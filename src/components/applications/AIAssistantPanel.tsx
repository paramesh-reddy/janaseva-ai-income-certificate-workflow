import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Application, AIReviewResult, WorkflowStage } from '../../types';
import { api } from '../../services/api';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  FileSearch,
  ShieldAlert,
  Cpu,
  RefreshCw,
  Info,
  Layers
} from 'lucide-react';

interface AIAssistantPanelProps {
  application: Application;
  currentStage: WorkflowStage;
  onReviewCompleted: (review: AIReviewResult) => void;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  application,
  currentStage,
  onReviewCompleted
}) => {
  const { t, isKannada } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  // Get the most recent review for the current application
  const latestReview = application.aiReviews && application.aiReviews.length > 0
    ? application.aiReviews[0]
    : null;

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    try {
      const stage = (currentStage === 'ELIGIBILITY_VERIFICATION' || currentStage === 'FINAL_DECISION')
        ? 'ELIGIBILITY_VERIFICATION'
        : 'DOCUMENT_VERIFICATION';
      const review = await api.runAiReview(application.id, stage);
      onReviewCompleted(review);
    } catch (e) {
      console.error('Failed to run AI analysis', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
      {/* AI Header */}
      <div className="bg-[#0f2b5c] text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-800 text-amber-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs tracking-wide">
              {t('aiAssistantTitle')}
            </h3>
            <span className="text-[10px] text-blue-200 block">
              {latestReview?.isLiveModel ? t('aiModelLive') : t('aiModelDemo')}
            </span>
          </div>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0f2b5c] bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded transition-colors shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? (isKannada ? 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...' : 'Analyzing...') : t('aiRunAnalysis')}</span>
        </button>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
        <span className="leading-tight">
          {t('aiAssistantNotice')}
        </span>
      </div>

      {/* AI Findings Body */}
      <div className="p-4 space-y-4 text-xs">
        {isLoading ? (
          <div className="py-8 text-center text-slate-500">
            <Cpu className="w-8 h-8 text-blue-900 animate-pulse mx-auto mb-2" />
            <p className="font-semibold text-slate-800">{t('aiRunningAnalysis')}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {isKannada ? 'OCR ಪಠ್ಯ ಹೊರತೆಗೆಯುವಿಕೆ, ಆದಾಯ ಹೋಲಿಕೆ ಮತ್ತು ಸಕಾಲ ಮಿತಿ ಪರೀಕ್ಷೆ ನಡೆಯುತ್ತಿದೆ' : 'Executing OCR text parsing, income variance check, and scheme benchmarks'}
            </p>
          </div>
        ) : latestReview ? (
          <>
            {/* Stage-Contextual Summary */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <div className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                <FileSearch className="w-3.5 h-3.5 text-[#0f2b5c]" />
                <span>{isKannada ? 'AI ಸಾರಾಂಶ (Executive Summary)' : 'AI Executive Summary'}</span>
              </div>
              <p className="text-slate-900 leading-relaxed font-medium">
                {isKannada ? latestReview.summaryKannada : latestReview.summary}
              </p>
            </div>

            {/* AI Preliminary Recommendation */}
            <div className={`p-3 rounded border ${
              latestReview.recommendation === 'RECOMMEND_APPROVE'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : latestReview.recommendation === 'NEEDS_OFFICER_REVIEW'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="font-bold text-xs flex items-center justify-between mb-1">
                <span>{t('aiPreliminaryRec')}:</span>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-white/80 border">
                  {latestReview.recommendation}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {isKannada ? latestReview.recommendationTextKannada : latestReview.recommendationText}
              </p>
            </div>

            {/* Structured Findings List */}
            {latestReview.findings && latestReview.findings.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-700 text-xs mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('aiDiscrepancyFound')}</span>
                </h4>
                <div className="space-y-2">
                  {latestReview.findings.map((f, fIdx) => (
                    <div
                      key={fIdx}
                      className={`p-2.5 rounded border text-[11px] ${
                        f.severity === 'HIGH'
                          ? 'bg-red-50/70 border-red-200 text-red-950'
                          : f.severity === 'MEDIUM'
                          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{isKannada ? f.titleKannada : f.title}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-white border font-mono">
                          {f.severity}
                        </span>
                      </div>
                      <p className="mt-0.5 text-slate-700 leading-normal">
                        {isKannada ? f.descriptionKannada : f.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checklist Findings */}
            {latestReview.checklist && latestReview.checklist.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-700 text-xs mb-2">
                  {isKannada ? 'ಸ್ವಯಂಚಾಲಿತ ಪರಿಶೀಲನಾ ಪಾಯಿಂಟ್‌ಗಳು' : 'Algorithmic Verification Points'}
                </h4>
                <div className="space-y-1.5">
                  {latestReview.checklist.map(c => (
                    <div
                      key={c.key}
                      className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-[11px]"
                    >
                      <span className="text-slate-800 font-medium">
                        {isKannada ? c.labelKannada : c.label}
                      </span>
                      <span className={`font-semibold ${c.passed ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {c.passed ? '✓ PASS' : '! FLAG'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audit footprint */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{latestReview.modelUsed}</span>
              <span>{latestReview.generatedAt}</span>
            </div>
          </>
        ) : (
          <div className="py-6 text-center text-slate-500">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">
              {isKannada ? 'AI ವಿಶ್ಲೇಷಣೆ ನಡೆಸಲಾಗಿಲ್ಲ' : 'AI Analysis Pending'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              {isKannada
                ? 'ದಾಖಲೆಗಳಲ್ಲಿನ ಆದಾಯ ವ್ಯತ್ಯಾಸಗಳು ಮತ್ತು ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಲು ಮೇಲಿನ ಬಟನ್ ಒತ್ತಿ.'
                : 'Click "Run AI Review" above to extract document data and compare declared income.'}
            </p>
            <button
              onClick={handleRunAnalysis}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-white bg-[#0f2b5c] hover:bg-[#1a428a] rounded shadow-2xs"
            >
              {t('aiRunAnalysis')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
