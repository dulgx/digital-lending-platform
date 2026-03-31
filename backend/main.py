from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.routers import auth, loan, repayment, admin, partner, b2b_loan

# Create all tables on startup (SQLite / dev only)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Branchless digital lending platform — FastAPI backend",
    version="0.1.0",
)

# CORS — origins configured via ALLOWED_ORIGINS env var
allowed_origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(loan.router)
app.include_router(repayment.router)
app.include_router(admin.router)
app.include_router(partner.router)
app.include_router(b2b_loan.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}
