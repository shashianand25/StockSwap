import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

type Lang = 'en' | 'hi' | 'kn' | 'mr';

const SELL_KEYWORDS = ['sell', 'bechna', 'new item', 'add', 'dalo', 'marata', 'vikne'];
const SWAP_KEYWORDS = ['swap', 'market', 'exchange', 'badalna', 'vinimaya', 'adla badli'];
const DASH_KEYWORDS = ['home', 'dashboard', 'main', 'wapas', 'ghar', 'mane'];

export default function GlobalVoiceAssistant() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Lang>('en');
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // clean up on unmount
    return () => {
      try { recognitionRef.current?.stop?.(); } catch (e) {}
    };
  }, []);

  const tts = (message: string, lang: Lang) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(message);
    utter.lang = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(x => x.lang?.startsWith(utter.lang));
    if (v) utter.voice = v;
    window.speechSynthesis.speak(utter);
  };

  const handleNavigate = (path: string, pageName: string) => {
    setIsProcessing(true);
    tts(`Opening ${pageName}`, selectedLang);
    // small delay to make TTS audible before navigation
    setTimeout(() => {
      navigate(path);
      setIsProcessing(false);
    }, 350);
  };

  const handleResult = (value: string) => {
    const lower = value.toLowerCase();
    setTranscript(value);

    // CASE 1: SELL
    if (SELL_KEYWORDS.some(k => lower.includes(k))) {
      handleNavigate('/sell', 'Sell');
      return;
    }

    // CASE 2: SWAP
    if (SWAP_KEYWORDS.some(k => lower.includes(k))) {
      handleNavigate('/swap', 'Swap');
      return;
    }

    // CASE 3: DASHBOARD
    if (DASH_KEYWORDS.some(k => lower.includes(k))) {
      handleNavigate('/dashboard', 'Dashboard');
      return;
    }

    // No match: polite fallback
    tts("Sorry, I didn't catch that. Try saying 'Sell' or 'Home'.", selectedLang);
  };

  const startListening = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      tts('Speech recognition not supported in this browser', selectedLang);
      return;
    }

    try {
      const recognition = new SR();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      // default to en-IN as requested but allow language selection
      recognition.lang = selectedLang === 'hi' ? 'hi-IN' : selectedLang === 'kn' ? 'kn-IN' : selectedLang === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        const heard = event.results?.[0]?.[0]?.transcript || '';
        setIsListening(false);
        handleResult(heard);
      };

      recognition.onerror = (e: any) => {
        setIsListening(false);
        console.error('Speech recognition error', e);
        tts('Voice recognition error occurred', selectedLang);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Could not start recognition', err);
      tts('Failed to start voice recognition', selectedLang);
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="flex flex-col items-center gap-2">
        {/* Language Selector */}
        <div className="flex gap-2">
          {(['en', 'hi', 'kn', 'mr'] as Lang[]).map(l => (
            <button
              key={l}
              onClick={() => setSelectedLang(l)}
              className={`text-xs px-2 py-1 rounded-md border border-white/20 bg-black/60 text-white ${selectedLang === l ? 'ring-2 ring-green-400' : ''}`}
              aria-label={`Select language ${l}`}
            >
              {l === 'en' ? 'EN' : l === 'hi' ? 'हिं' : l === 'kn' ? 'ಕನ್' : 'मर'}
            </button>
          ))}
        </div>

        <button
          aria-label="Global voice command"
          title="Global voice command"
          onClick={() => {
            if (isListening) {
              recognitionRef.current?.stop?.();
              setIsListening(false);
              return;
            }
            startListening();
          }}
          className="relative flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white hover:bg-green-700 focus:outline-none"
        >
          {/* pulse ring when listening */}
          {isListening && (
            <span className="absolute inline-flex h-20 w-20 rounded-full bg-green-400 opacity-20 animate-ping" aria-hidden />
          )}
          <Mic className="w-6 h-6" />
        </button>

        {transcript && (
          <div className="mt-2 px-3 py-1 text-xs bg-black bg-opacity-80 text-white rounded-md max-w-xs truncate">
            Hearing: {transcript}
          </div>
        )}
      </div>
    </div>
  );
}
