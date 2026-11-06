import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { language, setLanguage, t, isKannada } = useLanguage();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('officer@janaseva.demo');
  const [password, setPassword] = useState('Demo@12345');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    const res = await login(email, password);
    setIsLoading(false);
    if (!res.success) {
      setErrorMsg(res.message || 'Invalid credentials');
    }
  };

  const handleQuickDemo = () => {
    demoLogin();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top Hairline Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/src/assets/images/karnataka_gov_emblem_1793942945530.jpg"
              alt="Seal"
              className="w-8 h-8 object-contain rounded-full border border-amber-300"
            />
            <div>
              <span className="font-bold text-sm text-[#0f2b5c]">
                {isKannada ? 'ಜನಸೇವ AI' : 'Janaseva AI'}
              </span>
              <span className="text-[10px] text-slate-500 block leading-none">
                {t('appSubtitle')}
              </span>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => setLanguage('kn')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                isKannada ? 'bg-[#0f2b5c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                !isKannada ? 'bg-[#0f2b5c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Center Login Box */}
      <div className="max-w-md w-full mx-auto p-4 my-8">
        <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-6 sm:p-8">
          {/* Emblem & Portal Title */}
          <div className="text-center pb-5 mb-5 border-b border-slate-200">
            <img
              src="/src/assets/images/karnataka_gov_emblem_1793942945530.jpg"
              alt="Government of Karnataka Crest"
              className="w-16 h-16 mx-auto object-contain mb-3"
            />
            <h1 className="text-base font-bold text-[#0f2b5c]">
              {t('loginTitle')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('loginSubtitle')}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                {t('officerEmail')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="officer@janaseva.demo"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                {t('officerPassword')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800 text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-white bg-[#0f2b5c] hover:bg-[#1a428a] rounded transition-colors shadow-xs"
            >
              <span>{isLoading ? (isKannada ? 'ಪ್ರವೇಶಿಸಲಾಗುತ್ತಿದೆ...' : 'Signing in...') : t('loginBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo One-Click Access */}
          <div className="mt-5 pt-4 border-t border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 block mb-2">
              {isKannada ? 'ಪರೀಕ್ಷೆಗಾಗಿ ತ್ವರಿತ ಡೆಮೊ ಪ್ರವೇಶ:' : 'Instant access for evaluation & testing:'}
            </span>
            <button
              onClick={handleQuickDemo}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-[#0f2b5c] bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded transition-colors shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{t('quickDemoLogin')}</span>
            </button>
            <p className="text-[10px] text-slate-400 font-mono mt-2">
              officer@janaseva.demo · Demo@12345
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-[11px] text-slate-500 text-center mt-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>{t('securityNotice')}</span>
        </p>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-[11px] text-slate-500 border-t border-slate-200 bg-white">
        © 2026 Government of Karnataka · Revenue Department · Centre for e-Governance (CeG)
      </footer>
    </div>
  );
};
