import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ApplicationHistoryItem } from '../../types';
import { History, Shield, User, Clock, ArrowRight } from 'lucide-react';

interface AuditTimelineProps {
  history: ApplicationHistoryItem[];
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ history }) => {
  const { t, isKannada } = useLanguage();

  if (!history || history.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-md p-6 text-center text-xs text-slate-500">
        {isKannada ? 'ಯಾವುದೇ ಇತಿಹಾಸ ದಾಖಲೆಗಳು ಲಭ್ಯವಿಲ್ಲ' : 'No history audit records available'}
      </div>
    );
  }

  // Sort history newest first for display
  const sortedHistory = [...history].reverse();

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <History className="w-4 h-4 text-[#0f2b5c]" />
            <span>{t('historyTitle')}</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {t('historySubtitle')}
          </p>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          TAMPER-EVIDENT LOG
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {sortedHistory.map((item, idx) => (
          <div key={item.id || idx} className="relative group">
            {/* Dot marker */}
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#0f2b5c] border-2 border-white shadow-2xs" />

            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-slate-900">
                  {isKannada ? item.actionKannada || item.action : item.action}
                </span>
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {item.createdAt}
                </span>
              </div>

              {item.comments && (
                <p className="text-slate-700 text-[11px] leading-relaxed bg-white p-2 rounded border border-slate-100">
                  {item.comments}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <User className="w-3 h-3 text-slate-400" />
                  {item.officerName} ({item.officerRole})
                </span>
                <div className="flex items-center gap-1 font-mono">
                  <span>{item.previousStatus}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                  <span className="font-bold text-[#0f2b5c]">{item.newStatus}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
