from typing import Dict, Any

class ConcurrencyEngine:
    """
    Rule 18: Element Locking
    Rule 19: Optimistic Concurrency
    Rule 109: Collaboration Conflict Test
    """
    def __init__(self):
        self.element_versions = {}
        self.locks = {}
        
    def write_element(self, element_id: str, current_version: int, user_id: str) -> bool:
        """
        Attempts to write an element. Verifies version matching to avoid blind overwrites.
        """
        # Check lock
        if self.locks.get(element_id) and self.locks.get(element_id) != user_id:
            raise Exception(f"LOCKED_BY_USER_{self.locks[element_id]}")
            
        # Check optimistic concurrency
        server_version = self.element_versions.get(element_id, 0)
        
        if current_version != server_version:
            raise Exception("VERSION_CONFLICT: The element was modified by another user.")
            
        # Commit write and increment version
        self.element_versions[element_id] = server_version + 1
        return True
        
    def acquire_lock(self, element_id: str, user_id: str) -> bool:
        if element_id not in self.locks:
            self.locks[element_id] = user_id
            return True
        return False
        
    def release_lock(self, element_id: str, user_id: str) -> bool:
        if self.locks.get(element_id) == user_id:
            del self.locks[element_id]
            return True
        return False
