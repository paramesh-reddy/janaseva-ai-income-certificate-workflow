"""
Janaseva AI - SQLAlchemy ORM Models
Karnataka Government Income Certificate Workflow
"""

from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    Text,
    Boolean,
    JSON,
    Enum as SQLEnum
)
from sqlalchemy.orm import relationship
from .database import Base
import enum

class WorkflowStageEnum(str, enum.Enum):
    APPLICATION_SUBMISSION = "APPLICATION_SUBMISSION"
    DOCUMENT_VERIFICATION = "DOCUMENT_VERIFICATION"
    ELIGIBILITY_VERIFICATION = "ELIGIBILITY_VERIFICATION"
    FINAL_DECISION = "FINAL_DECISION"

class ApplicationStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    UNDER_VERIFICATION = "UNDER_VERIFICATION"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    RETURNED = "RETURNED"

class PriorityEnum(str, enum.Enum):
    URGENT = "URGENT"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    NORMAL = "NORMAL"

class DocumentVerificationStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    UNCLEAR = "UNCLEAR"
    MISSING = "MISSING"
    REJECTED = "REJECTED"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    name_kannada = Column(String(120), nullable=True)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(80), default="Revenue Inspector")
    kgid_number = Column(String(50), nullable=True)
    district = Column(String(80), default="Bengaluru Urban")
    taluk = Column(String(80), default="Bengaluru South")
    office_location = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("Application", back_populates="assigned_officer")
    audit_actions = relationship("ApplicationHistory", back_populates="officer")

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, index=True)
    application_number = Column(String(50), unique=True, index=True, nullable=False)
    applicant_name = Column(String(150), nullable=False, index=True)
    applicant_father_or_spouse = Column(String(150), nullable=True)
    mobile = Column(String(20), nullable=False)
    aadhaar_last_four = Column(String(4), nullable=True)
    address = Column(Text, nullable=False)
    district = Column(String(80), nullable=False)
    taluk = Column(String(80), nullable=False)
    hobli = Column(String(80), nullable=False)
    village = Column(String(80), nullable=False)
    pincode = Column(String(10), nullable=True)
    annual_income = Column(Float, nullable=False)
    purpose = Column(String(150), nullable=False)
    family_members_count = Column(Integer, default=4)
    ration_card_number = Column(String(50), nullable=True)
    status = Column(SQLEnum(ApplicationStatusEnum), default=ApplicationStatusEnum.PENDING, index=True)
    current_stage = Column(SQLEnum(WorkflowStageEnum), default=WorkflowStageEnum.APPLICATION_SUBMISSION)
    priority = Column(SQLEnum(PriorityEnum), default=PriorityEnum.NORMAL, index=True)
    assigned_officer_id = Column(String, ForeignKey("users.id"), nullable=True)
    sla_target_date = Column(String(30), nullable=True)
    days_pending = Column(Integer, default=0)
    submission_date = Column(String(30), nullable=True)
    decision_remarks = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    return_reason = Column(Text, nullable=True)
    required_corrections = Column(JSON, nullable=True)
    certificate_number = Column(String(80), nullable=True)
    certificate_issued_at = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    assigned_officer = relationship("User", back_populates="applications")
    documents = relationship("Document", back_populates="application", cascade="all, delete-orphan")
    history = relationship("ApplicationHistory", back_populates="application", cascade="all, delete-orphan")
    ai_reviews = relationship("AIReview", back_populates="application", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False, index=True)
    document_type = Column(String(50), nullable=False)
    title = Column(String(150), nullable=False)
    file_path = Column(String(300), nullable=True)
    file_name = Column(String(150), nullable=True)
    file_size = Column(String(50), nullable=True)
    mime_type = Column(String(50), default="application/pdf")
    extracted_text = Column(Text, nullable=True)
    ocr_confidence = Column(Float, nullable=True)
    extracted_income = Column(Float, nullable=True)
    extracted_name = Column(String(150), nullable=True)
    extracted_address = Column(Text, nullable=True)
    ai_flags = Column(JSON, nullable=True)
    verification_status = Column(SQLEnum(DocumentVerificationStatusEnum), default=DocumentVerificationStatusEnum.PENDING)
    officer_comments = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="documents")

class AIReview(Base):
    __tablename__ = "ai_reviews"

    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False, index=True)
    workflow_stage = Column(SQLEnum(WorkflowStageEnum), nullable=False)
    model_used = Column(String(100), default="Gemini 2.5 Flash")
    is_live_model = Column(Boolean, default=False)
    summary = Column(Text, nullable=False)
    summary_kannada = Column(Text, nullable=True)
    recommendation = Column(String(100), nullable=False)
    recommendation_text = Column(Text, nullable=False)
    recommendation_text_kannada = Column(Text, nullable=True)
    findings = Column(JSON, nullable=True)
    checklist = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="ai_reviews")

class ApplicationHistory(Base):
    __tablename__ = "application_history"

    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False, index=True)
    officer_id = Column(String, ForeignKey("users.id"), nullable=True)
    officer_name = Column(String(150), nullable=False)
    officer_role = Column(String(100), nullable=True)
    action = Column(String(150), nullable=False)
    action_kannada = Column(String(150), nullable=True)
    previous_status = Column(String(50), nullable=False)
    new_status = Column(String(50), nullable=False)
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="history")
    officer = relationship("User", back_populates="audit_actions")
