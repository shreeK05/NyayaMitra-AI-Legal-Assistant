import React, { useState, useRef, useEffect } from 'react';
import { getLegalAdvice } from './services/geminiService';
import { LegalResponse, HistoryItem, AppLanguage } from './types';
import AnalysisTabs from './components/AnalysisTabs';
import LegalNotice from './components/LegalNotice';
import VoicePlayer from './components/VoicePlayer';
import VoiceInput from './components/VoiceInput';

const STORAGE_KEY = 'nyayamitra_history';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [outputLanguage, setOutputLanguage] = useState<AppLanguage>('EN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeItem, setActiveItem] = useState<HistoryItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ data: string; mimeType: string } | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load history from localStorage on component mount
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  useEffect(() => {
    if (activeItem) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeItem, isLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setSelectedFile({
          data: base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !selectedFile) return;

    setIsLoading(true);
    setError(null);
    setActiveItem(null);

    try {
      const result = await getLegalAdvice(query || "Please analyze this document.", selectedFile || undefined);
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        query: query || "Document Analysis",
        response: result,
        timestamp: Date.now(),
        hasDocument: !!selectedFile
      };
      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      setActiveItem(newItem);
      setQuery('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExample = (text: string) => {
    setQuery(text);
  };

  const handleVoiceInput = (transcribedText: string) => {
    setQuery(prev => prev ? prev + ' ' + transcribedText : transcribedText);
  };

  const deleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    if (activeItem?.id === id) {
      setActiveItem(null);
    }
  };

  const clearAllHistory = () => {
    if (confirm('Are you sure you want to delete all consultations? This cannot be undone.')) {
      setHistory([]);
      setActiveItem(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getAnalysisForAudio = (res: LegalResponse) => {
    if (outputLanguage === 'HI') return res.hindiAnalysis;
    if (outputLanguage === 'MR') return res.marathiAnalysis;
    return res.englishAnalysis;
  };

  const exampleQueries = [
    "My employer denied me leave without valid reason - what are my rights?",
    "I received an eviction notice from my landlord - how should I respond?",
    "Neighbor's wall is constructed on my property - what legal action can I take?",
    "Company hasn't paid my salary for 2 months - what should I do?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-5 shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-3 rounded-lg shadow-lg transform hover:scale-110 transition-transform">
              <i className="fa-solid fa-scale-balanced text-slate-900 text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">NyayaMitra</h1>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Professional AI Legal Assistant for India</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-700 p-1.5 rounded-xl border border-slate-600 shadow-lg">
            {(['EN', 'HI', 'MR'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setOutputLanguage(lang)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  outputLanguage === lang 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 shadow-lg scale-105' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }`}
              >
                {lang === 'EN' ? 'English' : lang === 'HI' ? 'हिंदी' : 'मराठी'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero Section */}
        {!activeItem && !isLoading && (
          <div className="text-center mb-12 animate-in fade-in duration-700">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Your Personal Legal Advisor</h2>
            <p className="text-slate-700 text-lg max-w-3xl mx-auto mb-2">
              Get comprehensive legal analysis, applicable laws, case references, and professional legal notices—all powered by advanced AI.
            </p>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Available in English, Hindi, and Marathi. Instant responses tailored to Indian law.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 animate-in slide-in-from-top">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-exclamation text-red-600 text-xl mt-0.5"></i>
              <div>
                <h3 className="font-bold text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Input Form with Document Upload */}
        <section className="bg-gradient-to-br from-white via-blue-50 to-white p-10 rounded-3xl shadow-2xl border-2 border-slate-200 mb-10 transform hover:shadow-3xl transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-base font-bold text-slate-800 mb-4 flex items-center gap-3">
                <span className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-lg shadow-lg">
                  <i className="fa-solid fa-pen-to-square text-white"></i>
                </span>
                Describe Your Legal Issue
              </label>
              <div className="flex gap-3 mb-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <VoiceInput 
                    onTranscribed={handleVoiceInput}
                    disabled={isLoading}
                    placeholder="Speak in English, Hindi, or Marathi..."
                  />
                </div>
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="px-5 py-4 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-red-100 hover:to-red-200 text-slate-700 hover:text-red-600 rounded-2xl transition-all transform hover:scale-105 active:scale-95 border-2 border-slate-300 hover:border-red-300 font-bold shadow-md"
                    title="Clear text"
                  >
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                )}
              </div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Example: My landlord is refusing to return my security deposit after 3 months of moving out. What are my legal options?"
                className="w-full p-6 border-2 border-slate-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none min-h-[140px] text-slate-800 transition-all resize-none text-base font-medium shadow-sm hover:border-slate-400"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Document Upload */}
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-file-upload text-blue-600 text-lg"></i>
                  Upload Supporting Document (Optional)
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                    id="doc-upload"
                  />
                  <label
                    htmlFor="doc-upload"
                    className={`flex items-center justify-center gap-4 p-8 border-3 border-dashed rounded-2xl cursor-pointer transition-all transform hover:scale-102 ${
                      selectedFile 
                        ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 shadow-lg' 
                        : 'border-blue-400 hover:border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-slate-600 hover:text-blue-700 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <i className={`fa-solid ${selectedFile ? 'fa-file-circle-check' : 'fa-cloud-arrow-up'} text-4xl`}></i>
                    <div className="text-left">
                      <p className="font-bold text-base">{selectedFile ? '✓ Document Ready' : 'Upload Document'}</p>
                      <p className="text-sm opacity-80">{selectedFile ? 'Click to change file' : 'PNG, JPG, PDF...'}</p>
                    </div>
                    {selectedFile && (
                      <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="ml-auto text-green-700 hover:text-red-600 hover:scale-125 transition-transform bg-white p-2 rounded-full shadow-md"
                      >
                        <i className="fa-solid fa-xmark text-xl"></i>
                      </button>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  disabled={isLoading || (!query.trim() && !selectedFile)}
                  className={`px-10 py-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl text-lg border-2 transform hover:scale-105 active:scale-95 ${
                    isLoading || (!query.trim() && !selectedFile)
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed border-slate-400' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border-blue-800 hover:shadow-2xl'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block animate-bounce" style={{animationDelay: '0s'}}>
                        <i className="fa-solid fa-gavel text-xl"></i>
                      </span>
                      <span className="inline-block animate-bounce" style={{animationDelay: '0.2s'}}>
                        Analyzing
                      </span>
                      <span className="inline-block animate-bounce" style={{animationDelay: '0.4s'}}>
                        ...
                      </span>
                    </>
                  ) : (
                    <><i className="fa-solid fa-wand-magic-sparkles text-xl"></i> Get Analysis</>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Examples */}
            {!activeItem && !isLoading && (
              <div className="pt-6 border-t-2 border-slate-300">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-sparkles text-amber-500"></i>
                  Quick Examples:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {exampleQueries.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExample(example)}
                      type="button"
                      className="text-left text-sm bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 border-2 border-blue-300 hover:border-blue-400 p-4 rounded-xl transition-all hover:shadow-lg transform hover:scale-102 font-medium text-slate-800"
                    >
                      <p className="line-clamp-2 leading-snug">{example}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </section>

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 mb-6">
              <style>{`
                @keyframes gavel-swing {
                  0%, 100% { transform: rotateZ(-30deg); }
                  50% { transform: rotateZ(30deg); }
                }
                .gavel-animation {
                  animation: gavel-swing 1s ease-in-out infinite;
                  transform-origin: top center;
                }
                @keyframes scale-pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.1); }
                }
                .scale-pulse {
                  animation: scale-pulse 2s ease-in-out infinite;
                }
              `}</style>
              <div className="flex items-center justify-center h-24">
                <i className="fa-solid fa-gavel text-6xl text-blue-600 gavel-animation"></i>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Your Case</h3>
            <p className="text-slate-600 text-center max-w-md mb-4">
              Our AI is carefully reviewing your legal situation and preparing a comprehensive analysis...
            </p>
            <div className="flex gap-2 justify-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}

        {/* Results Area */}
        {activeItem && !isLoading && (
          <div className="space-y-8 animate-slide-in-from-bottom">
            {/* Suggested Action Card - Premium Design */}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-3 border-amber-300 p-8 rounded-3xl shadow-2xl transform hover:shadow-3xl transition-all duration-300">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                    <i className="fa-solid fa-bolt text-white text-2xl"></i>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-amber-900 font-bold text-lg uppercase tracking-wider mb-3">
                    Recommended Immediate Action
                  </h3>
                  <p className="text-slate-800 text-lg font-semibold leading-relaxed mb-4">
                    {activeItem.response.suggestedAction}
                  </p>
                  {activeItem.response.nextSteps && (
                    <div className="bg-white bg-opacity-70 rounded-xl p-4 border-l-4 border-amber-600">
                      <p className="text-slate-700 text-sm font-medium">
                        <strong className="text-amber-900">Next Steps:</strong> {activeItem.response.nextSteps}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Voice & Share Options - Premium Buttons */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <VoicePlayer 
                text={getAnalysisForAudio(activeItem.response)} 
                lang={outputLanguage} 
              />
              <button className="flex-1 bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-800 font-bold py-4 px-5 rounded-2xl transition-all flex items-center justify-center gap-3 border-2 border-slate-400 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-base">
                <i className="fa-solid fa-share-nodes text-lg"></i>
                Share Analysis
              </button>
            </div>

            {/* Analysis Tabs - Premium Design */}
            <div className="bg-white p-8 rounded-3xl border-3 border-slate-300 shadow-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-7 flex items-center gap-3">
                <span className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-lg">
                  <i className="fa-solid fa-magnifying-glass-chart text-white text-xl"></i>
                </span>
                Comprehensive Legal Analysis
              </h3>
              <AnalysisTabs 
                english={
                  outputLanguage === 'HI' ? activeItem.response.hindiAnalysis : 
                  outputLanguage === 'MR' ? activeItem.response.marathiAnalysis : 
                  activeItem.response.englishAnalysis
                }
                hindi={activeItem.response.hindiAnalysis}
                marathi={activeItem.response.marathiAnalysis}
                response={{
                  ...activeItem.response,
                  englishAnalysis: outputLanguage === 'HI' ? activeItem.response.hindiAnalysis : 
                                   outputLanguage === 'MR' ? activeItem.response.marathiAnalysis : 
                                   activeItem.response.englishAnalysis
                }}
              />
            </div>

            {/* Notice Templates */}
            <LegalNotice notices={{
              EN: activeItem.response.draftNoticeEN,
              HI: activeItem.response.draftNoticeHI,
              MR: activeItem.response.draftNoticeMR
            }} />

            {/* Disclaimers & Info - Premium Design */}
            {activeItem.response.disclaimers && activeItem.response.disclaimers.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-3 border-blue-400 p-8 rounded-3xl shadow-lg">
                <h4 className="font-bold text-blue-900 mb-5 flex items-center gap-3 text-lg">
                  <span className="bg-blue-500 text-white p-2 rounded-lg">
                    <i className="fa-solid fa-info-circle text-lg"></i>
                  </span>
                  Important Information & Disclaimers
                </h4>
                <ul className="space-y-3 text-base text-blue-900">
                  {activeItem.response.disclaimers.map((disclaimer, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <span className="text-blue-600 font-bold text-xl flex-shrink-0 mt-0.5">•</span>
                      <span className="leading-relaxed">{disclaimer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div ref={bottomRef} className="h-10" />
          </div>
        )}

        {/* History Section - Premium Design */}
        {!isLoading && history.length > 0 && (
          <section className="mt-20 border-t-3 border-gradient-to-r from-slate-300 via-blue-300 to-slate-300 pt-12">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h3 className="text-slate-900 font-bold uppercase text-lg tracking-widest flex items-center gap-3">
                <span className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-lg shadow-lg">
                  <i className="fa-solid fa-history text-white text-lg"></i>
                </span>
                Previous Consultations ({history.length})
              </h3>
              {history.length > 0 && (
                <button
                  onClick={clearAllHistory}
                  className="text-sm px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all border-2 border-red-700 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  title="Delete all consultations"
                >
                  <i className="fa-solid fa-trash mr-2"></i> Clear All
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`relative w-full text-left p-6 rounded-2xl border-2 transition-all flex flex-col gap-3 group transform hover:scale-105 cursor-pointer ${
                    activeItem?.id === item.id 
                      ? 'bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-500 shadow-xl ring-2 ring-blue-300' 
                      : 'bg-white border-slate-300 hover:border-blue-400 hover:shadow-lg'
                  }`}
                >
                  <button
                    onClick={() => setActiveItem(item)}
                    className="w-full text-left"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[12px] text-slate-600 font-bold uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-full">
                        {new Date(item.timestamp).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      {item.hasDocument && (
                        <span className="bg-gradient-to-r from-green-400 to-green-500 text-white text-[11px] px-3 py-1.5 rounded-full font-bold uppercase flex items-center gap-1.5 shadow-md">
                          <i className="fa-solid fa-file"></i> Document
                        </span>
                      )}
                    </div>
                    <p className="text-base font-semibold text-slate-800 line-clamp-2 mt-2 leading-snug">{item.query}</p>
                  </button>
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg transform hover:scale-110 shadow-md"
                    title="Delete this consultation"
                  >
                    <i className="fa-solid fa-trash text-base"></i>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t-2 border-slate-800 py-8 mt-auto">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-scale-balanced text-amber-400 text-xl"></i>
                <span className="font-bold text-white text-lg">NyayaMitra</span>
              </div>
              <p className="text-slate-400 text-sm">Professional AI Legal Assistant for India. Powered by Grok API.</p>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm uppercase mb-3">Services</h4>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>Legal Analysis</li>
                <li>Document Review</li>
                <li>Notice Drafting</li>
                <li>Case Research</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm uppercase mb-3">Disclaimer</h4>
              <p className="text-slate-500 text-xs">
                This service provides AI-generated analysis and is not a substitute for professional legal advice. Consult qualified legal professionals for formal proceedings.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} NyayaMitra. All rights reserved. | <span className="cursor-pointer hover:text-slate-400">Privacy Policy</span> | <span className="cursor-pointer hover:text-slate-400">Terms of Service</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;