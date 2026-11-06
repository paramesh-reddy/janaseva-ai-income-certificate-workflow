import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Application } from '../../types';
import { PriorityBadge } from '../common/Badge';
import { AlertCircle, Clock, FileWarning, ArrowRight, UserCheck } from 'lucide-react';

interface PriorityApplicationsProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
}

export const PriorityApplications: React.FC<PriorityApplicationsProps> = ({
  applications,
  onSelectApplication
}) => {
  const { t, isKannada } = useLanguage();

  // Filter applications requiring urgent officer attention:
  // 1. Missing or unclear documents
  // 2. Pending > 3 days
  // 3. Flagged discrepancies
  // 4. Marked URGENT or HIGH
  const priorityList = applications.filter(app => {
    if (app.status === 'APPROVED' || app.status === 'REJECTED') return false;
    const hasUnclearDocs = app.documents.some(d => d.verificationStatus === 'UNCLEAR' || d.verificationStatus === 'MISSING');
    const hasDiscrepancy = app.documents.some(d => d.aiFlags && d.aiFlags.length > 0);
    const isOverdue = app.daysPending >= 4;
    const isUrgentPriority = app.priority === 'URGENT' || app.priority === 'HIGH';
    return hasUnclearDocs || hasDiscrepancy || isOverdue || isUrgentPriority;
  });

  if (priorityList.length === 0) {
    return null;
  }

  const getPriorityReason = (app: Application) => {
    const hasDiscrepancy = app.documents.some(d => d.aiFlags && d.aiFlags.length > 0);
    if (hasDiscrepancy) {
      return {
        label: t('reasonDiscrepancy'),
        icon: FileWarning,
        colorClass: 'text-amber-800 bg-amber-50 border-amber-200'
      };
    }
    const hasUnclearDocs = app.documents.some(d => d.verificationStatus === 'UNCLEAR' || d.verificationStatus === 'MISSING');
    if (hasUnclearDocs) {
      return {
        label: t('reasonMissingDocs'),
        icon: AlertCircle,
        colorClass: 'text-red-800 bg-red-50 border-red-200'
      };
    }
    if (app.daysPending >= 4) {
      return {
        label: `${t('reasonPendingDelay')} (${app.daysPending} ${t('daysUnit')})`,
        icon: Clock,
        colorClass: 'text-orange-800 bg-orange-50 border-orange-200'
      };
    }
    return {
      label: t('reasonNeedFieldReview'),
      icon: UserCheck,
      colorClass: 'text-blue-800 bg-blue-50 border-blue-200'
    };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
            {t('prioritySectionTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('prioritySectionSubtitle')}
          </p>
        </div>
        <span className="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200 w-fit">
          {priorityList.length} {isKannada ? 'ಅರ್ಜಿಗಳು ಕ್ರಮಕ್ಕೆ ಬಾಕಿ' : 'Applications in Priority Queue'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
        {priorityList.map(app => {
          const reasonInfo = getPriorityReason(app);
          const ReasonIcon = reasonInfo.icon;

          return (
            <div
              key={app.id}
              className="border border-slate-200 hover:border-slate-300 rounded-md p-3.5 bg-slate-50 hover:bg-white transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-[#0f2b5c]">
                    {app.applicationNumber}
                  </span>
                  <PriorityBadge priority={app.priority} />
                </div>

                <div className="font-semibold text-slate-900 text-sm mb-1">
                  {app.applicantName}
                </div>

                <div className="text-xs text-slate-500 mb-2">
                  {app.village}, {app.hobli} · ₹{app.declaredAnnualIncome.toLocaleString('en-IN')}
                </div>

                {/* Flag Reason */}
                <div className={`p-2 rounded border text-[11px] font-medium flex items-start gap-1.5 mb-3 ${reasonInfo.colorClass}`}>
                  <ReasonIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="leading-tight">{reasonInfo.label}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectApplication(app)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-[#0f2b5c] bg-white hover:bg-blue-50 border border-slate-300 rounded transition-colors"
              >
                <span>{t('processApplication')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
