using System;
using System.Collections.Generic;
using UnityEngine;

namespace BuildSphere.Building
{
    public enum ArchitecturalStylePreset
    {
        CyberDigitalTwin,
        CommercialTower,
        ResidentialComplex,
        IndustrialHub,
        SustainableEcoTower
    }

    [System.Serializable]
    public class BuildingParameters
    {
        [Header("Global Dimensions")]
        [Range(1, 40)] public int numberOfFloors = 5;
        [Range(2.5f, 6.0f)] public float floorHeight = 3.5f;
        [Range(10f, 100f)] public float buildingWidth = 30f;
        [Range(10f, 100f)] public float buildingDepth = 20f;
        [Range(0.15f, 0.6f)] public float wallThickness = 0.25f;
        [Range(0.2f, 0.8f)] public float slabThickness = 0.35f;

        [Header("Structural Columns & Grid")]
        public bool generateColumns = true;
        [Range(4f, 15f)] public float columnSpacing = 6.0f;
        [Range(0.3f, 1.2f)] public float columnWidth = 0.5f;

        [Header("Facade & Openings")]
        [Range(0.1f, 0.9f)] public float windowToWallRatio = 0.55f;
        [Range(0.5f, 1.5f)] public float windowSillHeight = 0.85f;
        [Range(1.0f, 3.5f)] public float windowHeight = 2.0f;
        [Range(0.8f, 3.0f)] public float doorWidth = 1.2f;
        [Range(1.8f, 3.0f)] public float doorHeight = 2.2f;

        [Header("Roof & Foundation")]
        public bool generateFoundation = true;
        public float foundationDepth = 1.5f;
        public bool generateRoofStructures = true;
        public bool generateRooftopSolar = true;
        public bool generateParapet = true;
        public float parapetHeight = 1.1f;

        [Header("Style & Aesthetics")]
        public ArchitecturalStylePreset style = ArchitecturalStylePreset.CyberDigitalTwin;
    }

    [DisallowMultipleComponent]
    [RequireComponent(typeof(BuildingController))]
    public class ParametricArchitectureEngine : MonoBehaviour
    {
        [Header("Configuration")]
        [SerializeField] private BuildingParameters parameters = new BuildingParameters();

        [Header("Material Palette")]
        [SerializeField] private Material concreteMaterial;
        [SerializeField] private Material glassMaterial;
        [SerializeField] private Material steelMaterial;
        [SerializeField] private Material accentMaterial;
        [SerializeField] private Material solarMaterial;
        [SerializeField] private Material floorTileMaterial;

        [Header("Generated References")]
        [SerializeField] private GameObject generatedBuildingRoot;

        public BuildingParameters Parameters
        {
            get => parameters;
            set => parameters = value;
        }

        private void Reset()
        {
            InitializeDefaultMaterials();
        }

        public void InitializeDefaultMaterials()
        {
            Shader standardShader = Shader.Find("Universal Render Pipeline/Lit") ?? Shader.Find("Standard");

            if (concreteMaterial == null)
            {
                concreteMaterial = new Material(standardShader) { name = "Mat_Concrete_Structural" };
                concreteMaterial.color = new Color(0.72f, 0.74f, 0.76f);
            }
            if (glassMaterial == null)
            {
                glassMaterial = new Material(standardShader) { name = "Mat_CurtainWall_Glass" };
                glassMaterial.color = new Color(0.15f, 0.55f, 0.85f, 0.45f);
                SetMaterialTransparent(glassMaterial);
            }
            if (steelMaterial == null)
            {
                steelMaterial = new Material(standardShader) { name = "Mat_Structural_Steel" };
                steelMaterial.color = new Color(0.22f, 0.25f, 0.28f);
            }
            if (accentMaterial == null)
            {
                accentMaterial = new Material(standardShader) { name = "Mat_Cyber_Accent" };
                accentMaterial.color = new Color(0.0f, 0.85f, 0.95f);
                if (accentMaterial.HasProperty("_EmissionColor"))
                {
                    accentMaterial.EnableKeyword("_EMISSION");
                    accentMaterial.SetColor("_EmissionColor", new Color(0f, 0.6f, 0.8f));
                }
            }
            if (solarMaterial == null)
            {
                solarMaterial = new Material(standardShader) { name = "Mat_Solar_PV" };
                solarMaterial.color = new Color(0.05f, 0.1f, 0.22f);
            }
            if (floorTileMaterial == null)
            {
                floorTileMaterial = new Material(standardShader) { name = "Mat_Floor_Polished" };
                floorTileMaterial.color = new Color(0.85f, 0.87f, 0.88f);
            }
        }

