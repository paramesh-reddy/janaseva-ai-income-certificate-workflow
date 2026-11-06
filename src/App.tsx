import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { StatCards } from './components/dashboard/StatCards';
import { PriorityApplications } from './components/dashboard/PriorityApplications';
import { ApplicationsTable } from './components/dashboard/ApplicationsTable';
import { ApplicationDetail } from './components/applications/ApplicationDetail';
import { NewApplicationModal } from './components/applications/NewApplicationModal';
import { ReportsView } from './components/reports/ReportsView';
import { ActivityHistoryView } from './components/history/ActivityHistoryView';
import { SettingsView } from './components/settings/SettingsView';
import { LoginView } from './components/auth/LoginView';
import { Application, DashboardStats, DocumentVerificationStatus, WorkflowStage } from './types';
import { api } from './services/api';
import { INITIAL_APPLICATIONS } from './services/mockData';
import { CheckCircle2, FileCheck2, Loader2 } from 'lucide-react';

function MainApp() {
  const { isKannada, t } = useLanguage();
  const { isAuthenticated, officer } = useAuth();

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: INITIAL_APPLICATIONS.length,
    pendingApplications: INITIAL_APPLICATIONS.filter(a => a.status === 'PENDING' || a.status === 'UNDER_VERIFICATION').length,
    urgentAttentionCount: INITIAL_APPLICATIONS.filter(a => a.priority === 'URGENT' || a.daysPending >= 4).length,
    approvedCount: INITIAL_APPLICATIONS.filter(a => a.status === 'APPROVED').length,
    rejectedCount: INITIAL_APPLICATIONS.filter(a => a.status === 'REJECTED').length,
    returnedCount: INITIAL_APPLICATIONS.filter(a => a.status === 'RETURNED').length,
    avgProcessingDays: 2.3,
    slaComplianceRate: 94.8
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load applications from API
  const loadData = async () => {
    setIsLoading(true);
    try {
      const apps = await api.getApplications();
      setApplications(apps);
      const st = await api.getDashboardStats();
      setStats(st);
      // Sync selected app if open
      if (selectedApplication) {
        const refreshed = apps.find(a => a.id === selectedApplication.id);
        if (refreshed) setSelectedApplication(refreshed);
      }
    } catch (e) {
      console.warn('Error loading applications', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Handle document verification
  const handleVerifyDocument = async (docId: string, status: DocumentVerificationStatus, comments?: string) => {
    if (!selectedApplication) return;
    const updated = await api.verifyDocument(selectedApplication.id, docId, status, comments);
    if (updated) {
      setSelectedApplication(updated);
      await loadData();
    }
  };

  // Handle stage advancement
  const handleAdvanceStage = async (nextStage: WorkflowStage) => {
    if (!selectedApplication) return;
    const updated = await api.advanceStage(selectedApplication.id, nextStage);
    if (updated) {
      setSelectedApplication(updated);
      await loadData();
    }
  };

  // Handle Approve
  const handleApprove = async (remarks: string) => {
    if (!selectedApplication) return;
    const updated = await api.approveApplication(
      selectedApplication.id,
      remarks,
      officer?.name || 'K. S. Manjunath'
    );
    if (updated) {
      setSelectedApplication(updated);
      await loadData();
    }
  };

  // Handle Reject
  const handleReject = async (reason: string, remarks: string) => {
    if (!selectedApplication) return;
    const updated = await api.rejectApplication(
      selectedApplication.id,
      reason,
      remarks,
      officer?.name || 'K. S. Manjunath'
    );
    if (updated) {
      setSelectedApplication(updated);
      await loadData();
    }
  };

  // Handle Return
  const handleReturn = async (reason: string, corrections: string[], remarks: string) => {
    if (!selectedApplication) return;
    const updated = await api.returnApplication(
      selectedApplication.id,
      reason,
      corrections,
      remarks,
      officer?.name || 'K. S. Manjunath'
    );
    if (updated) {
      setSelectedApplication(updated);
      await loadData();
    }
  };

  // Simulate citizen resubmission with updated documents
  const handleResubmitSimulation = async () => {
    if (!selectedApplication) return;
    // Add updated document to the application and move status to PENDING
    const updatedDocs = [...selectedApplication.documents];
    updatedDocs.push({
      id: `doc-resubmit-${Date.now()}`,
      applicationId: selectedApplication.id,
      documentType: 'RTC_PAHANI',
      title: 'Current Year 2026-27 Bhoomi RTC (Re-uploaded)',
      fileName: 'bhoomi_rtc_2026_27_signed.pdf',
      fileSize: '512 KB',
      mimeType: 'application/pdf',
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      verificationStatus: 'PENDING',
      ocrExtractedText: 'GOVERNMENT OF KARNATAKA - BHOOMI PORTAL\nFinancial Year: 2026-2027\nRTC Verified: Valid Land Extent 1.10 Acre Dry',
      ocrConfidence: 99
    });

    const updatedApp: Application = {
      ...selectedApplication,
      status: 'PENDING',
      currentStage: 'DOCUMENT_VERIFICATION',
      documents: updatedDocs,
      returnReason: undefined,
      requiredCorrections: [],
      history: [
        ...selectedApplication.history,
        {
          id: `hist-${Date.now()}`,
          applicationId: selectedApplication.id,
          officerId: 'citizen',
          officerName: selectedApplication.applicantName,
          officerRole: 'Citizen Applicant',
          action: 'Application Resubmitted with Corrected Documents',
          actionKannada: 'ನಾಗರಿಕರು ತಿದ್ದುಪಡಿ ದಾಖಲೆಗಳೊಂದಿಗೆ ಮರುಸಲ್ಲಿಸಿದರು',
          previousStatus: 'RETURNED',
          newStatus: 'PENDING',
          comments: 'Citizen attached 2026-27 Bhoomi RTC record for verification.',
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ]
    };

    setSelectedApplication(updatedApp);
    // Update local storage
    const all = applications.map(a => (a.id === updatedApp.id ? updatedApp : a));
    setApplications(all);
    localStorage.setItem('janaseva_applications_db_v1', JSON.stringify(all));
  };

  // Handle new application creation
  const handleCreateApplication = async (data: Partial<Application>) => {
    const created = await api.createApplication(data);
    await loadData();
    setSelectedApplication(created);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Header */}
      <Header
        applications={applications}
        onSelectApplication={app => {
          setSelectedApplication(app);
          setCurrentTab('applications');
        }}
        urgentCount={stats.urgentAttentionCount}
      />

      {/* Main Body with Persistent Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentTab={currentTab}
          onTabChange={tab => {
            setCurrentTab(tab);
            setSelectedApplication(null);
          }}
          onNewApplication={() => setIsNewAppModalOpen(true)}
          pendingCount={stats.pendingApplications}
          urgentCount={stats.urgentAttentionCount}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {selectedApplication ? (
            <ApplicationDetail
              application={selectedApplication}
              onBack={() => setSelectedApplication(null)}
              onVerifyDocument={handleVerifyDocument}
              onAdvanceStage={handleAdvanceStage}
              onApprove={handleApprove}
              onReject={handleReject}
              onReturn={handleReturn}
              onResubmitSimulation={handleResubmitSimulation}
            />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Dashboard Title & Quick Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                    <div>
                      <h1 className="text-xl font-bold text-[#0f2b5c]">
                        {isKannada ? 'ಕಂದಾಯ ಅಧಿಕಾರಿ ಕಾರ್ಯಸ್ಥಳ' : 'Revenue Officer Workspace'}
                      </h1>
                      <p className="text-xs text-slate-500">
                        {t('portalTitle')} · {t('talukOffice')}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsNewAppModalOpen(true)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0f2b5c] hover:bg-[#1a428a] rounded-md transition-colors shadow-xs w-fit"
                    >
                      {t('newApplicationBtn')}
                    </button>
                  </div>

                  {/* 1. Stat Cards */}
                  <StatCards stats={stats} />

                  {/* 2. Priority Applications Section */}
                  <PriorityApplications
                    applications={applications}
                    onSelectApplication={app => setSelectedApplication(app)}
                  />

                  {/* 3. Main Applications Table */}
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                      {isKannada ? 'ಸಮಗ್ರ ಅರ್ಜಿಗಳ ಪಟ್ಟಿ (Master Register)' : 'All Applications Register'}
                    </h2>
                    <ApplicationsTable
                      applications={applications}
                      onSelectApplication={app => setSelectedApplication(app)}
                      onNewApplication={() => setIsNewAppModalOpen(true)}
                    />
                  </div>
                </div>
              )}

              {currentTab === 'applications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-lg font-bold text-slate-900">
                        {t('navApplications')}
                      </h1>
                      <p className="text-xs text-slate-500">
                        {isKannada ? 'ಬೆಂಗಳೂರು ದಕ್ಷಿಣ ತಾಲೂಕಿನ ಎಲ್ಲಾ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಅರ್ಜಿಗಳು' : 'All incoming and processed income certificate applications'}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsNewAppModalOpen(true)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0f2b5c] hover:bg-[#1a428a] rounded shadow-xs"
                    >
                      {t('newApplicationBtn')}
                    </button>
                  </div>

                  <ApplicationsTable
                    applications={applications}
                    onSelectApplication={app => setSelectedApplication(app)}
                    onNewApplication={() => setIsNewAppModalOpen(true)}
                  />
                </div>
              )}

              {currentTab === 'docVerification' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
                    <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileCheck2 className="w-5 h-5 text-[#0f2b5c]" />
                      <span>{t('navDocVerification')}</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isKannada
                        ? 'ದಾಖಲೆ ಪರಿಶೀಲನೆ ಬಾಕಿ ಇರುವ ಅಥವಾ ಅಸ್ಪಷ್ಟತೆ ಹೊಂದಿರುವ ಅರ್ಜಿಗಳ ತ್ವರಿತ ಸರತಿ'
                        : 'Queue of applications pending document verification or OCR discrepancy clearance'}
                    </p>
                  </div>

                  <ApplicationsTable
                    applications={applications.filter(
                      a => a.currentStage === 'DOCUMENT_VERIFICATION' || a.status === 'PENDING'
                    )}
                    onSelectApplication={app => setSelectedApplication(app)}
                    onNewApplication={() => setIsNewAppModalOpen(true)}
                  />
                </div>
              )}

              {currentTab === 'reports' && (
                <ReportsView applications={applications} />
              )}

              {currentTab === 'history' && (
                <ActivityHistoryView
                  applications={applications}
                  onSelectApplication={app => setSelectedApplication(app)}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView onDataReset={loadData} />
              )}
            </>
          )}
        </main>
      </div>

      {/* New Application Creation Modal */}
      <NewApplicationModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
        onSubmit={handleCreateApplication}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
