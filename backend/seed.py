"""
Janaseva AI - Database Seeder
Seeds Karnataka Revenue Department officer and Bangalore South applications
"""

import sys
import os
from datetime import datetime
from passlib.context import CryptContext

from .database import engine, Base, SessionLocal
from .models import (
    User,
    Application,
    Document,
    ApplicationHistory,
    AIReview,
    WorkflowStageEnum,
    ApplicationStatusEnum,
    PriorityEnum,
    DocumentVerificationStatusEnum
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if demo officer exists
    officer = db.query(User).filter(User.email == "officer@janaseva.demo").first()
    if not officer:
        officer = User(
            id="off-001",
            name="K. S. Manjunath",
            name_kannada="ಕೆ. ಎಸ್. ಮಂಜುನಾಥ್",
            email="officer@janaseva.demo",
            password_hash=pwd_context.hash("Demo@12345"),
            role="Revenue Inspector (Grade-I)",
            kgid_number="KGID-2849104",
            district="Bengaluru Urban",
            taluk="Bengaluru South",
            office_location="Kengeri Hobli Nadakacheri, Bengaluru South"
        )
        db.add(officer)
        db.commit()
        print("✓ Created Demo Officer: officer@janaseva.demo / Demo@12345")

    # Check applications
    existing_count = db.query(Application).count()
    if existing_count == 0:
        # App 1: Ramesh K Gowda (Discrepancy flag)
        app1 = Application(
            id="app-001",
            application_number="RD00382910482",
            applicant_name="Ramesh K. Gowda",
            applicant_father_or_spouse="Krishnappa Gowda",
            mobile="98451 28930",
            aadhaar_last_four="8392",
            address="#42, 3rd Cross, Near Grama Panchayat Office, Kumbalgodu",
            district="Bengaluru Urban",
            taluk="Bengaluru South",
            hobli="Kengeri",
            village="Kumbalgodu",
            pincode="560074",
            annual_income=48000,
            purpose="Educational Scholarship (SSP/NSP)",
            family_members_count=4,
            ration_card_number="KA12093849102",
            status=ApplicationStatusEnum.PENDING,
            current_stage=WorkflowStageEnum.DOCUMENT_VERIFICATION,
            priority=PriorityEnum.URGENT,
            assigned_officer_id="off-001",
            sla_target_date="2026-11-09",
            days_pending=4,
            submission_date="2026-11-01"
        )
        db.add(app1)

        doc1_1 = Document(
            id="doc-001-1",
            application_id="app-001",
            document_type="AADHAAR",
            title="Applicant Aadhaar Card",
            file_name="aadhaar_ramesh_gowda.pdf",
            file_size="482 KB",
            extracted_text="GOVERNMENT OF INDIA\nName: Ramesh K Gowda\nKumbalgodu, Bengaluru South",
            ocr_confidence=98,
            verification_status=DocumentVerificationStatusEnum.VERIFIED,
            officer_comments="Identity matched with electoral roll."
        )
        doc1_2 = Document(
            id="doc-001-2",
            application_id="app-001",
            document_type="SALARY_SLIP",
            title="Income Proof / Salary Slip",
            file_name="employer_salary_certificate_nov2026.pdf",
            file_size="620 KB",
            extracted_text="M/S PRECISION COMPONENTS PVT LTD\nGross Monthly Salary: Rs. 18,500 (Annual: Rs. 2,22,000)",
            ocr_confidence=94,
            extracted_income=222000,
            verification_status=DocumentVerificationStatusEnum.UNCLEAR,
            ai_flags=["INCOME_DISCREPANCY: Monthly gross Rs. 18,500 projects to Rs. 2,22,000 vs declared Rs. 48,000"],
            officer_comments="Discrepancy flagged."
        )
        db.add_all([doc1_1, doc1_2])

        hist1 = ApplicationHistory(
            id="hist-001-1",
            application_id="app-001",
            officer_id="off-001",
            officer_name="K. S. Manjunath",
            officer_role="Revenue Inspector (RI)",
            action="Application Intake Registered",
            action_kannada="ಅರ್ಜಿ ಸಲ್ಲಿಕೆಯಾಯಿತು",
            previous_status="PENDING",
            new_status="PENDING",
            comments="Application received via Nadakacheri portal with 2 attachments."
        )
        db.add(hist1)

        # App 2: Sumitra Devi (AAY Widow - Ready for Approval)
        app2 = Application(
            id="app-002",
            application_number="RD00384910244",
            applicant_name="Sumitra Devi",
            applicant_father_or_spouse="Late Shivanna",
            mobile="97412 04819",
            aadhaar_last_four="4190",
            address="#19, Slum Board Quarters, Vasanthapura Main Road",
            district="Bengaluru Urban",
            taluk="Bengaluru South",
            hobli="Uttarahalli",
            village="Vasanthapura",
            pincode="560061",
            annual_income=36000,
            purpose="Government Housing Scheme (Ashraya/Vajpayee)",
            family_members_count=3,
            ration_card_number="KA12048102941",
            status=ApplicationStatusEnum.UNDER_VERIFICATION,
            current_stage=WorkflowStageEnum.ELIGIBILITY_VERIFICATION,
            priority=PriorityEnum.HIGH,
            assigned_officer_id="off-001",
            sla_target_date="2026-11-10",
            days_pending=3,
            submission_date="2026-11-02"
        )
        db.add(app2)

        # App 3: Approved Case
        app3 = Application(
            id="app-003",
            application_number="RD00386129845",
            applicant_name="B. N. Geetha",
            applicant_father_or_spouse="Nagaraju B. C.",
            mobile="98440 91823",
            aadhaar_last_four="5561",
            address="#8, Ganesha Temple Road, Ramohalli Village",
            district="Bengaluru Urban",
            taluk="Bengaluru South",
            hobli="Kengeri",
            village="Ramohalli",
            pincode="560074",
            annual_income=60000,
            purpose="Educational Scholarship (SSP/NSP)",
            family_members_count=4,
            status=ApplicationStatusEnum.APPROVED,
            current_stage=WorkflowStageEnum.FINAL_DECISION,
            priority=PriorityEnum.NORMAL,
            assigned_officer_id="off-001",
            sla_target_date="2026-11-06",
            days_pending=1,
            submission_date="2026-11-01",
            decision_remarks="Field inspection completed by Village Accountant. Family resides in Ramohalli. Income verified at Rs. 60,000.",
            certificate_number="KAR-RD-INC-2026-94819",
            certificate_issued_at="2026-11-03 15:45"
        )
        db.add(app3)

        db.commit()
        print("✓ Seeded realistic demonstration applications in Bengaluru South taluk.")

    db.close()

if __name__ == "__main__":
    seed_database()
