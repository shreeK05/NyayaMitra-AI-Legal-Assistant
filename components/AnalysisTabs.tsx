
import React, { useState } from 'react';
import { LegalResponse } from '../types';

interface AnalysisTabsProps {
  english: string;
  hindi: string;
  marathi: string;
  response: LegalResponse;
}

const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ english, hindi, marathi, response }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'statutes' | 'caselaw' | 'actions'>('analysis');

  const renderCaseLaws = () => {
    if (!response.caseLaws || response.caseLaws.length === 0) {
      return <p className="text-slate-600 text-sm">No specific case laws identified for this issue.</p>;
    }

    return (
      <div className="space-y-4">
        {response.caseLaws.map((caseLaw, idx) => (
          <div key={idx} className="group bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-2 border-blue-200 hover:border-blue-400 p-5 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg">
            <div className="flex justify-between items-start gap-2 mb-3">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm leading-snug">{caseLaw.caseTitle}</h4>
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                  <i className="fa-solid fa-building text-blue-600"></i>
                  {caseLaw.courtName}, <span className="font-semibold">{caseLaw.year}</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md group-hover:shadow-lg">
                  {caseLaw.relevancePercentage}% Match
                </span>
                <span className="text-[10px] text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full font-semibold">Case Law</span>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed hover:text-slate-800 transition">{caseLaw.summary}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderStatutes = () => {
    if (!response.applicableStatutes || response.applicableStatutes.length === 0) {
      return <p className="text-slate-600 text-sm">No specific statutes identified.</p>;
    }

    return (
      <div className="space-y-4">
        {response.applicableStatutes.map((statute, idx) => (
          <div key={idx} className="group bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 hover:border-amber-400 p-5 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg">
            <div className="mb-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <i className="fa-solid fa-gavel text-amber-600"></i>
                  {statute.actName}
                </h4>
                <span className="text-[10px] text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">Statute</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {statute.sections.map((section, sidx) => (
                  <span key={sidx} className="bg-amber-200 text-amber-900 text-xs px-3 py-1.5 rounded-lg font-mono font-bold shadow-sm hover:bg-amber-300 transition">
                    § {section}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-700 mb-3"><strong className="text-slate-800">Applicability:</strong> {statute.applicability}</p>
            {statute.penalties && (
              <div className="text-sm text-red-700 bg-gradient-to-r from-red-50 to-rose-50 p-3 rounded-lg border border-red-200 font-medium">
                <strong className="flex items-center gap-2 text-red-800 mb-1">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                  Penalties:
                </strong> 
                {statute.penalties}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderActionSteps = () => {
    if (!response.actionSteps || response.actionSteps.length === 0) {
      return <p className="text-slate-600 text-sm">No specific action steps identified.</p>;
    }

    return (
      <div className="space-y-4">
        {response.actionSteps
          .sort((a, b) => a.stepNumber - b.stepNumber)
          .map((step, idx) => {
            const urgencyConfig = {
              'HIGH': { bg: 'from-red-50 to-rose-50', border: 'border-red-300', badge: 'bg-red-500', text: 'text-red-800', icon: 'fa-fire' },
              'MEDIUM': { bg: 'from-yellow-50 to-amber-50', border: 'border-yellow-300', badge: 'bg-yellow-500', text: 'text-yellow-800', icon: 'fa-clock' },
              'LOW': { bg: 'from-green-50 to-emerald-50', border: 'border-green-300', badge: 'bg-green-500', text: 'text-green-800', icon: 'fa-check' }
            };
            const config = urgencyConfig[step.urgency];
            return (
              <div key={idx} className={`group bg-gradient-to-r ${config.bg} border-2 ${config.border} hover:shadow-lg p-5 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-sm`}>
                <div className="flex items-start gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 ${config.badge} text-white rounded-full font-bold text-sm shadow-lg group-hover:scale-110 transition transform flex-shrink-0`}>
                    {step.stepNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-base ${config.text} mb-1`}>{step.action}</p>
                    <p className={`text-xs ${config.text} opacity-80 mb-2 flex items-center gap-1`}>
                      <i className={`fa-solid ${config.icon}`}></i>
                      Timeframe: <strong>{step.timeframe}</strong>
                    </p>
                  </div>
                  <span className={`${config.badge} text-white text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-md flex-shrink-0`}>
                    {step.urgency} PRIORITY
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  const renderProsCons = () => {
    const hasPros = response.prosCons?.pros && response.prosCons.pros.length > 0;
    const hasCons = response.prosCons?.cons && response.prosCons.cons.length > 0;

    if (!hasPros && !hasCons) {
      return <p className="text-slate-600 text-sm">No pros and cons analysis available.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hasPros && (
          <div className="group bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 hover:border-green-400 p-6 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg">
            <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2 text-base">
              <i className="fa-solid fa-circle-check text-green-600 text-xl"></i>
              Advantages
            </h4>
            <ul className="space-y-3">
              {response.prosCons.pros.map((pro, idx) => (
                <li key={idx} className="text-sm text-green-900 flex items-start gap-3 group/item">
                  <span className="text-green-600 font-bold text-lg flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition transform">✓</span>
                  <span className="leading-relaxed">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasCons && (
          <div className="group bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border-2 border-red-300 hover:border-red-400 p-6 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg">
            <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2 text-base">
              <i className="fa-solid fa-triangle-exclamation text-red-600 text-xl"></i>
              Risks & Challenges
            </h4>
            <ul className="space-y-3">
              {response.prosCons.cons.map((con, idx) => (
                <li key={idx} className="text-sm text-red-900 flex items-start gap-3 group/item">
                  <span className="text-red-600 font-bold text-lg flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition transform">⚠</span>
                  <span className="leading-relaxed">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'analysis', label: 'Analysis', icon: 'fa-book-open' },
    { id: 'statutes', label: 'Applicable Laws', icon: 'fa-scale-balanced' },
    { id: 'caselaw', label: 'Case Law', icon: 'fa-briefcase' },
    { id: 'actions', label: 'Action Steps', icon: 'fa-list-check' },
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-300 mb-0 bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-3xl overflow-x-auto shadow-md">
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border-b-3 relative group ${
              activeTab === tab.id 
                ? 'bg-gradient-to-b from-blue-100 to-blue-50 text-blue-700 border-blue-600 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 border-transparent'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-lg`}></i>
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-7 bg-white border-2 border-t-0 border-slate-300 rounded-b-3xl shadow-lg min-h-[300px] animate-blur-in">
        {activeTab === 'analysis' && (
          <div className="space-y-5">
            <div className="prose prose-sm max-w-none">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-base text-justify">
                {english}
              </p>
            </div>
            {response.analysisConfidence && (
              <div className="mt-8 pt-6 border-t-2 border-slate-200">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Analysis Confidence:</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-3 max-w-xs shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${response.analysisConfidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">{response.analysisConfidence}%</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'statutes' && renderStatutes()}
        {activeTab === 'caselaw' && renderCaseLaws()}
        {activeTab === 'actions' && renderActionSteps()}
      </div>

      {/* Pros/Cons Quick Access */}
      {response.prosCons && (response.prosCons.pros?.length || 0) + (response.prosCons.cons?.length || 0) > 0 && (
        <div className="mt-6">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-2xl border-2 border-slate-200 mb-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3">
              <i className="fa-solid fa-scale-balanced text-blue-600"></i>
              Pros & Cons Analysis
            </h4>
            {renderProsCons()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisTabs;