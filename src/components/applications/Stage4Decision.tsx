import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Application } from '../../types';
import { CertificateModal } from './CertificateModal';
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Award,
  FileCheck2,
  Lock,
  RefreshCw
} from 'lucide-react';

interface Stage4DecisionProps {
  application: Application;
  onApprove: (remarks: string) => Promise<void>;
  onReject: (reason: string, remarks: string) => Promise<void>;
  onReturn: (reason: string, corrections: string[], remarks: string) => Promise<void>;
  onResubmitSimulation?: () => Promise<void>;
}

export const Stage4Decision: React.FC<Stage4DecisionProps> = ({
  application,
  onApprove,
  onReject,
  onReturn,
  onResubmitSimulation
}) => {
  const { t, isKannada } = useLanguage();
  const { officer } = useAuth();

  const [activeModal, setActiveModal] = useState<'APPROVE' | 'REJECT' | 'RETURN' | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedCorrections, setSelectedCorrections] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-configured official rejection grounds
  const rejectionReasons = [
    { id: 'INCOME_EXCEEDS', label: t('reasonIncomeExceeds') },
    { id: 'FAKE_DOCS', label: t('reasonFakeDocs') },
    { id: 'JURISDICTION_MISMATCH', label: t('reasonJurisdiction') },
    { id: 'DUPLICATE_ACTIVE', label: t('reasonDuplicate') }
  ];

  // Pre-configured return grounds
  const returnReasons = [
    { id: 'BLURRED_DOC', label: t('returnReasonBlur') },
    { id: 'RTC_MISSING', label: t('returnReasonIncompleteRtc') },
    { id: 'FAMILY_DECL_MISSING', label: t('returnReasonFamilyDecl') }
  ];

  const correctionOptions = [
    isKannada ? 'ನೂತನ ಸಾಲಿನ ಆರ್.ಟಿ.ಸಿ (RTC/ಪಹಣಿ) ಭೂಮಿ ಪೋರ್ಟಲ್‌ನಿಂದ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಲಗತ್ತಿಸಿ' : 'Download and attach latest current year RTC from Bhoomi portal',
    isKannada ? 'ಸ್ಪಷ್ಟವಾದ ಮತ್ತು ಓದಲು ಸುಲಭವಾದ ಆಧಾರ್ ಕಾರ್ಡ್ ಛಾಯಾಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Re-upload clear, uncropped scan of Aadhaar Card',
    isKannada ? 'ಉದ್ಯೋಗದಾತರಿಂದ ಮಾನ್ಯತೆ ಪಡೆದ ವೇತನ ಪ್ರಮಾಣಪತ್ರ ಒದಗಿಸಿ' : 'Provide formal employer salary slip with stamp',
    isKannada ? 'ಕುಟುಂಬದ ಹಿರಿಯ ಸದಸ್ಯರ ಸಹಿಯೊಂದಿಗೆ ಸ್ವಯಂ ಘೋಷಣಾ ಪತ್ರ ಸಲ್ಲಿಸಿ' : 'Upload family head signed self-declaration form'
  ];

  const toggleCorrection = (item: string) => {
    setSelectedCorrections(prev =>
      prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]
    );
  };

  const handleConfirmApprove = async () => {
    setIsSubmitting(true);
    await onApprove(remarks || (isKannada ? 'ದಾಖಲೆಗಳು ಮತ್ತು ಆದಾಯ ವಿವರಗಳು ಸರಿಯಾಗಿವೆ ಎಂದು ಪರಿಶೀಲಿಸಿ ಅನುಮೋದಿಸಲಾಗಿದೆ.' : 'Approved after verifying supporting records and income ceiling.'));
    setIsSubmitting(false);
    setActiveModal(null);
    setShowCertificate(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedReason) return;
    setIsSubmitting(true);
    await onReject(selectedReason, remarks);
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleConfirmReturn = async () => {
    if (!selectedReason) return;
    setIsSubmitting(true);
    await onReturn(selectedReason, selectedCorrections, remarks);
    setIsSubmitting(false);
    setActiveModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Official Human Authority Disclaimer */}
      <div className="p-4 bg-slate-900 text-white rounded-md flex items-start gap-3 shadow-xs">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-bold text-amber-300">
            {isKannada ? 'ಮಾನವ ಅಧಿಕಾರಿ ಅಂತಿಮ ನಿರ್ಧಾರದ ನಿಯಮ (Human-in-the-Loop Protocol):' : 'Mandatory Human-in-the-Loop Protocol:'}
          </h4>
          <p className="text-slate-300 mt-1 leading-relaxed">
            {isKannada
              ? 'ಕರ್ನಾಟಕ ಕಂದಾಯ ಕಾಯ್ದೆಯನ್ವಯ ಯಾವುದೇ ಅರ್ಜಿಯನ್ನು AI ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಅನುಮೋದಿಸಲು ಅಥವಾ ತಿರಸ್ಕರಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ಪ್ರತಿಯೊಂದು ನಿರ್ಧಾರವನ್ನು ಲಾಗಿನ್ ಆಗಿರುವ ಅಧಿಕೃತ ಕಂದಾಯ ಅಧಿಕಾರಿಯೇ ಡಿಜಿಟಲ್ ರುಜುವಾತಿನೊಂದಿಗೆ ದೃಢಪಡಿಸಬೇಕು.'
              : 'Under the Karnataka Land Revenue Act, AI cannot execute final administrative determinations. Every approval, rejection, or return order must be confirmed by the authenticated officer with their official credentials.'}
          </p>
        </div>
      </div>

      {/* Current State Summary Card */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {isKannada ? 'ಅರ್ಜಿಯ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ' : 'Application Decision Status'}
            </span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {application.applicationNumber} — {application.applicantName}
            </div>
          </div>

          {application.status === 'APPROVED' && (
            <button
              onClick={() => setShowCertificate(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>{t('viewCertificate')}</span>
            </button>
          )}
        </div>

        {/* Existing Decision Details if already finalized */}
        {application.status === 'APPROVED' && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-md text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{isKannada ? 'ಈ ಅರ್ಜಿಯನ್ನು ಅಧಿಕೃತವಾಗಿ ಅನುಮೋದಿಸಲಾಗಿದೆ' : 'Application Formally Approved'}</span>
            </div>
            <p className="text-emerald-800">
              <span className="font-semibold">{isKannada ? 'ಪ್ರಮಾಣಪತ್ರ ಸಂಖ್ಯೆ:' : 'Certificate Number:'}</span> {application.certificateNumber}
            </p>
            <p className="text-emerald-800 mt-1">
              <span className="font-semibold">{isKannada ? 'ಅಧಿಕಾರಿಯ ಷರಾ:' : 'Officer Remarks:'}</span> {application.decisionRemarks}
            </p>
            <p className="text-[11px] text-emerald-700 mt-1">
              {isKannada ? 'ಅಧಿಕಾರಿ:' : 'Signed By:'} {application.assignedOfficerName} ({application.assignedOfficerRole}) · {application.certificateIssuedAt}
            </p>
          </div>
        )}

        {application.status === 'REJECTED' && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-md text-xs">
            <div className="flex items-center gap-2 font-bold text-rose-900 mb-1">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>{isKannada ? 'ಈ ಅರ್ಜಿಯನ್ನು ತಿರಸ್ಕರಿಸಲಾಗಿದೆ' : 'Application Rejected'}</span>
            </div>
            <p className="text-rose-800">
              <span className="font-semibold">{isKannada ? 'ತಿರಸ್ಕಾರಕ್ಕೆ ಕಾರಣ:' : 'Rejection Grounds:'}</span> {application.rejectionReason}
            </p>
            <p className="text-rose-800 mt-1">
              <span className="font-semibold">{isKannada ? 'ಅಧಿಕಾರಿಯ ಟಿಪ್ಪಣಿ:' : 'Officer Notes:'}</span> {application.decisionRemarks}
            </p>
          </div>
        )}

        {application.status === 'RETURNED' && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>{isKannada ? 'ತಿದ್ದುಪಡಿಗೆ ಹಿಂತಿರುಗಿಸಲಾಗಿದೆ' : 'Returned for Citizen Correction'}</span>
            </div>
            <p className="text-amber-800">
              <span className="font-semibold">{isKannada ? 'ಕಾರಣ:' : 'Return Grounds:'}</span> {application.returnReason}
            </p>
            {onResubmitSimulation && (
              <div className="mt-3 pt-3 border-t border-amber-200">
                <button
                  onClick={onResubmitSimulation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded border border-amber-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {isKannada ? 'ನಾಗರಿಕರು ತಿದ್ದುಪಡಿ ದಾಖಲೆಗಳೊಂದಿಗೆ ಮರುಸಲ್ಲಿಸುವಂತೆ ಸಿಮ್ಯುಲೇಟ್ ಮಾಡಿ' : 'Simulate Citizen Resubmission with Updated Docs'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons if decision not yet finalized or if officer wishes to update order */}
        <div className="pt-6">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            {t('decisionActions')}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. APPROVE */}
            <button
              onClick={() => {
                setRemarks('');
                setActiveModal('APPROVE');
              }}
              className="flex items-center justify-center gap-2 p-3 text-xs font-bold rounded-md text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors shadow-2xs"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{t('btnApprove')}</span>
            </button>

            {/* 2. REJECT */}
            <button
              onClick={() => {
                setRemarks('');
                setSelectedReason('');
                setActiveModal('REJECT');
              }}
              className="flex items-center justify-center gap-2 p-3 text-xs font-bold rounded-md text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-300 transition-colors shadow-2xs"
            >
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>{t('btnReject')}</span>
            </button>

            {/* 3. RETURN */}
            <button
              onClick={() => {
                setRemarks('');
                setSelectedReason('');
                setSelectedCorrections([]);
                setActiveModal('RETURN');
              }}
              className="flex items-center justify-center gap-2 p-3 text-xs font-bold rounded-md text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>{t('btnReturn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: APPROVE CONFIRMATION */}
      {activeModal === 'APPROVE' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-emerald-800 font-bold text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>{t('btnApprove')}</span>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-slate-700">
                {isKannada
                  ? `ಅರ್ಜಿ ಸಂಖ್ಯೆ ${application.applicationNumber} ಕ್ಕೆ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಅನುಮೋದಿಸಲು ಖಚಿತಪಡಿಸಿ.`
                  : `Confirm approval of Income Certificate for Application ${application.applicationNumber}.`}
              </p>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {t('officerRemarks')}
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder={t('remarksPlaceholder')}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-800 inline mr-1" />
                {t('digitalSignNotice')}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
              >
                {t('cancel')}
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleConfirmApprove}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors"
              >
                {isSubmitting ? (isKannada ? 'ಅನುಮೋದಿಸಲಾಗುತ್ತಿದೆ...' : 'Processing...') : t('confirmAction')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECT CONFIRMATION */}
      {activeModal === 'REJECT' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-rose-800 font-bold text-sm">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>{t('btnReject')}</span>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  {t('rejectionReasonLabel')} *
                </label>
                <select
                  value={selectedReason}
                  onChange={e => setSelectedReason(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800 focus:outline-hidden font-medium"
                >
                  <option value="">-- {isKannada ? 'ಕಾರಣ ಆಯ್ಕೆಮಾಡಿ' : 'Select Grounds'} --</option>
                  {rejectionReasons.map(r => (
                    <option key={r.id} value={r.label}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {t('officerRemarks')}
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder={t('remarksPlaceholder')}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded text-[11px] text-red-900 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span>
                  {isKannada
                    ? 'ತಿರಸ್ಕಾರ ಆದೇಶವು ಅಂತಿಮವಾಗಿದ್ದು, ನಾಗರಿಕರಿಗೆ ಸಕಾರಣ ಪತ್ರ ರವಾನೆಯಾಗುತ್ತದೆ.'
                    : 'Rejection orders are permanent and dispatched to the applicant under RTI / Sakala guidelines.'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
              >
                {t('cancel')}
              </button>
              <button
                disabled={!selectedReason || isSubmitting}
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (isKannada ? 'ತಿರಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ...' : 'Processing...') : t('confirmAction')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RETURN FOR CORRECTION */}
      {activeModal === 'RETURN' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-amber-900 font-bold text-sm">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span>{t('btnReturn')}</span>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  {t('returnReasonLabel')} *
                </label>
                <select
                  value={selectedReason}
                  onChange={e => setSelectedReason(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800 focus:outline-hidden font-medium"
                >
                  <option value="">-- {isKannada ? 'ಕಾರಣ ಆಯ್ಕೆಮಾಡಿ' : 'Select Reason'} --</option>
                  {returnReasons.map(r => (
                    <option key={r.id} value={r.label}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                  {isKannada ? 'ನಾಗರಿಕರು ಒದಗಿಸಬೇಕಾದ ಅಗತ್ಯ ತಿದ್ದುಪಡಿಗಳು:' : 'Required Citizen Corrections (Check all that apply):'}
                </label>
                <div className="space-y-1.5 bg-slate-50 p-2.5 rounded border border-slate-200">
                  {correctionOptions.map((opt, oIdx) => (
                    <label key={oIdx} className="flex items-start gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedCorrections.includes(opt)}
                        onChange={() => toggleCorrection(opt)}
                        className="mt-0.5 rounded text-[#0f2b5c]"
                      />
                      <span className="text-[11px]">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {t('officerRemarks')}
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder={t('remarksPlaceholder')}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
              >
                {t('cancel')}
              </button>
              <button
                disabled={!selectedReason || isSubmitting}
                onClick={handleConfirmReturn}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (isKannada ? 'ಹಿಂತಿರುಗಿಸಲಾಗುತ್ತಿದೆ...' : 'Processing...') : t('confirmAction')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {showCertificate && (
        <CertificateModal application={application} onClose={() => setShowCertificate(false)} />
      )}
    </div>
  );
};
