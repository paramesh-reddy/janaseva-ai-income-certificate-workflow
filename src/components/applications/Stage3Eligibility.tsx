import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Application } from '../../types';
import {
  CheckSquare,
  Square,
  AlertTriangle,
  Scale,
  ShieldAlert,
  FileCheck2,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface Stage3EligibilityProps {
  application: Application;
  onAdvanceToNextStage: () => void;
}

export const Stage3Eligibility: React.FC<Stage3EligibilityProps> = ({
  application,
  onAdvanceToNextStage
}) => {
  const { t, isKannada } = useLanguage();

  // Interactive checklist state for officer verification
  const [checklistState, setChecklistState] = useState<{ [key: string]: boolean }>({
    id_match: true,
    jurisdiction: true,
    income_ceiling: application.declaredAnnualIncome <= 200000,
    proof_consistency: !application.documents.some(d => d.aiFlags && d.aiFlags.length > 0),
    no_duplicate: true
  });

  const toggleCheck = (key: string) => {
    setChecklistState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Check for income discrepancy
  const extractedIncomes = application.documents
    .map(d => d.extractedIncome)
    .filter((inc): inc is number => inc !== undefined);

  const maxExtracted = extractedIncomes.length > 0 ? Math.max(...extractedIncomes) : null;
  const hasIncomeVariance = maxExtracted !== null && Math.abs(maxExtracted - application.declaredAnnualIncome) > 30000;

  // Scheme statutory thresholds (clearly marked demonstration policies)
  const schemeCeilings: { [key: string]: number } = {
    'Educational Scholarship (SSP/NSP)': 250000,
    'Government Housing Scheme (Ashraya/Vajpayee)': 120000,
    'College Tuition Fee Concession': 200000,
    'Social Security Pension (Sandhya Suraksha)': 50000,
    'Ration Card Modification / Issue': 120000
  };

  const currentCeiling = schemeCeilings[application.purpose] || 200000;
  const exceedsCeiling = application.declaredAnnualIncome > currentCeiling;

  return (
    <div className="space-y-6">
      {/* Policy Disclaimer */}
      <div className="p-3 bg-slate-100 border border-slate-300 rounded-md text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">{isKannada ? 'ಕಂದಾಯ ಅರ್ಹತಾ ನಿಯಮಾವಳಿ (ಮಾದರಿ ನಿಯಮಗಳು):' : 'Revenue Eligibility Norms (Demonstration Rules):'}</span>{' '}
          {isKannada
            ? 'ಸರ್ಕಾರಿ ಆದೇಶಗಳ ಅನ್ವಯ ನಿರ್ದಿಷ್ಟ ಯೋಜನೆಗೆ ನಿಗದಿಪಡಿಸಲಾದ ಗರಿಷ್ಠ ಆದಾಯ ಮಿತಿಯನ್ನು ಕೆಳಗೆ ಹೋಲಿಸಲಾಗಿದೆ. ಅಂತಿಮ ನಿರ್ಧಾರ ಅಧಿಕಾರಿಯ ವಿವೇಚನೆಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ.'
            : 'Statutory income ceiling thresholds for the selected scheme are benchmarked below. All determinations remain under human officer discretion.'}
        </div>
      </div>

      {/* Income Comparison Matrix */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#0f2b5c]" />
          <span>{isKannada ? 'ಆದಾಯ ದೃಢೀಕರಣ ಮತ್ತು ತುಲನಾತ್ಮಕ ವಿಶ್ಲೇಷಣೆ' : 'Comparative Income Analysis'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Declared Income */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
              {isKannada ? '೧. ಅರ್ಜಿದಾರರ ಘೋಷಿತ ಆದಾಯ' : '1. Declared Annual Income'}
            </span>
            <div className="text-xl font-bold text-slate-900 tabular-nums">
              ₹{application.declaredAnnualIncome.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {isKannada ? 'ನಾಗರಿಕರು ನಮೂದಿಸಿದ ಮೊತ್ತ' : 'Form Declaration'}
            </span>
          </div>

          {/* Extracted Income */}
          <div className={`p-4 border rounded-md ${hasIncomeVariance ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
              {isKannada ? '೨. ಲಗತ್ತಿಸಲಾದ ದಾಖಲೆಯ ಆದಾಯ' : '2. Supporting Proof Income'}
            </span>
            <div className={`text-xl font-bold tabular-nums ${hasIncomeVariance ? 'text-amber-900' : 'text-slate-900'}`}>
              {maxExtracted !== null ? `₹${maxExtracted.toLocaleString('en-IN')}` : (isKannada ? 'ಲಭ್ಯವಿಲ್ಲ' : 'Not quantified')}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {hasIncomeVariance
                ? (isKannada ? '⚠️ ವ್ಯತ್ಯಾಸ ಕಂಡುಬಂದಿದೆ' : '⚠️ Variance detected')
                : (isKannada ? 'ದಾಖಲೆಗೆ ತಾಳೆಯಾಗಿದೆ' : 'Consistent with documents')}
            </span>
          </div>

          {/* Scheme Statutory Ceiling */}
          <div className={`p-4 border rounded-md ${exceedsCeiling ? 'bg-rose-50 border-rose-300' : 'bg-emerald-50/70 border-emerald-300'}`}>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
              {isKannada ? '೩. ಯೋಜನೆಯ ಗರಿಷ್ಠ ಆದಾಯ ಮಿತಿ' : '3. Statutory Scheme Ceiling'}
            </span>
            <div className={`text-xl font-bold tabular-nums ${exceedsCeiling ? 'text-rose-900' : 'text-emerald-900'}`}>
              ₹{currentCeiling.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-600 mt-1 block">
              {application.purpose}
            </span>
          </div>
        </div>

        {/* Variance Warning if exists */}
        {hasIncomeVariance && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{isKannada ? 'ವ್ಯತ್ಯಾಸದ ವಿವರ:' : 'Income Variance Details:'}</span>{' '}
              {isKannada
                ? `ಘೋಷಿತ ಆದಾಯ ₹${application.declaredAnnualIncome.toLocaleString('en-IN')} ಮತ್ತು ವೇತನ ಪ್ರಮಾಣಪತ್ರದಲ್ಲಿನ ₹${maxExtracted?.toLocaleString('en-IN')} ನಡುವೆ ₹${Math.abs((maxExtracted || 0) - application.declaredAnnualIncome).toLocaleString('en-IN')} ವ್ಯತ್ಯಾಸವಿದೆ. ಗ್ರಾಮ ಆಡಳಿತಾಧಿಕಾರಿ (VA) ಕ್ಷೇತ್ರ ತನಿಖೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.`
                : `A discrepancy of ₹${Math.abs((maxExtracted || 0) - application.declaredAnnualIncome).toLocaleString('en-IN')} exists between the declared ₹${application.declaredAnnualIncome.toLocaleString('en-IN')} and the salary slip's annualized gross ₹${maxExtracted?.toLocaleString('en-IN')}. Village Accountant field inspection is suggested.`}
            </div>
          </div>
        )}
      </div>

      {/* Officer Verification Checklist */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#0f2b5c]" />
            <span>{t('aiVerificationChecklist')}</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            {isKannada ? 'ಪ್ರತಿಯೊಂದು ಅಂಶವನ್ನು ಪರಿಶೀಲಿಸಿ ಟಿಕ್ ಮಾಡಿ' : 'Toggle checklist items to verify'}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Item 1 */}
          <div
            onClick={() => toggleCheck('id_match')}
            className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded cursor-pointer transition-colors"
          >
            {checklistState.id_match ? (
              <CheckSquare className="w-4 h-4 text-[#0f2b5c] shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-slate-900">
                {isKannada ? 'ಅರ್ಜಿದಾರರ ಗುರುತು ಮತ್ತು ಮತದಾರರ ಪಟ್ಟಿ ಹೊಂದಾಣಿಕೆ' : 'Applicant Identity & Electoral Roll Match'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {application.applicantName} · Aadhaar XXXX-XXXX-{application.aadhaarLastFour}
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div
            onClick={() => toggleCheck('jurisdiction')}
            className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded cursor-pointer transition-colors"
          >
            {checklistState.jurisdiction ? (
              <CheckSquare className="w-4 h-4 text-[#0f2b5c] shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-slate-900">
                {isKannada ? 'ಕಂದಾಯ ಹೋಬಳಿ ವ್ಯಾಪ್ತಿಯ ಪರಿಶೀಲನೆ' : 'Hobli Jurisdiction Verification'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {application.village}, {application.hobli} hobli, {application.taluk}
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div
            onClick={() => toggleCheck('income_ceiling')}
            className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded cursor-pointer transition-colors"
          >
            {checklistState.income_ceiling ? (
              <CheckSquare className="w-4 h-4 text-[#0f2b5c] shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-slate-900">
                {isKannada ? 'ಸರ್ಕಾರದ ಗರಿಷ್ಠ ಮಿತಿಯೊಳಗೆ ಕುಟುಂಬದ ಆದಾಯ' : 'Income Within Statutory Scheme Ceiling'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                ₹{application.declaredAnnualIncome.toLocaleString('en-IN')} ≤ ₹{currentCeiling.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div
            onClick={() => toggleCheck('proof_consistency')}
            className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded cursor-pointer transition-colors"
          >
            {checklistState.proof_consistency ? (
              <CheckSquare className="w-4 h-4 text-[#0f2b5c] shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-slate-900">
                {isKannada ? 'ವೇತನ / ಕೃಷಿ ಆದಾಯ ದಾಖಲೆಗಳ ನೈಜತೆ' : 'Salary / Agricultural Record Authenticity'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {application.documents.length} {isKannada ? 'ದಾಖಲೆಗಳು ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿವೆ' : 'supporting documents evaluated'}
              </p>
            </div>
          </div>

          {/* Item 5 */}
          <div
            onClick={() => toggleCheck('no_duplicate')}
            className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded cursor-pointer transition-colors"
          >
            {checklistState.no_duplicate ? (
              <CheckSquare className="w-4 h-4 text-[#0f2b5c] shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-slate-900">
                {isKannada ? 'ನಾಡ ಕಚೇರಿ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ನಕಲು ಪ್ರಮಾಣಪತ್ರವಿಲ್ಲ' : 'No Prior Duplicate Certificate in Registry'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isKannada ? 'ಕಳೆದ ೩ ವರ್ಷಗಳಲ್ಲಿ ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಪ್ರಮಾಣಪತ್ರವಿಲ್ಲ' : 'No active certificate found within 3-year validity'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stage transition footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-500">
          {isKannada ? 'ಅರ್ಹತೆ ದೃಢಪಡಿಸಿದ ನಂತರ ಅಂತಿಮ ಆದೇಶ ನೀಡಿ' : 'After completing checklist, proceed to final official order'}
        </span>
        <button
          onClick={onAdvanceToNextStage}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#0f2b5c] hover:bg-[#1a428a] rounded-md transition-colors shadow-xs"
        >
          {isKannada ? 'ಹಂತ ೪ ಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ (ಅಂತಿಮ ನಿರ್ಧಾರ)' : 'Advance to Stage 4: Final Decision'} →
        </button>
      </div>
    </div>
  );
};
