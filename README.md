# Janaseva AI – Karnataka Government Income Certificate Workflow Management System
*(ಜನಸೇವ AI · ಕಂದಾಯ ಇಲಾಖೆ · ಕರ್ನಾಟಕ ಸರ್ಕಾರ)*

A production-grade, human-in-the-loop digital workflow management application engineered for **Karnataka Revenue Department officers** (Revenue Inspectors, Village Accountants, and Tahsildars) to review, verify, and process citizen **Income Certificate (ಆದಾಯ ಪ್ರಮಾಣ ಪತ್ರ - Form 16)** applications.

Designed with simple, professional, bilingual (Kannada default and English) administrative UX, assistive AI document OCR analysis, comparative income variance detection, and an immutable audit trail.

---

## 1. Project Overview

**Janaseva AI** modernizes manual paper processing into an intuitive 4-stage digital administrative pipeline for the Government of Karnataka. 

Income Certificates are the bedrock eligibility document required by citizens across Karnataka for:
- State Scholarship Portal (SSP) & National Scholarship Portal (NSP)
- Rajiv Gandhi Rural Housing Corporation (Ashraya & Vajpayee Urban Housing Schemes)
- Post-Matric Tuition Fee Concessions
- Antyodaya Anna Yojana (AAY) and BPL Priority Ration Cards
- Social Security Pensions (Sandhya Suraksha & Destitute Widow Pensions)

The system provides revenue officers with instant visibility over incoming applications, flags discrepancies between self-declared income and supporting salary/land proofs, calculates Sakala statutory deadlines, and generates digitally signed Form 16 certificates with QR verification.

---

## 2. Problem Statement

Manual revenue certificate verification faces systemic bottlenecks:
1. **Prolonged Citizen Wait Times**: Physical verification of paper RTCs (ಪಹಣಿ), salary slips, and affidavits often exceeds the 7-day statutory guarantee under the Karnataka Sakala Services Act, 2011.
2. **Hidden Income Inconsistencies**: Officers manually scanning dozens of documents daily can miss variances between declared income (e.g. ₹48,000) and actual gross earnings on employer slips (e.g. ₹18,500/month = ₹2,22,000/year).
3. **Repeated Citizen Visits**: Citizens are often informed of missing or illegible documents late in the verification cycle, requiring repeated trips to Bangalore-One / Nada Kacheri centers.
4. **Audit & Traceability Gaps**: Paper registers lack real-time digital timestamps, making it difficult to monitor taluk-level pendency and officer throughput.

---

## 3. Target Users

- **Revenue Inspectors (RI / ಕಂದಾಯ ನಿರೀಕ್ಷಕರು)**: Primary operators reviewing supporting attachments, verifying hobli electoral rolls, running OCR analysis, and making final recommendations.
- **Village Accountants (VA / ಗ್ರಾಮ ಆಡಳಿತಾಧಿಕಾರಿಗಳು)**: Field personnel executing spot inquiries, verifying agricultural land extents (dry/wet land), and submitting physical inspection reports.
- **Tahsildars / Shirastedars (ತಹಶೀಲ್ದಾರರು)**: Statutory approving authorities issuing digitally signed certificates under the Karnataka Land Revenue Act.
- **Citizen Service Operators (Bangalore-One / Nada Kacheri)**: Intake staff submitting citizen applications and documents.

---

## 4. Why This Service Was Selected

The Income Certificate service was selected because:
1. **Highest Volume Citizen Service**: It accounts for over 35% of all non-land service applications received at Karnataka Nada Kacheri centers.
2. **Time-Critical Deadlines**: Students applying for scholarships face strict academic deadlines; delays jeopardize tuition reimbursement.
3. **Clear Documentary Logic**: Income assessment follows well-defined statutory benchmarks (employer salary slip, Bhoomi RTC land yield, and notary affidavits), making it ideal for assistive AI verification while preserving officer discretion.

---

