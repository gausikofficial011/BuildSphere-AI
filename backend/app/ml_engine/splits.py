from typing import List, Dict, Any, Tuple
import random

class ProjectLevelSplitter:
    @staticmethod
    def split(elements: List[Dict[str, Any]], train_ratio: float = 0.8, seed: int = 42) -> Tuple[List, List]:
        """
        Rule 3: PREVENT DATA LEAKAGE. 
        Splits data cleanly across projects (sourceModelId), NEVER element by element.
        """
        random.seed(seed)
        
        # Group elements by project (sourceModelId)
        projects = {}
        for el in elements:
            prov = el.get("provenance", {})
            model_id = prov.get("sourceModelId", "unknown_model")
            if model_id not in projects:
                projects[model_id] = []
            projects[model_id].append(el)
            
        project_ids = list(projects.keys())
        random.shuffle(project_ids)
        
        split_idx = max(1, int(len(project_ids) * train_ratio))
        
        train_projects = set(project_ids[:split_idx])
        
        train_elements = []
        test_elements = []
        
        for el in elements:
            model_id = el.get("provenance", {}).get("sourceModelId", "unknown_model")
            if model_id in train_projects:
                train_elements.append(el)
            else:
                test_elements.append(el)
                
        return train_elements, test_elements
