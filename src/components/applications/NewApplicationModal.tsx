import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Application, DocumentItem } from '../../types';
import { PlusCircle, FileText, Upload, AlertCircle, X, Check } from 'lucide-react';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Application>) => Promise<void>;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { t, isKannada } = useLanguage();

  const [applicantName, setApplicantName] = useState('');
  const [fatherOrSpouse, setFatherOrSpouse] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhaarLastFour, setAadhaarLastFour] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [taluk, setTaluk] = useState('Bengaluru South');
  const [hobli, setHobli] = useState('Kengeri');
  const [village, setVillage] = useState('');
  const [pincode, setPincode] = useState('560074');
  const [declaredAnnualIncome, setDeclaredAnnualIncome] = useState('45000');
  const [purpose, setPurpose] = useState('Educational Scholarship (SSP/NSP)');
  const [familyMembersCount, setFamilyMembersCount] = useState('4');
  const [rationCardNumber, setRationCardNumber] = useState('');

  // Selected document uploads
  const [uploadedDocs, setUploadedDocs] = useState<{ type: string; title: string; fileName: string }[]>([
    { type: 'AADHAAR', title: 'Aadhaar Identity Proof', fileName: 'sample_aadhaar_demo.pdf' },
    { type: 'INCOME_PROOF', title: 'Salary / Income Proof', fileName: 'salary_statement.pdf' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      setErrorMsg(isKannada ? 'ದಯವಿಟ್ಟು ಅರ್ಜಿದಾರರ ಹೆಸರು ನಮೂದಿಸಿ' : 'Please provide applicant name');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setErrorMsg(isKannada ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ (೧೦ ಅಂಕಿಗಳು)' : 'Please enter valid 10-digit mobile number');
      return;
    }
    if (!declaredAnnualIncome || Number(declaredAnnualIncome) <= 0) {
      setErrorMsg(isKannada ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ವಾರ್ಷಿಕ ಆದಾಯ ನಮೂದಿಸಿ' : 'Please enter valid annual family income');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const generatedDocs: DocumentItem[] = uploadedDocs.map((d, idx) => ({
        id: `doc-new-${Date.now()}-${idx}`,
        applicationId: '',
        documentType: d.type as any,
        title: d.title,
        fileName: d.fileName,
        fileSize: '410 KB',
        mimeType: 'application/pdf',
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        verificationStatus: 'PENDING',
        ocrExtractedText: `GOVERNMENT DEMO EXTRACT\nDocument: ${d.title}\nApplicant: ${applicantName}\nAnnual Amount: Rs. ${declaredAnnualIncome}`,
        ocrConfidence: 96,
        extractedIncome: Number(declaredAnnualIncome),
        extractedName: applicantName
      }));

      await onSubmit({
        applicantName,
        applicantFatherOrSpouse: fatherOrSpouse,
        mobile,
        aadhaarLastFour: aadhaarLastFour || '9102',
        address,
        district,
        taluk,
        hobli,
        village: village || (isKannada ? 'ಕೆಂಗೇರಿ ಗ್ರಾಮ' : 'Kengeri Village'),
        pincode,
        declaredAnnualIncome: Number(declaredAnnualIncome),
        purpose,
        familyMembersCount: Number(familyMembersCount),
        rationCardNumber,
        documents: generatedDocs
      });

      onClose();
    } catch (err) {
      setErrorMsg(isKannada ? 'ಅರ್ಜಿ ನೋಂದಣಿಯಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ' : 'Error saving application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#0f2b5c]" />
            <h3 className="font-bold text-sm text-slate-900">
              {t('newApplicationBtn')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Name and Father/Spouse */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                {t('colApplicant')} *
              </label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={e => setApplicantName(e.target.value)}
                placeholder={isKannada ? 'ಉದಾ: ಮಂಜುಳಾ ಕೆ.' : 'e.g. Manjula K.'}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                {t('fatherOrSpouse')}
              </label>
              <input
                type="text"
                value={fatherOrSpouse}
                onChange={e => setFatherOrSpouse(e.target.value)}
                placeholder={isKannada ? 'ಉದಾ: ಕೆಂಪೇಗೌಡ' : 'e.g. Kempegowda'}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800"
              />
            </div>
          </div>

          {/* Row 2: Mobile & Aadhaar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                {t('mobileNumber')} *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder="98XXXXXXXX"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                {t('aadhaarNumber')} (Demo)
              </label>
              <input
                type="text"
                maxLength={4}
                value={aadhaarLastFour}
                onChange={e => setAadhaarLastFour(e.target.value)}
                placeholder="XXXX"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800 font-mono"
              />
            </div>
          </div>

          {/* Row 3: Income & Purpose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                {t('annualIncome')} (₹) *
              </label>
              <input
                type="number"
                required
                min={1000}
                max={10000000}
                value={declaredAnnualIncome}
                onChange={e => setDeclaredAnnualIncome(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                {t('purposeOfCert')} *
              </label>
              <select
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800"
              >
                <option value="Educational Scholarship (SSP/NSP)">{t('purposeScholarship')}</option>
                <option value="Government Housing Scheme (Ashraya/Vajpayee)">{t('purposeHousing')}</option>
                <option value="College Tuition Fee Concession">{t('purposeFeeConcession')}</option>
                <option value="Ration Card Modification / Issue">{t('purposeRationCard')}</option>
                <option value="Social Security Pension (Sandhya Suraksha)">{t('purposeOldAgePension')}</option>
                <option value="General Government Welfare Schemes">{t('purposeGeneral')}</option>
              </select>
            </div>
          </div>

          {/* Row 4: Family count & Ration Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                {t('familyMembers')}
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={familyMembersCount}
                onChange={e => setFamilyMembersCount(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                {t('rationCardNo')}
              </label>
              <input
                type="text"
                value={rationCardNumber}
                onChange={e => setRationCardNumber(e.target.value)}
                placeholder="KA120XXXXXXXX"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800 font-mono"
              />
            </div>
          </div>

          {/* Row 5: Address */}
          <div>
            <label className="text-slate-700 font-semibold block mb-1">
              {t('address')} & {t('village')}
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder={isKannada ? 'ಮನೆ ನಂಬರ್, ಕ್ರಾಸ್, ಗ್ರಾಮ/ವಾರ್ಡ್ ಹೆಸರು...' : 'House no, cross, village or ward...'}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-blue-800"
            />
          </div>

          {/* Upload Attachments Preview */}
          <div className="pt-2 border-t border-slate-200">
            <span className="text-[11px] font-semibold text-slate-700 block mb-2">
              {isKannada ? 'ಲಗತ್ತಿಸಲಾದ ಕಡತಗಳು (ಪರೀಕ್ಷಾರ್ಥ ಡೆಮೊ ದಾಖಲೆಗಳು):' : 'Attached Demonstration Documents:'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {uploadedDocs.map((doc, idx) => (
                <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                    <span className="text-[11px] truncate">{doc.title}</span>
                  </div>
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0f2b5c] hover:bg-[#1a428a] rounded transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (isKannada ? 'ನೋಂದಾಯಿಸಲಾಗುತ್ತಿದೆ...' : 'Submitting...') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
