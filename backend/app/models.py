from sqlalchemy import Boolean, Column, Integer, String, Float, ForeignKey, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default="viewer")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    tasks = relationship("Task", foreign_keys="Task.assignee_email", back_populates="assignee", primaryjoin="User.email == Task.assignee_email")
    notifications = relationship("Notification", back_populates="user")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    health_score = Column(Float, default=90.0)
    progress_percentage = Column(Float, default=0.0)
    budget_total = Column(Float, default=0.0)
    budget_used = Column(Float, default=0.0)
    cost_variance = Column(Float, default=0.0)
    spi = Column(Float, default=1.0)
    cpi = Column(Float, default=1.0)
    active_tasks = Column(Integer, default=0)
    overdue_tasks = Column(Integer, default=0)
    tasks = relationship("Task", back_populates="project")
    issues = relationship("Issue", back_populates="project")
    daily_logs = relationship("DailyLog", back_populates="project")
    documents = relationship("Document", back_populates="project")
    buildings = relationship("Building", back_populates="project")

class Building(Base):
    __tablename__ = "buildings"
    id = Column(String, primary_key=True, index=True) # Using String so frontend can use uuid/string like 'bldg_1'
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    name = Column(String)
    bim_state = Column(Text, default="{}") # JSON representation of BIM Store
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    project = relationship("Project", back_populates="buildings")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    status = Column(String, default="todo")   # todo | in_progress | done | blocked
    priority = Column(String, default="medium")  # low | medium | high | critical
    zone = Column(String, default="")
    due_date = Column(String, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    assignee_email = Column(String, ForeignKey("users.email"), nullable=True)
    author_role = Column(String, default="")
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", foreign_keys=[assignee_email], back_populates="tasks")

class Issue(Base):
    __tablename__ = "issues"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    category = Column(String, default="RFI")   # RFI | NCR | Snag | Risk | Change Order | Defect
    status = Column(String, default="open")    # open | in_review | resolved | closed
    priority = Column(String, default="medium")
    zone = Column(String, default="")
    raised_by = Column(String, default="")
    raised_by_role = Column(String, default="")
    assigned_to = Column(String, default="")
    resolution = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    project = relationship("Project", back_populates="issues")

class DailyLog(Base):
    __tablename__ = "daily_logs"
    id = Column(Integer, primary_key=True, index=True)
    log_date = Column(String, nullable=False)
    zone = Column(String, default="")
    weather = Column(String, default="Clear")
    workforce_engineers = Column(Integer, default=0)
    workforce_supervisors = Column(Integer, default=0)
    workforce_skilled = Column(Integer, default=0)
    workforce_unskilled = Column(Integer, default=0)
    workforce_operators = Column(Integer, default=0)
    activities = Column(Text, default="")
    materials_received = Column(Text, default="")
    issues_noted = Column(Text, default="")
    submitted_by = Column(String, default="")
    submitted_role = Column(String, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    project = relationship("Project", back_populates="daily_logs")

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, default="General")  # Drawings | Contracts | Specifications | Inspection | Reports | BOQ
    file_url = Column(String, default="")
    file_type = Column(String, default="pdf")
    uploaded_by = Column(String, default="")
    uploaded_by_role = Column(String, default="")
    version = Column(String, default="1.0")
    description = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    project = relationship("Project", back_populates="documents")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, ForeignKey("users.email"), nullable=True)
    message = Column(String, nullable=False)
    notif_type = Column(String, default="info")   # info | success | warning | error
    category = Column(String, default="general")  # task | issue | daily_log | document | report
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User", back_populates="notifications")