        private void SetMaterialTransparent(Material mat)
        {
            if (mat == null) return;
            mat.SetFloat("_Surface", 1); // Transparent in URP
            mat.SetFloat("_Blend", 0);
            mat.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.SrcAlpha);
            mat.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
            mat.SetInt("_ZWrite", 0);
            mat.DisableKeyword("_ALPHATEST_ON");
            mat.EnableKeyword("_ALPHABLEND_ON");
            mat.DisableKeyword("_ALPHAPREMULTIPLY_ON");
            mat.renderQueue = (int)UnityEngine.Rendering.RenderQueue.Transparent;
        }

        [ContextMenu("Generate Building Geometry")]
        public GameObject GenerateBuilding()
        {
            InitializeDefaultMaterials();

            if (generatedBuildingRoot != null)
            {
                if (Application.isPlaying)
                    Destroy(generatedBuildingRoot);
                else
                    DestroyImmediate(generatedBuildingRoot);
            }

            generatedBuildingRoot = new GameObject($"Generated_{parameters.style}_{DateTime.Now:HHmmss}");
            generatedBuildingRoot.transform.SetParent(transform, false);

            var buildingController = GetComponent<BuildingController>();

            // 1. Generate Foundation
            if (parameters.generateFoundation)
            {
                GenerateFoundationMesh(generatedBuildingRoot.transform);
            }

            // 2. Generate Floors & Rooms
            for (int f = 0; f < parameters.numberOfFloors; f++)
            {
                float floorY = f * parameters.floorHeight;
                GenerateFloor(f, floorY, generatedBuildingRoot.transform);
            }

            // 3. Generate Roof & Rooftop Features
            float roofY = parameters.numberOfFloors * parameters.floorHeight;
            GenerateRoof(roofY, generatedBuildingRoot.transform);

            // 4. Update BuildingController hierarchy
            if (buildingController != null)
            {
                buildingController.DiscoverFloors();
            }

            Debug.Log($"<color=#10B981>[ParametricArchitectureEngine]</color> Successfully built <b>{parameters.numberOfFloors}-story {parameters.style}</b> model.");
            return generatedBuildingRoot;
        }

        private void GenerateFoundationMesh(Transform parent)
        {
            GameObject foundationObj = new GameObject("Foundation_Substructure");
            foundationObj.transform.SetParent(parent, false);
            foundationObj.transform.localPosition = new Vector3(0, -parameters.foundationDepth * 0.5f, 0);

            MeshFilter mf = foundationObj.AddComponent<MeshFilter>();
            MeshRenderer mr = foundationObj.AddComponent<MeshRenderer>();
            mr.sharedMaterial = concreteMaterial;

            float margin = 1.0f;
            Vector3 size = new Vector3(parameters.buildingWidth + margin * 2f, parameters.foundationDepth, parameters.buildingDepth + margin * 2f);
            mf.sharedMesh = CreateBoxMesh(size.x, size.y, size.z, "FoundationMesh");

            var collider = foundationObj.AddComponent<BoxCollider>();
            collider.size = size;
        }

        private void GenerateFloor(int floorIndex, float floorY, Transform parent)
        {
            GameObject floorObj = new GameObject($"Floor_{floorIndex + 1:D2}");
            floorObj.transform.SetParent(parent, false);
            floorObj.transform.localPosition = new Vector3(0, floorY, 0);

            var floorController = floorObj.AddComponent<FloorController>();

            // 1. Floor Slab (Bottom)
            GameObject slabObj = new GameObject("FloorSlab");
            slabObj.transform.SetParent(floorObj.transform, false);
            slabObj.transform.localPosition = new Vector3(0, parameters.slabThickness * 0.5f, 0);
            MeshFilter slabMf = slabObj.AddComponent<MeshFilter>();
            MeshRenderer slabMr = slabObj.AddComponent<MeshRenderer>();
            slabMr.sharedMaterial = floorTileMaterial;
            slabMf.sharedMesh = CreateBoxMesh(parameters.buildingWidth, parameters.slabThickness, parameters.buildingDepth, $"Slab_F{floorIndex + 1}");
            var slabCol = slabObj.AddComponent<BoxCollider>();
            slabCol.size = new Vector3(parameters.buildingWidth, parameters.slabThickness, parameters.buildingDepth);

            // 2. Structural Columns
            if (parameters.generateColumns)
            {
                GenerateStructuralColumns(floorIndex, floorObj.transform);
            }

            // 3. Facade Walls (North, South, East, West)
            GenerateFacadeWalls(floorIndex, floorObj.transform);

            // 4. Interior Partitions and Default Rooms
            GenerateInteriorRooms(floorIndex, floorObj.transform, floorController);
        }

