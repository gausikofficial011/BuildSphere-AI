from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
from .. import schemas, database, models

# ── JWT / crypto imports (graceful fallback if not yet installed) ──────────────
try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    BCRYPT_AVAILABLE = True
except ImportError:
    BCRYPT_AVAILABLE = False

try:
    from jose import JWTError, jwt
    JOSE_AVAILABLE = True
except ImportError:
    JOSE_AVAILABLE = False

SECRET_KEY = "buildsphere-ai-super-secret-key-2026-enterprise"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8  # 8-hour work shift

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

# ── Helpers ────────────────────────────────────────────────────────────────────
def hash_password(plain: str) -> str:
    if BCRYPT_AVAILABLE:
        return pwd_context.hash(plain)
    return f"hashed_{plain}"   # fallback for dev without bcrypt

def verify_password(plain: str, hashed: str) -> bool:
    if BCRYPT_AVAILABLE:
        return pwd_context.verify(plain, hashed)
    return hashed == f"hashed_{plain}" or hashed == "mock_hashed_password"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    if JOSE_AVAILABLE:
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return f"fake-jwt-token-{data.get('sub', 'anon')}-{data.get('role', 'viewer')}"

def get_user_from_token(token: str, db: Session) -> Optional[models.User]:
    try:
        if JOSE_AVAILABLE and not token.startswith("fake-jwt-token-"):
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
        else:
            # parse legacy fake token
            parts = token.split("-")
            email = parts[3] if len(parts) > 3 else None
        if not email:
            return None
        return db.query(models.User).filter(models.User.email == email).first()
    except Exception:
        return None

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    if not token:
        return None  # Allow unauthenticated for demo mode
    user = get_user_from_token(token, db)
    return user

# ── Routes ─────────────────────────────────────────────────────────────────────
@router.post("/register", response_model=schemas.Token)
def register(user_in: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        email=user_in.email,
        full_name=user_in.full_name or user_in.email.split("@")[0],
        hashed_password=hash_password(user_in.password),
        role=user_in.role or "viewer"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user:
        # Auto-create for demo/dev environments
        user = models.User(
            email=user_credentials.email,
            full_name=user_credentials.email.split("@")[0].replace(".", " ").title(),
            hashed_password=hash_password(user_credentials.password),
            role=user_credentials.role or "viewer"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return current_user

@router.get("/users", response_model=list[schemas.UserOut])
def list_users(db: Session = Depends(database.get_db)):
    """List all users — for assignee dropdowns in tasks/issues."""
    return db.query(models.User).filter(models.User.is_active == True).all()
