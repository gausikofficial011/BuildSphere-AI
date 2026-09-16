import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import (
    auth, projects, google_docs, tasks, issues, daily_logs, 
    documents, notifications, twin, bim, spatial, copilot, 
    ml, execution, ingestion, os as os_router, planning, 
    platform, realworld, search, datasets, floorplans
)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BuildSphere AI Backend",
    description="Enterprise Construction Management Platform API — Real-world operations for all 25 portal roles",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(google_docs.router)
app.include_router(tasks.router)
app.include_router(issues.router)
app.include_router(daily_logs.router)
app.include_router(documents.router)
app.include_router(notifications.router)
app.include_router(twin.router)
app.include_router(floorplans.router)
app.include_router(bim.router)
app.include_router(spatial.router)
app.include_router(copilot.router)
app.include_router(ml.router)
app.include_router(execution.router)
app.include_router(ingestion.router)
app.include_router(os_router.router)
app.include_router(planning.router)
app.include_router(platform.router)
app.include_router(realworld.router)
app.include_router(search.router)
app.include_router(datasets.router)

from fastapi.staticfiles import StaticFiles
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/")
def read_root():
    return {
        "message": "Welcome to BuildSphere AI Backend v3.0",
        "status": "operational",
        "portals": 23,
        "api_docs": "/docs",
        "features": [
            "Task Management (CRUD + Kanban)",
            "Issue Tracker (RFI / NCR / Snag / Risk / Change Order)",
            "Daily Site Logs",
            "Document Center",
            "Live Notifications",
            "Project KPI Dashboard",
            "Google Docs Report Generation",
            "JWT Authentication"
        ]
    }

@app.get("/health")
@app.get("/api/v1/health")
@app.get("/api/v1/health/live")
def health_check():
    return {"status": "healthy", "version": "3.0.0"}

