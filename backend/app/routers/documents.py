from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, database, models
from .notifications import create_notification_internal
import datetime

router = APIRouter(prefix="/api/documents", tags=["Document Center"])

@router.get("/", response_model=List[schemas.DocumentOut])
def get_documents(
    project_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    uploaded_by_role: Optional[str] = Query(None),
    db: Session = Depends(database.get_db)
):
    """List all project documents. Filterable by category and role."""
    q = db.query(models.Document)
    if project_id:
        q = q.filter(models.Document.project_id == project_id)
    if category:
        q = q.filter(models.Document.category == category)
    if uploaded_by_role:
        q = q.filter(models.Document.uploaded_by_role == uploaded_by_role)
    return q.order_by(models.Document.created_at.desc()).all()

@router.post("/", response_model=schemas.DocumentOut)
def upload_document(doc_in: schemas.DocumentCreate, db: Session = Depends(database.get_db)):
    """Register a new document (metadata + URL reference). Notifies team."""
    doc = models.Document(
        title=doc_in.title,
        category=doc_in.category or "General",
        file_url=doc_in.file_url or "",
        file_type=doc_in.file_type or "pdf",
        uploaded_by=doc_in.uploaded_by or "",
        uploaded_by_role=doc_in.uploaded_by_role or "",
        version=doc_in.version or "1.0",
        description=doc_in.description or "",
        project_id=doc_in.project_id or 1
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Broadcast to team
    create_notification_internal(
        db=db,
        user_email=None,
        message=f"New {doc_in.category} document uploaded: '{doc_in.title}' v{doc_in.version} by {doc_in.uploaded_by_role}",
        notif_type="info",
        category="document"
    )

    return doc

@router.patch("/{doc_id}", response_model=schemas.DocumentOut)
def update_document(doc_id: int, updates: dict, db: Session = Depends(database.get_db)):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    for field, value in updates.items():
        if hasattr(doc, field):
            setattr(doc, field, value)
    db.commit()
    db.refresh(doc)
    return doc

@router.delete("/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(database.get_db)):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return {"status": "deleted", "doc_id": doc_id}

@router.get("/categories")
def get_categories(db: Session = Depends(database.get_db)):
    """Returns distinct document categories for filter dropdown."""
    cats = db.query(models.Document.category).distinct().all()
    default_cats = ["Drawings", "Contracts", "Specifications", "Inspection Reports", "BOQ", "Certificates", "Meeting Minutes", "Reports"]
    existing = [c[0] for c in cats if c[0]]
    merged = list(set(default_cats + existing))
    return {"categories": sorted(merged)}
