from typing import Dict, Any

class BIMNormalizer:
    @staticmethod
    def normalize_unit(value: float, source_unit: str) -> float:
        """
        Normalizes any length unit into metric meters as the canonical internal unit.
        """
        source_unit = source_unit.lower()
        if source_unit == "mm" or source_unit == "millimeters":
            return value / 1000.0
        elif source_unit == "cm" or source_unit == "centimeters":
            return value / 100.0
        elif source_unit in ["ft", "feet", "foot"]:
            return value * 0.3048
        elif source_unit in ["in", "inch", "inches"]:
            return value * 0.0254
        elif source_unit == "m" or source_unit == "meters":
            return value
        return value # Fallback for unknown
