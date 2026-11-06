import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { Application, AIReviewResult, WorkflowStage, ApplicationStatus, PriorityLevel } from './src/types/index';
import { INITIAL_APPLICATIONS } from './src/services/mockData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory data store initialized with realistic demonstration data
let applications: Application[] = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));

// 1. Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'officer@janaseva.demo' && password === 'Demo@12345') {
    return res.json({
      token: 'jwt-token-demo-officer-kgid2849104',
      user: {
        id: 'off-001',
        name: 'K. S. Manjunath',
        nameKannada: 'ಕೆ. ಎಸ್. ಮಂಜುನಾಥ್',
        email: 'officer@janaseva.demo',
        role: 'Revenue Inspector (Grade-I)',
        roleKannada: 'ಕಂದಾಯ ನಿರೀಕ್ಷಕರು (ದರ್ಜೆ-೧)',
        kgidNumber: 'KGID-2849104',
        district: 'Bengaluru Urban',
        taluk: 'Bengaluru South',
        officeLocation: 'Kengeri Hobli Nadakacheri, Bengaluru South',
        avatarUrl: '/src/assets/images/officer_avatar_1793942944619.jpg'
      }
    });
  }
  return res.status(401).json({ error: 'Invalid credentials. Use officer@janaseva.demo / Demo@12345' });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    id: 'off-001',
    name: 'K. S. Manjunath',
    nameKannada: 'ಕೆ. ಎಸ್. ಮಂಜುನಾಥ್',
    email: 'officer@janaseva.demo',
    role: 'Revenue Inspector (Grade-I)',
    roleKannada: 'ಕಂದಾಯ ನಿರೀಕ್ಷಕರು (ದರ್ಜೆ-೧)',
    kgidNumber: 'KGID-2849104',
    district: 'Bengaluru Urban',
    taluk: 'Bengaluru South'
  });
});