        private void GenerateStructuralColumns(int floorIndex, Transform floorParent)
        {
            GameObject columnGroup = new GameObject("Structural_Columns");
            columnGroup.transform.SetParent(floorParent, false);

            float colHeight = parameters.floorHeight - parameters.slabThickness;
            float halfW = (parameters.buildingWidth * 0.5f) - (parameters.wallThickness + parameters.columnWidth * 0.5f);
            float halfD = (parameters.buildingDepth * 0.5f) - (parameters.wallThickness + parameters.columnWidth * 0.5f);

            int countX = Mathf.Max(2, Mathf.RoundToInt(parameters.buildingWidth / parameters.columnSpacing));
            int countZ = Mathf.Max(2, Mathf.RoundToInt(parameters.buildingDepth / parameters.columnSpacing));

            float stepX = (halfW * 2f) / (countX - 1);
            float stepZ = (halfD * 2f) / (countZ - 1);

            for (int ix = 0; ix < countX; ix++)
            {
                for (int iz = 0; iz < countZ; iz++)
                {
                    float x = -halfW + ix * stepX;
                    float z = -halfD + iz * stepZ;

                    GameObject col = new GameObject($"Col_X{ix}_Z{iz}");
                    col.transform.SetParent(columnGroup.transform, false);
                    col.transform.localPosition = new Vector3(x, parameters.slabThickness + colHeight * 0.5f, z);

                    MeshFilter mf = col.AddComponent<MeshFilter>();
                    MeshRenderer mr = col.AddComponent<MeshRenderer>();
                    mr.sharedMaterial = steelMaterial;
                    mf.sharedMesh = CreateBoxMesh(parameters.columnWidth, colHeight, parameters.columnWidth, $"ColMesh_F{floorIndex + 1}");

                    var colBox = col.AddComponent<BoxCollider>();
                    colBox.size = new Vector3(parameters.columnWidth, colHeight, parameters.columnWidth);
                }
            }
        }

        private void GenerateFacadeWalls(int floorIndex, Transform floorParent)
        {
            GameObject facadeGroup = new GameObject("Facade_CurtainWalls");
            facadeGroup.transform.SetParent(floorParent, false);

            float wallH = parameters.floorHeight - parameters.slabThickness;
            float halfW = parameters.buildingWidth * 0.5f;
            float halfD = parameters.buildingDepth * 0.5f;
            float centerY = parameters.slabThickness + wallH * 0.5f;

            // North Wall (Front)
            CreateWallSection("Wall_North", new Vector3(0, centerY, halfD - parameters.wallThickness * 0.5f), parameters.buildingWidth, wallH, parameters.wallThickness, facadeGroup.transform, true, floorIndex == 0);
            // South Wall (Back)
            CreateWallSection("Wall_South", new Vector3(0, centerY, -halfD + parameters.wallThickness * 0.5f), parameters.buildingWidth, wallH, parameters.wallThickness, facadeGroup.transform, true, false);
            // East Wall (Right)
            CreateWallSection("Wall_East", new Vector3(halfW - parameters.wallThickness * 0.5f, centerY, 0), parameters.wallThickness, wallH, parameters.buildingDepth - parameters.wallThickness * 2f, facadeGroup.transform, true, false);
            // West Wall (Left)
            CreateWallSection("Wall_West", new Vector3(-halfW + parameters.wallThickness * 0.5f, centerY, 0), parameters.wallThickness, wallH, parameters.buildingDepth - parameters.wallThickness * 2f, facadeGroup.transform, true, false);
        }

