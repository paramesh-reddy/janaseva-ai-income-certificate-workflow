import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Application, DocumentItem, DocumentVerificationStatus } from '../../types';
import {
  FileCheck,
  FileQuestion,
  AlertOctagon,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertTriangle,
  Upload,
  Info
} from 'lucide-react';

interface Stage2DocVerificationProps {
  application: Application;
  onVerifyDocument: (docId: string, status: DocumentVerificationStatus, comments?: string) => Promise<void>;
  onAdvanceToNextStage: () => void;
}

export const Stage2DocVerification: React.FC<Stage2DocVerificationProps> = ({
  application,
  onVerifyDocument,
  onAdvanceToNextStage
}) => {
  const { t, isKannada } = useLanguage();
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [commentInput, setCommentInput] = useState<{ [docId: string]: string }>({});
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleStatusChange = async (doc: DocumentItem, status: DocumentVerificationStatus) => {
    setIsUpdating(doc.id);
    const comment = commentInput[doc.id] || doc.officerComments || '';
    await onVerifyDocument(doc.id, status, comment);
    setIsUpdating(null);
  };

  const getDocStatusBadge = (status: DocumentVerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            {isKannada ? 'ದೃಢೀಕರಿಸಲಾಗಿದೆ' : 'Verified'}
          </span>
        );
      case 'UNCLEAR':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <FileQuestion className="w-3 h-3 text-amber-600" />
            {isKannada ? 'ಅಸ್ಪಷ್ಟವಾಗಿದೆ' : 'Unclear / Blurred'}
          </span>
        );
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-800 border border-red-200">
            <AlertOctagon className="w-3 h-3 text-red-600" />
            {isKannada ? 'ಕಾಣೆಯಾಗಿದೆ' : 'Missing'}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            {isKannada ? 'ಅಮಾನ್ಯ' : 'Invalid / Rejected'}
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {isKannada ? 'ಪರಿಶೀಲನೆ ಬಾಕಿ' : 'Pending Verification'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice on Human Authority */}
      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-md text-xs text-blue-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#0f2b5c] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">{isKannada ? 'ಅಧಿಕಾರಿಗಳ ಗಮನಕ್ಕೆ:' : 'Officer Instruction:'}</span>{' '}
          {isKannada
            ? 'ಪ್ರತಿಯೊಂದು ದಾಖಲೆಯನ್ನು ಕಣ್ಣಾರೆ ಪರಿಶೀಲಿಸಿ ಸ್ಥಿತಿ ನಿಗದಿಪಡಿಸಿ. AI ಹೊರತೆಗೆದ OCR ವಿವರಗಳು ಕೇವಲ ಪರಿಶೀಲನಾ ಸಹಾಯಕವಾಗಿದ್ದು, ಕಾನೂನುಬದ್ಧ ನಿರ್ಧಾರವನ್ನು ಅಧಿಕಾರಿಯೇ ದೃಢಪಡಿಸಬೇಕು.'
            : 'Inspect each uploaded document. Algorithmic OCR findings serve solely as administrative aids; the officer is legally responsible for verifying authenticity.'}
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {application.documents.map((doc, idx) => (
          <div
            key={doc.id}
            className={`bg-white border rounded-md p-4 transition-all ${
              doc.verificationStatus === 'VERIFIED'
                ? 'border-emerald-200 shadow-2xs'
                : doc.verificationStatus === 'UNCLEAR' || doc.verificationStatus === 'MISSING'
                ? 'border-amber-300 bg-amber-50/20'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-[#0f2b5c]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs">{doc.title}</h4>
                    <span className="font-mono text-[10px] text-slate-400">({doc.fileName})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {t('uploadDate')}: {doc.uploadedAt} · {doc.fileSize}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getDocStatusBadge(doc.verificationStatus)}
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#0f2b5c] bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('actionPreview')}</span>
                </button>
              </div>
            </div>

            {/* OCR Extract & AI Flags */}
            <div className="pt-3 grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
              {/* OCR Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                  <span>{isKannada ? 'OCR ಪಠ್ಯ ಮಾಹಿತಿ (Text Extract)' : 'OCR Extracted Content'}</span>
                  {doc.ocrConfidence && (
                    <span className="font-mono text-emerald-700">
                      {isKannada ? 'ನಿಖರತೆ:' : 'Confidence:'} {doc.ocrConfidence}%
                    </span>
                  )}
                </div>
                <pre className="text-[11px] font-mono whitespace-pre-wrap text-slate-800 max-h-24 overflow-y-auto leading-relaxed">
                  {doc.ocrExtractedText || (isKannada ? 'ಯಾವುದೇ ಪಠ್ಯ ಲಭ್ಯವಿಲ್ಲ' : 'No OCR extract available')}
                </pre>
                {doc.extractedIncome !== undefined && (
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between font-semibold">
                    <span className="text-slate-600">{isKannada ? 'ದಾಖಲೆಯಲ್ಲಿ ನಮೂದಾದ ಆದಾಯ:' : 'Document Extracted Income:'}</span>
                    <span className="font-mono text-blue-900 font-bold">
                      ₹{doc.extractedIncome.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              {/* Officer Verification Actions */}
              <div className="flex flex-col justify-between">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    {t('addComment')}
                  </label>
                  <input
                    type="text"
                    value={commentInput[doc.id] !== undefined ? commentInput[doc.id] : doc.officerComments || ''}
                    onChange={e => setCommentInput({ ...commentInput, [doc.id]: e.target.value })}
                    placeholder={isKannada ? 'ಪರಿಶೀಲನಾ ಟಿಪ್ಪಣಿ ನಮೂದಿಸಿ...' : 'Enter officer verification remark...'}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-800 focus:outline-hidden"
                  />
                  {doc.aiFlags && doc.aiFlags.length > 0 && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        {doc.aiFlags.map((flag, fIdx) => (
                          <div key={fIdx}>{flag}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3">
                  <button
                    disabled={isUpdating === doc.id}
                    onClick={() => handleStatusChange(doc, 'VERIFIED')}
                    className="flex-1 py-1.5 px-2 text-xs font-semibold rounded text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors"
                  >
                    ✓ {t('actionVerify')}
                  </button>
                  <button
                    disabled={isUpdating === doc.id}
                    onClick={() => handleStatusChange(doc, 'UNCLEAR')}
                    className="flex-1 py-1.5 px-2 text-xs font-medium rounded text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors"
                  >
                    ! {t('actionMarkUnclear')}
                  </button>
                  <button
                    disabled={isUpdating === doc.id}
                    onClick={() => handleStatusChange(doc, 'MISSING')}
                    className="flex-1 py-1.5 px-2 text-xs font-medium rounded text-red-800 bg-red-50 hover:bg-red-100 border border-red-300 transition-colors"
                  >
                    ✕ {t('actionMarkMissing')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stage transition footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-500">
          {isKannada ? 'ದಾಖಲೆಗಳ ಸ್ಥಿತಿ ಪೂರ್ಣಗೊಂಡ ನಂತರ ಅರ್ಹತಾ ಪರಿಶೀಲನೆಗೆ ತೆರಳಿ' : 'Once documents are verified, proceed to eligibility evaluation'}
        </span>
        <button
          onClick={onAdvanceToNextStage}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#0f2b5c] hover:bg-[#1a428a] rounded-md transition-colors shadow-xs"
        >
          {isKannada ? 'ಹಂತ ೩ ಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ (ಅರ್ಹತಾ ಪರಿಶೀಲನೆ)' : 'Advance to Stage 3: Eligibility Verification'} →
        </button>
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0f2b5c]" />
                <h3 className="font-bold text-sm text-slate-900">{selectedDoc.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-100 border border-slate-300 rounded p-6 text-center mb-4">
              <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-xs border border-slate-200 mb-3 text-[#0f2b5c]">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">{selectedDoc.fileName}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {selectedDoc.mimeType} · {selectedDoc.fileSize}
              </p>
              <div className="mt-4 p-4 bg-white border border-slate-200 rounded text-left">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {isKannada ? 'ಕಡತದ ಪೂರ್ವವೀಕ್ಷಣೆ ಹಾಗೂ ವಿವರಗಳು' : 'Simulated Document Inspection View'}
                </div>
                <div className="space-y-1.5 text-xs text-slate-700 font-mono bg-slate-50 p-3 rounded">
                  {selectedDoc.ocrExtractedText?.split('\n').map((line, lIdx) => (
                    <div key={lIdx}>{line}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
