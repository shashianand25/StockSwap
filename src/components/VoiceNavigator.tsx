import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Lang = 'en' | 'hi';

const COMMAND_DICTIONARY: { path: string; keywords: Record<Lang, string[]> }[] = [
  {
    path: '/sell',
    keywords: {
      en: ['sell', 'add item', 'new listing', 'post'],
      hi: ['bechna', 'bechna hai', 'saman dalo', 'naya item'],
    },
  },
  {
    path: '/swap',
    keywords: {
      en: ['swap', 'trade', 'exchange', 'market'],
      hi: ['badalna', 'adla badli', 'exchange karna', 'bazaar'],
    },
  },
  {
    path: '/dashboard',
    keywords: {
      en: ['home', 'dashboard', 'main menu', 'back'],
      hi: ['ghar', 'wapas', 'home page', 'main'],
    },
  },
  {
    path: '/profile',
    keywords: {
      en: ['profile', 'my shop', 'account', 'settings'],
      hi: ['dukan', 'meri profile', 'account'],
    },
  },
];

function getTTSMessage(path: string, lang: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    '/sell': { en: 'Opening Sell Page', hi: 'Bechne ka page khol raha hoon' },
    '/swap': { en: 'Opening Marketplace', hi: 'Bazaar khol raha hoon' },
    '/dashboard': { en: 'Going to Dashboard', hi: 'Dashboard khol raha hai' },
    '/profile': { en: 'Opening Profile', hi: 'Profile khol raha hoon' },
  };

  return map[path] ? map[path][lang] ?? map[path].en : 'Opening page';
}

export function VoiceNavigator() {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Lang>('en');
  const [transcript, setTranscript] = useState<string>('');
  const toastTimer = useRef<number | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      recognitionRef.current = rec;
    } else {
      console.warn('Web Speech API not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const speak = (text: string, lang: Lang) => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-US';
    const voices = synth.getVoices();
    const match = voices.find(v => v.lang && v.lang.startsWith(u.lang));
    if (match) u.voice = match;
    synth.speak(u);
  };

  const handleVoiceCommand = (raw: string) => {
    const lower = raw.toLowerCase();
    // Search dictionary
    for (const entry of COMMAND_DICTIONARY) {
      const keywords = Object.values(entry.keywords).flat();
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          // Found a match
          setProcessing(true);
          // Speak feedback
          const msg = getTTSMessage(entry.path, selectedLang);
          speak(msg, selectedLang);
          // Navigate after a small delay to allow TTS to start
          setTimeout(() => {
            navigate(entry.path === '/sell' ? '/add-goods' : entry.path);
            setProcessing(false);
          }, 400);
          return true;
        }
      }
    }

    // No match
    const fallback = selectedLang === 'hi' ? "Maaf kijiye, main samajh nahi paaya. 'Bechna' kaho." : "Sorry, I didn't catch that. Try saying 'Sell' or 'Bechna'.";
    speak(fallback, selectedLang);
    return false;
  };

  const startListening = () => {
    if (!recognitionRef.current) return alert('Voice recognition not supported in this browser.');

    // set language for recognizer
    switch (selectedLang) {
      case 'hi': recognitionRef.current.lang = 'hi-IN'; break;
      default: recognitionRef.current.lang = 'en-US';
    }

    recognitionRef.current.start();
    setListening(true);

    recognitionRef.current.onresult = (event: any) => {
      const heard = event.results[0][0].transcript || '';
      setTranscript(heard);
      // show toast briefly
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setTranscript(''), 3000);

      setListening(false);
      handleVoiceCommand(heard);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setListening(false);
      setTranscript('');
    };

    recognitionRef.current.onend = () => setListening(false);
  };

  return (
    <div aria-live="polite">
      {/* Toast for detected transcript */}
      {transcript && (
        <div className="voice-toast" role="status">
          Hearing: "{transcript}"
        </div>
      )}

      <div className={`voice-fab ${listening ? 'listening' : ''} ${processing ? 'processing' : ''}`}>
        <div className="lang-toggle" aria-hidden>
          {(['en', 'hi'] as Lang[]).map(l => (
            <button
              key={l}
              onClick={() => setSelectedLang(l)}
              className={`lang-btn ${selectedLang === l ? 'active' : ''}`}
              aria-label={`Select language ${l}`}
            >
              {l === 'en' ? 'EN' : 'हिं'}
            </button>
          ))}
        </div>

        <button
          className="mic-btn"
          onClick={() => {
            if (listening) {
              recognitionRef.current?.stop();
              setListening(false);
              return;
            }
            startListening();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (listening) {
                recognitionRef.current?.stop();
                setListening(false);
                return;
              }
              startListening();
            }
          }}
          aria-label="Voice command"
          title="Voice command"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 11v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* sound wave */}
        {listening && (
          <div className="sound-wave" aria-hidden>
            <span /><span /><span />
          </div>
        )}
      </div>

      <style>{`
        .voice-toast{ position: fixed; right: 96px; bottom: 80px; background: rgba(15,23,42,0.95); color: #fff; padding: 8px 12px; border-radius: 8px; font-size: 13px; z-index: 60; box-shadow: 0 6px 18px rgba(2,6,23,0.3);}
        .voice-fab{ position: fixed; right: 20px; bottom: 28px; z-index: 60; display:flex; flex-direction:column; align-items:center; gap:8px; }
        .lang-toggle{ display:flex; gap:6px; margin-bottom:4px; }
        .lang-btn{ background: rgba(255,255,255,0.9); border:1px solid rgba(2,6,23,0.06); padding:6px 8px; border-radius:6px; font-size:12px; cursor:pointer; }
        .lang-btn.active{ background:#10B981; color:white; box-shadow: 0 6px 18px rgba(16,185,129,0.18); }
        .mic-btn{ background: linear-gradient(180deg,#10B981,#059669); width:56px; height:56px; border-radius:9999px; border:none; display:flex; align-items:center; justify-content:center; color:white; box-shadow: 0 8px 30px rgba(2,6,23,0.2); cursor:pointer; }
        .mic-btn:focus{ outline: 3px solid rgba(16,185,129,0.22); }
        .voice-fab.listening .mic-btn{ animation: pulse 1.6s infinite; }
        .voice-fab.processing .mic-btn{ animation:none; filter: grayscale(30%); }
        @keyframes pulse{ 0%{ box-shadow: 0 0 0 0 rgba(16,185,129,0.28);} 70%{ box-shadow: 0 0 0 18px rgba(16,185,129,0);} 100%{ box-shadow: 0 0 0 0 rgba(16,185,129,0);} }
        .sound-wave{ display:flex; gap:6px; margin-top:6px; }
        .sound-wave span{ width:6px; height:6px; background:#F43F5E; border-radius:3px; display:inline-block; animation: wave 1s infinite ease-in-out; }
        .sound-wave span:nth-child(2){ animation-delay: 0.12s; height:10px; }
        .sound-wave span:nth-child(3){ animation-delay: 0.24s; height:14px; }
        @keyframes wave{ 0%,100%{ transform: scaleY(1);} 50%{ transform: scaleY(1.8);} }
      `}</style>
    </div>
  );
}

export default VoiceNavigator;
