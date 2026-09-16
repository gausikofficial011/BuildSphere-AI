from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, database, models
import datetime

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

def create_notification_internal(db: Session, user_email: str, message: str, notif_type: str = "info", category: str = "general"):
    """Helper to create notification from other routers."""
    notif = models.Notification(
        user_email=user_email,
        message=message,
        notif_type=notif_type,
        category=category,
        is_read=False,
        created_at=datetime.datetime.utcnow()
    )
    db.add(notif)
    db.commit()
    return notif

@router.get("/", response_model=List[schemas.NotificationOut])
def get_notifications(
    user_email: Optional[str] = Query(None),
    unread_only: bool = Query(False),
    limit: int = Query(50),
    db: Session = Depends(database.get_db)
):
    """Get notifications for a user or all global ones."""
    q = db.query(models.Notification)
    if user_email:
        q = q.filter(
            (models.Notification.user_email == user_email) | (models.Notification.user_email == None)
        )
    if unread_only:
        q = q.filter(models.Notification.is_read == False)
    return q.order_by(models.Notification.created_at.desc()).limit(limit).all()

@router.get("/count")
def get_unread_count(user_email: Optional[str] = Query(None), db: Session = Depends(database.get_db)):
    """Returns unread notification count for bell icon badge."""
    q = db.query(models.Notification).filter(models.Notification.is_read == False)
    if user_email:
        q = q.filter(
            (models.Notification.user_email == user_email) | (models.Notification.user_email == None)
        )
    return {"unread_count": q.count()}

@router.patch("/{notif_id}/read")
def mark_read(notif_id: int, db: Session = Depends(database.get_db)):
    """Mark a single notification as read."""
    notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"status": "marked_read", "id": notif_id}

@router.patch("/mark-all-read")
def mark_all_read(user_email: Optional[str] = Query(None), db: Session = Depends(database.get_db)):
    """Mark all notifications as read."""
    q = db.query(models.Notification).filter(models.Notification.is_read == False)
    if user_email:
        q = q.filter(
            (models.Notification.user_email == user_email) | (models.Notification.user_email == None)
        )
    q.update({"is_read": True})
    db.commit()
    return {"status": "all_marked_read"}

@router.post("/broadcast")
def broadcast_notification(message: str, notif_type: str = "info", category: str = "general", db: Session = Depends(database.get_db)):
    """Broadcast a notification to all users (user_email=None means global)."""
    notif = models.Notification(
        user_email=None,
        message=message,
        notif_type=notif_type,
        category=category,
        is_read=False
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return {"status": "broadcast_sent", "id": notif.id}
