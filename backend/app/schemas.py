from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

# ─── AUTH ────────────────────────────────────────────────────────────────────
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: str = "viewer"

class UserLogin(BaseModel):
    email: str
    password: str
    role: Optional[str] = None

class UserOut(UserBase):
    id: int
    is_active: bool
    role: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[UserOut] = None

class TokenData(BaseModel):
    email: Optional[str] = None

# ─── PROJECT ─────────────────────────────────────────────────────────────────
class ProjectStats(BaseModel):
    id: int
    name: str
    description: Optional[str] = ""
    health_score: float
    progress_percentage: float
    budget_total: float
    budget_used: float
    cost_variance: float
    spi: float
    cpi: float
    active_tasks: int
    overdue_tasks: int
    class Config:
        from_attributes = True

class ProjectUpdate(BaseModel):
    progress_percentage: Optional[float] = None
    budget_used: Optional[float] = None
    health_score: Optional[float] = None
    active_tasks: Optional[int] = None
    overdue_tasks: Optional[int] = None

# ─── TASK ─────────────────────────────────────────────────────────────────────
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: Optional[str] = "medium"
    zone: Optional[str] = ""
    due_date: Optional[str] = ""
    assignee_email: Optional[str] = None
    project_id: Optional[int] = 1
    author_role: Optional[str] = ""

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    zone: Optional[str] = None
    due_date: Optional[str] = None
    assignee_email: Optional[str] = None

class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    status: str
    priority: str
    zone: str
    due_date: str
    assignee_email: Optional[str]
    author_role: str
    project_id: Optional[int]
    created_at: datetime.datetime
    class Config:
        from_attributes = True

# ─── ISSUE ────────────────────────────────────────────────────────────────────
class IssueCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    category: Optional[str] = "RFI"
    priority: Optional[str] = "medium"
    zone: Optional[str] = ""
    raised_by: Optional[str] = ""
    raised_by_role: Optional[str] = ""
    assigned_to: Optional[str] = ""
    project_id: Optional[int] = 1

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    resolution: Optional[str] = None
    zone: Optional[str] = None

class IssueOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    status: str
    priority: str
    zone: str
    raised_by: str
    raised_by_role: str
    assigned_to: str
    resolution: str
    project_id: Optional[int]
    created_at: datetime.datetime
    class Config:
        from_attributes = True

# ─── DAILY LOG ───────────────────────────────────────────────────────────────
class DailyLogCreate(BaseModel):
    log_date: str
    zone: Optional[str] = ""
    weather: Optional[str] = "Clear"
    workforce_engineers: Optional[int] = 0
    workforce_supervisors: Optional[int] = 0
    workforce_skilled: Optional[int] = 0
    workforce_unskilled: Optional[int] = 0
    workforce_operators: Optional[int] = 0
    activities: Optional[str] = ""
    materials_received: Optional[str] = ""
    issues_noted: Optional[str] = ""
    submitted_by: Optional[str] = ""
    submitted_role: Optional[str] = ""
    project_id: Optional[int] = 1

class DailyLogOut(BaseModel):
    id: int
    log_date: str
    zone: str
    weather: str
    workforce_engineers: int
    workforce_supervisors: int
    workforce_skilled: int
    workforce_unskilled: int
    workforce_operators: int
    activities: str
    materials_received: str
    issues_noted: str
    submitted_by: str
    submitted_role: str
    project_id: Optional[int]
    created_at: datetime.datetime
    class Config:
        from_attributes = True

# ─── DOCUMENT ─────────────────────────────────────────────────────────────────
class DocumentCreate(BaseModel):
    title: str
    category: Optional[str] = "General"
    file_url: Optional[str] = ""
    file_type: Optional[str] = "pdf"
    uploaded_by: Optional[str] = ""
    uploaded_by_role: Optional[str] = ""
    version: Optional[str] = "1.0"
    description: Optional[str] = ""
    project_id: Optional[int] = 1

class DocumentOut(BaseModel):
    id: int
    title: str
    category: str
    file_url: str
    file_type: str
    uploaded_by: str
    uploaded_by_role: str
    version: str
    description: str
    project_id: Optional[int]
    created_at: datetime.datetime
    class Config:
        from_attributes = True

# ─── NOTIFICATION ─────────────────────────────────────────────────────────────
class NotificationOut(BaseModel):
    id: int
    user_email: Optional[str]
    message: str
    notif_type: str
    category: str
    is_read: bool
    created_at: datetime.datetime
    class Config:
        from_attributes = True
