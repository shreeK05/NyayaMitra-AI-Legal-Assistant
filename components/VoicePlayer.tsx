import React, { useState, useEffect } from 'react';

interface VoicePlayerProps {
  text: string;
  lang: 'EN' | 'HI' | 'MR';
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ text, lang }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    // 1. Initialize Browser Speech Engine
    if (typeof window !== 'undefined') {
      setSynth(window.speechSynthesis);
    }
  }, []);

  // 2. Handle Stop when component unmounts (navigating away)
  useEffect(() => {
    return () => {
      if (synth) synth.cancel();
    };
  }, [synth]);

  const handleSpeak = () => {
    if (!synth) {
      alert("Your browser does not support Text-to-Speech.");
      return;
    }

    // A. Stop if already speaking
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!text) return;

    // B. Clean the text (Remove Markdown like **bold** or # headers for smoother speech)
    const cleanText = text.replace(/[*#_]/g, '').trim();

    // C. Create Speech Request
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // D. Select Accurate Accents/Voices
    // Try to find Google-specific voices first, fallback to generic
    const voices = synth.getVoices();
    let selectedVoice = null;

    if (lang === 'HI') {
        utterance.lang = 'hi-IN';
        selectedVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi'));
    } else if (lang === 'MR') {
        utterance.lang = 'mr-IN'; // Marathi often uses Hindi engine if Marathi specific missing
        selectedVoice = voices.find(v => v.lang.includes('mr') || v.name.includes('Marathi') || v.lang.includes('hi'));
    } else {
        utterance.lang = 'en-IN'; // Indian English Accent
        selectedVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('India'));
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    
    utterance.rate = 0.9; // Slightly slower for professional tone
    utterance.pitch = 1.0;

    // E. Handle "Finish" event
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // F. Speak!
    synth.cancel(); // Stop any overlapping audio
    synth.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <button
      onClick={handleSpeak}
      className={`flex-1 font-bold py-4 px-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-base border-2 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
        isSpeaking
          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-700 animate-pulse'
          : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 border-indigo-700'
      }`}
    >
      <i className={`fa-solid ${isSpeaking ? 'fa-circle-stop' : 'fa-volume-high'} text-xl`}></i>
      <span>{isSpeaking ? 'Stop Reading' : 'Listen to Analysis'}</span>
    </button>
  );
};

export default VoicePlayer;