import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Application } from '../../types';
import { User, Phone, MapPin, IndianRupee, Users, CreditCard, Calendar, AlertTriangle } from 'lucide-react';

interface Stage1SubmissionProps {
  application: Application;
  onAdvanceToNextStage: () => void;
}

export const Stage1Submission: React.FC<Stage1SubmissionProps> = ({
  application,
  onAdvanceToNextStage
}) => {
  const { t, isKannada } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Return Warning Banner if status is RETURNED */}
      {application.status === 'RETURNED' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                {isKannada ? 'ಅರ್ಜಿಯನ್ನು ತಿದ್ದುಪಡಿಗೆ ಹಿಂತಿರುಗಿಸಲಾಗಿದೆ' : 'Application Returned for Correction'}
              </h4>
              <p className="text-xs text-amber-800 mt-1">
                <span className="font-semibold">{isKannada ? 'ಕಾರಣ:' : 'Reason:'}</span> {application.returnReason}
              </p>
              {application.requiredCorrections && application.requiredCorrections.length > 0 && (
                <div className="mt-2 text-xs text-amber-900">
                  <span className="font-semibold">{isKannada ? 'ಅಗತ್ಯವಿರುವ ತಿದ್ದುಪಡಿಗಳು:' : 'Required Corrections:'}</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-amber-800">
                    {application.requiredCorrections.map((corr, idx) => (
                      <li key={idx}>{corr}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Applicant Demographic Information */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <span>{t('applicantDetails')}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-xs">
          <div>
            <label className="text-slate-500 block text-[11px] mb-1">{t('colApplicant')}</label>
            <div className="font-semibold text-slate-900 text-sm">{application.applicantName}</div>
          </div>

          <div>
            <label className="text-slate-500 block text-[11px] mb-1">{t('fatherOrSpouse')}</label>
            <div className="font-medium text-slate-800">{application.applicantFatherOrSpouse || '—'}</div>
          </div>

          <div>
            <label className="text-slate-500 block text-[11px] mb-1">{t('mobileNumber')}</label>
            <div className="font-mono font-medium text-slate-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{application.mobile}</span>
            </div>
          </div>

          <div>
            <label className="text-slate-500 block text-[11px] mb-1">{t('aadhaarNumber')}</label>
            <div className="font-mono font-medium text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>XXXX-XXXX-{application.aadhaarLastFour}</span>
            </div>
          </div>

          <div>
            <label className="text-slate-500 block text-[11px] mb-1">{t('rationCardNo')}</label>
            <div className="font-mono font-medium text-slate-800">
              {application.rationCardNumber || (isKannada ? 'ನಮೂದಿಸಿಲ್ಲ' : 'Not provided')}
            </div>
          </div>

          <div>
            <label className="text-slate-500 block text-[11px] mb-1">{t('familyMembers')}</label>
            <div className="font-medium text-slate-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{application.familyMembersCount} {isKannada ? 'ಸದಸ್ಯರು' : 'Members'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Address & Revenue Jurisdiction */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span>{isKannada ? 'ವಾಸಸ್ಥಳ ಮತ್ತು ಕಂದಾಯ ವ್ಯಾಪ್ತಿ' : 'Residential & Revenue Jurisdiction'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="text-slate-500 block text-[11px] mb-1">{t('district')}</label>
            <div className="font-medium text-slate-800">{application.district}</div>
          </div>

          <div>
            <label className="text-slate-500 block text-[11px] mb-1">{t('taluk')}</label>
            <div className="font-medium text-slate-800">{application.taluk}</div>
          </div>

          <div>
            <label className="text-slate-500 block text-[11px] mb-1">{t('hobli')}</label>
            <div className="font-medium text-slate-800">{application.hobli}</div>
          </div>

          <div>
            <label className="text-slate-500 block text-[11px] mb-1">{t('village')}</label>
            <div className="font-medium text-slate-800">{application.village}</div>
          </div>

          <div className="col-span-full pt-2">
            <label className="text-slate-500 block text-[11px] mb-1">{t('address')}</label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 text-xs">
              {application.address} — {application.pincode}
            </div>
          </div>
        </div>
      </div>

      {/* Declared Income & Scheme Purpose */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-slate-400" />
          <span>{isKannada ? 'ಘೋಷಿತ ಆದಾಯ ಮತ್ತು ಉದ್ದೇಶ' : 'Declared Income & Scheme Purpose'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-md">
            <label className="text-slate-600 block text-xs font-medium mb-1">
              {t('annualIncome')}
            </label>
            <div className="text-2xl font-bold text-[#0f2b5c] tabular-nums">
              ₹{application.declaredAnnualIncome.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {isKannada ? 'ನಾಗರಿಕರು ಅರ್ಜಿಯಲ್ಲಿ ಸ್ವಯಂ ಘೋಷಿಸಿದ ವಾರ್ಷಿಕ ಕುಟುಂಬದ ಒಟ್ಟು ಆದಾಯ' : 'Self-declared total gross annual family earnings'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
            <label className="text-slate-600 block text-xs font-medium mb-1">
              {t('purposeOfCert')}
            </label>
            <div className="text-sm font-semibold text-slate-900">
              {application.purpose}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('slaTarget')}: <strong className="text-slate-700">{application.slaTargetDate}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage transition footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-500">
          {isKannada ? 'ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆಗೆ ಮುಂದುವರಿಯಿರಿ' : 'Proceed to verify uploaded supporting documents'}
        </span>
        <button
          onClick={onAdvanceToNextStage}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#0f2b5c] hover:bg-[#1a428a] rounded-md transition-colors shadow-xs"
        >
          {isKannada ? 'ಹಂತ ೨ ಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ (ದಾಖಲೆ ಪರಿಶೀಲನೆ)' : 'Advance to Stage 2: Document Verification'} →
        </button>
      </div>
    </div>
  );
};
