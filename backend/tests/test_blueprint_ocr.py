"""
Test Suite: Blueprint & Architectural Drawing OCR Pipeline
Tests line-text morphological separation, text region segmentation,
domain entity extraction, and 3D synthesis parameter estimation.
"""

import pytest
import numpy as np
import cv2
from app.ml_engine.blueprint_ocr import BlueprintOcrEngine

def test_ocr_preprocessing_and_line_separation():
    engine = BlueprintOcrEngine()
    
    # Create simple synthetic test image
    img = np.full((400, 500, 3), 255, dtype=np.uint8)
    cv2.rectangle(img, (50, 50), (450, 350), (0, 0, 0), 4) # Wall line
    cv2.putText(img, "LIVING ROOM", (150, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)
    
    gray, binary = engine.preprocess_image(img)
    assert gray.shape == (400, 500)
    assert binary.shape == (400, 500)
    
    walls_mask, text_mask = engine.separate_lines_and_text(binary)
    assert walls_mask is not None
    assert text_mask is not None
    assert np.count_nonzero(walls_mask) > 0
    assert np.count_nonzero(text_mask) > 0

def test_ocr_blueprint_entity_extraction():
    engine = BlueprintOcrEngine()
    
    # Synthetic drawing array
    img = np.full((600, 800, 3), 255, dtype=np.uint8)
    cv2.rectangle(img, (80, 80), (720, 520), (20, 20, 20), 4)
    
    ground_truth = [
        {"name": "LIVING ROOM", "dims": "5.0m x 6.0m", "pos": (250, 300)},
        {"name": "BEDROOM 1", "dims": "4.0m x 4.5m", "pos": (550, 300)}
    ]
    
    results = engine.extract_blueprint_entities(img, ground_truth_labels=ground_truth)
    assert results["status"] == "success"
    assert len(results["recognized_rooms"]) == 2
    assert results["recognized_rooms"][0]["room_name"] == "LIVING ROOM"
    assert results["recognized_rooms"][0]["width_meters"] == 5.0
    assert results["recognized_rooms"][0]["length_meters"] == 6.0
    assert results["recognized_rooms"][0]["area_m2"] == 30.0
    
    synth = results["3d_synthesis_model"]
    assert synth["total_gross_floor_area_m2"] == 48.0
    assert synth["recommended_stories"] == 2
    assert synth["floor_height"] == 3.0

def test_ocr_annotated_image_generation():
    engine = BlueprintOcrEngine()
    img = np.full((400, 600, 3), 255, dtype=np.uint8)
    mock_ocr = {
        "recognized_rooms": [
            {
                "room_name": "KITCHEN",
                "dimension_raw": "3.5m x 4.0m",
                "width_meters": 3.5,
                "length_meters": 4.0,
                "area_m2": 14.0,
                "pixel_center": (300, 200),
                "confidence": 0.98
            }
        ]
    }
    annotated = engine.generate_annotated_image(img, mock_ocr)
    assert annotated.shape == img.shape
    # Ensure drawing annotations occurred
    assert not np.array_equal(annotated, img)