        private void CreateWallSection(string name, Vector3 pos, float w, float h, float d, Transform parent, bool hasGlazing, bool isMainEntrance)
        {
            GameObject wallObj = new GameObject(name);
            wallObj.transform.SetParent(parent, false);
            wallObj.transform.localPosition = pos;

            if (hasGlazing && parameters.windowToWallRatio > 0.1f)
            {
                // Multi-material wall: Solid Spandrel + Glazing Panel
                float glassHeight = Mathf.Min(h - 0.4f, h * parameters.windowToWallRatio);
                float solidBottomH = (h - glassHeight) * 0.5f;

                // Lower Solid Base
                GameObject baseObj = new GameObject("BaseSpandrel");
                baseObj.transform.SetParent(wallObj.transform, false);
                baseObj.transform.localPosition = new Vector3(0, -h * 0.5f + solidBottomH * 0.5f, 0);
                MeshFilter bMf = baseObj.AddComponent<MeshFilter>();
                MeshRenderer bMr = baseObj.AddComponent<MeshRenderer>();
                bMr.sharedMaterial = concreteMaterial;
                bMf.sharedMesh = CreateBoxMesh(w, solidBottomH, d, "SpandrelBase");

                // Glazing Center
                GameObject glassObj = new GameObject("GlazingWindow");
                glassObj.transform.SetParent(wallObj.transform, false);
                glassObj.transform.localPosition = new Vector3(0, -h * 0.5f + solidBottomH + glassHeight * 0.5f, 0);
                MeshFilter gMf = glassObj.AddComponent<MeshFilter>();
                MeshRenderer gMr = glassObj.AddComponent<MeshRenderer>();
                gMr.sharedMaterial = glassMaterial;
                gMf.sharedMesh = CreateBoxMesh(w, glassHeight, d * 0.4f, "GlassPanel");

                // Top Solid Transom
                GameObject topObj = new GameObject("TopSpandrel");
                topObj.transform.SetParent(wallObj.transform, false);
                topObj.transform.localPosition = new Vector3(0, h * 0.5f - solidBottomH * 0.5f, 0);
                MeshFilter tMf = topObj.AddComponent<MeshFilter>();
                MeshRenderer tMr = topObj.AddComponent<MeshRenderer>();
                tMr.sharedMaterial = concreteMaterial;
                tMf.sharedMesh = CreateBoxMesh(w, solidBottomH, d, "SpandrelTop");

                if (isMainEntrance)
                {
                    // Cyber / Modern Portal Frame
                    GameObject portal = new GameObject("EntrancePortal");
                    portal.transform.SetParent(wallObj.transform, false);
                    portal.transform.localPosition = new Vector3(0, -h * 0.5f + 1.2f, d * 0.6f);
                    MeshFilter pMf = portal.AddComponent<MeshFilter>();
                    MeshRenderer pMr = portal.AddComponent<MeshRenderer>();
                    pMr.sharedMaterial = accentMaterial;
                    pMf.sharedMesh = CreateBoxMesh(parameters.doorWidth + 0.4f, parameters.doorHeight + 0.2f, 0.3f, "PortalFrame");
                }
            }
            else
            {
                MeshFilter mf = wallObj.AddComponent<MeshFilter>();
                MeshRenderer mr = wallObj.AddComponent<MeshRenderer>();
                mr.sharedMaterial = concreteMaterial;
                mf.sharedMesh = CreateBoxMesh(w, h, d, $"{name}_Mesh");
            }

            var col = wallObj.AddComponent<BoxCollider>();
            col.size = new Vector3(w, h, d);
        }

        private void GenerateInteriorRooms(int floorIndex, Transform floorParent, FloorController floorController)
        {
            GameObject roomGroup = new GameObject("Interior_Rooms");
            roomGroup.transform.SetParent(floorParent, false);

            int roomCols = 2;
            int roomRows = 2;
            float roomW = (parameters.buildingWidth - parameters.wallThickness * 4f) / roomCols;
            float roomD = (parameters.buildingDepth - parameters.wallThickness * 4f) / roomRows;
            float wallH = parameters.floorHeight - parameters.slabThickness;

            string[] roomTypes = { "Executive Office", "Collaborative Zone", "Server Core", "Operations Center" };

            int roomIdx = 0;
            for (int rx = 0; rx < roomCols; rx++)
            {
                for (int rz = 0; rz < roomRows; rz++)
                {
                    float posX = -(parameters.buildingWidth * 0.5f) + parameters.wallThickness * 2f + rx * roomW + roomW * 0.5f;
                    float posZ = -(parameters.buildingDepth * 0.5f) + parameters.wallThickness * 2f + rz * roomD + roomD * 0.5f;

                    string roomId = $"F{floorIndex + 1}_R{roomIdx + 1:D2}";
                    string roomName = $"{roomTypes[roomIdx % roomTypes.Length]} {floorIndex + 1}0{roomIdx + 1}";

                    GameObject roomObj = new GameObject($"Room_{roomId}");
                    roomObj.transform.SetParent(roomGroup.transform, false);
                    roomObj.transform.localPosition = new Vector3(posX, parameters.slabThickness, posZ);

                    var roomCtrl = roomObj.AddComponent<Rooms.RoomController>();
                    
                    // Interior partition markers
                    GameObject partition = new GameObject("PartitionVolume");
                    partition.transform.SetParent(roomObj.transform, false);
                    partition.transform.localPosition = new Vector3(0, wallH * 0.5f, 0);
                    
                    var boxCol = partition.AddComponent<BoxCollider>();
                    boxCol.size = new Vector3(roomW * 0.95f, wallH, roomD * 0.95f);
                    boxCol.isTrigger = true;

                    roomIdx++;
                }
            }
        }

