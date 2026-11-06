/**
 * Bilingual localization (Kannada & English)
 * Karnataka Government Janaseva AI Workflow System
 */

export type Language = 'kn' | 'en';

export const translations = {
  kn: {
    // App Header & Branding
    appName: 'ಜನಸೇವ AI',
    appSubtitle: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ · ಕಂದಾಯ ಇಲಾಖೆ',
    portalTitle: 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಕಾರ್ಯಪ್ರವಾಹ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ',
    demoModeBadge: 'ಪರೀಕ್ಷಾರ್ಥ ಡೆಮೊ ಆವೃತ್ತಿ',
    searchPlaceholder: 'ಅರ್ಜಿ ಸಂಖ್ಯೆ (RD...) ಅಥವಾ ಅರ್ಜಿದಾರರ ಹೆಸರು ಹುಡುಕಿ...',
    notifications: 'ಸೂಚನೆಗಳು',
    profile: 'ಅಧಿಕಾರಿ ಪ್ರೊಫೈಲ್',
    logout: 'ನಿರ್ಗಮಿಸಿ',
    officerBadge: 'ಕಂದಾಯ ನಿರೀಕ್ಷಕರು (RI)',
    talukOffice: 'ಬೆಂಗಳೂರು ದಕ್ಷಿಣ ತಾಲೂಕು ಕಚೇರಿ',

    // Navigation
    navDashboard: 'ಡ್ಯಾಶ್ಬೋರ್ಡ್',
    navApplications: 'ಅರ್ಜಿಗಳು',
    navDocVerification: 'ದಾಖಲೆ ಪರಿಶೀಲನೆ',
    navReports: 'ವರದಿಗಳು',
    navHistory: 'ಚಟುವಟಿಕೆ ಇತಿಹಾಸ',
    navSettings: 'ಸೆಟ್ಟಿಂಗ್ಸ್ & ನಿಯಮಾವಳಿ',

    // Dashboard Stats
    totalApplications: 'ಒಟ್ಟು ಅರ್ಜಿಗಳು',
    pendingApplications: 'ಬಾಕಿ ಇರುವ ಅರ್ಜಿಗಳು',
    urgentAttention: 'ತುರ್ತು ಗಮನ ಅಗತ್ಯವಿರುವ ಅರ್ಜಿಗಳು',
    approvedApplications: 'ಅನುಮೋದಿತ ಅರ್ಜಿಗಳು',
    rejectedApplications: 'ತಿರಸ್ಕೃತ ಅರ್ಜಿಗಳು',
    returnedApplications: 'ಹಿಂತಿರುಗಿಸಲಾದ ಅರ್ಜಿಗಳು',
    avgProcessingTime: 'ಸರಾಸರಿ ವಿಲೇವಾರಿ ಸಮಯ',
    slaCompliance: 'ಸಕಾಲ ನಿಗದಿತ ಸಮಯ ಪಾಲನೆ',
    daysUnit: 'ದಿನಗಳು',

    // Priority Section
    prioritySectionTitle: 'ತುರ್ತು ಗಮನ ನೀಡಬೇಕಾದ ಅರ್ಜಿಗಳು (Priority Applications)',
    prioritySectionSubtitle: 'ದಾಖಲೆ ಕೊರತೆ, ವಿಳಂಬ ಅಥವಾ ತಪಾಸಣೆ ಅಗತ್ಯವಿರುವ ಅರ್ಜಿಗಳು',
    reasonMissingDocs: 'ಪ್ರಮುಖ ದಾಖಲೆಗಳು ಲಭ್ಯವಿಲ್ಲ',
    reasonPendingDelay: 'ಸಕಾಲ ನಿಗದಿತ ಅವಧಿ ಮೀರುತ್ತಿದೆ (5+ ದಿನಗಳು)',
    reasonDiscrepancy: 'ಆದಾಯ ವಿವರಗಳಲ್ಲಿ ವ್ಯತ್ಯಾಸ ಪತ್ತೆಯಾಗಿದೆ',
    reasonNeedFieldReview: 'ಗ್ರಾಮ ಆಡಳಿತಾಧಿಕಾರಿ (VA) ಕ್ಷೇತ್ರ ತನಿಖೆ ಅಗತ್ಯ',

    // Statuses
    statusAll: 'ಎಲ್ಲಾ ಅರ್ಜಿಗಳು',
    statusPending: 'ಬಾಕಿ',
    statusUnderVerification: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    statusApproved: 'ಅನುಮೋದಿಸಲಾಗಿದೆ',
    statusRejected: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
    statusReturned: 'ಹಿಂತಿರುಗಿಸಲಾಗಿದೆ',

    // Stages
    stage1Name: 'ಹಂತ ೧: ಅರ್ಜಿ ಸಲ್ಲಿಕೆ',
    stage2Name: 'ಹಂತ ೨: ದಾಖಲೆ ಪರಿಶೀಲನೆ',
    stage3Name: 'ಹಂತ ೩: ಅರ್ಹತಾ ಪರಿಶೀಲನೆ',
    stage4Name: 'ಹಂತ ೪: ಅಂತಿಮ ನಿರ್ಧಾರ',

    // Table Headers
    colAppId: 'ಅರ್ಜಿ ಸಂಖ್ಯೆ',
    colApplicant: 'ಅರ್ಜಿದಾರರ ಹೆಸರು',
    colDate: 'ಅರ್ಜಿ ದಿನಾಂಕ',
    colStage: 'ಪ್ರಸ್ತುತ ಹಂತ',
    colPriority: 'ಆದ್ಯತೆ',
    colStatus: 'ಸ್ಥಿತಿ',
    colOfficer: 'ನಿಯೋಜಿತ ಅಧಿಕಾರಿ',
    colAction: 'ಕ್ರಮ',
    viewDetails: 'ವಿವರ ನೋಡಿ',
    processApplication: 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿ',

    // Priority labels
    priorityUrgent: 'ತುರ್ತು',
    priorityHigh: 'ಹೆಚ್ಚಿನ',
    priorityMedium: 'ಸಾಮಾನ್ಯ',
    priorityNormal: 'ಸಾಧಾರಣ',

    // Application Form / Details
    newApplicationBtn: '+ ಹೊಸ ಅರ್ಜಿ ನೋಂದಣಿ',
    applicantDetails: 'ಅರ್ಜಿದಾರರ ವಿವರಗಳು',
    fatherOrSpouse: 'ತಂದೆ / ಪತಿಯ ಹೆಸರು',
    mobileNumber: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    aadhaarNumber: 'ಆಧಾರ್ ಸಂಖ್ಯೆ (ಕೊನೆಯ ೪ ಅಂಕಿಗಳು)',
    address: 'ವಿಳಾಸ',
    district: 'ಜಿಲ್ಲೆ',
    taluk: 'ತಾಲೂಕು',
    hobli: 'ಹೋಬಳಿ',
    village: 'ಗ್ರಾಮ / ವಾರ್ಡ್',
    annualIncome: 'ಘೋಷಿತ ವಾರ್ಷಿಕ ಆದಾಯ',
    purposeOfCert: 'ಪ್ರಮಾಣಪತ್ರದ ಉದ್ದೇಶ',
    familyMembers: 'ಕುಟುಂಬದ ಸದಸ್ಯರ ಸಂಖ್ಯೆ',
    rationCardNo: 'ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ (BPL/APL)',
    slaTarget: 'ಸಕಾಲ ಅಂತಿಮ ದಿನಾಂಕ',
    daysInQueue: 'ಸರತಿಯಲ್ಲಿ ಕಳೆದ ದಿನಗಳು',

    // Purposes
    purposeScholarship: 'ಶೈಕ್ಷಣಿಕ ವಿದ್ಯಾರ್ಥಿವೇತನ (SSP/NSP)',
    purposeHousing: 'ಸರ್ಕಾರಿ ವಸತಿ ಯೋಜನೆ (ಆಶ್ರಯ/ವಾಜಪೇಯಿ)',
    purposeFeeConcession: 'ಕಾಲೇಜು ಶುಲ್ಕ ರಿಯಾಯಿತಿ',
    purposeRationCard: 'ಪಡಿತರ ಚೀಟಿ ತಿದ್ದುಪಡಿ / ಹೊಸ ಚೀಟಿ',
    purposeOldAgePension: 'ಸಾಮಾಜಿಕ ಭದ್ರತಾ ಪಿಂಚಣಿ (ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ)',
    purposeGeneral: 'ಇತರ ಸಾಮಾನ್ಯ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯ',

    // Document Verification
    uploadedDocuments: 'ಸಲ್ಲಿಸಲಾದ ದಾಖಲೆಗಳು',
    docType: 'ದಾಖಲೆಯ ಪ್ರಕಾರ',
    fileName: 'ಕಡತದ ಹೆಸರು',
    uploadDate: 'ಅಪ್‌ಲೋಡ್ ದಿನಾಂಕ',
    verificationStatus: 'ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ',
    actionPreview: 'ಮುನ್ನೋಟ',
    actionVerify: 'ಪರಿಶೀಲಿಸಿ ಖಚಿತಪಡಿಸಿ',
    actionMarkUnclear: 'ಅಸ್ಪಷ್ಟವೆಂದು ಗುರುತಿಸಿ',
    actionMarkMissing: 'ಕಾಣೆಯಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    addComment: 'ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ',
    docAadhaar: 'ಆಧಾರ್ ಗುರುತಿನ ಚೀಟಿ',
    docIncomeProof: 'ಆದಾಯ ದೃಢೀಕರಣ ಪತ್ರ / ವೇತನ ಪ್ರಮಾಣಪತ್ರ',
    docRationCard: 'ಪಡಿತರ ಚೀಟಿ (BPL/AAY)',
    docRtcPahani: 'ಭೂಮಿ ಪಹಣಿ (RTC)',
    docSalarySlip: 'ವೇತನ ಚೀಟಿ (Salary Slip)',
    docSelfAffidavit: 'ಸ್ವಯಂ ಘೋಷಣಾ ಪ್ರಮಾಣಪತ್ರ (Affidavit)',

    // AI Assistant Panel
    aiAssistantTitle: 'ಜನಸೇವ AI ಸಹಾಯಕ (ಸಹಾಯಕಿ)',
    aiAssistantNotice: 'ಗಮನಿಸಿ: AI ಸಲಹಾತ್ಮಕವಾಗಿ ಮಾತ್ರ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ. ಯಾವುದೇ ಅಂತಿಮ ನಿರ್ಧಾರವನ್ನು ಸರ್ಕಾರಿ ಅಧಿಕಾರಿಯೇ ತೆಗೆದುಕೊಳ್ಳಬೇಕು.',
    aiModelLive: 'ಲೈವ್ AI ಮಾದರಿ ಸಂಪರ್ಕಿತವಾಗಿದೆ',
    aiModelDemo: 'ಡೆಮೊ ವಿಶ್ಲೇಷಣಾ ಮಾದರಿ (Deterministic Mode)',
    aiRunAnalysis: 'ದಾಖಲೆಗಳ AI ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ',
    aiRunningAnalysis: 'AI ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದೆ...',
    aiDiscrepancyFound: 'ವ್ಯತ್ಯಾಸಗಳು ಪತ್ತೆಯಾಗಿವೆ',
    aiVerificationChecklist: 'ಅಧಿಕಾರಿಯ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ (AI Checklist)',
    aiPreliminaryRec: 'AI ಪೂರ್ವಭಾವಿ ಶಿಫಾರಸು',
    aiLegalDisclaimer: 'ಈ ವಿಶ್ಲೇಷಣೆಯು ಅಲ್ಗಾರಿದಮಿಕ್ OCR ಆಧಾರಿತವಾಗಿದೆ; ಕಂದಾಯ ಕಾಯ್ದೆಯನ್ವಯ ಕಾನೂನುಬದ್ಧ ನಿರ್ಧಾರಕ್ಕೆ ಅಧಿಕಾರಿಯ ಪರಿಶೀಲನೆ ಕಡ್ಡಾಯ.',

    // Decisions
    decisionActions: 'ಅಂತಿಮ ಆದೇಶ & ಕ್ರಮಗಳು',
    btnApprove: 'ಅನುಮೋದಿಸಿ (Approve)',
    btnReject: 'ತಿರಸ್ಕರಿಸಿ (Reject)',
    btnReturn: 'ತಿದ್ದುಪಡಿಗೆ ಹಿಂತಿರುಗಿಸಿ (Return for Correction)',
    officerRemarks: 'ಅಧಿಕಾರಿಯ ಅಧಿಕೃತ ಟಿಪ್ಪಣಿಗಳು / ಷರಾ',
    remarksPlaceholder: 'ಅರ್ಜಿಯ ಕುರಿತು ತನಿಖಾ ವರದಿ ಮತ್ತು ನಿರ್ಧಾರದ ಕಾರಣವನ್ನು ಇಲ್ಲಿ ನಮೂದಿಸಿ...',
    rejectionReasonLabel: 'ತಿರಸ್ಕಾರಕ್ಕೆ ನಿಖರ ಕಾರಣ ಆಯ್ಕೆಮಾಡಿ',
    returnReasonLabel: 'ಹಿಂತಿರುಗಿಸಲು ಕಾರಣ ಮತ್ತು ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು',
    confirmAction: 'ಖಚಿತಪಡಿಸಿ',
    cancel: 'ರದ್ದುಗೊಳಿಸಿ',
    digitalSignNotice: 'ನಿರ್ಧಾರ ದಾಖಲಿಸಿದ ನಂತರ, ಇಲಾಖೆಯ ಲೆಡ್ಜರ್‌ನಲ್ಲಿ ಡಿಜಿಟಲ್ ಆಡಿಟ್ ಟ್ರಯಲ್ ಸೃಷ್ಟಿಯಾಗುತ್ತದೆ.',
    viewCertificate: 'ಅಧಿಕೃತ ಪ್ರಮಾಣಪತ್ರ ವೀಕ್ಷಿಸಿ / ಡೌನ್‌ಲೋಡ್',

    // Reasons for rejection
    reasonIncomeExceeds: 'ಘೋಷಿತ ಆದಾಯವು ಸರ್ಕಾರದ ನಿಗದಿತ ಮಿತಿಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ',
    reasonFakeDocs: 'ಸಲ್ಲಿಸಿದ ದಾಖಲೆಗಳು ನಕಲಿ ಅಥವಾ ಅಮಾನ್ಯವಾಗಿವೆ',
    reasonJurisdiction: 'ಅರ್ಜಿದಾರರ ವಿಳಾಸವು ಈ ಕಂದಾಯ ಹೋಬಳಿ ವ್ಯಾಪ್ತಿಗೆ ಬರುವುದಿಲ್ಲ',
    reasonDuplicate: 'ಈಗಾಗಲೇ ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಸಕ್ರಿಯ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಲಭ್ಯವಿದೆ',

    // Reasons for return
    returnReasonBlur: 'ಸಲ್ಲಿಸಿದ ದಾಖಲೆಗಳ ಛಾಯಾಚಿತ್ರಗಳು ಓದಲು ಅಸ್ಪಷ್ಟವಾಗಿವೆ',
    returnReasonIncompleteRtc: 'ಪ್ರಸ್ತುತ ಸಾಲಿನ ಆರ್.ಟಿ.ಸಿ (RTC/ಪಹಣಿ) ದಾಖಲೆ ಲಗತ್ತಿಸಿಲ್ಲ',
    returnReasonFamilyDecl: 'ಕುಟುಂಬದ ಇತರ ಸದಸ್ಯರ ಆದಾಯ ಘೋಷಣಾ ಪತ್ರ ಅಪೂರ್ಣವಾಗಿದೆ',

    // History
    historyTitle: 'ಅರ್ಜಿ ಪ್ರಕ್ರಿಯೆಯ ಸಂಪೂರ್ಣ ಇತಿಹಾಸ (Audit Trail)',
    historySubtitle: 'ಪ್ರತಿಯೊಂದು ಕ್ರಮ, ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಅಧಿಕಾರಿಯ ಗುರುತು',
    actionCreated: 'ಅರ್ಜಿ ಸಲ್ಲಿಕೆಯಾಯಿತು',
    actionDocVerified: 'ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಯಿತು',
    actionAiReview: 'AI ದಾಖಲೆ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಲಾಯಿತು',
    actionReturned: 'ಅರ್ಜಿಯನ್ನು ನಾಗರಿಕರಿಗೆ ಹಿಂತಿರುಗಿಸಲಾಯಿತು',
    actionResubmitted: 'ನಾಗರಿಕರು ತಿದ್ದುಪಡಿ ದಾಖಲೆಗಳೊಂದಿಗೆ ಮರುಸಲ್ಲಿಸಿದರು',
    actionApproved: 'ಅಧಿಕಾರಿಯಿಂದ ಅನುಮೋದನೆ ನೀಡಲಾಯಿತು',
    actionRejected: 'ಅರ್ಜಿಯನ್ನು ತಿರಸ್ಕರಿಸಲಾಯಿತು',

    // Reports
    reportsTitle: 'ಕಂದಾಯ ವರದಿಗಳು & ವಿಶ್ಲೇಷಣೆ',
    reportsSubtitle: 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ವಿಲೇವಾರಿ ದರ ಮತ್ತು ಸಕಾಲ ಪಾಲನೆ ವರದಿ',
    talukPerformance: 'ತಾಲೂಕುವಾರು ಅರ್ಜಿಗಳ ಸ್ಥಿತಿ',
    avgDaysToProcess: 'ಸರಾಸರಿ ವಿಲೇವಾರಿ ಅವಧಿ (ದಿನಗಳು)',
    sakalaTarget: 'ಸಕಾಲ ನಿಗದಿತ ಗರಿಷ್ಠ ಅವಧಿ: ೭ ದಿನಗಳು',

    // Login
    loginTitle: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ · ಕಂದಾಯ ಇಲಾಖೆ',
    loginSubtitle: 'ಜನಸೇವ AI - ಅಧಿಕಾರಿ ಲಾಗಿನ್ ಪೋರ್ಟಲ್',
    officerEmail: 'ಅಧಿಕಾರಿಯ ಇಮೇಲ್ ಐಡಿ / KGID',
    officerPassword: 'ಪಾಸ್‌ವರ್ಡ್',
    loginBtn: 'ಲಾಗಿನ್ ಮಾಡಿ',
    quickDemoLogin: 'ಪರೀಕ್ಷಾರ್ಥ ಡೆಮೊ ಲಾಗಿನ್ (ತ್ವರಿತ ಪ್ರವೇಶ)',
    securityNotice: 'ಅನಧಿಕೃತ ಪ್ರವೇಶವು ಕರ್ನಾಟಕ ಸೈಬರ್ ಭದ್ರತಾ ಕಾಯ್ದೆಯಡಿ ಶಿಕ್ಷಾರ್ಹ ಅಪರಾಧವಾಗಿದೆ.',

    // Common
    save: 'ಉಳಿಸಿ',
    close: 'ಮುಚ್ಚಿ',
    print: 'ಮುದ್ರಿಸಿ',
    downloadPdf: 'PDF ಡೌನ್‌ಲೋಡ್',
    success: 'ಯಶಸ್ವಿಯಾಗಿದೆ',
    error: 'ದೋಷ ಸಂಭವಿಸಿದೆ',
    search: 'ಹುಡುಕಿ',
    filter: 'ಫಿಲ್ಟರ್',
    reset: 'ಮರುಹೊಂದಿಸಿ',
    yes: 'ಹೌದು',
    no: 'ಇಲ್ಲ'
  },
  en: {
    // App Header & Branding
    appName: 'Janaseva AI',
    appSubtitle: 'Government of Karnataka · Revenue Department',
    portalTitle: 'Income Certificate Workflow Management System',
    demoModeBadge: 'Testing Demo Mode',
    searchPlaceholder: 'Search by Application ID (RD...) or Applicant Name...',
    notifications: 'Notifications',
    profile: 'Officer Profile',
    logout: 'Logout',
    officerBadge: 'Revenue Inspector (RI)',
    talukOffice: 'Bengaluru South Taluk Office',

    // Navigation
    navDashboard: 'Dashboard',
    navApplications: 'Applications',
    navDocVerification: 'Document Verification',
    navReports: 'Reports',
    navHistory: 'Activity History',
    navSettings: 'Settings & Policy Rules',

    // Dashboard Stats
    totalApplications: 'Total Applications',
    pendingApplications: 'Pending Applications',
    urgentAttention: 'Applications Requiring Urgent Attention',
    approvedApplications: 'Approved Applications',
    rejectedApplications: 'Rejected Applications',
    returnedApplications: 'Returned Applications',
    avgProcessingTime: 'Avg Processing Time',
    slaCompliance: 'Sakala SLA Compliance',
    daysUnit: 'days',

    // Priority Section
    prioritySectionTitle: 'Priority Applications Requiring Attention',
    prioritySectionSubtitle: 'Applications with missing documents, pending delays, or discrepancy flags',
    reasonMissingDocs: 'Mandatory supporting documents missing',
    reasonPendingDelay: 'Exceeding Sakala SLA threshold (5+ days in queue)',
    reasonDiscrepancy: 'Income disparity detected between proof and declaration',
    reasonNeedFieldReview: 'Village Accountant (VA) physical spot inspection recommended',

    // Statuses
    statusAll: 'All Applications',
    statusPending: 'Pending',
    statusUnderVerification: 'Under Verification',
    statusApproved: 'Approved',
    statusRejected: 'Rejected',
    statusReturned: 'Returned',

    // Stages
    stage1Name: 'Stage 1: Application Submission',
    stage2Name: 'Stage 2: Document Verification',
    stage3Name: 'Stage 3: Eligibility Verification',
    stage4Name: 'Stage 4: Final Decision',

    // Table Headers
    colAppId: 'Application ID',
    colApplicant: 'Applicant Name',
    colDate: 'Submission Date',
    colStage: 'Current Stage',
    colPriority: 'Priority',
    colStatus: 'Status',
    colOfficer: 'Assigned Officer',
    colAction: 'Action',
    viewDetails: 'View Details',
    processApplication: 'Process',

    // Priority labels
    priorityUrgent: 'Urgent',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityNormal: 'Normal',

    // Application Form / Details
    newApplicationBtn: '+ New Application Submission',
    applicantDetails: 'Applicant Details',
    fatherOrSpouse: 'Father / Spouse Name',
    mobileNumber: 'Mobile Number',
    aadhaarNumber: 'Aadhaar (Last 4 Digits)',
    address: 'Residential Address',
    district: 'District',
    taluk: 'Taluk',
    hobli: 'Hobli',
    village: 'Village / Ward',
    annualIncome: 'Declared Annual Family Income',
    purposeOfCert: 'Purpose of Certificate',
    familyMembers: 'Family Members Count',
    rationCardNo: 'Ration Card Number (BPL/APL)',
    slaTarget: 'Sakala Target Deadline',
    daysInQueue: 'Days in Queue',

    // Purposes
    purposeScholarship: 'Educational Scholarship (SSP/NSP)',
    purposeHousing: 'Government Housing Scheme (Ashraya/Vajpayee)',
    purposeFeeConcession: 'College Tuition Fee Concession',
    purposeRationCard: 'Ration Card Modification / Issue',
    purposeOldAgePension: 'Social Security Pension (Sandhya Suraksha)',
    purposeGeneral: 'General Government Welfare Schemes',

    // Document Verification
    uploadedDocuments: 'Submitted Supporting Documents',
    docType: 'Document Type',
    fileName: 'File Name',
    uploadDate: 'Uploaded Date',
    verificationStatus: 'Verification Status',
    actionPreview: 'Preview Document',
    actionVerify: 'Mark as Verified',
    actionMarkUnclear: 'Mark as Unclear',
    actionMarkMissing: 'Mark as Missing',
    addComment: 'Add Officer Comment',
    docAadhaar: 'Aadhaar Identity Card',
    docIncomeProof: 'Income Certificate / Salary Certificate',
    docRationCard: 'Ration Card (BPL/AAY)',
    docRtcPahani: 'Land RTC / Pahani',
    docSalarySlip: 'Salary Slip / Employer Letter',
    docSelfAffidavit: 'Self-Declaration Affidavit',

    // AI Assistant Panel
    aiAssistantTitle: 'Janaseva AI Officer Assistant',
    aiAssistantNotice: 'Notice: AI provides assistive intelligence only. All final administrative decisions must be executed by an authorized human officer.',
    aiModelLive: 'Live Gemini AI Model Connected',
    aiModelDemo: 'Deterministic Demo Analysis Mode',
    aiRunAnalysis: 'Run AI Document & Discrepancy Review',
    aiRunningAnalysis: 'AI is analyzing documents & extracted data...',
    aiDiscrepancyFound: 'Discrepancies & Flags Detected',
    aiVerificationChecklist: 'Officer Verification Checklist (AI Generated)',
    aiPreliminaryRec: 'AI Preliminary Review Recommendation',
    aiLegalDisclaimer: 'Extracted findings are algorithmic OCR aids and do not constitute legal verification under the Karnataka Land Revenue Act.',

    // Decisions
    decisionActions: 'Official Decision & Orders',
    btnApprove: 'Approve Application',
    btnReject: 'Reject Application',
    btnReturn: 'Return for Correction',
    officerRemarks: 'Official Order Remarks / Inspection Notes',
    remarksPlaceholder: 'Enter official verification findings and reason for decision...',
    rejectionReasonLabel: 'Select primary ground for rejection',
    returnReasonLabel: 'Specify required corrections and missing documents',
    confirmAction: 'Confirm Action',
    cancel: 'Cancel',
    digitalSignNotice: 'Submitting this decision applies a digital audit timestamp and records your KGID officer credentials to the official state ledger.',
    viewCertificate: 'View / Download Official Certificate',

    // Reasons for rejection
    reasonIncomeExceeds: 'Verified family income exceeds government ceiling for specified scheme',
    reasonFakeDocs: 'Submitted supporting documents appear forged, invalid, or unverified',
    reasonJurisdiction: 'Applicant residence falls outside this revenue hobli jurisdiction',
    reasonDuplicate: 'An active valid income certificate already exists in Nada Kacheri registry',

    // Reasons for return
    returnReasonBlur: 'Uploaded document images are illegible, cropped, or blurred',
    returnReasonIncompleteRtc: 'Current financial year RTC / Pahani land record not enclosed',
    returnReasonFamilyDecl: 'Earning member family declaration form is incomplete',

    // History
    historyTitle: 'Complete Application History & Audit Trail',
    historySubtitle: 'Tamper-evident record of all officer actions, timestamps, and stage transitions',
    actionCreated: 'Application Created',
    actionDocVerified: 'Documents Verified by Officer',
    actionAiReview: 'AI Verification Analysis Executed',
    actionReturned: 'Application Returned to Citizen for Correction',
    actionResubmitted: 'Application Resubmitted with Corrected Documents',
    actionApproved: 'Application Formally Approved by Officer',
    actionRejected: 'Application Formally Rejected by Officer',

    // Reports
    reportsTitle: 'Revenue Department Workflow Reports',
    reportsSubtitle: 'Income certificate throughput, pendency statistics, and Sakala SLA compliance',
    talukPerformance: 'Taluk-wise Application Distribution',
    avgDaysToProcess: 'Average Processing Duration (Days)',
    sakalaTarget: 'Sakala Statutory SLA Target: 7 Days',

    // Login
    loginTitle: 'Government of Karnataka · Revenue Department',
    loginSubtitle: 'Janaseva AI - Officer Workflow Portal',
    officerEmail: 'Officer Email / KGID Number',
    officerPassword: 'Password',
    loginBtn: 'Sign In to Portal',
    quickDemoLogin: 'Quick Demo Officer Login (One Click)',
    securityNotice: 'Authorized government personnel only. Unauthorized access is punishable under the IT Act.',

    // Common
    save: 'Save',
    close: 'Close',
    print: 'Print',
    downloadPdf: 'Download PDF',
    success: 'Success',
    error: 'Error occurred',
    search: 'Search',
    filter: 'Filter',
    reset: 'Reset',
    yes: 'Yes',
    no: 'No'
  }
};