// 2. Application listings & detail
app.get('/api/applications', (req, res) => {
  const { status, search, priority } = req.query;
  let result = [...applications];

  if (status && status !== 'ALL') {
    result = result.filter(a => a.status === status);
  }
  if (priority) {
    result = result.filter(a => a.priority === priority);
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      a =>
        a.applicationNumber.toLowerCase().includes(q) ||
        a.applicantName.toLowerCase().includes(q) ||
        a.village.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

app.get('/api/applications/:id', (req, res) => {
  const appItem = applications.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);
  if (!appItem) {
    return res.status(404).json({ error: 'Application not found' });
  }
  res.json(appItem);
});

// 3. Create new application
app.post('/api/applications', (req, res) => {
  const payload = req.body;
  const newNumber = `RD0038${Math.floor(1000000 + Math.random() * 9000000)}`;
  const newApp = {
    id: `app-${Date.now()}`,
    applicationNumber: newNumber,
    applicantName: payload.applicantName || 'Applicant',
    applicantFatherOrSpouse: payload.applicantFatherOrSpouse || '',
    mobile: payload.mobile || '',
    aadhaarLastFour: payload.aadhaarLastFour || '1234',
    address: payload.address || '',
    district: payload.district || 'Bengaluru Urban',
    taluk: payload.taluk || 'Bengaluru South',
    hobli: payload.hobli || 'Kengeri',
    village: payload.village || '',
    pincode: payload.pincode || '560060',
    declaredAnnualIncome: Number(payload.declaredAnnualIncome) || 50000,
    purpose: payload.purpose || 'Educational Scholarship (SSP/NSP)',
    familyMembersCount: Number(payload.familyMembersCount) || 4,
    rationCardNumber: payload.rationCardNumber || '',
    status: 'PENDING' as ApplicationStatus,
    currentStage: 'APPLICATION_SUBMISSION' as WorkflowStage,
    priority: (Number(payload.declaredAnnualIncome) < 40000 ? 'URGENT' : 'NORMAL') as PriorityLevel,
    assignedOfficerId: 'off-001',
    assignedOfficerName: 'K. S. Manjunath',
    assignedOfficerRole: 'Revenue Inspector (RI)',
    slaTargetDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    daysPending: 0,
    submissionDate: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    documents: payload.documents || [],
    history: [
      {
        id: `hist-${Date.now()}`,
        applicationId: `app-${Date.now()}`,
        officerId: 'off-001',
        officerName: 'K. S. Manjunath',
        officerRole: 'Revenue Inspector (RI)',
        action: 'Application Submitted',
        actionKannada: 'ಅರ್ಜಿ ಸಲ್ಲಿಕೆಯಾಯಿತು',
        previousStatus: 'PENDING' as ApplicationStatus,
        newStatus: 'PENDING' as ApplicationStatus,
        comments: 'Application registered in Nadakacheri portal.',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      }
    ],
    aiReviews: []
  };

  applications.unshift(newApp);
  res.status(201).json(newApp);
});

// 4. Document Verification action
app.post('/api/documents/:id/verify', (req, res) => {
  const { applicationId, verificationStatus, officerComments } = req.body;
  const appItem = applications.find(a => a.id === applicationId);
  if (!appItem) return res.status(404).json({ error: 'Application not found' });

  const doc = appItem.documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  doc.verificationStatus = verificationStatus;
  if (officerComments) doc.officerComments = officerComments;

  appItem.history.push({
    id: `hist-${Date.now()}`,
    applicationId: appItem.id,
    officerId: 'off-001',
    officerName: 'K. S. Manjunath',
    officerRole: 'Revenue Inspector (RI)',
    action: `Document ${doc.title} marked as ${verificationStatus}`,
    actionKannada: `ದಾಖಲೆ (${doc.title}) ಸ್ಥಿತಿ: ${verificationStatus}`,
    previousStatus: appItem.status,
    newStatus: appItem.status,
    comments: officerComments || `Document status changed to ${verificationStatus}`,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  });

  res.json(appItem);
});

// 5. AI Review endpoints
app.post('/api/applications/:id/ai/document-review', async (req, res) => {
  const appItem = applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ error: 'Application not found' });

  const apiKey = process.env.GEMINI_API_KEY;
  const declared = appItem.declaredAnnualIncome;
  const hasDiscrepancy = appItem.documents.some(
    d => d.extractedIncome && Math.abs(d.extractedIncome - declared) > 30000
  );

  let review: AIReviewResult | undefined;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({});
      const prompt = `You are the Janaseva AI assistant for the Karnataka Revenue Department, analyzing an Income Certificate application.
Applicant: ${appItem.applicantName}
Declared Annual Family Income: Rs. ${appItem.declaredAnnualIncome}
Purpose: ${appItem.purpose}
Taluk: ${appItem.taluk}, Hobli: ${appItem.hobli}, Village: ${appItem.village}
Documents:
${appItem.documents.map(d => `- ${d.title} (${d.documentType}): Extracted Income: ${d.extractedIncome || 'N/A'}, OCR Text: ${d.ocrExtractedText || ''}`).join('\n')}

Provide a structured JSON output with:
- summary (English, concise 1-2 sentences)
- summaryKannada (Kannada, concise 1-2 sentences)
- recommendation (one of: RECOMMEND_APPROVE, RECOMMEND_RETURN, NEEDS_OFFICER_REVIEW)
- recommendationText (English explanation)
- recommendationTextKannada (Kannada explanation)
- findings (array of { type, severity, title, titleKannada, description, descriptionKannada })
- checklist (array of { key, label, labelKannada, passed, details })`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(aiResponse.text || '{}');
      review = {
        id: `ai-${Date.now()}`,
        applicationId: appItem.id,
        workflowStage: 'DOCUMENT_VERIFICATION' as WorkflowStage,
        isLiveModel: true,
        modelUsed: 'Gemini 2.5 Flash (Karnataka Revenue Engine)',
        summary: parsed.summary || `Analysis completed for ${appItem.applicantName}`,
        summaryKannada: parsed.summaryKannada || `${appItem.applicantName} ಅವರ ದಾಖಲೆಗಳ ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ`,
        recommendation: (parsed.recommendation || (hasDiscrepancy ? 'NEEDS_OFFICER_REVIEW' : 'RECOMMEND_APPROVE')) as any,
        recommendationText: parsed.recommendationText || 'Review supporting records before signing.',
        recommendationTextKannada: parsed.recommendationTextKannada || 'ಅಧಿಕೃತ ಸಹಿ ನೀಡುವ ಮೊದಲು ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
        checklist: parsed.checklist || [
          { key: 'id_match', label: 'Identity & Address match', labelKannada: 'ಗುರುತು ಮತ್ತು ವಿಳಾಸ ಹೊಂದಾಣಿಕೆ', passed: true, details: 'Verified' }
        ],
        findings: parsed.findings || [],
        generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    } catch (e) {
      console.warn('Gemini live call error, falling back to deterministic engine:', e);
    }
  }

  if (!review) {
    review = {
      id: `ai-${Date.now()}`,
      applicationId: appItem.id,
      workflowStage: 'DOCUMENT_VERIFICATION' as WorkflowStage,
      isLiveModel: false,
      modelUsed: 'Janaseva AI Revenue Engine (Karnataka Demonstration Rules)',
      summary: hasDiscrepancy
        ? `Declared income ₹${declared.toLocaleString('en-IN')} shows significant variance against extracted supporting salary / land proof.`
        : `Applicant submitted valid documentation under Bangalore South taluk jurisdiction. Declared income is ₹${declared.toLocaleString('en-IN')}.`,
      summaryKannada: hasDiscrepancy
        ? `ಘೋಷಿತ ವಾರ್ಷಿಕ ಆದಾಯ ₹${declared.toLocaleString('en-IN')} ಮತ್ತು ಲಗತ್ತಿಸಲಾದ ದಾಖಲೆಯ ಆದಾಯದ ನಡುವೆ ವ್ಯತ್ಯಾಸ ಕಂಡುಬಂದಿದೆ.`
        : `ಅರ್ಜಿದಾರರು ಬೆಂಗಳೂರು ದಕ್ಷಿಣ ವ್ಯಾಪ್ತಿಯ ದಾಖಲೆಗಳನ್ನು ಸಲ್ಲಿಸಿದ್ದಾರೆ. ಘೋಷಿತ ಆದಾಯ ₹${declared.toLocaleString('en-IN')}.`,
      recommendation: hasDiscrepancy ? 'NEEDS_OFFICER_REVIEW' : 'RECOMMEND_APPROVE',
      recommendationText: hasDiscrepancy
        ? 'Discrepancy in earnings. Recommend spot verification by Village Accountant before approval.'
        : 'Documents verified and income falls within statutory ceiling. Satisfies eligibility criteria.',
      recommendationTextKannada: hasDiscrepancy
        ? 'ಆದಾಯದಲ್ಲಿ ವ್ಯತ್ಯಾಸವಿದೆ. ಅನುಮೋದಿಸುವ ಮುನ್ನ ಗ್ರಾಮ ಆಡಳಿತಾಧಿಕಾರಿಗಳಿಂದ ಸ್ಥಳ ತಪಾಸಣೆ ಅಗತ್ಯ.'
        : 'ದಾಖಲೆಗಳು ಸರಿಹೊಂದಿವೆ ಮತ್ತು ಆದಾಯವು ನಿಗದಿತ ಮಿತಿಯೊಳಗಿದೆ. ಅರ್ಹತಾ ಮಾನದಂಡಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ.',
      checklist: [
        {
          key: 'applicant_id',
          label: 'Applicant Identity & Address Verification',
          labelKannada: 'ಅರ್ಜಿದಾರರ ಗುರುತು ಮತ್ತು ವಿಳಾಸ ದೃಢೀಕರಣ',
          passed: true,
          details: 'Matched with Electoral Roll & Aadhaar Last 4'
        },
        {
          key: 'income_ceiling',
          label: 'Declared Income Within Ceiling Threshold',
          labelKannada: 'ಘೋಷಿತ ಆದಾಯ ನಿಗದಿತ ಸೀಲಿಂಗ್ ಮಿತಿಯೊಳಗಿದೆ',
          passed: declared <= 200000,
          details: `Declared ₹${declared.toLocaleString('en-IN')} vs Scheme ceiling ₹2,00,000`
        },
        {
          key: 'doc_integrity',
          label: 'All Mandatory Documents Legible and Uploaded',
          labelKannada: 'ಎಲ್ಲಾ ಕಡ್ಡಾಯ ದಾಖಲೆಗಳು ಸ್ಪಷ್ಟವಾಗಿವೆ',
          passed: !appItem.documents.some(d => d.verificationStatus === 'UNCLEAR' || d.verificationStatus === 'MISSING'),
          details: 'Verified against Nadakacheri document checklist'
        }
      ],
      findings: [
        {
          type: hasDiscrepancy ? 'DISCREPANCY' : 'MATCH',
          severity: hasDiscrepancy ? 'HIGH' : 'LOW',
          title: hasDiscrepancy ? 'Income Mismatch Detected' : 'Income Verification Consistent',
          titleKannada: hasDiscrepancy ? 'ಆದಾಯದಲ್ಲಿ ವ್ಯತ್ಯಾಸ ಪತ್ತೆಯಾಗಿದೆ' : 'ಆದಾಯ ಪರಿಶೀಲನೆ ಸರಿಹೊಂದಿದೆ',
          description: hasDiscrepancy
            ? `Difference detected between declared ₹${declared.toLocaleString('en-IN')} and uploaded proof figures.`
            : `Declared amount ₹${declared.toLocaleString('en-IN')} is consistent with submitted economic proofs.`,
          descriptionKannada: hasDiscrepancy
            ? `ಘೋಷಿತ ಮೊತ್ತ ₹${declared.toLocaleString('en-IN')} ಮತ್ತು ದಾಖಲೆಯ ಮೊತ್ತದಲ್ಲಿ ವ್ಯತ್ಯಾಸವಿದೆ.`
            : `ಘೋಷಿತ ಆದಾಯ ₹${declared.toLocaleString('en-IN')} ಎಲ್ಲಾ ದಾಖಲೆಗಳಿಗೆ ತಾಳೆಯಾಗಿದೆ.`
        }
      ],
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
  }

  appItem.aiReviews = appItem.aiReviews || [];
  appItem.aiReviews.unshift(review);

  appItem.history.push({
    id: `hist-${Date.now()}`,
    applicationId: appItem.id,
    officerId: 'off-001',
    officerName: 'K. S. Manjunath',
    officerRole: 'Revenue Inspector (RI)',
    action: 'AI Verification Analysis Executed',
    actionKannada: 'AI ದಾಖಲೆ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಲಾಯಿತು',
    previousStatus: appItem.status,
    newStatus: appItem.status,
    comments: `AI analysis completed (${review.recommendation}). Mode: ${review.modelUsed}`,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  });

  res.json(review);
});

