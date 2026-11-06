/**
 * Janaseva AI – Core TypeScript Data Models
 * Karnataka Government Income Certificate Workflow
 */

export type WorkflowStage =
  | 'APPLICATION_SUBMISSION'
  | 'DOCUMENT_VERIFICATION'
  | 'ELIGIBILITY_VERIFICATION'
  | 'FINAL_DECISION';

export type ApplicationStatus =
  | 'PENDING'
  | 'UNDER_VERIFICATION'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNED';

export type PriorityLevel = 'URGENT' | 'HIGH' | 'MEDIUM' | 'NORMAL';

export type DocumentType =
  | 'AADHAAR'
  | 'INCOME_PROOF'
  | 'RATION_CARD'
  | 'RTC_PAHANI'
  | 'SALARY_SLIP'
  | 'SELF_AFFIDAVIT'
  | 'OTHER';

export type DocumentVerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'UNCLEAR'
  | 'MISSING'
  | 'REJECTED';

export interface DocumentItem {
  id: string;
  applicationId: string;
  documentType: DocumentType;
  title: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  mimeType: string;
  uploadedAt: string;
  verificationStatus: DocumentVerificationStatus;
  officerComments?: string;
  ocrExtractedText?: string;
  ocrConfidence?: number;
  extractedIncome?: number;
  extractedName?: string;
  extractedAddress?: string;
  aiFlags?: string[];
}

export interface ApplicationHistoryItem {
  id: string;
  applicationId: string;
  officerId: string;
  officerName: string;
  officerRole: string;
  action: string;
  actionKannada: string;
  previousStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  comments: string;
  createdAt: string;
}

export interface AIReviewResult {
  id: string;
  applicationId: string;
  workflowStage: WorkflowStage;
  isLiveModel: boolean;
  modelUsed: string;
  summary: string;
  summaryKannada: string;
  recommendation: 'RECOMMEND_APPROVE' | 'RECOMMEND_RETURN' | 'RECOMMEND_INSPECTION' | 'NEEDS_OFFICER_REVIEW';
  recommendationText: string;
  recommendationTextKannada: string;
  checklist: {
    key: string;
    label: string;
    labelKannada: string;
    passed: boolean;
    details: string;
  }[];
  findings: {
    type: 'DISCREPANCY' | 'MISSING_DOC' | 'MATCH' | 'INFO';
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    titleKannada: string;
    description: string;
    descriptionKannada: string;
  }[];
  generatedAt: string;
}

export interface Application {
  id: string;
  applicationNumber: string; // e.g. RD00382910482
  applicantName: string;
  applicantFatherOrSpouse: string;
  mobile: string;
  aadhaarLastFour: string;
  address: string;
  district: string;
  taluk: string;
  hobli: string;
  village: string;
  pincode: string;
  declaredAnnualIncome: number;
  purpose: string;
  familyMembersCount: number;
  rationCardNumber?: string;
  status: ApplicationStatus;
  currentStage: WorkflowStage;
  priority: PriorityLevel;
  assignedOfficerId: string;
  assignedOfficerName: string;
  assignedOfficerRole: string;
  slaTargetDate: string;
  daysPending: number;
  submissionDate: string;
  updatedAt: string;
  decisionRemarks?: string;
  rejectionReason?: string;
  returnReason?: string;
  requiredCorrections?: string[];
  documents: DocumentItem[];
  history: ApplicationHistoryItem[];
  aiReviews?: AIReviewResult[];
  certificateNumber?: string;
  certificateIssuedAt?: string;
}

export interface OfficerUser {
  id: string;
  name: string;
  nameKannada: string;
  email: string;
  role: string;
  roleKannada: string;
  kgidNumber: string; // Karnataka Govt Insurance Dept / Employee ID
  district: string;
  taluk: string;
  officeLocation: string;
  avatarUrl?: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  urgentAttentionCount: number;
  approvedCount: number;
  rejectedCount: number;
  returnedCount: number;
  avgProcessingDays: number;
  slaComplianceRate: number;
}
