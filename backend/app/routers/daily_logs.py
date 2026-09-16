from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, database, models
from .notifications import create_notification_internal
import datetime

router = APIRouter(prefix="/api/daily-logs", tags=["Daily Site Logs"])

@router.get("/", response_model=List[schemas.DailyLogOut])
def get_daily_logs(
    project_id: Optional[int] = Query(None),
    zone: Optional[str] = Query(None),
    submitted_by: Optional[str] = Query(None),
    limit: int = Query(100),
    db: Session = Depends(database.get_db)
):
    """Fetch daily site logs. Filterable by zone, date, submitter."""
    q = db.query(models.DailyLog)
    if project_id:
        q = q.filter(models.DailyLog.project_id == project_id)
    if zone:
        q = q.filter(models.DailyLog.zone == zone)
    if submitted_by:
        q = q.filter(models.DailyLog.submitted_by == submitted_by)
    return q.order_by(models.DailyLog.log_date.desc()).limit(limit).all()

@router.post("/", response_model=schemas.DailyLogOut)
def submit_daily_log(log_in: schemas.DailyLogCreate, db: Session = Depends(database.get_db)):
    """Submit a daily site log. Notifies CM of new submission."""
    total_workforce = (
        (log_in.workforce_engineers or 0) +
        (log_in.workforce_supervisors or 0) +
        (log_in.workforce_skilled or 0) +
        (log_in.workforce_unskilled or 0) +
        (log_in.workforce_operators or 0)
    )

    log = models.DailyLog(
        log_date=log_in.log_date,
        zone=log_in.zone or "",
        weather=log_in.weather or "Clear",
        workforce_engineers=log_in.workforce_engineers or 0,
        workforce_supervisors=log_in.workforce_supervisors or 0,
        workforce_skilled=log_in.workforce_skilled or 0,
        workforce_unskilled=log_in.workforce_unskilled or 0,
        workforce_operators=log_in.workforce_operators or 0,
        activities=log_in.activities or "",
        materials_received=log_in.materials_received or "",
        issues_noted=log_in.issues_noted or "",
        submitted_by=log_in.submitted_by or "",
        submitted_role=log_in.submitted_role or "",
        project_id=log_in.project_id or 1
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    # Broadcast notification to team
    create_notification_internal(
        db=db,
        user_email=None,  # global broadcast
        message=f"Daily log submitted for {log_in.zone or 'Site'} on {log_in.log_date} by {log_in.submitted_role} — {total_workforce} workforce on site",
        notif_type="success",
        category="daily_log"
    )

    return log

@router.get("/summary")
def get_daily_log_summary(project_id: Optional[int] = Query(1), db: Session = Depends(database.get_db)):
    """Aggregate KPIs from all daily logs for dashboard display."""
    logs = db.query(models.DailyLog).filter(models.DailyLog.project_id == project_id).all()
    if not logs:
        return {"total_logs": 0, "avg_workforce": 0, "zones": [], "recent_log": None}

    total_workforce_list = [
        l.workforce_engineers + l.workforce_supervisors + l.workforce_skilled + l.workforce_unskilled + l.workforce_operators
        for l in logs
    ]
    zones = list(set(l.zone for l in logs if l.zone))
    recent = logs[0] if logs else None

    return {
        "total_logs": len(logs),
        "avg_workforce": round(sum(total_workforce_list) / len(total_workforce_list), 0) if total_workforce_list else 0,
        "max_workforce": max(total_workforce_list) if total_workforce_list else 0,
        "zones": zones,
        "recent_log": {
            "date": recent.log_date,
            "zone": recent.zone,
            "submitted_by": recent.submitted_by,
            "total_workforce": total_workforce_list[0] if total_workforce_list else 0
        } if recent else None
    }

@router.get("/{log_id}", response_model=schemas.DailyLogOut)
def get_daily_log(log_id: int, db: Session = Depends(database.get_db)):
    log = db.query(models.DailyLog).filter(models.DailyLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Daily log not found")
    return log
