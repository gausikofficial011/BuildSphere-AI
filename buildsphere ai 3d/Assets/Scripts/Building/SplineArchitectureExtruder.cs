using System.Collections.Generic;
using UnityEngine;

namespace BuildSphere.Building
{
    public enum ExtrusionProfileType
    {
        CurvedWall,
        CurtainWallGlazing,
        BalustradeRailing,
        HVACDuct,
        StructuralPipe,
        WalkwayRibbon
    }

    [System.Serializable]
    public class SplineKnotData
    {
        public Vector3 position;
        public Vector3 tangentOut;

        public SplineKnotData(Vector3 pos, Vector3 tan)
        {
            position = pos;
            tangentOut = tan;
        }
    }

    [ExecuteInEditMode]
    [DisallowMultipleComponent]
    [RequireComponent(typeof(MeshFilter), typeof(MeshRenderer))]
    public class SplineArchitectureExtruder : MonoBehaviour
    {
        [Header("Profile & Configuration")]
        [SerializeField] private ExtrusionProfileType profileType = ExtrusionProfileType.CurvedWall;
        [SerializeField] private float profileWidth = 0.3f;
        [SerializeField] private float profileHeight = 3.2f;
        [Range(8, 120)] [SerializeField] private int splineSubdivisions = 32;
        [SerializeField] private bool closeLoop = false;
        [SerializeField] private bool generateCaps = true;
        [SerializeField] private Material assignedMaterial;

        [Header("Spline Waypoints")]
        [SerializeField] private List<SplineKnotData> knots = new List<SplineKnotData>();

        private MeshFilter meshFilter;
        private MeshRenderer meshRenderer;

        public List<SplineKnotData> Knots => knots;
        public ExtrusionProfileType ProfileType
        {
            get => profileType;
            set => profileType = value;
        }

        private void Awake()
        {
            meshFilter = GetComponent<MeshFilter>();
            meshRenderer = GetComponent<MeshRenderer>();
            EnsureDefaultKnots();
        }

        public void EnsureDefaultKnots()
        {
            if (knots.Count < 2)
            {
                knots.Clear();
                knots.Add(new SplineKnotData(new Vector3(-10f, 0, 0), new Vector3(-5f, 0, 5f)));
                knots.Add(new SplineKnotData(new Vector3(0, 0, 8f), new Vector3(5f, 0, 8f)));
                knots.Add(new SplineKnotData(new Vector3(10f, 0, 0), new Vector3(10f, 0, -5f)));
            }
        }

        [ContextMenu("Extrude Spline Mesh")]
        public void RebuildExtrusionMesh()
        {
            if (meshFilter == null) meshFilter = GetComponent<MeshFilter>();
            if (meshRenderer == null) meshRenderer = GetComponent<MeshRenderer>();

            EnsureDefaultKnots();

            List<Vector3> sampledPath = SampleSplinePath(splineSubdivisions);
            if (sampledPath.Count < 2) return;

            Vector2[] profileCrossSection = GetProfile2D(profileType, profileWidth, profileHeight);

            Mesh mesh = new Mesh { name = $"SplineExtrusion_{profileType}" };

            List<Vector3> vertices = new List<Vector3>();
            List<Vector3> normals = new List<Vector3>();
            List<Vector2> uvs = new List<Vector2>();
            List<int> triangles = new List<int>();

            int numPathPoints = sampledPath.Count;
            int numProfilePoints = profileCrossSection.Length;

            float totalLength = 0f;
            float[] segmentLengths = new float[numPathPoints];
            for (int i = 1; i < numPathPoints; i++)
            {
                float d = Vector3.Distance(sampledPath[i - 1], sampledPath[i]);
                totalLength += d;
                segmentLengths[i] = totalLength;
            }

            // Generate rings along path
            for (int i = 0; i < numPathPoints; i++)
            {
                Vector3 currentPos = sampledPath[i];
                Vector3 forward;

                if (i == 0)
                {
                    forward = (sampledPath[1] - sampledPath[0]).normalized;
                }
                else if (i == numPathPoints - 1)
                {
                    forward = (sampledPath[i] - sampledPath[i - 1]).normalized;
                }
                else
                {
                    forward = (sampledPath[i + 1] - sampledPath[i - 1]).normalized;
                }

                Vector3 up = Vector3.up;
                Vector3 right = Vector3.Cross(up, forward).normalized;
                if (right.sqrMagnitude < 0.001f) right = Vector3.right;
                up = Vector3.Cross(forward, right).normalized;

                float u = segmentLengths[i] / (totalLength > 0.001f ? totalLength : 1f);

                for (int p = 0; p < numProfilePoints; p++)
                {
                    Vector2 local2D = profileCrossSection[p];
                    Vector3 worldV = currentPos + (right * local2D.x) + (up * local2D.y);
                    vertices.Add(worldV);

                    Vector3 norm = ((right * local2D.x) + (up * local2D.y)).normalized;
                    normals.Add(norm.sqrMagnitude > 0.001f ? norm : Vector3.up);

                    float v = (float)p / (numProfilePoints - 1);
                    uvs.Add(new Vector2(u * 5f, v));
                }
            }

            // Connect rings
            for (int i = 0; i < numPathPoints - 1; i++)
            {
                int ringStart = i * numProfilePoints;
                int nextRingStart = (i + 1) * numProfilePoints;

                for (int p = 0; p < numProfilePoints - 1; p++)
                {
                    int currentA = ringStart + p;
                    int currentB = ringStart + p + 1;
                    int nextA = nextRingStart + p;
                    int nextB = nextRingStart + p + 1;

                    triangles.Add(currentA);
                    triangles.Add(nextA);
                    triangles.Add(currentB);

                    triangles.Add(currentB);
                    triangles.Add(nextA);
                    triangles.Add(nextB);
                }
            }

            // Optional end caps
            if (generateCaps && !closeLoop && numProfilePoints >= 3)
            {
                AddEndCap(vertices, normals, uvs, triangles, 0, numProfilePoints, -Vector3.forward);
                AddEndCap(vertices, normals, uvs, triangles, (numPathPoints - 1) * numProfilePoints, numProfilePoints, Vector3.forward);
            }

            mesh.SetVertices(vertices);
            mesh.SetNormals(normals);
            mesh.SetUVs(0, uvs);
            mesh.SetTriangles(triangles, 0);
            mesh.RecalculateTangents();
            mesh.RecalculateBounds();

            meshFilter.sharedMesh = mesh;

            var col = GetComponent<MeshCollider>();
            if (col != null) col.sharedMesh = mesh;
        }

