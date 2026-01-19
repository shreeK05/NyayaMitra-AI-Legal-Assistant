import React, { useState, useEffect, useRef } from 'react';

interface VoiceInputProps {
  onTranscribed: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscribed, disabled = false, placeholder = "Click to start speaking..." }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'HI' | 'MR'>('EN');
  const transcriptRef = useRef('');
  const recognitionRef = useRef<any>(null);

  // Language to locale code mapping
  const languageMap: Record<string, string> = {
    'EN': 'en-IN',
    'HI': 'hi-IN',
    'MR': 'mr-IN'
  };

  const languageLabels: Record<string, string> = {
    'EN': 'English',
    'HI': 'हिंदी',
    'MR': 'मराठी'
  };

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in this browser');
      return;
    }

    const recognizer = new SpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = languageMap[selectedLanguage];
    recognizer.maxAlternatives = 1;

    let interimTranscript = '';

    recognizer.onstart = () => {
      setIsListening(true);
      setError(null);
      transcriptRef.current = '';
      interimTranscript = '';
      console.log(`🎙️ Listening in ${selectedLanguage}...`);
    };

    recognizer.onresult = (event: any) => {
      interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;
        
        console.log(`[${isFinal ? 'FINAL' : 'INTERIM'}] ${transcript}`);
        
        if (isFinal) {
          // Add final transcript
          transcriptRef.current = transcriptRef.current ? transcriptRef.current + ' ' + transcript : transcript;
          setTranscript(transcriptRef.current);
        } else {
          // Accumulate interim results
          interimTranscript += transcript;
        }
      }
    };

    recognizer.onerror = (event: any) => {
      console.error('Speech Recognition Error:', event.error);
      if (event.error === 'no-speech') {
        setError('No speech detected. Please speak clearly.');
      } else if (event.error === 'network') {
        setError('Network error. Check your internet connection.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Allow in browser settings.');
      } else {
        setError(`Error: ${event.error}`);
      }
    };

    recognizer.onend = () => {
      console.log('Recording ended. Transcript:', transcriptRef.current);
      setIsListening(false);
      
      if (transcriptRef.current && transcriptRef.current.trim()) {
        console.log('✅ Sending transcript:', transcriptRef.current);
        onTranscribed(transcriptRef.current);
        transcriptRef.current = '';
        setTranscript('');
      } else {
        if (!error) {
          setError('No speech detected. Please try again.');
        }
      }
    };

    recognitionRef.current = recognizer;
    setRecognition(recognizer);
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [selectedLanguage, onTranscribed, error]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError('Speech Recognition not available');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      transcriptRef.current = '';
      setError(null);
      // Set language before starting
      recognitionRef.current.lang = languageMap[selectedLanguage];
      console.log(`Starting recognition in ${selectedLanguage} (${languageMap[selectedLanguage]})`);
      recognitionRef.current.start();
    }
  };

  const changeLanguage = (lang: 'EN' | 'HI' | 'MR') => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    setSelectedLanguage(lang);
    setTranscript('');
    transcriptRef.current = '';
    setError(null);
  };

  const clearTranscript = () => {
    setTranscript('');
    transcriptRef.current = '';
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Language Selector */}
      <div className="flex gap-3 items-center flex-wrap">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Language:</span>
        <div className="flex gap-2 bg-gradient-to-r from-slate-100 to-blue-50 p-1.5 rounded-xl border-2 border-slate-300 shadow-sm">
          {(['EN', 'HI', 'MR'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              disabled={disabled || isListening}
              type="button"
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all transform ${
                selectedLanguage === lang
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              } ${disabled || isListening ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              title={`Switch to ${languageLabels[lang]}`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Input Controls */}
      <div className="flex gap-3 items-stretch">
        <button
          type="button"
          onClick={startListening}
          disabled={disabled}
          title={`Click to ${isListening ? 'stop' : 'start'} recording in ${languageLabels[selectedLanguage]}`}
          className={`relative px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 font-bold flex-1 text-base border-2 transform hover:scale-105 active:scale-95 ${
            isListening
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-700 shadow-lg animate-pulse'
              : disabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 border-indigo-700 shadow-lg hover:shadow-xl'
          }`}
        >
          <i className={`fa-solid ${isListening ? 'fa-microphone' : 'fa-microphone-slash'} text-2xl`}></i>
          <span>
            {isListening 
              ? `🎙️ Recording in ${languageLabels[selectedLanguage]}...` 
              : `Speak ${languageLabels[selectedLanguage]}`}
          </span>
        </button>

        {transcript && (
          <button
            type="button"
            onClick={clearTranscript}
            className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-red-100 hover:to-red-200 text-slate-700 hover:text-red-600 rounded-2xl transition-all transform hover:scale-110 active:scale-95 border-2 border-slate-300 hover:border-red-300 shadow-md"
            title="Clear transcript"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        )}
      </div>

      {/* Transcribed Text Display */}
      {transcript && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-5 shadow-md animate-bounce-in">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i className="fa-solid fa-check-circle"></i>
            Transcribed Text
          </p>
          <p className="text-base text-slate-800 font-medium leading-relaxed">{transcript}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 rounded-2xl p-4 shadow-md animate-bounce-in">
          <p className="text-sm font-bold text-red-700 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </p>
        </div>
      )}

      {/* Language Help Text */}
      {!isListening && !transcript && !error && (
        <p className="text-xs text-slate-600 italic bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-200 flex items-start gap-2">
          <i className="fa-solid fa-lightbulb text-blue-600 mt-0.5 flex-shrink-0"></i>
          <span>
            {selectedLanguage === 'EN' && 'Speak clearly in English or Indian English accent. Works best with natural speech.'}
            {selectedLanguage === 'HI' && 'हिंदी में स्पष्ट रूप से बोलें। Hinglish (हिंदी + English) भी काम करता है।'}
            {selectedLanguage === 'MR' && 'मराठीत स्पष्टपणे बोला. मराठी-इंग्लिश मिश्रण देखील कार्य करते.'}
          </span>
        </p>
      )}
    </div>
  );
};

export default VoiceInput;
