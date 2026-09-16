from typing import Dict, Any, List
from enum import Enum

class TrustCategory(Enum):
    FACT = "FACT"
    MODEL_PREDICTION = "MODEL_PREDICTION"
    CALCULATION = "CALCULATION"
    RECOMMENDATION = "RECOMMENDATION"
    ASSUMPTION = "ASSUMPTION"
    UNKNOWN = "UNKNOWN"

class CopilotResponseFormatter:
    """
    Rule 90: AI Response Structure
    Rule 103: AI Response Trust Model
    """
    @staticmethod
    def format_response(
        understanding: str, 
        trust_category: TrustCategory, 
        data: Any,
        validation: str = "N/A",
        approval_required: bool = False
    ) -> Dict[str, Any]:
        return {
            "understanding": understanding,
            "trust_category": trust_category.value,
            "data": data,
            "validation": validation,
            "approval_required": approval_required
        }
