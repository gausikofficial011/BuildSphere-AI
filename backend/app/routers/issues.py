from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, database, models
from .notifications import create_notification_internal
import datetime

router = APIRouter(prefix="/api/issues", tags=["Issues & RFIs"])

@router.get("/", response_model=List[schemas.IssueOut])
def get_issues(
    project_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    zone: Optional[str] = Query(None),
    db: Session = Depends(database.get_db)
):
    """List all issues/RFIs/NCRs with filters. Cross-portal — any role can read."""
    q = db.query(models.Issue)
    if project_id:
        q = q.filter(models.Issue.project_id == project_id)
    if category:
        q = q.filter(models.Issue.category == category)
    if status:
        q = q.filter(models.Issue.status == status)
    if priority:
        q = q.filter(models.Issue.priority == priority)
    if zone:
        q = q.filter(models.Issue.zone == zone)
    return q.order_by(models.Issue.created_at.desc()).all()

@router.post("/", response_model=schemas.IssueOut)
def create_issue(issue_in: schemas.IssueCreate, db: Session = Depends(database.get_db)):
    """Raise a new issue/RFI/NCR/Snag. Notifies assigned person."""
    issue = models.Issue(
        title=issue_in.title,
        description=issue_in.description or "",
        category=issue_in.category or "RFI",
        status="open",
        priority=issue_in.priority or "medium",
        zone=issue_in.zone or "",
        raised_by=issue_in.raised_by or "",
        raised_by_role=issue_in.raised_by_role or "",
        assigned_to=issue_in.assigned_to or "",
        project_id=issue_in.project_id or 1
    )
    db.add(issue)
    db.commit()
    db.refresh(issue)

    # Notify assigned person if provided
    if issue_in.assigned_to:
        create_notification_internal(
            db=db,
            user_email=issue_in.assigned_to,
            message=f"New {issue_in.category} raised: '{issue_in.title}' — assigned to you by {issue_in.raised_by_role}",
            notif_type="warning",
            category="issue"
        )

    return issue

@router.patch("/{issue_id}", response_model=schemas.IssueOut)
def update_issue(issue_id: int, updates: schemas.IssueUpdate, db: Session = Depends(database.get_db)):
    """Update issue status, resolution, reassign, etc."""
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(issue, field, value)
    issue.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(issue)
    return issue

@router.delete("/{issue_id}")
def delete_issue(issue_id: int, db: Session = Depends(database.get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    db.delete(issue)
    db.commit()
    return {"status": "deleted", "issue_id": issue_id}

@router.get("/stats/summary")
def issue_stats(project_id: Optional[int] = Query(1), db: Session = Depends(database.get_db)):
    """Returns issue counts by category and status for dashboards."""
    q = db.query(models.Issue).filter(models.Issue.project_id == project_id)
    return {
        "total": q.count(),
        "open": q.filter(models.Issue.status == "open").count(),
        "in_review": q.filter(models.Issue.status == "in_review").count(),
        "resolved": q.filter(models.Issue.status == "resolved").count(),
        "by_category": {
            "RFI": db.query(models.Issue).filter(models.Issue.project_id == project_id, models.Issue.category == "RFI").count(),
            "NCR": db.query(models.Issue).filter(models.Issue.project_id == project_id, models.Issue.category == "NCR").count(),
            "Snag": db.query(models.Issue).filter(models.Issue.project_id == project_id, models.Issue.category == "Snag").count(),
            "Risk": db.query(models.Issue).filter(models.Issue.project_id == project_id, models.Issue.category == "Risk").count(),
            "Change Order": db.query(models.Issue).filter(models.Issue.project_id == project_id, models.Issue.category == "Change Order").count(),
        }
    }
