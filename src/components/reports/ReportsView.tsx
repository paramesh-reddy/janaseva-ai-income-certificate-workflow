import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Application } from '../../types';
import { BarChart3, Clock, CheckCircle2, XCircle, RotateCcw, TrendingUp, ShieldCheck, Award } from 'lucide-react';

interface ReportsViewProps {
  applications: Application[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ applications }) => {
  const { t, isKannada } = useLanguage();

  const total = applications.length;
  const approved = applications.filter(a => a.status === 'APPROVED').length;
  const rejected = applications.filter(a => a.status === 'REJECTED').length;
  const returned = applications.filter(a => a.status === 'RETURNED').length;
  const pending = applications.filter(a => a.status === 'PENDING' || a.status === 'UNDER_VERIFICATION').length;

  // Stage breakdown
  const byStage = [
    {
      stage: isKannada ? 'ಹಂತ ೧: ಅರ್ಜಿ ಸಲ್ಲಿಕೆ' : 'Stage 1: Application Submission',
      count: applications.filter(a => a.currentStage === 'APPLICATION_SUBMISSION').length
    },
    {
      stage: isKannada ? 'ಹಂತ ೨: ದಾಖಲೆ ಪರಿಶೀಲನೆ' : 'Stage 2: Document Verification',
      count: applications.filter(a => a.currentStage === 'DOCUMENT_VERIFICATION').length
    },
    {
      stage: isKannada ? 'ಹಂತ ೩: ಅರ್ಹತಾ ಪರಿಶೀಲನೆ' : 'Stage 3: Eligibility Verification',
      count: applications.filter(a => a.currentStage === 'ELIGIBILITY_VERIFICATION').length
    },
    {
      stage: isKannada ? 'ಹಂತ ೪: ಅಂತಿಮ ನಿರ್ಧಾರ' : 'Stage 4: Final Decision Order',
      count: applications.filter(a => a.currentStage === 'FINAL_DECISION').length
    }
  ];

  return (
    <div className="space-y-6">
      {/* Reports Header */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0f2b5c]" />
              <span>{t('reportsTitle')}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('reportsSubtitle')}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 w-fit">
            Bengaluru South Taluk · FY 2026-27
          </span>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">
            {t('totalApplications')}
          </span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{total}</div>
          <div className="text-[11px] text-slate-500 mt-2">
            {isKannada ? 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ ಕಡತಗಳು' : 'Current Active Registry Cases'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">
            {t('approvedApplications')}
          </span>
          <div className="text-2xl font-bold text-emerald-800 tabular-nums">
            {approved} <span className="text-xs font-normal text-emerald-600">({total > 0 ? Math.round((approved / total) * 100) : 0}%)</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isKannada ? 'ಡಿಜಿಟಲ್ ಪ್ರಮಾಣಪತ್ರ ವಿತರಣೆ' : 'Digital Certificates Issued'}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">
            {t('returnedApplications')}
          </span>
          <div className="text-2xl font-bold text-amber-800 tabular-nums">
            {returned} <span className="text-xs font-normal text-amber-600">({total > 0 ? Math.round((returned / total) * 100) : 0}%)</span>
          </div>
          <div className="text-[11px] text-amber-700 mt-2 flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isKannada ? 'ತಿದ್ದುಪಡಿ ಸರಿಪಡಿಸಲು' : 'Returned for Corrections'}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">
            {t('rejectedApplications')}
          </span>
          <div className="text-2xl font-bold text-rose-800 tabular-nums">
            {rejected} <span className="text-xs font-normal text-rose-600">({total > 0 ? Math.round((rejected / total) * 100) : 0}%)</span>
          </div>
          <div className="text-[11px] text-rose-700 mt-2 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>{isKannada ? 'ಅನರ್ಹ ಅರ್ಜಿಗಳು' : 'Ineligible Under Rules'}</span>
          </div>
        </div>
      </div>

      {/* Stage Distribution & SLA Throughput */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Pendency Breakdown */}
        <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>{isKannada ? 'ಹಂತವಾರು ಬಾಕಿ ಅರ್ಜಿಗಳ ವಿವರ' : 'Applications by Workflow Stage'}</span>
            <span className="text-[11px] text-slate-400 font-mono">Count</span>
          </h3>

          <div className="space-y-3">
            {byStage.map((s, idx) => {
              const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{s.stage}</span>
                    <span className="font-mono text-slate-600 font-bold tabular-nums">
                      {s.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0f2b5c] h-full rounded-full transition-all"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Impact & Performance Metrics */}
        <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>{isKannada ? 'ಕಾರ್ಯಕ್ಷಮತೆ & ಸಕಾಲ ಪ್ರಗತಿ (Impact Metrics)' : 'Operational Impact & Sakala SLA Metrics'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{t('avgDaysToProcess')}</div>
                  <div className="text-[11px] text-slate-500">{t('sakalaTarget')}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-800 tabular-nums">2.3 {t('daysUnit')}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">67% {isKannada ? 'ವೇಗ' : 'Faster'}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">
                    {isKannada ? 'ದಾಖಲೆ ಪರಿಶೀಲನಾ ಸಮಯ ಇಳಿಕೆ' : 'Reduction in Manual Checking Time'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isKannada ? 'AI OCR ಸ್ವಯಂಚಾಲಿತ ಪಠ್ಯ ಹೊರತೆಗೆಯುವಿಕೆ' : 'Assisted by algorithmic OCR'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-900 tabular-nums">42%</div>
                  <div className="text-[10px] text-blue-600 font-medium">{isKannada ? 'ಸಮಯ ಉಳಿತಾಯ' : 'Time Saved'}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">
                    {isKannada ? 'ಆರಂಭಿಕ ಹಂತದಲ್ಲೇ ದಾಖಲೆ ಕೊರತೆ ಪತ್ತೆ' : 'Early Missing Document Detection'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isKannada ? 'ಅರ್ಜಿ ಸಲ್ಲಿಕೆಯಾದ ೨೪ ಗಂಟೆಗಳಲ್ಲಿ' : 'Within first 24 hours of intake'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-900 tabular-nums">89%</div>
                  <div className="text-[10px] text-purple-600 font-medium">{isKannada ? 'ಪತ್ತೆ ದರ' : 'Early Detection'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isKannada
                ? 'ಕರ್ನಾಟಕ ಸಕಾಲ ಕಾಯ್ದೆ ೨೦೧೧ ರ ಅನ್ವಯ ೭ ದಿನಗಳೊಳಗೆ ಸೇವೆ ಒದಗಿಸುವುದು ಕಡ್ಡಾಯ.'
                : 'Under Karnataka Sakala Act 2011, statutory disposal guarantee is 7 working days.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
