"""Computer Vision and OCR Pipeline Package for Architectural Floor Plans."""

from .preprocessor import FloorPlanPreprocessor, PreprocessResult
from .ocr_provider import (
    BaseOcrProvider, TesseractOcrProvider, HeuristicArchitecturalOcrProvider,
    CompositeOcrPipeline, OcrBox, ArchitecturalSemanticInterpreter
)
from .geometry_detector import FloorPlanGeometryDetector, DetectedWallSegment
from .aperture_detector import FloorPlanApertureDetector, DetectedAperture
from .room_detector import FloorPlanRoomDetector, DetectedRoom
from .scale_calibrator import FloorPlanScaleCalibrator, ScaleCalibrationResult
from .topology_validator import TopologyValidator
from .pipeline_orchestrator import FloorPlanPipelineOrchestrator

__all__ = [
    "FloorPlanPreprocessor",
    "PreprocessResult",
    "BaseOcrProvider",
    "TesseractOcrProvider",
    "HeuristicArchitecturalOcrProvider",
    "CompositeOcrPipeline",
    "OcrBox",
    "ArchitecturalSemanticInterpreter",
    "FloorPlanGeometryDetector",
    "DetectedWallSegment",
    "FloorPlanApertureDetector",
    "DetectedAperture",
    "FloorPlanRoomDetector",
    "DetectedRoom",
    "FloorPlanScaleCalibrator",
    "ScaleCalibrationResult",
    "TopologyValidator",
    "FloorPlanPipelineOrchestrator"
]
