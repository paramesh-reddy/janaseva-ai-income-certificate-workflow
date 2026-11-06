import React from 'react';
import { ApplicationStatus, PriorityLevel, WorkflowStage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const { t } = useLanguage();

  switch (status) {
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded text-emerald-800 bg-emerald-50 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          {t('statusApproved')}
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded text-rose-800 bg-rose-50 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
          {t('statusRejected')}
        </span>
      );
    case 'RETURNED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded text-amber-800 bg-amber-50 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          {t('statusReturned')}
        </span>
      );
    case 'UNDER_VERIFICATION':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded text-blue-800 bg-blue-50 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          {t('statusUnderVerification')}
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded text-slate-800 bg-slate-100 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          {t('statusPending')}
        </span>
      );
  }
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  const { t } = useLanguage();

  switch (priority) {
    case 'URGENT':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded text-red-700 bg-red-50 border border-red-200">
          {t('priorityUrgent')}
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded text-orange-700 bg-orange-50 border border-orange-200">
          {t('priorityHigh')}
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded text-blue-700 bg-blue-50 border border-blue-200">
          {t('priorityMedium')}
        </span>
      );
    case 'NORMAL':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded text-slate-600 bg-slate-50 border border-slate-200">
          {t('priorityNormal')}
        </span>
      );
  }
};

export const StageBadge: React.FC<{ stage: WorkflowStage }> = ({ stage }) => {
  const { t } = useLanguage();

  const labels: Record<WorkflowStage, string> = {
    APPLICATION_SUBMISSION: t('stage1Name'),
    DOCUMENT_VERIFICATION: t('stage2Name'),
    ELIGIBILITY_VERIFICATION: t('stage3Name'),
    FINAL_DECISION: t('stage4Name')
  };

  return (
    <span className="text-xs font-medium text-slate-700">
      {labels[stage] || stage}
    </span>
  );
};
