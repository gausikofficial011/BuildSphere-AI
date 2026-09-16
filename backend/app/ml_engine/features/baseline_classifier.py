from typing import List, Dict, Any

class BaselineClassifier:
    """
    Rule 12: BIM Classifier Baseline.
    A simple deterministic or logistic regression baseline to compare against NNs.
    """
    def __init__(self):
        self.is_trained = False
        self.class_priors = {}
        
    def train(self, X: List[Dict[str, Any]], y: List[str]):
        # Mocking a baseline training step (e.g. calculating priors)
        total = len(y)
        if total == 0:
            return
            
        for label in y:
            self.class_priors[label] = self.class_priors.get(label, 0) + 1
            
        for k in self.class_priors:
            self.class_priors[k] /= total
            
        self.is_trained = True
        
    def predict(self, x: Dict[str, Any]) -> str:
        if not self.is_trained or not self.class_priors:
            return "UNKNOWN"
            
        # Very naive baseline: predict the most common class
        return max(self.class_priors, key=self.class_priors.get)