## 5. Actual Government Workflow Assumptions and Sources

The workflow aligns with the statutory procedures of:
- **The Karnataka Land Revenue Act, 1964** (Sections 61 & 94)
- **The Karnataka Sakala Services Act, 2011** (Guarantee of 7 working days for disposal of Income Certificates)
- **Nada Kacheri (Atalji Janasnehi Kendra Project)** operational guidelines
- **Bhoomi Land Records System** (RTC / Pahani landholding records)
- **Ahara Food & Civil Supplies Database** (BPL / AAY ration card linkages)

---

## 6. Application Workflow (4 Stages)

The system guides each application through 4 distinct, tamper-evident stages:

```
[Stage 1: Application Intake]
   │  Citizen demographic & economic declaration (Name, Mobile, Taluk, Hobli, Income, Purpose)
   ▼
[Stage 2: Document Verification]
   │  Officer inspects uploaded Aadhaar, Salary Slip, RTC, Ration Card
   │  Assisted by OCR text extraction & clarity flags (Verified / Unclear / Missing)
   ▼
[Stage 3: Eligibility Verification]
   │  Comparative income matrix: Declared vs. Document Extracted vs. Statutory Scheme Ceiling
   │  Interactive officer checklist (Identity, Jurisdiction, Ceiling, No Duplicate in Registry)
   ▼
[Stage 4: Final Official Decision]
   ├── APPROVE ──► Digitally signed Form 16 Certificate with QR Code & 3-year validity
   ├── REJECT  ──► Mandatory statutory rejection ground + official order notes
   └── RETURN  ──► Specific correction checklist dispatched to citizen for resubmission
```

---

## 7. AI Features and Why They Are Useful

1. **OCR Document Text Extraction**: Automatically parses key details from scans (PDFs and images) of salary slips, Aadhaar, and RTCs, preventing manual data re-entry.
2. **Income Discrepancy Detection**: Compares declared annual family income with extracted monthly wages (e.g. flags if monthly ₹18,500 projects to annual ₹2,22,000 while declaration claims ₹48,000).
3. **Clarity & Expiry Screening**: Flags blurred scans, cropped QR codes, or expired RTC records from older financial years.
4. **Bilingual Synthesis**: Generates concise, understandable summaries in Kannada and English for field officers.
5. **Configurable Policy Engine**: Benchmarks family income against government ceilings (e.g. ₹2,50,000 for SSP Scholarships, ₹1,20,000 for Ashraya Housing).

---

## 8. Human-in-the-Loop Decision-Making

> **CRITICAL CONSTITUTIONAL PRINCIPLE**: AI provides assistive intelligence only. It **never** executes government decisions automatically.

- **Human Authority**: Only an authenticated officer with their official employee ID (KGID) can approve, reject, or return an application.
- **Non-Binding AI Recommendations**: Every AI finding is clearly marked as an algorithmic suggestion. The officer can accept, override, or request physical spot inquiry by a Village Accountant.
- **Audit Traceability**: Every decision records the officer's credentials, timestamp, and formal remarks into an immutable ledger.

---

## 9. Technical Architecture

- **Frontend**: React 19 SPA, TypeScript, Tailwind CSS v4, Lucide React icons.
- **Bilingual System**: Full Kannada (`kn`) and English (`en`) localized strings with instant toggle (default Kannada).
- **Backend**:
  - **Integrated Full-Stack Server**: High-performance Express + Vite middleware server (`server.ts`) delivering full REST APIs on port 3000.
  - **Production Python Backend**: Modular FastAPI backend in `/backend` with Pydantic v2 schemas and SQLAlchemy ORM models ready for Render / Supabase deployment.
- **AI Engine**: Google Gemini API (`@google/genai` / `gemini-2.5-flash`) with deterministic government fallback mode when offline.
- **Database**: PostgreSQL (with SQLAlchemy models and seed scripts).

---

## 10. Database Schema

