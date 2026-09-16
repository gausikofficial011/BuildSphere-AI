from abc import ABC, abstractmethod
from typing import List, Dict, Any

class IRevitConnection(ABC):
    @abstractmethod
    def connect(self) -> bool:
        pass

class IRevitReader(ABC):
    @abstractmethod
    def get_all_elements(self) -> List[Dict[str, Any]]:
        pass
    
    @abstractmethod
    def get_element_by_id(self, element_id: str) -> Dict[str, Any]:
        pass
        
    @abstractmethod
    def get_parameters(self, element_id: str) -> Dict[str, Any]:
        pass

class IRevitWriter(ABC):
    @abstractmethod
    def create_element(self, element_data: Dict[str, Any]) -> str:
        pass
        
    @abstractmethod
    def modify_parameter(self, element_id: str, param_name: str, value: Any) -> bool:
        pass

class IRevitTransaction(ABC):
    @abstractmethod
    def start(self, name: str) -> None:
        pass
        
    @abstractmethod
    def commit(self) -> None:
        pass
        
    @abstractmethod
    def rollback(self) -> None:
        pass
