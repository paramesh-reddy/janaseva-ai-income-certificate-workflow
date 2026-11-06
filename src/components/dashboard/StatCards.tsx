import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DashboardStats } from '../../types';
import { Clock, AlertOctagon, CheckCircle2, FileStack } from 'lucide-react';

interface StatCardsProps {
  stats: DashboardStats;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const { t, isKannada } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Applications */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">{t('totalApplications')}</span>
          <FileStack className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold text-slate-900 tabular-nums">
          {stats.totalApplications}
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>{isKannada ? 'ಕಂದಾಯ ನೋಂದಣಿ' : 'Nadakacheri Intake'}</span>
          <span className="font-medium text-slate-700">100%</span>
        </div>
      </div>

      {/* 2. Pending Applications */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">{t('pendingApplications')}</span>
          <Clock className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-2xl font-bold text-blue-900 tabular-nums">
          {stats.pendingApplications}
        </div>
        <div className="mt-2 text-[11px] text-blue-700 flex items-center justify-between">
          <span>{t('avgProcessingTime')}</span>
          <span className="font-semibold tabular-nums">{stats.avgProcessingDays} {t('daysUnit')}</span>
        </div>
      </div>

      {/* 3. Urgent Attention */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium text-red-900">{t('urgentAttention')}</span>
          <AlertOctagon className="w-4 h-4 text-red-600" />
        </div>
        <div className="text-2xl font-bold text-red-700 tabular-nums">
          {stats.urgentAttentionCount}
        </div>
        <div className="mt-2 text-[11px] text-red-600 flex items-center justify-between">
          <span>{isKannada ? 'ಸಕಾಲ ವಿಳಂಬ & ತಪಾಸಣೆ' : 'SLA delay & flags'}</span>
          <span className="font-semibold">{isKannada ? 'ತಕ್ಷಣ ವಿಲೇವಾರಿ ಮಾಡಿ' : 'Action Required'}</span>
        </div>
      </div>

      {/* 4. Approved Applications */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium text-emerald-900">{t('approvedApplications')}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold text-emerald-800 tabular-nums">
          {stats.approvedCount}
        </div>
        <div className="mt-2 text-[11px] text-emerald-700 flex items-center justify-between">
          <span>{t('slaCompliance')}</span>
          <span className="font-semibold tabular-nums">{stats.slaComplianceRate}%</span>
        </div>
      </div>
    </div>
  );
};
