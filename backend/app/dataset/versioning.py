import hashlib
import json
from typing import Any

class DatasetVersioning:
    @staticmethod
    def generate_hash(data: Any) -> str:
        """
        Creates a reproducible hash for provenance and reproducibility.
        """
        # Ensure stable serialization by sorting keys
        json_str = json.dumps(data, sort_keys=True)
        return hashlib.sha256(json_str.encode('utf-8')).hexdigest()