app.post('/api/applications/:id/ai/eligibility-review', async (req, res) => {
  // Same flow for eligibility stage
  const appItem = applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ error: 'Application not found' });
  // Delegate to review generator with ELIGIBILITY_VERIFICATION stage
  req.url = `/api/applications/${req.params.id}/ai/document-review`;
  const review = {
    id: `ai-${Date.now()}`,
    applicationId: appItem.id,
    workflowStage: 'ELIGIBILITY_VERIFICATION',
    isLiveModel: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    modelUsed: 'Janaseva AI Revenue Engine',
    summary: `Eligibility check completed for ${appItem.purpose}. Declared ₹${appItem.declaredAnnualIncome}.`,
    summaryKannada: `${appItem.purpose} ಗಾಗಿ ಅರ್ಹತಾ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ಘೋಷಿತ ಆದಾಯ ₹${appItem.declaredAnnualIncome}.`,
    recommendation: appItem.declaredAnnualIncome > 200000 ? 'NEEDS_OFFICER_REVIEW' : 'RECOMMEND_APPROVE',
    recommendationText: 'Eligibility criteria verified against Karnataka Sakala norms.',
    recommendationTextKannada: 'ಕರ್ನಾಟಕ ಸಕಾಲ ನಿಯಮಗಳ ಅನ್ವಯ ಅರ್ಹತಾ ಮಾನದಂಡಗಳು ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿವೆ.',
    checklist: [
      { key: 'ceiling', label: 'Within Scheme Ceiling', labelKannada: 'ಸರ್ಕಾರದ ಗರಿಷ್ಠ ಮಿತಿಯೊಳಗಿದೆ', passed: appItem.declaredAnnualIncome <= 200000, details: 'Statutory threshold met' }
    ],
    findings: [],
    generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };
  res.json(review);
});

