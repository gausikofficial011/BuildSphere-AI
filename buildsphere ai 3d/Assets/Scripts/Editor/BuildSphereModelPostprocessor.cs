#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;

namespace BuildSphere.EditorTools
{
    public class BuildSphereModelPostprocessor : AssetPostprocessor
    {
        private void OnPreprocessModel()
        {
            // Only apply automatic standard settings to models placed within Assets/Models/
            if (!assetPath.StartsWith("Assets/Models/")) return;

            ModelImporter importer = assetImporter as ModelImporter;
            if (importer == null) return;

            // Enforce Real-world Scale Standards
            importer.globalScale = 1.0f;
            importer.useFileScale = true;
            importer.useFileUnits = true;
            importer.bakeAxisConversion = true; // -Z forward, Y up to Unity standard

            // Geometry & Mesh Optimization
            importer.importBlendShapes = false;
            importer.importVisibility = true;
            importer.importCameras = false;
            importer.importLights = false;
            importer.meshCompression = ModelImporterMeshCompression.Off;
            importer.isReadable = true;
            importer.optimizeMeshVertices = true;
            importer.optimizeMeshPolygons = true;

            // Generate Secondary UVs for Lightmapping if building/infrastructure
            if (assetPath.Contains("/Buildings/") || assetPath.Contains("/Infrastructure/") || assetPath.Contains("/Construction/"))
            {
                importer.generateSecondaryUV = true;
            }

            // Normals and Tangents
            importer.importNormals = ModelImporterNormals.Import;
            importer.normalCalculationMode = ModelImporterNormalCalculationMode.AreaAndAngleWeighted;
            importer.importTangents = ModelImporterTangents.CalculateMikk;

            // Materials handling
            importer.materialImportMode = ModelImporterMaterialImportMode.ImportViaMaterialDescription;
            importer.materialLocation = ModelImporterMaterialLocation.InPrefab;
        }
    }
}
#endif