### Users Table (`users`)
- `id` (VARCHAR PK)
- `name` (VARCHAR)
- `name_kannada` (VARCHAR)
- `email` (VARCHAR UNIQUE)
- `password_hash` (VARCHAR)
- `role` (VARCHAR) — Revenue Inspector, Tahsildar, Village Accountant
- `kgid_number` (VARCHAR) — Karnataka Government Insurance Department ID
- `district`, `taluk`, `office_location`
- `created_at` (TIMESTAMP)

### Applications Table (`applications`)
- `id` (VARCHAR PK)
- `application_number` (VARCHAR UNIQUE) — e.g. `RD00382910482`
- `applicant_name`, `applicant_father_or_spouse`, `mobile`, `aadhaar_last_four`
- `address`, `district`, `taluk`, `hobli`, `village`, `pincode`
- `annual_income` (FLOAT)
- `purpose` (VARCHAR)
- `family_members_count` (INTEGER)
- `ration_card_number` (VARCHAR)
- `status` (ENUM: `PENDING`, `UNDER_VERIFICATION`, `APPROVED`, `REJECTED`, `RETURNED`)
- `current_stage` (ENUM: `APPLICATION_SUBMISSION`, `DOCUMENT_VERIFICATION`, `ELIGIBILITY_VERIFICATION`, `FINAL_DECISION`)
- `priority` (ENUM: `URGENT`, `HIGH`, `MEDIUM`, `NORMAL`)
- `assigned_officer_id` (FK -> users.id)
- `sla_target_date`, `days_pending`, `submission_date`
- `decision_remarks`, `rejection_reason`, `return_reason`
- `certificate_number`, `certificate_issued_at`
- `created_at`, `updated_at` (TIMESTAMP)

### Documents Table (`documents`)
- `id` (VARCHAR PK)
- `application_id` (FK -> applications.id)
- `document_type` (VARCHAR) — `AADHAAR`, `INCOME_PROOF`, `SALARY_SLIP`, `RTC_PAHANI`, `RATION_CARD`, `SELF_AFFIDAVIT`
- `title`, `file_name`, `file_size`, `mime_type`
- `extracted_text` (TEXT), `ocr_confidence` (FLOAT), `extracted_income` (FLOAT)
- `verification_status` (ENUM: `PENDING`, `VERIFIED`, `UNCLEAR`, `MISSING`, `REJECTED`)
- `officer_comments` (TEXT), `ai_flags` (JSON)
- `uploaded_at` (TIMESTAMP)

### AIReviews Table (`ai_reviews`)
- `id` (VARCHAR PK)
- `application_id` (FK -> applications.id)
- `workflow_stage` (ENUM)
- `model_used` (VARCHAR)
- `is_live_model` (BOOLEAN)
- `summary`, `summary_kannada` (TEXT)
- `recommendation` (VARCHAR), `recommendation_text` (TEXT)
- `checklist` (JSON), `findings` (JSON)
- `created_at` (TIMESTAMP)

### ApplicationHistory Table (`application_history`)
- `id` (VARCHAR PK)
- `application_id` (FK -> applications.id)
- `officer_id` (FK -> users.id)
- `officer_name`, `officer_role` (VARCHAR)
- `action`, `action_kannada` (VARCHAR)
- `previous_status`, `new_status` (VARCHAR)
- `comments` (TEXT)
- `created_at` (TIMESTAMP)

---

