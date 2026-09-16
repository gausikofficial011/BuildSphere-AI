from typing import Dict, Any

class AecStandardsRegistry:
    """Registry for configured mock standards to prevent fabrication."""
    def __init__(self):
        self.standards = {
            "TEST_CODE_2026": {
                "name": "Mock Acoustic Standard",
                "rules": ["REQ_STC_50"]
            }
        }
        
    def get_standard(self, code: str) -> Dict[str, Any]:
        return self.standards.get(code, {})

class CompliancePrecheckEngine:
    """Evaluates elements against standards. Strictly non-legal."""
    def __init__(self, registry: AecStandardsRegistry):
        self.registry = registry
        
    def evaluate(self, element_data: Dict[str, Any], standard_code: str) -> Dict[str, Any]:
        standard = self.registry.get_standard(standard_code)
        if not standard:
            return {"status": "UNKNOWN_STANDARD"}
            
        # Simplified rule check for demo
        is_compliant = element_data.get("stc_rating", 0) >= 50
        
        return {
            "status": "PASS" if is_compliant else "FAIL",
            "standard_evaluated": standard["name"],
            "disclaimer": "STATUS: PRE-CHECK ONLY. NOT A LEGAL CERTIFICATION."
        }
