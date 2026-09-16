from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, database, models
from typing import List

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/", response_model=List[schemas.ProjectStats])
def get_projects(db: Session = Depends(database.get_db)):
    projects = db.query(models.Project).all()
    if not projects:
        # Seed mock project if empty
        mock_project = models.Project(
            name="Skyline Towers - Phase 1",
            description="Enterprise construction project",
            health_score=92.0,
            progress_percentage=68.4,
            budget_total=34.0,
            budget_used=24.68,
            cost_variance=-2.35,
            spi=0.94,
            cpi=0.97,
            active_tasks=128,
            overdue_tasks=24
        )
        db.add(mock_project)
        db.commit()
        db.refresh(mock_project)
        projects = [mock_project]
    return projects

@router.get("/{project_id}", response_model=schemas.ProjectStats)
def get_project(project_id: int, db: Session = Depends(database.get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    return project
