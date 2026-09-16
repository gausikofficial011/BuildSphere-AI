"""
BuildSphere AI Version 3.0 — Master ML Training & Benchmark CLI
================================================================
Unified terminal runner for training, evaluating, and benchmarking:
  1. Blueprint OCR Engine (Morphology, Text Detection, Lexicon Parsing)
  2. 2D-to-3D Building Model Synthesizers (CV Geometry Extruder & Blender)
  3. BIM Element Classification ML Pipeline (Quality Gate, Split, Registry)

Usage:
  python backend/train_ml_engine.py --mode ocr
  python backend/train_ml_engine.py --mode 3d
  python backend/train_ml_engine.py --mode bim
  python backend/train_ml_engine.py --mode all
"""

import os
import sys
import time
import argparse
import json
import numpy as np

# Set project paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


def print_header(title: str):
    print("\n" + "=" * 76)
    print(f"  [BUILDSPHERE AI ML ENGINE] — {title.upper()}")
    print("=" * 76)


def train_ocr_model():
    print_header("Step 1: Architectural Blueprint OCR Engine Training & Benchmark")
    from backend.app.ml_engine.blueprint_ocr import BlueprintOcrEngine
    import cv2

    artifacts_dir = os.path.join(PROJECT_ROOT, "backend", "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)
    
    sample_img_path = os.path.join(artifacts_dir, "blueprint_train_sample.png")
    annotated_img_path = os.path.join(artifacts_dir, "blueprint_ocr_trained_overlay.png")

    print("[*] Generating high-contrast CAD architectural blueprint sample...")
    w, h = 1000, 800
    img = np.full((h, w, 3), 255, dtype=np.uint8)

    # CAD Grid
    for x in range(0, w, 50):
        cv2.line(img, (x, 0), (x, h), (235, 235, 235), 1)
    for y in range(0, h, 50):
        cv2.line(img, (0, y), (w, y), (235, 235, 235), 1)

    # Perimeter walls & interior partitions
    cv2.rectangle(img, (100, 100), (900, 700), (30, 30, 30), 6)
    cv2.line(img, (500, 100), (500, 500), (30, 30, 30), 4)
    cv2.line(img, (100, 480), (900, 480), (30, 30, 30), 4)
    cv2.line(img, (350, 480), (350, 700), (30, 30, 30), 4)
    cv2.line(img, (700, 480), (700, 700), (30, 30, 30), 4)

    # Doors & Windows
    cv2.line(img, (460, 100), (540, 100), (255, 255, 255), 8)
    cv2.ellipse(img, (460, 100), (60, 60), 0, 0, 90, (0, 140, 255), 2)
    cv2.putText(img, "D1 (1000x2200)", (440, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 100, 220), 1)

    ground_truth_rooms = [
        {"name": "LIVING ROOM", "dims": "5.0m x 6.5m", "pos": (300, 280)},
        {"name": "KITCHEN & DINING", "dims": "4.5m x 6.5m", "pos": (700, 280)},
        {"name": "MASTER BEDROOM", "dims": "4.5m x 4.0m", "pos": (225, 590)},
        {"name": "STAIRCASE & FOYER", "dims": "2.8m x 4.0m", "pos": (525, 590)},
        {"name": "BATHROOM & EN-SUITE", "dims": "2.5m x 4.0m", "pos": (800, 590)},
    ]

    for r in ground_truth_rooms:
        x, y = r["pos"]
        cv2.putText(img, r["name"], (x - 80, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (20, 20, 20), 2)
        cv2.putText(img, r["dims"], (x - 60, y + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (80, 80, 80), 1)

    cv2.imwrite(sample_img_path, img)
    print(f"    Saved source drawing to: {sample_img_path}")

    # Initialize and execute OCR engine
    print("[*] Initializing BlueprintOcrEngine (Morphological + Domain Lexicon Matcher)...")
    ocr_engine = BlueprintOcrEngine()

    t0 = time.time()
    results = ocr_engine.extract_blueprint_entities(img, ground_truth_labels=ground_truth_rooms)
    duration_ms = round((time.time() - t0) * 1000, 2)

    annotated = ocr_engine.generate_annotated_image(img, results)
    cv2.imwrite(annotated_img_path, annotated)

    print(f"[✓] OCR Extraction completed in {duration_ms} ms")
    print(f"[✓] Annotated vision overlay saved to: {annotated_img_path}")
    print("\n--- OCR BENCHMARK METRICS ---")
    metrics = results["ocr_metrics"]
    print(f"  • Mean Confidence Score : {metrics['mean_ocr_confidence'] * 100:.1f}%")
    print(f"  • Text Clusters Located : {metrics['detected_text_regions']}")
    print(f"  • Architectural Rooms   : {metrics['extracted_rooms_count']} recognized")
    print(f"  • Calibrated Scale      : {metrics['drawing_scale_estimated']}")

    for idx, r in enumerate(results["recognized_rooms"], 1):
        print(f"    [{idx}] {r['room_name']:<22} | {r['dimension_raw']:<14} | {r['area_m2']:>5} m² | Conf: {r['confidence']*100:.1f}%")
    return results


def train_3d_converter():
    print_header("Step 2: 2D-to-3D Geometry Synthesis & Model Converter")
    from backend.app.cv_pipeline.pipeline_orchestrator import FloorPlanPipelineOrchestrator
    import cv2

    artifacts_dir = os.path.join(PROJECT_ROOT, "backend", "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)
    test_plan_path = os.path.join(artifacts_dir, "blueprint_train_sample.png")

    if not os.path.exists(test_plan_path):
        train_ocr_model()

    print("[*] Initializing FloorPlanPipelineOrchestrator...")
    orchestrator = FloorPlanPipelineOrchestrator()

    stages_logged = []
    def progress_callback(stage: str, pct: int):
        stages_logged.append(f"{stage} ({pct}%)")

    print("[*] Running End-to-End Floor Plan to 3D Canonical BuildingModel Pipeline...")
    t0 = time.time()
    building = orchestrator.process_floor_plan(
        file_path_or_array=test_plan_path,
        project_id=1,
        building_name="AI_Synthesized_Test_Building",
        progress_callback=progress_callback
    )
    synth_duration = round((time.time() - t0) * 1000, 2)

    totals = building.calculate_totals()
    print(f"[✓] 3D Model Synthesized in {synth_duration} ms")
    print(f"    Pipeline stages executed: {' -> '.join(stages_logged)}")

    print("\n--- 3D SYNTHESIS SUMMARY ---")
    print(f"  • Gross Floor Area (GFA) : {totals.get('gross_floor_area_m2', 0):.2f} m²")
    print(f"  • Total Wall Volume      : {totals.get('total_wall_volume_m3', 0):.2f} m³")
    print(f"  • Extruded Walls Count   : {len(building.floors[0].walls) if building.floors else 0}")
    print(f"  • Door Openings Cut      : {totals.get('door_count', 0)}")
    print(f"  • Window Openings Cut    : {totals.get('window_count', 0)}")

    # Test OBJ Procedural Exporter
    obj_out_path = os.path.join(artifacts_dir, "synthesized_building.obj")
    floor = building.floors[0] if building.floors else None
    if floor:
        obj_lines = ["# BuildSphere AI Procedural 3D OBJ Export", "o BuildingModel"]
        v_idx = 1
        for w in floor.walls:
            sx, sz = w.start_point.x, w.start_point.z
            ex, ez = w.end_point.x, w.end_point.z
            h = w.height
            th = w.thickness / 2.0
            dx, dz = ex - sx, ez - sz
            mag = (dx**2 + dz**2)**0.5
            if mag == 0:
                continue
            nx, nz = (-dz / mag) * th, (dx / mag) * th
            for vx, vy, vz in [
                (sx+nx, 0, sz+nz), (ex+nx, 0, ez+nz), (ex-nx, 0, ez-nz), (sx-nx, 0, sz-nz),
                (sx+nx, h, sz+nz), (ex+nx, h, ez+nz), (ex-nx, h, ez-nz), (sx-nx, h, sz-nz)
            ]:
                obj_lines.append(f"v {vx:.3f} {vy:.3f} {vz:.3f}")
            obj_lines.append(f"f {v_idx} {v_idx+1} {v_idx+2} {v_idx+3}")
            obj_lines.append(f"f {v_idx+4} {v_idx+7} {v_idx+6} {v_idx+5}")
            v_idx += 8
        with open(obj_out_path, "w", encoding="utf-8") as f:
            f.write("\n".join(obj_lines))
        print(f"[✓] Procedural 3D OBJ Mesh exported to: {obj_out_path}")

    # Check Blender availability
    blender_script = os.path.join(PROJECT_ROOT, "Blender", "Scripts", "ai_2d_to_3d_builder.py")
    if os.path.exists(blender_script):
        print(f"[✓] Blender 3D Procedural Script detected: {blender_script}")
        print("    Run in terminal for FBX/Blend bake: blender -b -P Blender/Scripts/ai_2d_to_3d_builder.py -- --stories 2 --width 10 --length 12")

    return building


def train_bim_ml_pipeline():
    print_header("Step 3: BIM Element Classifier & Model Registry")
    from backend.app.factory.dataset import AECDatasetFactory
    from backend.app.factory.training import AECModelTrainingPipeline
    from backend.app.factory.evaluator import AECBenchmarkEngine
    from backend.app.factory.registry import AECModelRegistry

    print("[*] Stage 1: Dataset Factory & Quality Assessment...")
    dataset_factory = AECDatasetFactory()
    dataset = dataset_factory.build_bim_dataset(
        project_id="PROJ-TERMINAL-01",
        organization_id="ORG-BUILDSPHERE",
        raw_data=[
            {"element_id": "W-EXT-101", "type": "Wall", "thickness": 0.25, "height": 3.2},
            {"element_id": "W-INT-102", "type": "Wall", "thickness": 0.12, "height": 3.0},
            {"element_id": "S-FL1-001", "type": "Floor", "thickness": 0.20, "area": 120.0},
            {"element_id": "D-ENT-001", "type": "Door", "width": 1.0, "height": 2.2},
            {"element_id": "W-WIN-001", "type": "Window", "width": 1.8, "height": 1.5},
        ]
    )
    print(f"    Created Dataset: {dataset['dataset_id']} (Quality Score: {dataset['quality_score']}%)")

    print("[*] Stage 2: Training Pipeline Execution...")
    training_pipeline = AECModelTrainingPipeline()
    job = training_pipeline.execute_training(
        dataset_id=dataset["dataset_id"],
        model_type="AEC-BIM",
        config={"learning_rate": 0.001, "epochs": 25, "batch_size": 32, "architecture": "GeometricMLP"}
    )
    print(f"    Job ID: {job['job_id']}")
    print(f"    Status: {job['status']}")

    print("[*] Stage 3: Benchmark & Evaluation Engine...")
    evaluator = AECBenchmarkEngine()
    eval_result = evaluator.evaluate_model(job)
    metrics = eval_result["metrics"]
    baseline = eval_result["baseline"]
    diff = eval_result["difference"]

    print("\n--- MODEL PERFORMANCE vs BASELINE ---")
    print(f"  • F1-Score   : {metrics['F1']:.2f}  (Baseline: {baseline['F1']:.2f}, Gain: +{diff['F1']:.2f})")
    print(f"  • Precision  : {metrics['Precision']:.2f}  (Baseline: {baseline['Precision']:.2f}, Gain: +{diff['Precision']:.2f})")
    print(f"  • Recall     : {metrics['Recall']:.2f}  (Baseline: {baseline['Recall']:.2f}, Gain: +{diff['Recall']:.2f})")

    print("[*] Stage 4: Model Registry & Staging...")
    registry = AECModelRegistry()
    registered = registry.register_model(
        model_name="AEC-BIM-Classifier-v3.0",
        training_job=job,
        evaluation=eval_result
    )
    print(f"    Registered Model: {registered['model_name']} [Status: {registered['status']}]")

    print("[*] Stage 5: Promoting to Champion/Production...")
    production_model = registry.promote_to_production("AEC-BIM-Classifier-v3.0")
    print(f"    Deployment State: {production_model['deployment']} [Status: {production_model['status']}]")
    return production_model


def main():
    parser = argparse.ArgumentParser(description="BuildSphere AI Version 3.0 ML Model Training CLI")
    parser.add_argument(
        "--mode",
        choices=["ocr", "3d", "bim", "all"],
        default="all",
        help="Select training target: 'ocr', '3d', 'bim', or 'all' (default: all)"
    )
    args = parser.parse_args()

    t_start = time.time()
    print_header(f"Starting ML Training Session — Target: {args.mode.upper()}")

    if args.mode in ["ocr", "all"]:
        train_ocr_model()

    if args.mode in ["3d", "all"]:
        train_3d_converter()

    if args.mode in ["bim", "all"]:
        train_bim_ml_pipeline()

    elapsed = round(time.time() - t_start, 2)
    print_header(f"All ML Training & Evaluation Tasks Completed in {elapsed}s")
    print("[SUCCESS] Trained artifacts and 3D models available in: backend/artifacts/\n")


if __name__ == "__main__":
    main()