class SearchLog(Base):
    __tablename__ = "search_logs"
    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, index=True, nullable=False)
    user_email = Column(String, ForeignKey("users.email"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


# ── Architectural Floor Plan & Canonical 3D Building Models ───────────────────

class FloorPlanJob(Base):
    __tablename__ = "floorplan_jobs"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    building_id = Column(String, ForeignKey("buildings.id"), nullable=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    status = Column(String, default="UPLOADED")  # UPLOADED, PROCESSING, OCR_RUNNING, GEOMETRY_DETECTION, READY_FOR_REVIEW, USER_REVIEW, COMPLETED, FAILED
    progress = Column(Integer, default=0)
    stage = Column(String, default="Uploaded")
    error_message = Column(Text, nullable=True)
    result_summary = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class BuildingModelEntity(Base):
    __tablename__ = "building_models"
    id = Column(String, primary_key=True, index=True)
    building_id = Column(String, ForeignKey("buildings.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    name = Column(String, default="Architectural Building Model")
    scale_px_per_meter = Column(Float, default=80.0)
    units = Column(String, default="m")
    model_data = Column(Text, default="{}")  # Canonical BuildingModel JSON representation
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class ModelVersion(Base):
    __tablename__ = "model_versions"
    id = Column(String, primary_key=True, index=True)
    building_id = Column(String, ForeignKey("buildings.id"), nullable=False)
    version_number = Column(Integer, default=1)
    version_name = Column(String, default="Initial Draft")
    model_snapshot = Column(Text, nullable=False)
    created_by = Column(String, default="AI Engine")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class FloorEntity(Base):
    __tablename__ = "building_floors"
    id = Column(String, primary_key=True, index=True)
    building_id = Column(String, ForeignKey("buildings.id"), nullable=False)
    level = Column(Integer, default=0)
    name = Column(String, default="Ground Floor")
    elevation = Column(Float, default=0.0)
    height = Column(Float, default=3.0)


class WallEntity(Base):
    __tablename__ = "building_walls"
    id = Column(String, primary_key=True, index=True)
    floor_id = Column(String, ForeignKey("building_floors.id"), nullable=False)
    start_x = Column(Float, nullable=False)
    start_z = Column(Float, nullable=False)
    end_x = Column(Float, nullable=False)
    end_z = Column(Float, nullable=False)
    thickness = Column(Float, default=0.20)
    height = Column(Float, default=3.0)
    wall_type = Column(String, default="interior")
    material = Column(String, default="AAC Concrete Block")
    confidence = Column(Float, default=0.95)


class RoomEntity(Base):
    __tablename__ = "building_rooms"
    id = Column(String, primary_key=True, index=True)
    floor_id = Column(String, ForeignKey("building_floors.id"), nullable=False)
    name = Column(String, default="Room")
    room_type = Column(String, default="OTHER")
    polygon_json = Column(Text, default="[]")
    area_m2 = Column(Float, default=0.0)
    perimeter_m = Column(Float, default=0.0)
    confidence = Column(Float, default=0.90)


class DoorEntity(Base):
    __tablename__ = "building_doors"
    id = Column(String, primary_key=True, index=True)
    wall_id = Column(String, ForeignKey("building_walls.id"), nullable=True)
    pos_x = Column(Float, nullable=False)
    pos_z = Column(Float, nullable=False)
    width = Column(Float, default=0.90)
    height = Column(Float, default=2.10)
    door_type = Column(String, default="single_flush")
    confidence = Column(Float, default=0.90)


class WindowEntity(Base):
    __tablename__ = "building_windows"
    id = Column(String, primary_key=True, index=True)
    wall_id = Column(String, ForeignKey("building_walls.id"), nullable=True)
    pos_x = Column(Float, nullable=False)
    pos_z = Column(Float, nullable=False)
    width = Column(Float, default=1.50)
    height = Column(Float, default=1.40)
    sill_height = Column(Float, default=0.90)
    confidence = Column(Float, default=0.88)


class StairEntity(Base):
    __tablename__ = "building_stairs"
    id = Column(String, primary_key=True, index=True)
    floor_id = Column(String, ForeignKey("building_floors.id"), nullable=False)
    pos_x = Column(Float, nullable=False)
    pos_z = Column(Float, nullable=False)
    width = Column(Float, default=1.10)
    step_count = Column(Integer, default=16)
    direction = Column(String, default="up")


# ── Personnel Management & Historical Archival Engine ──────────────────────────

class PersonnelRecord(Base):
    __tablename__ = "personnel_records"
    id = Column(String, primary_key=True, index=True)  # e.g., TECH-101
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, default="")
    trade = Column(String, default="Specialist")
    department = Column(String, default="Technical Operations")
    location = Column(String, default="Main Facility")
    primary_portal = Column(String, default="/technician")
    portal_access_list = Column(Text, default="[]")  # JSON array of granted portals or ["*"]
    active_ticket = Column(String, default="")
    status = Column(String, default="Active (On-Duty)")  # Active (On-Duty), Dispatched, Standby, Offboarded
    shift = Column(String, default="Day Shift (08:00 - 17:00)")
    clearance = Column(String, default="Level 2 - Standard")
    temp_password = Column(String, default="TechPass@2026")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class PersonnelArchive(Base):
    __tablename__ = "personnel_archives"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, default="")
    trade = Column(String, default="")
    department = Column(String, default="")
    primary_portal = Column(String, default="")
    revoked_portal_access = Column(Text, default="[]")  # JSON list of portals that were deleted
    departure_reason = Column(String, default="Resignation / Contract Completion")
    departure_date = Column(DateTime, default=datetime.datetime.utcnow)
    exit_notes = Column(Text, default="")
    historical_work_records = Column(Text, default="[]")  # JSON snapshot of completed tickets & logs
    retention_policy = Column(String, default="7-Year Statutory Audit Retention (ISO 27001 / NBC)")
    data_integrity_hash = Column(String, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


