import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Application, ApplicationHistoryItem } from '../../types';
import { History, Search, Filter, Clock, User, ArrowRight, FileText } from 'lucide-react';

interface ActivityHistoryViewProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
}

export const ActivityHistoryView: React.FC<ActivityHistoryViewProps> = ({
  applications,
  onSelectApplication
}) => {
  const { t, isKannada } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  // Flatten all history items with application metadata
  const allEvents: (ApplicationHistoryItem & { appNumber: string; applicantName: string; rawApp: Application })[] = [];
  applications.forEach(app => {
    (app.history || []).forEach(h => {
      allEvents.push({
        ...h,
        appNumber: app.applicationNumber,
        applicantName: app.applicantName,
        rawApp: app
      });
    });
  });

  // Sort descending by time
  allEvents.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const filteredEvents = allEvents.filter(ev => {
    if (filterAction !== 'ALL' && !ev.action.toLowerCase().includes(filterAction.toLowerCase())) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        ev.appNumber.toLowerCase().includes(q) ||
        ev.applicantName.toLowerCase().includes(q) ||
        ev.action.toLowerCase().includes(q) ||
        (ev.comments && ev.comments.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-[#0f2b5c]" />
              <span>{t('historyTitle')}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('historySubtitle')}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 w-fit">
            {allEvents.length} {isKannada ? 'ದಾಖಲಿತ ಕ್ರಮಗಳು' : 'Logged Events'}
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {['ALL', 'Approved', 'Rejected', 'Returned', 'AI'].map(act => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`px-3 py-1 font-semibold rounded whitespace-nowrap transition-colors ${
                  filterAction === act ? 'bg-white text-[#0f2b5c] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {act === 'ALL'
                  ? (isKannada ? 'ಎಲ್ಲಾ ಕ್ರಮಗಳು' : 'All Actions')
                  : act === 'Approved'
                  ? t('statusApproved')
                  : act === 'Rejected'
                  ? t('statusRejected')
                  : act === 'Returned'
                  ? t('statusReturned')
                  : 'AI Analysis'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Events Table / Timeline */}
      <div className="bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>{isKannada ? 'ಯಾವುದೇ ಚಟುವಟಿಕೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No matching audit records'}</p>
            </div>
          ) : (
            filteredEvents.map((ev, idx) => (
              <div
                key={ev.id || idx}
                onClick={() => onSelectApplication(ev.rawApp)}
                className="p-4 hover:bg-slate-50/70 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0f2b5c]">
                      {ev.appNumber}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-900">
                      {ev.applicantName}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-medium text-slate-700">
                      {isKannada ? ev.actionKannada || ev.action : ev.action}
                    </span>
                  </div>

                  {ev.comments && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 max-w-2xl">
                      {ev.comments}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <User className="w-3 h-3 text-slate-400" />
                      {ev.officerName} ({ev.officerRole})
                    </span>
                    <span>•</span>
                    <span className="font-mono">{ev.previousStatus} → {ev.newStatus}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-500 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {ev.createdAt}
                  </span>
                  <span className="text-[11px] text-[#0f2b5c] font-semibold hover:underline block mt-1">
                    {isKannada ? 'ಕಡತ ತೆರೆಯಿರಿ →' : 'Open Case File →'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