        private void AddEndCap(List<Vector3> verts, List<Vector3> norms, List<Vector2> uvs, List<int> tris, int startIdx, int count, Vector3 capNormal)
        {
            int centerIdx = verts.Count;
            Vector3 center = Vector3.zero;
            for (int i = 0; i < count; i++)
            {
                center += verts[startIdx + i];
            }
            center /= count;

            verts.Add(center);
            norms.Add(capNormal);
            uvs.Add(new Vector2(0.5f, 0.5f));

            for (int i = 0; i < count - 1; i++)
            {
                tris.Add(centerIdx);
                tris.Add(startIdx + i);
                tris.Add(startIdx + i + 1);
            }
        }

        private List<Vector3> SampleSplinePath(int subdivisions)
        {
            List<Vector3> points = new List<Vector3>();
            if (knots.Count < 2) return points;

            int segmentCount = knots.Count - 1;
            int pointsPerSegment = Mathf.Max(2, subdivisions / segmentCount);

            for (int s = 0; s < segmentCount; s++)
            {
                Vector3 p0 = knots[s].position;
                Vector3 p1 = knots[s].tangentOut;
                Vector3 p2 = knots[s + 1].tangentOut;
                Vector3 p3 = knots[s + 1].position;

                for (int step = 0; step <= pointsPerSegment; step++)
                {
                    if (s > 0 && step == 0) continue; // Avoid duplicate points
                    float t = (float)step / pointsPerSegment;
                    Vector3 pt = CalculateCubicBezier(p0, p1, p2, p3, t);
                    points.Add(pt);
                }
            }

            return points;
        }

        private Vector3 CalculateCubicBezier(Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3, float t)
        {
            float u = 1f - t;
            float tt = t * t;
            float uu = u * u;
            float uuu = uu * u;
            float ttt = tt * t;

            Vector3 p = uuu * p0;
            p += 3f * uu * t * p1;
            p += 3f * u * tt * p2;
            p += ttt * p3;
            return p;
        }

        private Vector2[] GetProfile2D(ExtrusionProfileType type, float w, float h)
        {
            float halfW = w * 0.5f;
            switch (type)
            {
                case ExtrusionProfileType.CurvedWall:
                case ExtrusionProfileType.CurtainWallGlazing:
                    return new Vector2[]
                    {
                        new Vector2(-halfW, 0),
                        new Vector2(halfW, 0),
                        new Vector2(halfW, h),
                        new Vector2(-halfW, h),
                        new Vector2(-halfW, 0)
                    };

                case ExtrusionProfileType.BalustradeRailing:
                    return new Vector2[]
                    {
                        new Vector2(-halfW * 0.3f, 0),
                        new Vector2(halfW * 0.3f, 0),
                        new Vector2(halfW * 0.3f, h),
                        new Vector2(halfW, h),
                        new Vector2(halfW, h + 0.1f),
                        new Vector2(-halfW, h + 0.1f),
                        new Vector2(-halfW, h),
                        new Vector2(-halfW * 0.3f, h),
                        new Vector2(-halfW * 0.3f, 0)
                    };

                case ExtrusionProfileType.HVACDuct:
                    return new Vector2[]
                    {
                        new Vector2(-halfW, -h * 0.5f),
                        new Vector2(halfW, -h * 0.5f),
                        new Vector2(halfW, h * 0.5f),
                        new Vector2(-halfW, h * 0.5f),
                        new Vector2(-halfW, -h * 0.5f)
                    };

                case ExtrusionProfileType.StructuralPipe:
                default:
                    int circleSegments = 12;
                    Vector2[] circle = new Vector2[circleSegments + 1];
                    float radius = halfW;
                    for (int i = 0; i <= circleSegments; i++)
                    {
                        float angle = (i / (float)circleSegments) * Mathf.PI * 2f;
                        circle[i] = new Vector2(Mathf.Cos(angle) * radius, Mathf.Sin(angle) * radius);
                    }
                    return circle;
            }
        }
    }
}
