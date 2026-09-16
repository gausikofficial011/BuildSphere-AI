using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEngine;

namespace BuildSphere.Building
{
    [System.Serializable]
    public class BIMElementMetadata
    {
        public string guid;
        public string elementName;
        public string category; // Slab, Wall, Column, Glazing, Roof
        public string materialName;
        public float volumeCubicMeters;
        public float surfaceAreaSqMeters;
        public Vector3 boundingBoxSize;
    }

    public static class BIMModelExporter
    {
        public static string ExportToOBJ(GameObject rootObject, string exportDirectory, string modelName = "BuildSphere_Export")
        {
            if (rootObject == null)
            {
                Debug.LogError("[BIMModelExporter] Cannot export null root object.");
                return string.Empty;
            }

            if (!Directory.Exists(exportDirectory))
            {
                Directory.CreateDirectory(exportDirectory);
            }

            string objPath = Path.Combine(exportDirectory, $"{modelName}.obj");
            string mtlPath = Path.Combine(exportDirectory, $"{modelName}.mtl");
            string bimMetaPath = Path.Combine(exportDirectory, $"{modelName}_BIM_Metadata.json");

            StringBuilder objBuilder = new StringBuilder();
            StringBuilder mtlBuilder = new StringBuilder();
            List<BIMElementMetadata> bimRecords = new List<BIMElementMetadata>();

            objBuilder.AppendLine($"# BuildSphere AI 3.0 Advanced BIM/CAD Model Export");
            objBuilder.AppendLine($"# Date: {DateTime.Now:yyyy-MM-dd HH:mm:ss}");
            objBuilder.AppendLine($"mtllib {modelName}.mtl");
            objBuilder.AppendLine();

            HashSet<string> writtenMaterials = new HashSet<string>();

            MeshFilter[] meshFilters = rootObject.GetComponentsInChildren<MeshFilter>(true);

            int vertexOffset = 1;
            int normalOffset = 1;
            int uvOffset = 1;

            foreach (var mf in meshFilters)
            {
                if (mf.sharedMesh == null) continue;

                Mesh mesh = mf.sharedMesh;
                Transform tf = mf.transform;
                Renderer rend = mf.GetComponent<Renderer>();
                string matName = (rend != null && rend.sharedMaterial != null) ? rend.sharedMaterial.name : "Default_Mat";

                // Generate Material if not written
                if (!writtenMaterials.Contains(matName))
                {
                    writtenMaterials.Add(matName);
                    Color col = (rend != null && rend.sharedMaterial != null && rend.sharedMaterial.HasProperty("_Color"))
                        ? rend.sharedMaterial.color
                        : Color.gray;

                    mtlBuilder.AppendLine($"newmtl {matName}");
                    mtlBuilder.AppendLine($"Ka 0.2 0.2 0.2");
                    mtlBuilder.AppendLine($"Kd {col.r:F3} {col.g:F3} {col.b:F3}");
                    mtlBuilder.AppendLine($"Ks 0.5 0.5 0.5");
                    mtlBuilder.AppendLine($"d {col.a:F2}");
                    mtlBuilder.AppendLine($"illum 2");
                    mtlBuilder.AppendLine();
                }

                objBuilder.AppendLine($"o {mf.gameObject.name}_{mf.GetInstanceID()}");
                objBuilder.AppendLine($"usemtl {matName}");

                Vector3[] verts = mesh.vertices;
                Vector3[] normals = mesh.normals;
                Vector2[] uvs = mesh.uv;

                // Vertices
                for (int i = 0; i < verts.Length; i++)
                {
                    Vector3 worldV = tf.TransformPoint(verts[i]);
                    // Flip Z for right-handed CAD coordinates standard
                    objBuilder.AppendLine($"v {worldV.x:F4} {worldV.y:F4} {-worldV.z:F4}");
                }

                // UVs
                for (int i = 0; i < uvs.Length; i++)
                {
                    objBuilder.AppendLine($"vt {uvs[i].x:F4} {uvs[i].y:F4}");
                }

                // Normals
                for (int i = 0; i < normals.Length; i++)
                {
                    Vector3 worldN = tf.TransformDirection(normals[i]);
                    objBuilder.AppendLine($"vn {worldN.x:F4} {worldN.y:F4} {-worldN.z:F4}");
                }

                // Faces / Triangles
                int[] triangles = mesh.triangles;
                for (int t = 0; t < triangles.Length; t += 3)
                {
                    int i0 = triangles[t] + vertexOffset;
                    int i1 = triangles[t + 2] + vertexOffset; // inverted winding for Z-flip
                    int i2 = triangles[t + 1] + vertexOffset;

                    int u0 = (uvs.Length > 0) ? triangles[t] + uvOffset : 0;
                    int u1 = (uvs.Length > 0) ? triangles[t + 2] + uvOffset : 0;
                    int u2 = (uvs.Length > 0) ? triangles[t + 1] + uvOffset : 0;

                    int n0 = (normals.Length > 0) ? triangles[t] + normalOffset : 0;
                    int n1 = (normals.Length > 0) ? triangles[t + 2] + normalOffset : 0;
                    int n2 = (normals.Length > 0) ? triangles[t + 1] + normalOffset : 0;

                    if (u0 > 0 && n0 > 0)
                        objBuilder.AppendLine($"f {i0}/{u0}/{n0} {i1}/{u1}/{n1} {i2}/{u2}/{n2}");
                    else if (n0 > 0)
                        objBuilder.AppendLine($"f {i0}//{n0} {i1}//{n1} {i2}//{n2}");
                    else
                        objBuilder.AppendLine($"f {i0} {i1} {i2}");
                }

                // Collect BIM metadata
                Bounds b = mesh.bounds;
                Vector3 worldSize = Vector3.Scale(b.size, tf.lossyScale);
                float estVol = worldSize.x * worldSize.y * worldSize.z;
                float estArea = 2f * (worldSize.x * worldSize.y + worldSize.y * worldSize.z + worldSize.x * worldSize.z);

                string category = "GenericModel";
                string n = mf.gameObject.name.ToLower();
                if (n.Contains("wall") || n.Contains("spandrel")) category = "IfcWall";
                else if (n.Contains("slab") || n.Contains("floor")) category = "IfcSlab";
                else if (n.Contains("col") || n.Contains("pillar")) category = "IfcColumn";
                else if (n.Contains("glass") || n.Contains("glazing") || n.Contains("window")) category = "IfcCurtainWall";
                else if (n.Contains("roof")) category = "IfcRoof";
                else if (n.Contains("solar")) category = "IfcEnergyConversionDevice";

                bimRecords.Add(new BIMElementMetadata
                {
                    guid = Guid.NewGuid().ToString("D"),
                    elementName = mf.gameObject.name,
                    category = category,
                    materialName = matName,
                    volumeCubicMeters = estVol,
                    surfaceAreaSqMeters = estArea,
                    boundingBoxSize = worldSize
                });

                vertexOffset += verts.Length;
                normalOffset += normals.Length;
                uvOffset += uvs.Length;
            }

            File.WriteAllText(objPath, objBuilder.ToString());
            File.WriteAllText(mtlPath, mtlBuilder.ToString());

            // Write JSON metadata
            string jsonRecords = JsonUtility.ToJson(new BIMPackageWrapper { elements = bimRecords }, true);
            File.WriteAllText(bimMetaPath, jsonRecords);

            Debug.Log($"<color=#10B981>[BIMModelExporter]</color> Successfully exported 3D model to:\n<b>{objPath}</b>\n(Extracted {bimRecords.Count} BIM elements)");
            return objPath;
        }

        [System.Serializable]
        private class BIMPackageWrapper
        {
            public List<BIMElementMetadata> elements;
        }
    }
}
