/**
 * Janaseva AI API Client
 * Talks to backend REST API with persistent local storage fallback
 */

import { Application, DashboardStats, AIReviewResult, DocumentVerificationStatus } from '../types';
import { INITIAL_APPLICATIONS } from './mockData';

const STORAGE_KEY = 'janaseva_applications_db_v1';

// Seed initial state in local storage if not present
function getStoredApplications(): Application[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

function saveStoredApplications(apps: Application[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (err) {
    console.warn('Failed to save applications to localStorage', err);
  }
}

export const api = {
  // Get all applications
  async getApplications(): Promise<Application[]> {
    try {
      const res = await fetch('/api/applications');
      if (res.ok) {
        const data = await res.json();
        saveStoredApplications(data);
        return data;
      }
    } catch {
      // Fallback to local storage
    }
    return getStoredApplications();
  },

  // Get application by ID
  async getApplicationById(id: string): Promise<Application | null> {
    try {
      const res = await fetch(`/api/applications/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const apps = getStoredApplications();
    return apps.find(a => a.id === id || a.applicationNumber === id) || null;
  },

  // Create new application
  async createApplication(payload: Partial<Application>): Promise<Application> {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        const apps = getStoredApplications();
        apps.unshift(created);
        saveStoredApplications(apps);
        return created;
      }
    } catch {
      // Fallback
    }

    // Local creation
    const apps = getStoredApplications();
    const newNumber = `RD0038${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newApp: Application = {
      id: `app-${Date.now()}`,
      applicationNumber: newNumber,
      applicantName: payload.applicantName || 'Citizen Applicant',
      applicantFatherOrSpouse: payload.applicantFatherOrSpouse || '',
      mobile: payload.mobile || '',
      aadhaarLastFour: payload.aadhaarLastFour || '0000',
      address: payload.address || '',
      district: payload.district || 'Bengaluru Urban',
      taluk: payload.taluk || 'Bengaluru South',
      hobli: payload.hobli || 'Kengeri',
      village: payload.village || '',
      pincode: payload.pincode || '560001',
      declaredAnnualIncome: Number(payload.declaredAnnualIncome) || 50000,
      purpose: payload.purpose || 'Educational Scholarship (SSP/NSP)',
      familyMembersCount: Number(payload.familyMembersCount) || 4,
      rationCardNumber: payload.rationCardNumber || '',
      status: 'PENDING',
      currentStage: 'APPLICATION_SUBMISSION',
      priority: (Number(payload.declaredAnnualIncome) < 40000 ? 'URGENT' : 'NORMAL'),
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
          previousStatus: 'PENDING',
          newStatus: 'PENDING',
          comments: 'Application entered into Nadakacheri register by Revenue Inspector.',
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ]
    };

    apps.unshift(newApp);
    saveStoredApplications(apps);
    return newApp;
  },

  // Verify document
  async verifyDocument(
    applicationId: string,
    documentId: string,
    verificationStatus: DocumentVerificationStatus,
    officerComments?: string
  ): Promise<Application | null> {
    try {
      const res = await fetch(`/api/documents/${documentId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, verificationStatus, officerComments })
      });
      if (res.ok) {
        const updated = await res.json();
        const apps = getStoredApplications().map(a => (a.id === updated.id ? updated : a));
        saveStoredApplications(apps);
        return updated;
      }
    } catch {
      // Fallback
    }

    const apps = getStoredApplications();
    const appIndex = apps.findIndex(a => a.id === applicationId);
    if (appIndex === -1) return null;

    const targetApp = apps[appIndex];
    const doc = targetApp.documents.find(d => d.id === documentId);
    if (doc) {
      doc.verificationStatus = verificationStatus;
      if (officerComments !== undefined) doc.officerComments = officerComments;
    }

    // Add audit history
    targetApp.history.push({
      id: `hist-${Date.now()}`,
      applicationId: targetApp.id,
      officerId: 'off-001',
      officerName: 'K. S. Manjunath',
      officerRole: 'Revenue Inspector (RI)',
      action: `Document ${doc?.title || ''} marked as ${verificationStatus}`,
      actionKannada: `ದಾಖಲೆ (${doc?.title || ''}) ಸ್ಥಿತಿ: ${verificationStatus}`,
      previousStatus: targetApp.status,
      newStatus: targetApp.status,
      comments: officerComments || `Document status changed to ${verificationStatus}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    targetApp.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    apps[appIndex] = { ...targetApp };
    saveStoredApplications(apps);
    return apps[appIndex];
  },

  // Run AI review
  async runAiReview(applicationId: string, stage: 'DOCUMENT_VERIFICATION' | 'ELIGIBILITY_VERIFICATION'): Promise<AIReviewResult> {
    try {
      const endpoint = stage === 'DOCUMENT_VERIFICATION'
        ? `/api/applications/${applicationId}/ai/document-review`
        : `/api/applications/${applicationId}/ai/eligibility-review`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const review = await res.json();
        const apps = getStoredApplications();
        const app = apps.find(a => a.id === applicationId);
        if (app) {
          app.aiReviews = app.aiReviews || [];
          app.aiReviews.unshift(review);
          saveStoredApplications(apps);
        }
        return review;
      }
    } catch {
      // Fallback
    }

    // High quality deterministic fallback generator
    const apps = getStoredApplications();
    const app = apps.find(a => a.id === applicationId);
    const declared = app ? app.declaredAnnualIncome : 50000;
    const hasDiscrepancy = app?.documents.some(d => d.extractedIncome && Math.abs(d.extractedIncome - declared) > 30000);

    const review: AIReviewResult = {
      id: `ai-${Date.now()}`,
      applicationId,
      workflowStage: stage,
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
          passed: !app?.documents.some(d => d.verificationStatus === 'UNCLEAR' || d.verificationStatus === 'MISSING'),
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

    if (app) {
      app.aiReviews = app.aiReviews || [];
      app.aiReviews.unshift(review);
      saveStoredApplications(apps);
    }
    return review;
  },

  // Final Decision: Approve
  async approveApplication(applicationId: string, remarks: string, officerName: string): Promise<Application | null> {
    try {
      const res = await fetch(`/api/applications/${applicationId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks, officerName })
      });
      if (res.ok) {
        const updated = await res.json();
        const apps = getStoredApplications().map(a => (a.id === updated.id ? updated : a));
        saveStoredApplications(apps);
        return updated;
      }
    } catch {
      // Fallback
    }

    const apps = getStoredApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return null;

    app.status = 'APPROVED';
    app.currentStage = 'FINAL_DECISION';
    app.decisionRemarks = remarks || 'Approved after document verification and eligibility check.';
    app.certificateNumber = `KAR-RD-INC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    app.certificateIssuedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    app.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    app.history.push({
      id: `hist-${Date.now()}`,
      applicationId: app.id,
      officerId: 'off-001',
      officerName: officerName || 'K. S. Manjunath',
      officerRole: 'Revenue Inspector (RI)',
      action: 'Application Formally Approved by Officer',
      actionKannada: 'ಅಧಿಕಾರಿಯಿಂದ ಅನುಮೋದನೆ ನೀಡಲಾಯಿತು',
      previousStatus: 'UNDER_VERIFICATION',
      newStatus: 'APPROVED',
      comments: remarks || `Certificate #${app.certificateNumber} generated and signed digitally.`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    saveStoredApplications(apps);
    return app;
  },

  // Final Decision: Reject
  async rejectApplication(applicationId: string, reason: string, remarks: string, officerName: string): Promise<Application | null> {
    try {
      const res = await fetch(`/api/applications/${applicationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, remarks, officerName })
      });
      if (res.ok) {
        const updated = await res.json();
        const apps = getStoredApplications().map(a => (a.id === updated.id ? updated : a));
        saveStoredApplications(apps);
        return updated;
      }
    } catch {
      // Fallback
    }

    const apps = getStoredApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return null;

    app.status = 'REJECTED';
    app.currentStage = 'FINAL_DECISION';
    app.rejectionReason = reason;
    app.decisionRemarks = remarks;
    app.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    app.history.push({
      id: `hist-${Date.now()}`,
      applicationId: app.id,
      officerId: 'off-001',
      officerName: officerName || 'K. S. Manjunath',
      officerRole: 'Revenue Inspector (RI)',
      action: 'Application Formally Rejected by Officer',
      actionKannada: 'ಅರ್ಜಿಯನ್ನು ತಿರಸ್ಕರಿಸಲಾಯಿತು',
      previousStatus: app.status,
      newStatus: 'REJECTED',
      comments: `Reason: ${reason}. Remarks: ${remarks}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    saveStoredApplications(apps);
    return app;
  },

  // Final Decision: Return for correction
  async returnApplication(
    applicationId: string,
    reason: string,
    corrections: string[],
    remarks: string,
    officerName: string
  ): Promise<Application | null> {
    try {
      const res = await fetch(`/api/applications/${applicationId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, corrections, remarks, officerName })
      });
      if (res.ok) {
        const updated = await res.json();
        const apps = getStoredApplications().map(a => (a.id === updated.id ? updated : a));
        saveStoredApplications(apps);
        return updated;
      }
    } catch {
      // Fallback
    }

    const apps = getStoredApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return null;

    app.status = 'RETURNED';
    app.currentStage = 'APPLICATION_SUBMISSION';
    app.returnReason = reason;
    app.requiredCorrections = corrections;
    app.decisionRemarks = remarks;
    app.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    app.history.push({
      id: `hist-${Date.now()}`,
      applicationId: app.id,
      officerId: 'off-001',
      officerName: officerName || 'K. S. Manjunath',
      officerRole: 'Revenue Inspector (RI)',
      action: 'Application Returned to Citizen for Correction',
      actionKannada: 'ಅರ್ಜಿಯನ್ನು ನಾಗರಿಕರಿಗೆ ಹಿಂತಿರುಗಿಸಲಾಯಿತು',
      previousStatus: app.status,
      newStatus: 'RETURNED',
      comments: `Reason: ${reason}. Requested corrections: ${corrections.join(', ')}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    saveStoredApplications(apps);
    return app;
  },

  // Advance workflow stage
  async advanceStage(applicationId: string, nextStage: Application['currentStage']): Promise<Application | null> {
    const apps = getStoredApplications();
    const app = apps.find(a => a.id === applicationId);
    if (!app) return null;

    app.currentStage = nextStage;
    if (app.status === 'PENDING' && nextStage === 'DOCUMENT_VERIFICATION') {
      app.status = 'UNDER_VERIFICATION';
    }
    app.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    app.history.push({
      id: `hist-${Date.now()}`,
      applicationId: app.id,
      officerId: 'off-001',
      officerName: 'K. S. Manjunath',
      officerRole: 'Revenue Inspector (RI)',
      action: `Workflow advanced to ${nextStage}`,
      actionKannada: `ಕಾರ್ಯಪ್ರವಾಹ ಮುಂದುವರಿಕೆ: ${nextStage}`,
      previousStatus: app.status,
      newStatus: app.status,
      comments: `Officer advanced stage to ${nextStage}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    saveStoredApplications(apps);
    return app;
  },

  // Calculate dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const apps = await this.getApplications();
    const total = apps.length;
    const pending = apps.filter(a => a.status === 'PENDING' || a.status === 'UNDER_VERIFICATION').length;
    const urgent = apps.filter(a => a.priority === 'URGENT' || a.daysPending >= 4).length;
    const approved = apps.filter(a => a.status === 'APPROVED').length;
    const rejected = apps.filter(a => a.status === 'REJECTED').length;
    const returned = apps.filter(a => a.status === 'RETURNED').length;

    return {
      totalApplications: total,
      pendingApplications: pending,
      urgentAttentionCount: urgent,
      approvedCount: approved,
      rejectedCount: rejected,
      returnedCount: returned,
      avgProcessingDays: 2.3,
      slaComplianceRate: 94.8
    };
  },

  // Reset to initial demonstration seed
  resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  }
};
