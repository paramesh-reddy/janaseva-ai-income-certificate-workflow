import React from 'react';
import { Application } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  application: Application;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ application, onClose }) => {
  const { isKannada } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-6 md:p-8 border border-slate-300 my-8">
        {/* Certificate Header Bar Controls */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>
              {isKannada ? 'ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ' : 'Official Digital Income Certificate'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isKannada ? 'ಮುದ್ರಿಸಿ' : 'Print'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0f2b5c] hover:bg-[#1a428a] rounded transition-colors"
            >
              {isKannada ? 'ಮುಚ್ಚಿ' : 'Close'}
            </button>
          </div>
        </div>

        {/* Certificate Document Border (Government of Karnataka Style) */}
        <div className="border-4 border-double border-[#0f2b5c] p-6 md:p-8 relative bg-amber-50/15">
          {/* Subtle watermark seal */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <img
              src="/src/assets/images/karnataka_gov_emblem_1793942945530.jpg"
              alt="Seal watermark"
              className="w-96 h-96 object-contain"
            />
          </div>

          {/* Official Emblem & Header */}
          <div className="text-center pb-4 border-b border-slate-300 relative">
            <img
              src="/src/assets/images/karnataka_gov_emblem_1793942945530.jpg"
              alt="Karnataka Emblem"
              className="w-16 h-16 mx-auto object-contain mb-2"
            />
            <h2 className="text-base font-bold text-[#0f2b5c] tracking-wide">
              GOVERNMENT OF KARNATAKA · ಕರ್ನಾಟಕ ಸರ್ಕಾರ
            </h2>
            <h3 className="text-xs font-semibold text-slate-700">
              REVENUE DEPARTMENT · ಕಂದಾಯ ಇಲಾಖೆ (ನಾಡಕಚೇರಿ)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Office of the Tahsildar / Revenue Inspector, Bengaluru South Taluk
            </p>
            <div className="mt-2 inline-block px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#0f2b5c] bg-amber-100/70 border border-amber-300 rounded">
              FORM NO. 16 · ಆದಾಯ ಪ್ರಮಾಣ ಪತ್ರ (INCOME CERTIFICATE)
            </div>
          </div>

          {/* Reference Meta Numbers */}
          <div className="grid grid-cols-2 text-xs py-3 border-b border-slate-200">
            <div>
              <span className="text-slate-500">{isKannada ? 'ಅರ್ಜಿ ಸಂಖ್ಯೆ:' : 'Application RD No:'}</span>{' '}
              <strong className="font-mono text-slate-900">{application.applicationNumber}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">{isKannada ? 'ಪ್ರಮಾಣಪತ್ರ ಸಂಖ್ಯೆ:' : 'Certificate No:'}</span>{' '}
              <strong className="font-mono text-[#0f2b5c]">
                {application.certificateNumber || 'KAR-RD-INC-2026-94819'}
              </strong>
            </div>
            <div className="mt-1">
              <span className="text-slate-500">{isKannada ? 'ದಿನಾಂಕ:' : 'Date of Issue:'}</span>{' '}
              <strong className="text-slate-900">{application.certificateIssuedAt || application.updatedAt}</strong>
            </div>
            <div className="mt-1 text-right">
              <span className="text-slate-500">{isKannada ? 'ಮಾನ್ಯತೆ ಅವಧಿ:' : 'Validity:'}</span>{' '}
              <strong className="text-emerald-800">3 {isKannada ? 'ವರ್ಷಗಳು (3 Years)' : 'Years'}</strong>
            </div>
          </div>

          {/* Legal Certification Statement */}
          <div className="py-6 space-y-4 text-xs text-slate-800 leading-relaxed">
            <p className="text-justify indent-8">
              This is to certify that after official spot inquiry by the Village Accountant and verification
              of supporting revenue records by the Revenue Inspector under the provisions of the Karnataka Land
              Revenue Act, the total gross annual income of the family of:
            </p>

            <div className="p-4 bg-slate-50 border border-slate-300 rounded text-center">
              <div className="text-sm font-bold text-slate-950 uppercase">
                {application.applicantName}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                {isKannada ? 'ತಂದೆ / ಪತಿ:' : 'Father / Spouse:'} {application.applicantFatherOrSpouse || '—'}
              </div>
              <div className="text-xs text-slate-600">
                {isKannada ? 'ವಿಳಾಸ:' : 'Residing at:'} {application.address}, {application.village}, {application.hobli} Hobli, {application.taluk}
              </div>
            </div>

            <p className="text-justify">
              The family consists of <strong className="font-semibold">{application.familyMembersCount}</strong> member(s).
              The total annual income of the applicant and his/her family from all sources is determined to be:
            </p>

            <div className="p-3 bg-amber-50 border border-amber-300 rounded text-center">
              <span className="text-xs text-slate-600 block">{isKannada ? 'ವಾರ್ಷಿಕ ಆದಾಯ (ಅಂಕಿಗಳಲ್ಲಿ & ಅಕ್ಷರಗಳಲ್ಲಿ)' : 'Annual Income in Figures & Words'}</span>
              <span className="text-xl font-bold text-[#0f2b5c] font-mono">
                ₹{application.declaredAnnualIncome.toLocaleString('en-IN')} /-
              </span>
              <span className="block text-xs font-medium text-slate-700 italic mt-0.5">
                (Rupees {application.declaredAnnualIncome} Only)
              </span>
            </div>

            <p className="text-xs text-slate-600">
              This certificate is issued strictly for the purpose of: <strong className="text-slate-900">{application.purpose}</strong>.
            </p>
          </div>

          {/* Digital Signature & QR Verification Code */}
          <div className="pt-6 mt-4 border-t border-slate-300 flex items-end justify-between text-xs">
            {/* QR Code */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-slate-900 text-white p-1 rounded flex flex-col items-center justify-center font-mono text-[9px] text-center">
                <div className="w-full h-full bg-white text-slate-900 p-1 flex flex-col items-center justify-center">
                  <div className="font-bold text-[8px]">QR VERIFY</div>
                  <div className="text-[7px] text-slate-500 font-mono truncate max-w-[65px]">{application.applicationNumber}</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 space-y-0.5 max-w-[150px]">
                <div>Karnataka Sakala Portal</div>
                <div>Verify: nadakacheri.karnataka.gov.in</div>
              </div>
            </div>

            {/* Officer Digital Signature */}
            <div className="text-right">
              <div className="inline-block p-3 bg-blue-50/70 border border-blue-200 rounded text-right">
                <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-blue-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-800" />
                  <span>DIGITALLY SIGNED</span>
                </div>
                <div className="font-semibold text-slate-900 text-xs mt-0.5">
                  {application.assignedOfficerName || 'K. S. Manjunath'}
                </div>
                <div className="text-[10px] text-slate-600">
                  {application.assignedOfficerRole || 'Revenue Inspector (RI)'}
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                  KGID-2849104 · Bengaluru South
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