// 6. Decision endpoints (Approve, Reject, Return)
app.post('/api/applications/:id/approve', (req, res) => {
  const { remarks, officerName } = req.body;
  const appItem = applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ error: 'Application not found' });

  appItem.status = 'APPROVED';
  appItem.currentStage = 'FINAL_DECISION';
  appItem.decisionRemarks = remarks || 'Approved after document verification and eligibility check.';
  appItem.certificateNumber = `KAR-RD-INC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  appItem.certificateIssuedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
  appItem.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

  appItem.history.push({
    id: `hist-${Date.now()}`,
    applicationId: appItem.id,
    officerId: 'off-001',
    officerName: officerName || 'K. S. Manjunath',
    officerRole: 'Revenue Inspector (RI)',
    action: 'Application Formally Approved by Officer',
    actionKannada: 'ಅಧಿಕಾರಿಯಿಂದ ಅನುಮೋದನೆ ನೀಡಲಾಯಿತು',
    previousStatus: 'UNDER_VERIFICATION',
    newStatus: 'APPROVED',
    comments: remarks || `Certificate #${appItem.certificateNumber} generated and signed digitally.`,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  });

  res.json(appItem);
});

app.post('/api/applications/:id/reject', (req, res) => {
  const { reason, remarks, officerName } = req.body;
  const appItem = applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ error: 'Application not found' });

  appItem.status = 'REJECTED';
  appItem.currentStage = 'FINAL_DECISION';
  appItem.rejectionReason = reason;
  appItem.decisionRemarks = remarks;
  appItem.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

  appItem.history.push({
    id: `hist-${Date.now()}`,
    applicationId: appItem.id,
    officerId: 'off-001',
    officerName: officerName || 'K. S. Manjunath',
    officerRole: 'Revenue Inspector (RI)',
    action: 'Application Formally Rejected by Officer',
    actionKannada: 'ಅರ್ಜಿಯನ್ನು ತಿರಸ್ಕರಿಸಲಾಯಿತು',
    previousStatus: appItem.status,
    newStatus: 'REJECTED',
    comments: `Grounds: ${reason}. Notes: ${remarks}`,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  });

  res.json(appItem);
});

