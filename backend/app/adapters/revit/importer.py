from abc import ABC, abstractmethod
from typing import List, Dict, Any
from .environment import RevitEnvironmentDetector, RevitEnvironmentError

class IRevitModelReader(ABC):
    @abstractmethod
    def inspectModel(self) -> Dict[str, Any]:
        pass

class IRevitElementReader(ABC):
    @abstractmethod
    def extractCategories(self) -> List[Dict[str, Any]]:
        pass
    
    @abstractmethod
    def extractFamilies(self) -> List[Dict[str, Any]]:
        pass
        
    @abstractmethod
    def extractTypes(self) -> List[Dict[str, Any]]:
        pass
        
    @abstractmethod
    def extractInstances(self) -> List[Dict[str, Any]]:
        pass

class IRevitParameterReader(ABC):
    @abstractmethod
    def extractParameters(self, element_id: str) -> Dict[str, Any]:
        pass

class IRevitGeometryReader(ABC):
    @abstractmethod
    def extractGeometry(self, element_id: str) -> Dict[str, Any]:
        pass

class IRevitRelationshipReader(ABC):
    @abstractmethod
    def extractRelationships(self) -> List[Dict[str, Any]]:
        pass

class NativeRevitImporter(IRevitModelReader, IRevitElementReader, IRevitParameterReader, IRevitGeometryReader, IRevitRelationshipReader):
    def inspectModel(self) -> Dict[str, Any]:
        RevitEnvironmentDetector.require_environment()
        return {}
        
    def extractCategories(self) -> List[Dict[str, Any]]:
        RevitEnvironmentDetector.require_environment()
        return []
        
    def extractFamilies(self) -> List[Dict[str, Any]]:
        RevitEnvironmentDetector.require_environment()
        return []
        
    def extractTypes(self) -> List[Dict[str, Any]]:
        RevitEnvironmentDetector.require_environment()
        return []
        
    def extractInstances(self) -> List[Dict[str, Any]]:
        RevitEnvironmentDetector.require_environment()
        return []
        
    def extractParameters(self, element_id: str) -> Dict[str, Any]:
        RevitEnvironmentDetector.require_environment()
        return {}
        
    def extractGeometry(self, element_id: str) -> Dict[str, Any]:
        RevitEnvironmentDetector.require_environment()
        return {}
        
    def extractRelationships(self) -> List[Dict[str, Any]]:
        RevitEnvironmentDetector.require_environment()
        return []

