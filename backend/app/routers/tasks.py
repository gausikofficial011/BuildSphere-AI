from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, database, models
from .notifications import create_notification_internal
import datetime

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

def get_db():
    return database.get_db()

@router.get("/", response_model=List[schemas.TaskOut])
def get_tasks(
    project_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    assignee_email: Optional[str] = Query(None),
    zone: Optional[str] = Query(None),
    db: Session = Depends(database.get_db)
):
    """Get all tasks with optional filters. Used by all portals."""
    q = db.query(models.Task)
    if project_id:
        q = q.filter(models.Task.project_id == project_id)
    if status:
        q = q.filter(models.Task.status == status)
    if priority:
        q = q.filter(models.Task.priority == priority)
    if assignee_email:
        q = q.filter(models.Task.assignee_email == assignee_email)
    if zone:
        q = q.filter(models.Task.zone == zone)
    return q.order_by(models.Task.created_at.desc()).all()

@router.post("/", response_model=schemas.TaskOut)
def create_task(task_in: schemas.TaskCreate, db: Session = Depends(database.get_db)):
    """Create a new task. Triggers notification to assignee."""
    task = models.Task(
        title=task_in.title,
        description=task_in.description or "",
        status="todo",
        priority=task_in.priority or "medium",
        zone=task_in.zone or "",
        due_date=task_in.due_date or "",
        assignee_email=task_in.assignee_email,
        project_id=task_in.project_id or 1,
        author_role=task_in.author_role or ""
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    # Update project active task count
    project = db.query(models.Project).filter(models.Project.id == task.project_id).first()
    if project:
        project.active_tasks = db.query(models.Task).filter(
            models.Task.project_id == project.id,
            models.Task.status != "done"
        ).count()
        db.commit()

    # Send notification to assignee
    if task_in.assignee_email:
        create_notification_internal(
            db=db,
            user_email=task_in.assignee_email,
            message=f"New task assigned to you: '{task_in.title}' (Priority: {task_in.priority})",
            notif_type="info",
            category="task"
        )

    return task

@router.patch("/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, updates: schemas.TaskUpdate, db: Session = Depends(database.get_db)):
    """Update task status, priority, assignee, etc."""
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    old_status = task.status
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(task, field, value)
    task.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(task)

    # Update overdue count on project
    if updates.status and updates.status != old_status:
        project = db.query(models.Project).filter(models.Project.id == task.project_id).first()
        if project:
            project.active_tasks = db.query(models.Task).filter(
                models.Task.project_id == project.id,
                models.Task.status != "done"
            ).count()
            db.commit()

    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(database.get_db)):
    """Delete a task."""
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"status": "deleted", "task_id": task_id}

@router.get("/stats/summary")
def task_stats(project_id: Optional[int] = Query(1), db: Session = Depends(database.get_db)):
    """Returns task count by status for dashboard KPI cards."""
    q = db.query(models.Task).filter(models.Task.project_id == project_id)
    total = q.count()
    todo = q.filter(models.Task.status == "todo").count()
    in_progress = q.filter(models.Task.status == "in_progress").count()
    done = q.filter(models.Task.status == "done").count()
    blocked = q.filter(models.Task.status == "blocked").count()
    return {
        "total": total,
        "todo": todo,
        "in_progress": in_progress,
        "done": done,
        "blocked": blocked,
        "completion_rate": round((done / total * 100) if total > 0 else 0, 1)
    }
