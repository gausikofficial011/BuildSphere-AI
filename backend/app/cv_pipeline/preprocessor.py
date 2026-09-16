"""
BuildSphere AI — Floor Plan Preprocessor
========================================
Robust multi-format loader, deskewer, contrast-enhancer, and line-separator.
Handles PNG, JPG, JPEG, and PDF documents.
Preserves Unicode paths and Windows file system compatibility.
"""

import os
import math
from typing import Tuple, Optional, Dict, Any
import numpy as np
import cv2
from PIL import Image


class PreprocessResult:
    def __init__(
        self,
        rgb: np.ndarray,
        gray: np.ndarray,
        binary: np.ndarray,
        skew_angle: float,
        width: int,
        height: int,
        scale_factor: float = 1.0,
        metadata: Optional[Dict[str, Any]] = None
    ):
        self.rgb = rgb
        self.gray = gray
        self.binary = binary
        self.skew_angle = skew_angle
        self.width = width
        self.height = height
        self.scale_factor = scale_factor
        self.metadata = metadata or {}


class FloorPlanPreprocessor:
    """Preprocesses 2D architectural drawings for geometry extraction and OCR."""

    def __init__(self, target_max_dimension: int = 2400):
        self.target_max_dimension = target_max_dimension

    def load_document(self, file_path: str) -> np.ndarray:
        """Loads an architectural floor plan file safely (supports Unicode Windows paths)."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Drawing file not found: {file_path}")

        ext = os.path.splitext(file_path)[1].lower()

        if ext == ".pdf":
            return self._load_pdf_first_page(file_path)
        elif ext in [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"]:
            # Use numpy + cv2.imdecode to avoid Windows path issues
            with open(file_path, "rb") as f:
                file_bytes = np.frombuffer(f.read(), dtype=np.uint8)
            img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
            if img is None:
                raise ValueError(f"Failed to decode image file: {file_path}")
            return img
        else:
            raise ValueError(f"Unsupported drawing format '{ext}'. Supported: PNG, JPG, JPEG, PDF.")

    def _load_pdf_first_page(self, pdf_path: str) -> np.ndarray:
        """Extracts and renders the first page of an architectural PDF drawing."""
        # Check for PyMuPDF (fitz)
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(pdf_path)
            if len(doc) == 0:
                raise ValueError("PDF contains no pages.")
            page = doc[0]
            pix = page.get_pixmap(dpi=150)
            img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
            if pix.n == 4:
                img = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
            elif pix.n == 3:
                img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
            return img
        except ImportError:
            pass

        # Check for pdf2image
        try:
            from pdf2image import convert_from_path
            pages = convert_from_path(pdf_path, first_page=1, last_page=1, dpi=150)
            if pages:
                pil_img = pages[0].convert("RGB")
                return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        except Exception:
            pass

        # Check for pypdf image extraction
        try:
            import pypdf
            reader = pypdf.PdfReader(pdf_path)
            if len(reader.pages) > 0:
                page = reader.pages[0]
                for image_file in page.images:
                    pil_img = Image.open(image_file.data).convert("RGB")
                    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        except Exception:
            pass

        raise RuntimeError(
            f"PDF file uploaded ({pdf_path}), but no PDF rasterizer is installed. "
            "Please upload PNG or JPEG directly, or ensure pymupdf/pdf2image is available."
        )

    def normalize_resolution(self, img: np.ndarray) -> Tuple[np.ndarray, float]:
        """Rescales the image if necessary so the largest dimension fits target_max_dimension."""
        h, w = img.shape[:2]
        max_dim = max(h, w)
        if max_dim > self.target_max_dimension:
            scale = self.target_max_dimension / float(max_dim)
            new_w = int(w * scale)
            new_h = int(h * scale)
            resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
            return resized, scale
        elif max_dim < 600:
            scale = 1200.0 / float(max_dim)
            new_w = int(w * scale)
            new_h = int(h * scale)
            resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
            return resized, scale
        return img, 1.0

    def detect_skew_angle(self, gray: np.ndarray) -> float:
        """Estimates rotation skew angle from dominant horizontal and vertical lines."""
        edges = cv2.Canny(gray, 50, 150, apertureSize=3)
        lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=100, minLineLength=80, maxLineGap=10)
        if lines is None:
            return 0.0

        angles = []
        lines_reshaped = lines.reshape(-1, 4)
        for x1, y1, x2, y2 in lines_reshaped:
            dx = float(x2 - x1)
            dy = float(y2 - y1)
            if dx == 0 and dy == 0:
                continue
            deg = math.degrees(math.atan2(dy, dx))
            # Wrap to [-45, 45] range
            wrapped = (deg + 45) % 90 - 45
            angles.append(wrapped)

        if not angles:
            return 0.0

        # Calculate median angle
        median_angle = float(np.median(angles))
        # Only deskew if the skew is significant (> 0.4°) and not a false diagonal (< 20°)
        if 0.4 < abs(median_angle) < 20.0:
            return median_angle
        return 0.0

    def rotate_image(self, img: np.ndarray, angle: float) -> np.ndarray:
        """Rotates image around its center to correct skew."""
        if abs(angle) < 0.05:
            return img
        h, w = img.shape[:2]
        center = (w // 2, h // 2)
        rot_mat = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(
            img, rot_mat, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE
        )
        return rotated

    def enhance_and_binarize(self, gray: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Applies edge-preserving filtering and adaptive Otsu binarization."""
        # Bilateral filter eliminates paper/scanner texture while preserving crisp wall edges
        filtered = cv2.bilateralFilter(gray, d=9, sigmaColor=75, sigmaSpace=75)

        # Contrast Limited Adaptive Histogram Equalization
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(filtered)

        # Otsu thresholding with slight Gaussian blur
        blurred = cv2.GaussianBlur(enhanced, (3, 3), 0)
        _, binary = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

        # Morphological clean up to remove isolated 1-pixel noise
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        clean_binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)

        return enhanced, clean_binary

    def process(self, file_path_or_array) -> PreprocessResult:
        """Full preprocessing pipeline entry point."""
        if isinstance(file_path_or_array, str):
            raw_bgr = self.load_document(file_path_or_array)
        else:
            raw_bgr = file_path_or_array

        # Convert to RGB
        if len(raw_bgr.shape) == 2:
            rgb = cv2.cvtColor(raw_bgr, cv2.COLOR_GRAY2RGB)
            gray = raw_bgr
        else:
            rgb = cv2.cvtColor(raw_bgr, cv2.COLOR_BGR2RGB)
            gray = cv2.cvtColor(raw_bgr, cv2.COLOR_BGR2GRAY)

        # Normalize resolution
        normalized_rgb, scale_factor = self.normalize_resolution(rgb)
        normalized_gray = cv2.cvtColor(normalized_rgb, cv2.COLOR_RGB2GRAY)

        # Deskew
        skew_angle = self.detect_skew_angle(normalized_gray)
        if abs(skew_angle) > 0.1:
            normalized_rgb = self.rotate_image(normalized_rgb, skew_angle)
            normalized_gray = self.rotate_image(normalized_gray, skew_angle)

        # Enhance and binarize
        enhanced_gray, binary = self.enhance_and_binarize(normalized_gray)
        h, w = normalized_rgb.shape[:2]

        return PreprocessResult(
            rgb=normalized_rgb,
            gray=enhanced_gray,
            binary=binary,
            skew_angle=skew_angle,
            width=w,
            height=h,
            scale_factor=scale_factor,
            metadata={"original_shape": raw_bgr.shape[:2], "scale_factor": scale_factor}
        )
