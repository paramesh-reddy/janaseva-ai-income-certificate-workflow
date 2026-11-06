import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, Globe, LogOut, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Application } from '../../types';

interface HeaderProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  urgentCount: number;
}

export const Header: React.FC<HeaderProps> = ({ applications, onSelectApplication, urgentCount }) => {
  const { language, setLanguage, t, isKannada } = useLanguage();
  const { officer, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const filteredApps = searchQuery.trim()
    ? applications.filter(
        a =>
          a.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.village.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Topmost Official Tricolor Hairline Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Crest Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/src/assets/images/karnataka_gov_emblem_1793942945530.jpg"
            alt="Government of Karnataka Seal"
            className="w-10 h-10 object-contain rounded-full shadow-xs border border-amber-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#0f2b5c]">
                {isKannada ? 'ಜನಸೇವ AI' : 'Janaseva AI'}
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                {t('demoModeBadge')}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-none">
              {t('appSubtitle')} · {t('talukOffice')}
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-800 focus:bg-white text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Search dropdown results */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
              {filteredApps.length === 0 ? (
                <div className="px-3 py-2 text-xs text-slate-500 text-center">
                  {isKannada ? 'ಯಾವುದೇ ಅರ್ಜಿ ಕಂಡುಬಂದಿಲ್ಲ' : 'No matching applications found'}
                </div>
              ) : (
                filteredApps.map(app => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onSelectApplication(app);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-xs border-b border-slate-100 last:border-b-0"
                  >
                    <div>
                      <span className="font-semibold text-blue-950 font-mono">{app.applicationNumber}</span>
                      <span className="ml-2 font-medium text-slate-800">{app.applicantName}</span>
                      <span className="text-slate-500 text-[11px] block">{app.village}, {app.hobli}</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      ₹{app.declaredAnnualIncome.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Zone Controls: Language Switcher, Alerts, Profile */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => setLanguage('kn')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                isKannada ? 'bg-[#0f2b5c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ"
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                !isKannada ? 'bg-[#0f2b5c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to English"
            >
              English
            </button>
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md relative"
              title={t('notifications')}
            >
              <Bell className="w-5 h-5" />
              {urgentCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-md shadow-lg p-3 z-50 text-xs">
                <div className="font-semibold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>{t('notifications')}</span>
                  <span className="text-[11px] text-red-600 font-bold">{urgentCount} {isKannada ? 'ತುರ್ತು' : 'Urgent'}</span>
                </div>
                <div className="py-2 space-y-2">
                  <div className="p-2 bg-red-50 rounded border border-red-100 flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">RD00382910482</p>
                      <p className="text-red-700 text-[11px]">
                        {isKannada ? 'ವೇತನ ಚೀಟಿ ಆದಾಯ ವ್ಯತ್ಯಾಸ - ಅಧಿಕಾರಿ ಪರಿಶೀಲನೆ ಅಗತ್ಯ' : 'Salary slip variance detected - Officer review required'}
                      </p>
                    </div>
                  </div>
                  <div className="p-2 bg-amber-50 rounded border border-amber-100 flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900">RD00381049281</p>
                      <p className="text-amber-700 text-[11px]">
                        {isKannada ? 'ಸಕಾಲ ನಿಗದಿತ ಅವಧಿ ೬ ದಿನಗಳು ಬಾಕಿ (SLA Alert)' : 'SLA Target threshold pending 6 days in queue'}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full text-center text-[11px] text-blue-800 font-medium pt-1 hover:underline"
                >
                  {isKannada ? 'ಮುಚ್ಚಿ' : 'Close'}
                </button>
              </div>
            )}
          </div>

          {/* Officer Profile Badge */}
          {officer ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={officer.avatarUrl || '/src/assets/images/officer_avatar_1793942944619.jpg'}
                alt={officer.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-300"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {isKannada ? officer.nameKannada : officer.name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {officer.kgidNumber} · {isKannada ? 'ಕಂದಾಯ ನಿರೀಕ್ಷಕರು' : 'Revenue Inspector'}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-1"
                title={t('logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
