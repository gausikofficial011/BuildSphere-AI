from typing import Dict, Any, List

class TradeoffExplainer:
    """Explains the 'why' behind AI proposed options."""
    def explain(self, options: List[Dict[str, Any]]) -> Dict[str, str]:
        explanations = {}
        for opt in options:
            if opt["id"] == "BASELINE":
                explanations[opt["id"]] = "Accepts the full 11-day delay. High risk of cascading impacts to MEP trades."
            elif opt["id"] == "OPTION_A":
                explanations[opt["id"]] = "Recoups 7 days by adding standard equipment. Medium risk due to site congestion."
            elif opt["id"] == "OPTION_B":
                explanations[opt["id"]] = "Recoups 5 days by altering the 4D BIM sequence. Cost-effective, but requires MEP re-coordination."
            elif opt["id"] == "OPTION_C":
                explanations[opt["id"]] = "Recoups 9 days via robotic assistance. High upfront cost, but lowest schedule risk."
        return explanations
