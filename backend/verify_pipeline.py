from app.revit_adapter.harness import MockRevitReader
from app.revit_adapter.extractor import RevitDataExtractor
from app.dataset.normalizer import BIMNormalizer
from app.dataset.pipeline import DatasetPipeline

def main():
    print("--- Starting Verification Pipeline ---")
    
    # 1. Initialize Mock Revit Connection
    reader = MockRevitReader()
    extractor = RevitDataExtractor(reader)
    
    # 2. Initialize Normalizer
    normalizer = BIMNormalizer()
    
    # 3. Initialize Pipeline
    pipeline = DatasetPipeline(extractor, normalizer)
    
    # 4. Run Pipeline
    output_path = "dataset/processed/dataset_v1.json"
    result_path = pipeline.run_pipeline("proj_default", output_path)
    
    print(f"Dataset successfully generated at: {result_path}")
    print("Verification complete.")

if __name__ == "__main__":
    main()
