"""
Janaseva AI - Pydantic Request & Response Schemas
"""

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: str
    name: str
    name_kannada: Optional[str] = None
    email: str
    role: str
    kgid_number: Optional[str] = None
    district: str
    taluk: str

class DocumentCreate(BaseModel):
    document_type: str
    title: str
    file_name: str
    file_size: Optional[str] = "500 KB"
    mime_type: Optional[str] = "application/pdf"
    extracted_text: Optional[str] = None
    extracted_income: Optional[float] = None

class DocumentVerifyRequest(BaseModel):
    application_id: str
    verification_status: str
    officer_comments: Optional[str] = None

class DocumentResponse(BaseModel):
    id: str
    application_id: str
    document_type: str
    title: str
    file_name: Optional[str]
    file_size: Optional[str]
    verification_status: str
    officer_comments: Optional[str] = None
    extracted_text: Optional[str] = None
    extracted_income: Optional[float] = None
    ai_flags: Optional[List[str]] = None

class HistoryItemResponse(BaseModel):
    id: str
    application_id: str
    officer_name: str
    officer_role: Optional[str]
    action: str
    action_kannada: Optional[str]
    previous_status: str
    new_status: str
    comments: Optional[str]
    created_at: Any

class AIReviewResponse(BaseModel):
    id: str
    application_id: str
    workflow_stage: str
    is_live_model: bool
    model_used: str
    summary: str
    summary_kannada: Optional[str] = None
    recommendation: str
    recommendation_text: str
    recommendation_text_kannada: Optional[str] = None
    checklist: Optional[List[Dict[str, Any]]] = None
    findings: Optional[List[Dict[str, Any]]] = None
    created_at: Any

class ApplicationCreate(BaseModel):
    applicant_name: str
    applicant_father_or_spouse: Optional[str] = None
    mobile: str
    aadhaar_last_four: Optional[str] = "0000"
    address: str
    district: Optional[str] = "Bengaluru Urban"
    taluk: Optional[str] = "Bengaluru South"
    hobli: Optional[str] = "Kengeri"
    village: str
    pincode: Optional[str] = "560001"
    declared_annual_income: float
    purpose: str
    family_members_count: Optional[int] = 4
    ration_card_number: Optional[str] = None
    documents: Optional[List[DocumentCreate]] = []

class ApplicationResponse(BaseModel):
    id: str
    application_number: str
    applicant_name: str
    applicant_father_or_spouse: Optional[str]
    mobile: str
    aadhaar_last_four: Optional[str]
    address: str
    district: str
    taluk: str
    hobli: str
    village: str
    pincode: Optional[str]
    annual_income: float
    purpose: str
    family_members_count: int
    ration_card_number: Optional[str]
    status: str
    current_stage: str
    priority: str
    assigned_officer_id: Optional[str]
    sla_target_date: Optional[str]
    days_pending: int
    submission_date: Optional[str]
    decision_remarks: Optional[str] = None
    rejection_reason: Optional[str] = None
    return_reason: Optional[str] = None
    certificate_number: Optional[str] = None
    certificate_issued_at: Optional[str] = None
    documents: List[DocumentResponse] = []
    history: List[HistoryItemResponse] = []

class ApproveRequest(BaseModel):
    remarks: Optional[str] = "Approved by Revenue Inspector"
    officer_name: Optional[str] = "K. S. Manjunath"

class RejectRequest(BaseModel):
    reason: str
    remarks: Optional[str] = None
    officer_name: Optional[str] = "K. S. Manjunath"

class ReturnRequest(BaseModel):
    reason: str
    corrections: Optional[List[str]] = []
    remarks: Optional[str] = None
    officer_name: Optional[str] = "K. S. Manjunath"

class DashboardStatsResponse(BaseModel):
    total_applications: int
    pending_applications: int
    urgent_attention_count: int
    approved_count: int
    rejected_count: int
    returned_count: int
    avg_processing_days: float
    sla_compliance_rate: float
