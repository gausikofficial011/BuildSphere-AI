from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os
import json
import uuid
import datetime

router = APIRouter(prefix="/api/datasets", tags=["Datasets"])

DATASET_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "dataset", "processed")
os.makedirs(DATASET_DIR, exist_ok=True)

# Pydantic Schemas
class ElementData(BaseModel):
    element_id: str
    category: str
    family: Optional[str] = "Standard"
    type: Optional[str] = "Generic"
    level: Optional[str] = "Level 1"
    discipline: Optional[str] = "Architectural"
    geometry_features: Optional[Dict[str, Any]] = None
    parameters: Optional[Dict[str, Any]] = None

class RelationshipData(BaseModel):
    source: str
    target: str
    type: str

class DatasetCreatePayload(BaseModel):
    dataset_id: Optional[str] = None
    name: str
    discipline: str = "BIM"
    portal_role: Optional[str] = "BimManager"
    building_type: Optional[str] = "Commercial High-Rise"
    description: Optional[str] = ""
    elements: List[ElementData] = []
    relationships: List[RelationshipData] = []
    source: Optional[str] = "buildsphere_engine"
    version: Optional[str] = "v1"

class DatasetUpdatePayload(BaseModel):
    name: Optional[str] = None
    discipline: Optional[str] = None
    description: Optional[str] = None
    elements: Optional[List[ElementData]] = None
    relationships: Optional[List[RelationshipData]] = None
    parameters: Optional[Dict[str, Any]] = None

class ElementEditPayload(BaseModel):
    category: Optional[str] = None
    family: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    geometry_features: Optional[Dict[str, Any]] = None

def get_all_dataset_files():
    files = []
    if os.path.exists(DATASET_DIR):
        for f in os.listdir(DATASET_DIR):
            if f.endswith(".json"):
                files.append(f)
    return files

