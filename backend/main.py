"""
Janaseva AI - Karnataka Revenue Department Income Certificate Workflow
FastAPI Backend Main Application
"""

import os
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from .database import engine, Base, get_db
from .models import (
    User,
    Application,
    Document,
    AIReview,
    ApplicationHistory,
    ApplicationStatusEnum,
    WorkflowStageEnum,
    PriorityEnum,
    DocumentVerificationStatusEnum
)
from .schemas import (
    LoginRequest,
    TokenResponse,
    ApplicationCreate,
    ApplicationResponse,
    DocumentVerifyRequest,
    ApproveRequest,
    RejectRequest,
    ReturnRequest,
    DashboardStatsResponse,
    AIReviewResponse
)
from .seed import seed_database

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Janaseva AI – Karnataka Income Certificate Workflow API",
    description="Digital workflow management backend for Karnataka Revenue Department officers. Built with FastAPI, PostgreSQL, and Gemini/OpenAI.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    try:
        seed_database()
    except Exception as e:
        print(f"Seed note: {e}")

@app.get("/")
def root():
    return {
        "portal": "Janaseva AI - Karnataka Revenue Department",
        "service": "Income Certificate Workflow Management System (ಆದಾಯ ಪ್ರಮಾಣ ಪತ್ರ)",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "HEALTHY"
    }

# 1. AUTHENTICATION
@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    # Accept demo credentials
    if payload.email == "officer@janaseva.demo" and payload.password == "Demo@12345":
        return TokenResponse(
            access_token="demo-officer-jwt-token-kgid2849104",
            token_type="bearer",
            user={
                "id": "off-001",
                "name": "K. S. Manjunath",
                "name_kannada": "ಕೆ. ಎಸ್. ಮಂಜುನಾಥ್",
                "email": "officer@janaseva.demo",
                "role": "Revenue Inspector (Grade-I)",
                "kgid_number": "KGID-2849104",
                "district": "Bengaluru Urban",
                "taluk": "Bengaluru South",
                "office_location": "Kengeri Hobli Nadakacheri, Bengaluru South"
            }
        )
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenResponse(
        access_token="generated-jwt-token",
        token_type="bearer",
        user={
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "district": user.district,
            "taluk": user.taluk
        }
    )

# 2. APPLICATIONS LIST & DETAILS
@app.get("/api/applications")
def list_applications(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Application)
    if status_filter and status_filter != "ALL":
        query = query.filter(Application.status == status_filter)
    if priority:
        query = query.filter(Application.priority == priority)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Application.application_number.ilike(search_term)) |
            (Application.applicant_name.ilike(search_term)) |
            (Application.village.ilike(search_term))
        )
    apps = query.order_by(Application.created_at.desc()).all()
    return apps