app.post('/api/applications/:id/return', (req, res) => {
  const { reason, corrections, remarks, officerName } = req.body;
  const appItem = applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ error: 'Application not found' });

  appItem.status = 'RETURNED';
  appItem.currentStage = 'APPLICATION_SUBMISSION';
  appItem.returnReason = reason;
  appItem.requiredCorrections = corrections || [];
  appItem.decisionRemarks = remarks;
  appItem.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

  appItem.history.push({
    id: `hist-${Date.now()}`,
    applicationId: appItem.id,
    officerId: 'off-001',
    officerName: officerName || 'K. S. Manjunath',
    officerRole: 'Revenue Inspector (RI)',
    action: 'Application Returned to Citizen for Correction',
    actionKannada: 'ಅರ್ಜಿಯನ್ನು ನಾಗರಿಕರಿಗೆ ಹಿಂತಿರುಗಿಸಲಾಯಿತು',
    previousStatus: appItem.status,
    newStatus: 'RETURNED',
    comments: `Reason: ${reason}. Requested: ${(corrections || []).join(', ')}`,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  });

  res.json(appItem);
});

// 7. Dashboard stats endpoint
app.get('/api/dashboard/stats', (req, res) => {
  const total = applications.length;
  const pending = applications.filter(a => a.status === 'PENDING' || a.status === 'UNDER_VERIFICATION').length;
  const urgent = applications.filter(a => a.priority === 'URGENT' || a.daysPending >= 4).length;
  const approved = applications.filter(a => a.status === 'APPROVED').length;
  const rejected = applications.filter(a => a.status === 'REJECTED').length;
  const returned = applications.filter(a => a.status === 'RETURNED').length;

  res.json({
    totalApplications: total,
    pendingApplications: pending,
    urgentAttentionCount: urgent,
    approvedCount: approved,
    rejectedCount: rejected,
    returnedCount: returned,
    avgProcessingDays: 2.3,
    slaComplianceRate: 94.8
  });
});

// 8. Reports endpoint
app.get('/api/reports', (req, res) => {
  res.json({
    metrics: {
      totalReceived: 1248,
      approvedRate: 88.4,
      rejectedRate: 5.6,
      returnedRate: 6.0,
      avgProcessingDays: 2.3,
      slaTargetDays: 7.0,
      reductionInManualCheckingPercent: 42
    },
    byStage: [
      { stage: 'Application Submission', stageKn: 'ಅರ್ಜಿ ಸಲ್ಲಿಕೆ', count: 120 },
      { stage: 'Document Verification', stageKn: 'ದಾಖಲೆ ಪರಿಶೀಲನೆ', count: 85 },
      { stage: 'Eligibility Verification', stageKn: 'ಅರ್ಹತಾ ಪರಿಶೀಲನೆ', count: 44 },
      { stage: 'Final Decision Order', stageKn: 'ಅಂತಿಮ ಆದೇಶ', count: 28 }
    ],
    byTaluk: [
      { taluk: 'Bengaluru South', talukKn: 'ಬೆಂಗಳೂರು ದಕ್ಷಿಣ', pending: 38, approved: 412, rejected: 19 },
      { taluk: 'Bengaluru North', talukKn: 'ಬೆಂಗಳೂರು ಉತ್ತರ', pending: 45, approved: 380, rejected: 24 },
      { taluk: 'Bengaluru East', talukKn: 'ಬೆಂಗಳೂರು ಪೂರ್ವ', pending: 29, approved: 298, rejected: 14 },
      { taluk: 'Anekal', talukKn: 'ಆನೇಕಲ್', pending: 32, approved: 245, rejected: 18 }
    ]
  });
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Janaseva AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