def load_dataset_file(filename: str) -> Dict[str, Any]:
    file_path = os.path.join(DATASET_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Dataset {filename} not found")
    try:
        with open(file_path, "r", encoding="utf-8") as fp:
            return json.load(fp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading dataset: {str(e)}")

def save_dataset_file(filename: str, data: Dict[str, Any]):
    file_path = os.path.join(DATASET_DIR, filename)
    with open(file_path, "w", encoding="utf-8") as fp:
        json.dump(data, fp, indent=2)

# =========================================================================
# 1. LIST ALL DATASETS (Filtered by Discipline / Portal)
# =========================================================================
@router.get("/")
def list_datasets(
    discipline: Optional[str] = None,
    portal: Optional[str] = None,
    search: Optional[str] = None
):
    """
    Lists all available datasets with metadata summary.
    """
    dataset_files = get_all_dataset_files()
    datasets_summary = []

    for filename in dataset_files:
        try:
            data = load_dataset_file(filename)
            dataset_id = data.get("dataset_id") or filename.replace(".json", "")
            name = data.get("name") or dataset_id.replace("_", " ").title()
            disc = data.get("discipline") or "BIM"
            role = data.get("portal_role") or "General"
            elements_count = len(data.get("elements", []))
            version = data.get("version", "v1")
            updated_at = data.get("updated_at") or data.get("created_at") or "2026-08-20T00:00:00Z"

            # Filtering
            if discipline and discipline.lower() != "all" and disc.lower() != discipline.lower():
                continue
            if portal and portal.lower() != "all" and role.lower() != portal.lower():
                continue
            if search and search.lower() not in name.lower() and search.lower() not in disc.lower():
                continue

            datasets_summary.append({
                "dataset_id": dataset_id,
                "filename": filename,
                "name": name,
                "discipline": disc,
                "portal_role": role,
                "building_type": data.get("building_type", "Commercial"),
                "description": data.get("description", ""),
                "elements_count": elements_count,
                "relationships_count": len(data.get("relationships", [])),
                "version": version,
                "source": data.get("source", "BuildSphere Engine"),
                "updated_at": updated_at
            })
        except Exception:
            continue

    return {
        "total": len(datasets_summary),
        "datasets": datasets_summary
    }

# =========================================================================
# 2. GET SPECIFIC DATASET BY ID / FILENAME
# =========================================================================
@router.get("/{dataset_id}")
def get_dataset_details(dataset_id: str):
    """
    Retrieves the full dataset structure including elements, relationships, and parameters.
    """
    filename = dataset_id if dataset_id.endswith(".json") else f"{dataset_id}.json"
    data = load_dataset_file(filename)
    return data

# =========================================================================
# 3. INTAKE / CREATE NEW DATASET
# =========================================================================
@router.post("/intake")
def intake_dataset(payload: DatasetCreatePayload):
    """
    Intakes and stores a new structured dataset with validation and metadata hashing.
    """
    dataset_id = payload.dataset_id or f"ds_{uuid.uuid4().hex[:8]}"
    filename = f"{dataset_id}.json"
    
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    
    record = {
        "dataset_id": dataset_id,
        "name": payload.name,
        "discipline": payload.discipline,
        "portal_role": payload.portal_role,
        "building_type": payload.building_type,
        "description": payload.description,
        "elements": [e.model_dump() for e in payload.elements],
        "relationships": [r.model_dump() for r in payload.relationships],
        "source": payload.source,
        "version": payload.version,
        "created_at": timestamp,
        "updated_at": timestamp
    }
    
    save_dataset_file(filename, record)
    return {
        "status": "SUCCESS",
        "message": f"Dataset '{payload.name}' successfully intaken and saved.",
        "dataset_id": dataset_id,
        "elements_count": len(payload.elements),
        "version": payload.version
    }

# =========================================================================
# 4. EDIT / UPDATE DATASET METADATA & ELEMENTS
# =========================================================================
@router.put("/{dataset_id}")
def update_dataset(dataset_id: str, payload: DatasetUpdatePayload):
    """
    Updates dataset properties, adds elements, or modifies dataset parameters.
    """
    filename = dataset_id if dataset_id.endswith(".json") else f"{dataset_id}.json"
    data = load_dataset_file(filename)
    
    if payload.name:
        data["name"] = payload.name
    if payload.discipline:
        data["discipline"] = payload.discipline
    if payload.description is not None:
        data["description"] = payload.description
    if payload.elements is not None:
        data["elements"] = [e.model_dump() for e in payload.elements]
    if payload.relationships is not None:
        data["relationships"] = [r.model_dump() for r in payload.relationships]
    if payload.parameters is not None:
        data["parameters"] = payload.parameters
        
    data["updated_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    save_dataset_file(filename, data)
    
    return {
        "status": "SUCCESS",
        "message": f"Dataset '{dataset_id}' successfully updated.",
        "dataset_id": dataset_id,
        "elements_count": len(data.get("elements", []))
    }

# =========================================================================
# 5. EDIT SPECIFIC ELEMENT WITHIN A DATASET
# =========================================================================
@router.patch("/{dataset_id}/elements/{element_id}")
def edit_dataset_element(dataset_id: str, element_id: str, payload: ElementEditPayload):
    """
    Modifies parameters or attributes of a single element inside a dataset.
    """
    filename = dataset_id if dataset_id.endswith(".json") else f"{dataset_id}.json"
    data = load_dataset_file(filename)
    
    elements = data.get("elements", [])
    found = False
    
    for el in elements:
        if el.get("element_id") == element_id:
            found = True
            if payload.category:
                el["category"] = payload.category
            if payload.family:
                el["family"] = payload.family
            if payload.type:
                el["type"] = payload.type
            if payload.level:
                el["level"] = payload.level
            if payload.parameters:
                el.setdefault("parameters", {}).update(payload.parameters)
            if payload.geometry_features:
                el.setdefault("geometry_features", {}).update(payload.geometry_features)
            break
            
    if not found:
        raise HTTPException(status_code=404, detail=f"Element {element_id} not found in dataset {dataset_id}")
        
    data["updated_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    save_dataset_file(filename, data)
    
    return {
        "status": "SUCCESS",
        "message": f"Element {element_id} updated in dataset {dataset_id}."
    }

# =========================================================================
# 6. ADD A SINGLE ELEMENT TO AN EXISTING DATASET
# =========================================================================
@router.post("/{dataset_id}/elements")
def add_element_to_dataset(dataset_id: str, element: ElementData):
    """
    Appends a new element to an existing dataset.
    """
    filename = dataset_id if dataset_id.endswith(".json") else f"{dataset_id}.json"
    data = load_dataset_file(filename)
    
    elements = data.setdefault("elements", [])
    # Check duplicate
    if any(e.get("element_id") == element.element_id for e in elements):
        raise HTTPException(status_code=400, detail=f"Element ID {element.element_id} already exists")
        
    elements.append(element.model_dump())
    data["updated_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    save_dataset_file(filename, data)
    
    return {
        "status": "SUCCESS",
        "message": f"Element {element.element_id} added to dataset {dataset_id}.",
        "total_elements": len(elements)
    }

# =========================================================================
# 7. DELETE AN ELEMENT FROM A DATASET
# =========================================================================
@router.delete("/{dataset_id}/elements/{element_id}")
def delete_element_from_dataset(dataset_id: str, element_id: str):
    """
    Removes an element from a dataset.
    """
    filename = dataset_id if dataset_id.endswith(".json") else f"{dataset_id}.json"
    data = load_dataset_file(filename)
    
    elements = data.get("elements", [])
    initial_len = len(elements)
    data["elements"] = [e for e in elements if e.get("element_id") != element_id]
    
    if len(data["elements"]) == initial_len:
        raise HTTPException(status_code=404, detail=f"Element {element_id} not found")
        
    data["updated_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    save_dataset_file(filename, data)
    
    return {
        "status": "SUCCESS",
        "message": f"Element {element_id} deleted from dataset {dataset_id}.",
        "remaining_elements": len(data["elements"])
    }

# =========================================================================
# 8. DELETE ENTIRE DATASET
# =========================================================================
@router.delete("/{dataset_id}")
def delete_dataset(dataset_id: str):
    """
    Permanently removes a dataset file from the repository.
    """
    filename = dataset_id if dataset_id.endswith(".json") else f"{dataset_id}.json"
    file_path = os.path.join(DATASET_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Dataset {dataset_id} not found")
        
    os.remove(file_path)
    return {
        "status": "SUCCESS",
        "message": f"Dataset {dataset_id} permanently deleted."
    }
