import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Application, WorkflowStage, DocumentVerificationStatus, AIReviewResult } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { Stage1Submission } from './Stage1Submission';
import { Stage2DocVerification } from './Stage2DocVerification';
import { Stage3Eligibility } from './Stage3Eligibility';
import { Stage4Decision } from './Stage4Decision';
import { AIAssistantPanel } from './AIAssistantPanel';
import { AuditTimeline } from './AuditTimeline';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCheck,
  History,
  Sparkles
} from 'lucide-react';

interface ApplicationDetailProps {
  application: Application;
  onBack: () => void;
  onVerifyDocument: (docId: string, status: DocumentVerificationStatus, comments?: string) => Promise<void>;
  onAdvanceStage: (nextStage: WorkflowStage) => Promise<void>;
  onApprove: (remarks: string) => Promise<void>;
  onReject: (reason: string, remarks: string) => Promise<void>;
  onReturn: (reason: string, corrections: string[], remarks: string) => Promise<void>;
  onResubmitSimulation: () => Promise<void>;
}

export const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  application,
  onBack,
  onVerifyDocument,
  onAdvanceStage,
  onApprove,
  onReject,
  onReturn,
  onResubmitSimulation
}) => {
  const { t, isKannada } = useLanguage();
  const [activeStage, setActiveStage] = useState<WorkflowStage>(application.currentStage);
  const [activeTab, setActiveTab] = useState<'workflow' | 'history'>('workflow');

  const stages: { id: WorkflowStage; num: number; label: string }[] = [
    { id: 'APPLICATION_SUBMISSION', num: 1, label: t('stage1Name') },
    { id: 'DOCUMENT_VERIFICATION', num: 2, label: t('stage2Name') },
    { id: 'ELIGIBILITY_VERIFICATION', num: 3, label: t('stage3Name') },
    { id: 'FINAL_DECISION', num: 4, label: t('stage4Name') }
  ];

  const handleStageAdvance = async (nextStage: WorkflowStage) => {
    setActiveStage(nextStage);
    await onAdvanceStage(nextStage);
  };

  const handleReviewCompleted = (review: AIReviewResult) => {
    // Review saved into state
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0f2b5c] transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isKannada ? '← ಹಿಂದಿನ ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ' : '← Back to Applications List'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                activeTab === 'workflow' ? 'bg-white text-[#0f2b5c] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isKannada ? 'ಕಾರ್ಯಪ್ರವಾಹ ಹಂತಗಳು' : 'Workflow Stages'}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                activeTab === 'history' ? 'bg-white text-[#0f2b5c] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isKannada ? 'ಆಡಿಟ್ ಇತಿಹಾಸ' : 'Audit Trail'} ({application.history.length})
            </button>
          </div>
        </div>
      </div>

      {/* Application Master Header Card */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-base font-bold text-[#0f2b5c]">
                {application.applicationNumber}
              </span>
              <PriorityBadge priority={application.priority} />
              <StatusBadge status={application.status} />
            </div>

            <h1 className="text-xl font-bold text-slate-900">
              {application.applicantName}
            </h1>

            <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>
                {isKannada ? 'ತಂದೆ / ಪತಿ:' : 'S/o, W/o:'} {application.applicantFatherOrSpouse || '—'}
              </span>
              <span>•</span>
              <span>
                {application.village}, {application.hobli}, {application.taluk}
              </span>
              <span>•</span>
              <span className="tabular-nums">
                {isKannada ? 'ಸಲ್ಲಿಸಿದ ದಿನಾಂಕ:' : 'Submitted:'} {application.submissionDate}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-right shrink-0">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">
              {t('annualIncome')}
            </div>
            <div className="text-xl font-bold text-[#0f2b5c] tabular-nums">
              ₹{application.declaredAnnualIncome.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {application.purpose}
            </div>
          </div>
        </div>

        {/* 4-Stage Stepper Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-2">
          {stages.map((stg, idx) => {
            const isCurrent = activeStage === stg.id;
            const isCompleted =
              stg.id === 'APPLICATION_SUBMISSION'
                ? true
                : stg.id === 'DOCUMENT_VERIFICATION'
                ? application.documents.every(d => d.verificationStatus === 'VERIFIED')
                : stg.id === 'ELIGIBILITY_VERIFICATION'
                ? application.status === 'APPROVED' || application.status === 'REJECTED'
                : application.status === 'APPROVED';

            return (
              <button
                key={stg.id}
                onClick={() => {
                  setActiveStage(stg.id);
                  setActiveTab('workflow');
                }}
                className={`p-3 rounded border text-left transition-all ${
                  isCurrent
                    ? 'bg-blue-50/80 border-[#0f2b5c] shadow-2xs ring-1 ring-[#0f2b5c]'
                    : 'bg-slate-50 hover:bg-slate-100/60 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isCurrent ? 'text-[#0f2b5c]' : 'text-slate-500'
                  }`}>
                    {isKannada ? `ಹಂತ ೦${stg.num}` : `Stage 0${stg.num}`}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <div className={`text-xs font-semibold truncate ${
                  isCurrent ? 'text-[#0f2b5c]' : 'text-slate-800'
                }`}>
                  {stg.label.split(':')[1]?.trim() || stg.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout: Active Stage / History on Left, Contextual AI Assistant on Right */}
      {activeTab === 'history' ? (
        <AuditTimeline history={application.history} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Active Stage Body (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            {activeStage === 'APPLICATION_SUBMISSION' && (
              <Stage1Submission
                application={application}
                onAdvanceToNextStage={() => handleStageAdvance('DOCUMENT_VERIFICATION')}
              />
            )}

            {activeStage === 'DOCUMENT_VERIFICATION' && (
              <Stage2DocVerification
                application={application}
                onVerifyDocument={onVerifyDocument}
                onAdvanceToNextStage={() => handleStageAdvance('ELIGIBILITY_VERIFICATION')}
              />
            )}

            {activeStage === 'ELIGIBILITY_VERIFICATION' && (
              <Stage3Eligibility
                application={application}
                onAdvanceToNextStage={() => handleStageAdvance('FINAL_DECISION')}
              />
            )}

            {activeStage === 'FINAL_DECISION' && (
              <Stage4Decision
                application={application}
                onApprove={onApprove}
                onReject={onReject}
                onReturn={onReturn}
                onResubmitSimulation={onResubmitSimulation}
              />
            )}
          </div>

          {/* Contextual AI Assistant Panel (1 Column) */}
          <div className="space-y-6">
            <AIAssistantPanel
              application={application}
              currentStage={activeStage}
              onReviewCompleted={handleReviewCompleted}
            />

            {/* Quick Officer Audit Summary */}
            <div className="bg-white border border-slate-200 rounded-md p-4 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>{isKannada ? 'ಇತ್ತೀಚಿನ ಕಡತ ಚಟುವಟಿಕೆ' : 'Recent Case History'}</span>
              </h4>
              <div className="space-y-2 text-[11px]">
                {application.history.slice(-3).reverse().map((h, hIdx) => (
                  <div key={h.id || hIdx} className="pb-2 border-b border-slate-100 last:border-b-0">
                    <div className="font-semibold text-slate-900">
                      {isKannada ? h.actionKannada || h.action : h.action}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {h.officerName} · {h.createdAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
