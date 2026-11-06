import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Application, ApplicationStatus } from '../../types';
import { StatusBadge, PriorityBadge, StageBadge } from '../common/Badge';
import { Search, Filter, ArrowUpRight, FileText } from 'lucide-react';

interface ApplicationsTableProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  onNewApplication: () => void;
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onSelectApplication,
  onNewApplication
}) => {
  const { t, isKannada } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filterTabs: { id: string; label: string }[] = [
    { id: 'ALL', label: t('statusAll') },
    { id: 'PENDING', label: t('statusPending') },
    { id: 'UNDER_VERIFICATION', label: t('statusUnderVerification') },
    { id: 'APPROVED', label: t('statusApproved') },
    { id: 'REJECTED', label: t('statusRejected') },
    { id: 'RETURNED', label: t('statusReturned') }
  ];

  const filteredApplications = applications.filter(app => {
    // Status filter
    if (statusFilter !== 'ALL' && app.status !== statusFilter) {
      return false;
    }
    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = app.applicationNumber.toLowerCase().includes(q);
      const matchName = app.applicantName.toLowerCase().includes(q);
      const matchVillage = app.village.toLowerCase().includes(q);
      return matchId || matchName || matchVillage;
    }
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Tabs (Functional Segmented Control) */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-full overflow-x-auto">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-white text-[#0f2b5c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-800 text-slate-900 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">{t('colAppId')}</th>
              <th className="py-3 px-4">{t('colApplicant')}</th>
              <th className="py-3 px-4">{t('colDate')}</th>
              <th className="py-3 px-4">{t('colStage')}</th>
              <th className="py-3 px-4">{t('colPriority')}</th>
              <th className="py-3 px-4">{t('colStatus')}</th>
              <th className="py-3 px-4">{t('colOfficer')}</th>
              <th className="py-3 px-4 text-right">{t('colAction')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium">
                    {isKannada ? 'ಯಾವುದೇ ಅರ್ಜಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No applications match the criteria'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isKannada ? 'ಫಿಲ್ಟರ್ ಬದಲಾಯಿಸಿ ಅಥವಾ ಹೊಸ ಅರ್ಜಿ ನಮೂದಿಸಿ' : 'Try adjusting your filters or create a new application'}
                  </p>
                </td>
              </tr>
            ) : (
              filteredApplications.map(app => (
                <tr
                  key={app.id}
                  onClick={() => onSelectApplication(app)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                >
                  {/* Application ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0f2b5c]">
                    {app.applicationNumber}
                  </td>

                  {/* Applicant Name & Address */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{app.applicantName}</div>
                    <div className="text-[11px] text-slate-500">
                      {app.village}, {app.hobli}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 tabular-nums text-slate-600">
                    <div>{app.submissionDate}</div>
                    <div className="text-[10px] text-slate-400">
                      {app.daysPending} {t('daysUnit')} {isKannada ? 'ಸರತಿಯಲ್ಲಿ' : 'in queue'}
                    </div>
                  </td>

                  {/* Workflow Stage */}
                  <td className="py-3.5 px-4">
                    <StageBadge stage={app.currentStage} />
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <PriorityBadge priority={app.priority} />
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={app.status} />
                  </td>

                  {/* Officer */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="font-medium text-[11px]">{app.assignedOfficerName}</div>
                    <div className="text-[10px] text-slate-400">{app.assignedOfficerRole}</div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSelectApplication(app);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#0f2b5c] bg-white border border-slate-300 rounded hover:bg-blue-50 transition-colors shadow-2xs"
                    >
                      <span>{t('processApplication')}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>
          {isKannada ? 'ತೋರಿಸಲಾಗುತ್ತಿದೆ' : 'Showing'} {filteredApplications.length} {isKannada ? 'ಅರ್ಜಿಗಳು' : 'applications'}
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          Karnataka Sakala Services Portal · Taluk Bangalore South
        </span>
      </div>
    </div>
  );
};