        private void GenerateRoof(float roofY, Transform parent)
        {
            GameObject roofRoot = new GameObject("Roof_Superstructure");
            roofRoot.transform.SetParent(parent, false);
            roofRoot.transform.localPosition = new Vector3(0, roofY, 0);

            // Roof Slab
            GameObject roofSlab = new GameObject("RoofSlab");
            roofSlab.transform.SetParent(roofRoot.transform, false);
            roofSlab.transform.localPosition = new Vector3(0, parameters.slabThickness * 0.5f, 0);
            MeshFilter slabMf = roofSlab.AddComponent<MeshFilter>();
            MeshRenderer slabMr = roofSlab.AddComponent<MeshRenderer>();
            slabMr.sharedMaterial = concreteMaterial;
            slabMf.sharedMesh = CreateBoxMesh(parameters.buildingWidth, parameters.slabThickness, parameters.buildingDepth, "RoofSlabMesh");
            var slabCol = roofSlab.AddComponent<BoxCollider>();
            slabCol.size = new Vector3(parameters.buildingWidth, parameters.slabThickness, parameters.buildingDepth);

            // Parapet Wall
            if (parameters.generateParapet)
            {
                GameObject parapetGroup = new GameObject("Parapets");
                parapetGroup.transform.SetParent(roofRoot.transform, false);
                float pH = parameters.parapetHeight;
                float halfW = parameters.buildingWidth * 0.5f;
                float halfD = parameters.buildingDepth * 0.5f;
                float pY = parameters.slabThickness + pH * 0.5f;

                CreateWallSection("Parapet_N", new Vector3(0, pY, halfD - parameters.wallThickness * 0.5f), parameters.buildingWidth, pH, parameters.wallThickness, parapetGroup.transform, false, false);
                CreateWallSection("Parapet_S", new Vector3(0, pY, -halfD + parameters.wallThickness * 0.5f), parameters.buildingWidth, pH, parameters.wallThickness, parapetGroup.transform, false, false);
                CreateWallSection("Parapet_E", new Vector3(halfW - parameters.wallThickness * 0.5f, pY, 0), parameters.wallThickness, pH, parameters.buildingDepth - parameters.wallThickness * 2f, parapetGroup.transform, false, false);
                CreateWallSection("Parapet_W", new Vector3(-halfW + parameters.wallThickness * 0.5f, pY, 0), parameters.wallThickness, pH, parameters.buildingDepth - parameters.wallThickness * 2f, parapetGroup.transform, false, false);
            }

            // Rooftop Solar Array / Mechanical Penthouse
            if (parameters.generateRooftopSolar)
            {
                GenerateRooftopSolarArray(roofRoot.transform);
            }
        }

