import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Sliders, RotateCcw, ShieldCheck, Key, Check, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface SettingsViewProps {
  onDataReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onDataReset }) => {
  const { t, isKannada } = useLanguage();
  const { officer } = useAuth();

  const [scholarshipCeiling, setScholarshipCeiling] = useState('250000');
  const [housingCeiling, setHousingCeiling] = useState('120000');
  const [feeConcessionCeiling, setFeeConcessionCeiling] = useState('200000');
  const [pensionCeiling, setPensionCeiling] = useState('50000');
  const [slaDays, setSlaDays] = useState('7');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm(isKannada ? 'ಪರೀಕ್ಷಾರ್ಥ ಡೇಟಾವನ್ನು ಮೂಲ ಸ್ಥಿತಿಗೆ ಮರುಹೊಂದಿಸಲು ಖಚಿತಪಡಿಸಿ?' : 'Reset demonstration database to initial seed?')) {
      api.resetDemoData();
      setResetSuccess(true);
      onDataReset();
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#0f2b5c]" />
          <span>{t('navSettings')}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isKannada
            ? 'ಕಂದಾಯ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಮಿತಿಗಳು ಮತ್ತು ಸಕಾಲ ನಿಯಮಾವಳಿ ಕಾನ್ಫಿಗರೇಶನ್'
            : 'Statutory income ceiling thresholds and Sakala SLA configuration (Demonstration Rules)'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{isKannada ? 'ನಿಯಮಾವಳಿಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ.' : 'Policy rules updated successfully.'}</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-blue-600" />
          <span>{isKannada ? 'ಪರೀಕ್ಷಾರ್ಥ ಡೇಟಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮರುಹೊಂದಿಸಲಾಗಿದೆ.' : 'Demo database restored to default seed.'}</span>
        </div>
      )}

      {/* Statutory Income Ceiling Form */}
      <form onSubmit={handleSavePolicies} className="bg-white border border-slate-200 rounded-md p-5 shadow-xs text-xs space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            {isKannada ? 'ಯೋಜನೆವಾರು ವಾರ್ಷಿಕ ಆದಾಯದ ಗರಿಷ್ಠ ಮಿತಿ (₹)' : 'Statutory Income Ceilings by Scheme (₹)'}
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
            {isKannada ? 'ಮಾದರಿ ನಿಯಮಾವಳಿಗಳು' : 'Sample Rules'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-700 font-semibold block mb-1">
              {t('purposeScholarship')}
            </label>
            <input
              type="number"
              value={scholarshipCeiling}
              onChange={e => setScholarshipCeiling(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">
              {t('purposeHousing')}
            </label>
            <input
              type="number"
              value={housingCeiling}
              onChange={e => setHousingCeiling(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">
              {t('purposeFeeConcession')}
            </label>
            <input
              type="number"
              value={feeConcessionCeiling}
              onChange={e => setFeeConcessionCeiling(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">
              {t('purposeOldAgePension')}
            </label>
            <input
              type="number"
              value={pensionCeiling}
              onChange={e => setPensionCeiling(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold"
            />
          </div>

          <div className="col-span-full pt-2">
            <label className="text-slate-700 font-semibold block mb-1">
              {t('sakalaTarget')}
            </label>
            <input
              type="number"
              value={slaDays}
              onChange={e => setSlaDays(e.target.value)}
              className="w-full sm:w-48 p-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-[#0f2b5c] hover:bg-[#1a428a] rounded transition-colors"
          >
            {t('save')}
          </button>
        </div>
      </form>

      {/* Demo Credentials & Reset Section */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs text-xs space-y-4">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#0f2b5c]" />
          <span>{isKannada ? 'ಡೆಮೊ ಪರೀಕ್ಷಾರ್ಥ ಮಾಹಿತಿ & ಮರುಹೊಂದಿಕೆ' : 'Demo Credentials & Database Reset'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold block">
              {isKannada ? 'ಪರೀಕ್ಷಾರ್ಥ ಅಧಿಕಾರಿ ಲಾಗಿನ್' : 'Testing Demo Account'}
            </span>
            <div className="font-mono text-slate-800">Email: officer@janaseva.demo</div>
            <div className="font-mono text-slate-800">Password: Demo@12345</div>
            <div className="text-[10px] text-slate-500">Role: Revenue Inspector (Grade-I)</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold block">
              {isKannada ? 'ಕಚೇರಿ ಸ್ಥಳ' : 'Office Location'}
            </span>
            <div className="font-semibold text-slate-900">{t('talukOffice')}</div>
            <div className="text-slate-600">Nadakacheri, Kengeri Hobli, Bengaluru South</div>
            <div className="text-[10px] text-slate-500 font-mono">KGID: 2849104</div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            {isKannada
              ? 'ಮೂಲ ಪರೀಕ್ಷಾರ್ಥ ಅರ್ಜಿಗಳನ್ನು ಪುನಃ ಸ್ಥಾಪಿಸಲು ಮರುಹೊಂದಿಸಿ ಬಟನ್ ಒತ್ತಿ.'
              : 'Click reset to restore original realistic Bangalore South demonstration records.'}
          </p>
          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isKannada ? 'ಡೆಮೊ ಡೇಟಾ ಮರುಹೊಂದಿಸಿ' : 'Reset Demo Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