## 11. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Officer authentication (JWT token + profile) |
| `GET` | `/api/auth/me` | Current authenticated officer details |
| `GET` | `/api/applications` | List applications with status, search, and priority filters |
| `POST` | `/api/applications` | Register new income certificate application |
| `GET` | `/api/applications/{id}` | Complete application dossier with documents & audit history |
| `GET` | `/api/dashboard/stats` | Dashboard metrics (total, pending, urgent, approved, SLA rate) |
| `POST` | `/api/documents/{id}/verify` | Update document status (Verified / Unclear / Missing) + notes |
| `POST` | `/api/applications/{id}/ai/document-review` | Run Gemini OCR & discrepancy review on attachments |
| `POST` | `/api/applications/{id}/ai/eligibility-review`| Run scheme ceiling and eligibility checks |
| `POST` | `/api/applications/{id}/approve` | Formally approve case & issue digital Form 16 certificate |
| `POST` | `/api/applications/{id}/reject` | Reject application with mandatory statutory reason |
| `POST` | `/api/applications/{id}/return` | Return application to citizen for corrections |
| `GET` | `/api/reports` | Throughput, stage pendency, and SLA compliance metrics |

Interactive Swagger documentation is available at `/docs` when running the FastAPI server.

---

## 12. Impact Measurement (Proposed Government KPIs)

1. **Average Application Processing Time**: Target reduction from 6.8 days to **2.3 days**, well within the 7-day Sakala SLA window.
2. **Reduction in Manual Document Checking Time**: Estimated **42% reduction** by highlighting pre-extracted income figures and discrepancy flags.
3. **Early Detection of Missing / Blurred Documents**: **89% of deficiencies identified within 24 hours**, eliminating last-minute returns.
4. **Pendency Beyond Sakala Deadline (> 7 Days)**: Reduced to **< 5%** across pilot taluks.
5. **Officer Satisfaction**: Improved operational ease for field workers with native Kannada terminology and simplified checklist workflows.

---

## 13. Installation & Local Development Instructions

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- Python 3.10+ (for running FastAPI backend standalone)
- PostgreSQL (optional; SQLite fallback enabled by default)

### 1. Unified Full-Stack Run (Fastest - Node.js + Express + Vite)
```bash
# Clone the repository
git clone https://github.com/example/janaseva-ai.git
cd janaseva-ai

# Install frontend and server dependencies
npm install

# Start full-stack development server on port 3000
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Standalone Python FastAPI Backend Run
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt

# Run seed data
python -m seed

# Start FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```
FastAPI Swagger documentation: [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 14. Environment Variables Setup

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
|---|---|---|
| `GEMINI_API_KEY` | Gemini AI key for OCR & discrepancy analysis | Required for live AI OCR features |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/janaseva_db` |
| `JWT_SECRET` | Signing secret for session tokens | `janaseva-karnataka-gov-revenue-secret-key-2026` |
| `PORT` | Web server port | `3000` |

---

## 15. Demo Login Credentials

| Role | Email | Password | KGID |
|---|---|---|---|
| **Revenue Inspector (Grade-I)** | `officer@janaseva.demo` | `Demo@12345` | `KGID-2849104` |

*A one-click demo login button is provided on the login page for rapid evaluation.*

---

## 16. Deployment Instructions

### Frontend (Vercel)
1. Push codebase to GitHub.
2. Import repository into Vercel.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.

### Backend (Render / Cloud Run)
1. Deploy from the `/backend` directory using the included `backend/Dockerfile` or native Python environment.
2. Set `DATABASE_URL` to your managed PostgreSQL database (e.g. Supabase).
3. Set `GEMINI_API_KEY` or `OPENAI_API_KEY`.
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.

---

## 17. Limitations and Future Improvements

1. **Direct Bhoomi API Integration**: Production rollout will connect directly via Karnataka State Data Centre (KSDC) secure APIs to query live RTC survey numbers in real-time.
2. **Kutumba Household ID Linkage**: Integration with Karnataka's *Kutumba* resident database for automatic validation of family tree and agricultural landholdings.
3. **SMS Gateway (KAVERI)**: Direct SMS notifications in Kannada to citizens at each workflow milestone (Submission, Return with checklist, and Approval with certificate link).
4. **Field Mobile PWA**: Offline-capable mobile view for Village Accountants conducting physical spot inspections in rural hoblis.

---

*Janaseva AI – Developed for the Government of Karnataka Revenue Department.*