        private void GenerateRooftopSolarArray(Transform roofParent)
        {
            GameObject solarGroup = new GameObject("Rooftop_SolarArray");
            solarGroup.transform.SetParent(roofParent, false);

            int panelRows = 3;
            int panelCols = 5;
            float panelW = 3.2f;
            float panelD = 1.8f;
            float panelH = 0.08f;
            float tiltAngle = 18f;

            float startX = -(panelCols * (panelW + 0.8f)) * 0.5f + panelW * 0.5f;
            float startZ = -(panelRows * (panelD + 1.2f)) * 0.5f + panelD * 0.5f;

            for (int r = 0; r < panelRows; r++)
            {
                for (int c = 0; c < panelCols; c++)
                {
                    float x = startX + c * (panelW + 0.8f);
                    float z = startZ + r * (panelD + 1.2f);

                    GameObject panel = new GameObject($"SolarPanel_R{r}_C{c}");
                    panel.transform.SetParent(solarGroup.transform, false);
                    panel.transform.localPosition = new Vector3(x, parameters.slabThickness + 0.6f, z);
                    panel.transform.localRotation = Quaternion.Euler(tiltAngle, 0, 0);

                    MeshFilter mf = panel.AddComponent<MeshFilter>();
                    MeshRenderer mr = panel.AddComponent<MeshRenderer>();
                    mr.sharedMaterial = solarMaterial;
                    mf.sharedMesh = CreateBoxMesh(panelW, panelH, panelD, "SolarPV_Mesh");

                    // Solar Stanchion
                    GameObject stand = new GameObject("MountingStanchion");
                    stand.transform.SetParent(panel.transform, false);
                    stand.transform.localPosition = new Vector3(0, -0.3f, 0);
                    stand.transform.localRotation = Quaternion.Euler(-tiltAngle, 0, 0);
                    MeshFilter sMf = stand.AddComponent<MeshFilter>();
                    MeshRenderer sMr = stand.AddComponent<MeshRenderer>();
                    sMr.sharedMaterial = steelMaterial;
                    sMf.sharedMesh = CreateBoxMesh(0.15f, 0.6f, 0.15f, "StanchionMesh");
                }
            }
        }

        public static Mesh CreateBoxMesh(float width, float height, float depth, string meshName = "CustomBox")
        {
            Mesh mesh = new Mesh { name = meshName };

            float w2 = width * 0.5f;
            float h2 = height * 0.5f;
            float d2 = depth * 0.5f;

            Vector3[] vertices = new Vector3[]
            {
                // Front
                new Vector3(-w2, -h2,  d2), new Vector3( w2, -h2,  d2), new Vector3( w2,  h2,  d2), new Vector3(-w2,  h2,  d2),
                // Back
                new Vector3( w2, -h2, -d2), new Vector3(-w2, -h2, -d2), new Vector3(-w2,  h2, -d2), new Vector3( w2,  h2, -d2),
                // Top
                new Vector3(-w2,  h2,  d2), new Vector3( w2,  h2,  d2), new Vector3( w2,  h2, -d2), new Vector3(-w2,  h2, -d2),
                // Bottom
                new Vector3(-w2, -h2, -d2), new Vector3( w2, -h2, -d2), new Vector3( w2, -h2,  d2), new Vector3(-w2, -h2,  d2),
                // Right
                new Vector3( w2, -h2,  d2), new Vector3( w2, -h2, -d2), new Vector3( w2,  h2, -d2), new Vector3( w2,  h2,  d2),
                // Left
                new Vector3(-w2, -h2, -d2), new Vector3(-w2, -h2,  d2), new Vector3(-w2,  h2,  d2), new Vector3(-w2,  h2, -d2)
            };

            Vector3[] normals = new Vector3[]
            {
                Vector3.forward, Vector3.forward, Vector3.forward, Vector3.forward,
                Vector3.back, Vector3.back, Vector3.back, Vector3.back,
                Vector3.up, Vector3.up, Vector3.up, Vector3.up,
                Vector3.down, Vector3.down, Vector3.down, Vector3.down,
                Vector3.right, Vector3.right, Vector3.right, Vector3.right,
                Vector3.left, Vector3.left, Vector3.left, Vector3.left
            };

            Vector2[] uvs = new Vector2[]
            {
                new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1),
                new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1),
                new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1),
                new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1),
                new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1),
                new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1)
            };

            int[] triangles = new int[]
            {
                0, 2, 1, 0, 3, 2,       // Front
                4, 6, 5, 4, 7, 6,       // Back
                8, 10, 9, 8, 11, 10,    // Top
                12, 14, 13, 12, 15, 14, // Bottom
                16, 18, 17, 16, 19, 18, // Right
                20, 22, 21, 20, 23, 22  // Left
            };

            mesh.vertices = vertices;
            mesh.normals = normals;
            mesh.uv = uvs;
            mesh.triangles = triangles;
            mesh.RecalculateTangents();
            mesh.RecalculateBounds();

            return mesh;
        }
    }
}
