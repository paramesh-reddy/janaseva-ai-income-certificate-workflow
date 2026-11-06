import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  FileText,
  FileCheck2,
  BarChart3,
  History,
  Sliders,
  PlusCircle,
  Building2,
  ShieldCheck
} from 'lucide-react';

export type NavTab = 'dashboard' | 'applications' | 'docVerification' | 'reports' | 'history' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onNewApplication: () => void;
  pendingCount: number;
  urgentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onNewApplication,
  pendingCount,
  urgentCount
}) => {
  const { t, isKannada } = useLanguage();

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: t('navDashboard'),
      icon: LayoutDashboard,
      badge: urgentCount > 0 ? urgentCount : undefined,
      badgeVariant: 'urgent'
    },
    {
      id: 'applications' as NavTab,
      label: t('navApplications'),
      icon: FileText,
      badge: pendingCount,
      badgeVariant: 'normal'
    },
    {
      id: 'docVerification' as NavTab,
      label: t('navDocVerification'),
      icon: FileCheck2
    },
    {
      id: 'reports' as NavTab,
      label: t('navReports'),
      icon: BarChart3
    },
    {
      id: 'history' as NavTab,
      label: t('navHistory'),
      icon: History
    },
    {
      id: 'settings' as NavTab,
      label: t('navSettings'),
      icon: Sliders
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Primary Action Button */}
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={onNewApplication}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-white bg-[#0f2b5c] hover:bg-[#1a428a] rounded-md transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('newApplicationBtn')}</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-[#0f2b5c] font-semibold border-l-2 border-[#0f2b5c]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0f2b5c]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.badgeVariant === 'urgent'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Jurisdiction Info Card */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-600 space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Building2 className="w-3.5 h-3.5 text-blue-900" />
          <span>{isKannada ? 'ಕಂದಾಯ ವ್ಯಾಪ್ತಿ' : 'Revenue Jurisdiction'}</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          {isKannada ? 'ಬೆಂಗಳೂರು ದಕ್ಷಿಣ ತಾಲೂಕು' : 'Bengaluru South Taluk'} · {isKannada ? 'ಕೆಂಗೇರಿ & ಉತ್ತರಹಳ್ಳಿ ಹೋಬಳಿ' : 'Kengeri & Uttarahalli Hoblis'}
        </p>
        <div className="pt-2 flex items-center gap-1 text-[10px] text-emerald-800">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>{isKannada ? 'ಸಕಾಲ ಸೇವಾ ಖಾತರಿ ೨೦೧೧' : 'Karnataka Sakala Act 2011'}</span>
        </div>
      </div>
    </aside>
  );
};