@app.get("/api/applications/{app_id}")
def get_application(app_id: str, db: Session = Depends(get_db)):
    app = db.query(Application).filter(
        (Application.id == app_id) | (Application.application_number == app_id)
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

# 3. CREATE APPLICATION
@app.post("/api/applications", status_code=status.HTTP_201_CREATED)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    import random
    new_number = f"RD0038{random.randint(1000000, 9999999)}"
    new_id = f"app-{int(datetime.utcnow().timestamp())}"

    app = Application(
        id=new_id,
        application_number=new_number,
        applicant_name=payload.applicant_name,
        applicant_father_or_spouse=payload.applicant_father_or_spouse,
        mobile=payload.mobile,
        aadhaar_last_four=payload.aadhaar_last_four,
        address=payload.address,
        district=payload.district or "Bengaluru Urban",
        taluk=payload.taluk or "Bengaluru South",
        hobli=payload.hobli or "Kengeri",
        village=payload.village,
        pincode=payload.pincode or "560001",
        annual_income=payload.declared_annual_income,
        purpose=payload.purpose,
        family_members_count=payload.family_members_count or 4,
        ration_card_number=payload.ration_card_number,
        status=ApplicationStatusEnum.PENDING,
        current_stage=WorkflowStageEnum.APPLICATION_SUBMISSION,
        priority=PriorityEnum.URGENT if payload.declared_annual_income < 40000 else PriorityEnum.NORMAL,
        assigned_officer_id="off-001",
        days_pending=0,
        submission_date=datetime.utcnow().strftime("%Y-%m-%d")
    )
    db.add(app)

    # Add audit log
    hist = ApplicationHistory(
        id=f"hist-{int(datetime.utcnow().timestamp())}",
        application_id=new_id,
        officer_name="K. S. Manjunath",
        officer_role="Revenue Inspector (RI)",
        action="Application Registered",
        action_kannada="ಅರ್ಜಿ ಸಲ್ಲಿಕೆಯಾಯಿತು",
        previous_status="PENDING",
        new_status="PENDING",
        comments="Application registered into Nadakacheri portal."
    )
    db.add(hist)
    db.commit()
    db.refresh(app)
    return app

# 4. DOCUMENT VERIFICATION
@app.post("/api/documents/{doc_id}/verify")
def verify_document(doc_id: str, payload: DocumentVerifyRequest, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.verification_status = payload.verification_status
    if payload.officer_comments:
        doc.officer_comments = payload.officer_comments

    # Add audit history
    hist = ApplicationHistory(
        id=f"hist-{int(datetime.utcnow().timestamp())}",
        application_id=doc.application_id,
        officer_name="K. S. Manjunath",
        officer_role="Revenue Inspector (RI)",
        action=f"Document {doc.title} marked as {payload.verification_status}",
        action_kannada=f"ದಾಖಲೆ ({doc.title}) ಸ್ಥಿತಿ: {payload.verification_status}",
        previous_status="UNDER_VERIFICATION",
        new_status="UNDER_VERIFICATION",
        comments=payload.officer_comments or f"Document verification set to {payload.verification_status}"
    )
    db.add(hist)
    db.commit()

    return db.query(Application).filter(Application.id == doc.application_id).first()

# 5. DECISIONS
@app.post("/api/applications/{app_id}/approve")
def approve_application(app_id: str, payload: ApproveRequest, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    import random
    app.status = ApplicationStatusEnum.APPROVED
    app.current_stage = WorkflowStageEnum.FINAL_DECISION
    app.decision_remarks = payload.remarks
    app.certificate_number = f"KAR-RD-INC-{datetime.utcnow().year}-{random.randint(10000, 99999)}"
    app.certificate_issued_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M")

    hist = ApplicationHistory(
        id=f"hist-{int(datetime.utcnow().timestamp())}",
        application_id=app.id,
        officer_name=payload.officer_name or "K. S. Manjunath",
        officer_role="Revenue Inspector (RI)",
        action="Application Formally Approved by Officer",
        action_kannada="ಅಧಿಕಾರಿಯಿಂದ ಅನುಮೋದನೆ ನೀಡಲಾಯಿತು",
        previous_status=app.status.value,
        new_status="APPROVED",
        comments=payload.remarks or f"Digitally signed certificate #{app.certificate_number} issued."
    )
    db.add(hist)
    db.commit()
    db.refresh(app)
    return app

@app.post("/api/applications/{app_id}/reject")
def reject_application(app_id: str, payload: RejectRequest, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = ApplicationStatusEnum.REJECTED
    app.current_stage = WorkflowStageEnum.FINAL_DECISION
    app.rejection_reason = payload.reason
    app.decision_remarks = payload.remarks

    hist = ApplicationHistory(
        id=f"hist-{int(datetime.utcnow().timestamp())}",
        application_id=app.id,
        officer_name=payload.officer_name or "K. S. Manjunath",
        officer_role="Revenue Inspector (RI)",
        action="Application Formally Rejected by Officer",
        action_kannada="ಅರ್ಜಿಯನ್ನು ತಿರಸ್ಕರಿಸಲಾಯಿತು",
        previous_status=app.status.value,
        new_status="REJECTED",
        comments=f"Grounds: {payload.reason}. Notes: {payload.remarks}"
    )
    db.add(hist)
    db.commit()
    db.refresh(app)
    return app

@app.post("/api/applications/{app_id}/return")
def return_application(app_id: str, payload: ReturnRequest, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = ApplicationStatusEnum.RETURNED
    app.current_stage = WorkflowStageEnum.APPLICATION_SUBMISSION
    app.return_reason = payload.reason
    app.required_corrections = payload.corrections or []
    app.decision_remarks = payload.remarks

    hist = ApplicationHistory(
        id=f"hist-{int(datetime.utcnow().timestamp())}",
        application_id=app.id,
        officer_name=payload.officer_name or "K. S. Manjunath",
        officer_role="Revenue Inspector (RI)",
        action="Application Returned to Citizen for Correction",
        action_kannada="ಅರ್ಜಿಯನ್ನು ನಾಗರಿಕರಿಗೆ ಹಿಂತಿರುಗಿಸಲಾಯಿತು",
        previous_status=app.status.value,
        new_status="RETURNED",
        comments=f"Reason: {payload.reason}. Required corrections: {', '.join(payload.corrections or [])}"
    )
    db.add(hist)
    db.commit()
    db.refresh(app)
    return app

# 6. DASHBOARD & STATS
@app.get("/api/dashboard/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(Application).count()
    pending = db.query(Application).filter(
        (Application.status == ApplicationStatusEnum.PENDING) |
        (Application.status == ApplicationStatusEnum.UNDER_VERIFICATION)
    ).count()
    urgent = db.query(Application).filter(
        (Application.priority == PriorityEnum.URGENT) | (Application.days_pending >= 4)
    ).count()
    approved = db.query(Application).filter(Application.status == ApplicationStatusEnum.APPROVED).count()
    rejected = db.query(Application).filter(Application.status == ApplicationStatusEnum.REJECTED).count()
    returned = db.query(Application).filter(Application.status == ApplicationStatusEnum.RETURNED).count()

    return DashboardStatsResponse(
        total_applications=total,
        pending_applications=pending,
        urgent_attention_count=urgent,
        approved_count=approved,
        rejected_count=rejected,
        returned_count=returned,
        avg_processing_days=2.3,
        sla_compliance_rate=94.8
    )
