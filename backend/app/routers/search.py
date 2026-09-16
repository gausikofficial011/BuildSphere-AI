from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/api/search",
    tags=["Search"]
)

@router.get("/")
def search_all(
    q: str = Query(..., min_length=1),
    user_email: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Search across Tasks, Issues, Documents, and Projects.
    Logs the query if user_email is provided.
    """
    
    # Log the search
    new_log = models.SearchLog(query=q, user_email=user_email)
    db.add(new_log)
    db.commit()

    results = []
    
    # Search Tasks
    tasks = db.query(models.Task).filter(
        or_(
            models.Task.title.ilike(f"%{q}%"),
            models.Task.description.ilike(f"%{q}%")
        )
    ).limit(5).all()
    
    for t in tasks:
        results.append({
            "id": t.id,
            "type": "task",
            "title": t.title,
            "snippet": t.description[:100] + "..." if len(t.description) > 100 else t.description,
            "url": None
        })

    # Search Issues
    issues = db.query(models.Issue).filter(
        or_(
            models.Issue.title.ilike(f"%{q}%"),
            models.Issue.description.ilike(f"%{q}%"),
            models.Issue.resolution.ilike(f"%{q}%")
        )
    ).limit(5).all()
    
    for i in issues:
        results.append({
            "id": i.id,
            "type": "issue",
            "title": i.title,
            "snippet": i.description[:100] + "..." if len(i.description) > 100 else i.description,
            "url": None
        })

    # Search Documents
    documents = db.query(models.Document).filter(
        or_(
            models.Document.title.ilike(f"%{q}%"),
            models.Document.description.ilike(f"%{q}%")
        )
    ).limit(5).all()
    
    for d in documents:
        results.append({
            "id": d.id,
            "type": "document",
            "title": d.title,
            "snippet": d.description[:100] + "..." if len(d.description) > 100 else d.description,
            "url": d.file_url
        })
        
    # Search Projects
    projects = db.query(models.Project).filter(
        or_(
            models.Project.name.ilike(f"%{q}%"),
            models.Project.description.ilike(f"%{q}%")
        )
    ).limit(3).all()
    
    for p in projects:
        results.append({
            "id": p.id,
            "type": "project",
            "title": p.name,
            "snippet": p.description[:100] + "..." if len(p.description) > 100 else p.description,
            "url": None
        })

    return results
