import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Mic, MicOff, Volume2, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Mock inventory data
const MOCK_INVENTORY = [
    { name: 'Tata Salt', nameHi: 'टाटा नमक', price: 20, expiry: 15, quantity: 12, unit: 'packets' },
    { name: 'Maggi Noodles', nameHi: 'मैगी नूडल्स', price: 14, expiry: 5, quantity: 22, unit: 'packets' },
    { name: 'Parle-G Biscuits', nameHi: 'पारले-जी बिस्कुट', price: 5, expiry: 3, quantity: 30, unit: 'packets' },
    { name: 'Fresh Milk', nameHi: 'ताज़ा दूध', price: 28, expiry: 1, quantity: 10, unit: 'packets' },
    { name: 'Bread Loaf', nameHi: 'ब्रेड', price: 35, expiry: 2, quantity: 6, unit: 'pieces' },
];

// Language detection keywords
const LANGUAGE_KEYWORDS = {
    hindi: [
        'kitna', 'kya', 'hai', 'kab', 'bacha', 'banao', 'karu', 'mein', 'din', 'rupaye', 'bhaiya', // Hinglish
        'कितना', 'क्या', 'है', 'कब', 'बचा', 'बनाओ', 'करूं', 'में', 'दिन', 'रुपये', 'भैया', 'दाम', 'भाव', 'कीमत', 'स्टॉक', 'बिल', 'स्वैप' // Devanagari
    ],
    english: ['how', 'many', 'what', 'when', 'price', 'left', 'expiry', 'bill', 'swap', 'make', 'day', 'days'],
};

// Web Speech API Type Definitions
interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

// Suggested commands for each language
const SUGGESTED_COMMANDS = {
    en: [
        'Check item price',
        'Check expiry',
        'Show expiring items',
        'Make bill summary',
        'Swap suggestion',
        'Check stock quantity',
    ],
    hi: [
        'कीमत बताओ',
        'एक्सपायरी कब है',
        'जल्दी एक्सपायर होने वाले',
        'बिल बनाओ',
        'क्या स्वैप करूं',
        'स्टॉक कितना है',
    ],
};

type Language = 'en' | 'hi';

interface Message {
    id: string;
    type: 'user' | 'assistant';
    text: string;
    timestamp: Date;
    language?: Language;
}

// Detect language from user input
function detectLanguage(text: string): Language {
    const lowerText = text.toLowerCase();
    const scores = {
        hindi: 0,
        english: 0,
    };

    // Check for language-specific keywords
    Object.entries(LANGUAGE_KEYWORDS).forEach(([lang, keywords]) => {
        keywords.forEach(keyword => {
            if (lowerText.includes(keyword)) {
                scores[lang as keyof typeof scores]++;
            }
        });
    });

    // Return the language with highest score, default to English
    const maxLang = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a))[0];

    if (scores[maxLang as keyof typeof scores] === 0) return 'en';

    return maxLang === 'hindi' ? 'hi' : 'en';
}

// Get item name in specific language
function getItemName(item: any, lang: Language): string {
    if (lang === 'hi') return item.nameHi;
    return item.name;
}

// Process query and generate response
function processQuery(query: string, fallbackAlternate = false): { response: string; lang: Language; isFallback?: boolean } {
    const lang = detectLanguage(query);
    const lowerQuery = query.toLowerCase();

    // Keyword Helper
    const hasKeyword = (keywords: string[]) => keywords.some(k => lowerQuery.includes(k));

    // 1. Price & Valuation Lookup
    if (hasKeyword(['price', 'cost', 'rate', 'value', 'kya hai', 'kitne ka', 'daam', 'bhav', 'kimat', 'keemat', 'कीमत', 'दाम', 'भाव', 'रेट', 'पैसे'])) {
        const item = MOCK_INVENTORY.find(item =>
            lowerQuery.includes(item.name.toLowerCase()) ||
            lowerQuery.includes(getItemName(item, lang).toLowerCase())
        );

        if (item) {
            const itemName = getItemName(item, lang);
                if (lang === 'hi') return { response: `Boss, ${itemName} ka abhi ka rate ₹${item.price} hai. Market mein iski demand stable hai.`, lang, isFallback: false };
                return { response: `${itemName} is currently trading at ₹${item.price}. Demand is stable in the market.`, lang, isFallback: false };
        }
    }

    // 2. Expiry & Shelf Life Analysis
    if (hasKeyword(['expiry', 'expire', 'date', 'validity', 'kab', 'kharaab', 'din', 'एक्सपायरी', 'खराब', 'तारीख', 'कब तक'])) {
        const item = MOCK_INVENTORY.find(item =>
            lowerQuery.includes(item.name.toLowerCase()) ||
            lowerQuery.includes(getItemName(item, lang).toLowerCase())
        );

        if (item) {
            const itemName = getItemName(item, lang);
            const urgency = item.expiry < 5 ? (lang === 'hi' ? "Turant nikaalna padega!" : "Action needed immediately!") : "";

            if (lang === 'hi') return { response: `Dhyan dein: ${itemName} ${item.expiry} din mein expire ho jayega. ${urgency}`, lang, isFallback: false };
            return { response: `Alert: ${itemName} expires in ${item.expiry} days. ${urgency}`, lang, isFallback: false };
        }
    }

    // 3. Stock & Quantity Check
    if (hasKeyword(['stock', 'quantity', 'kitna', 'how many', 'left', 'count', 'inventory', 'bacha', 'स्टॉक', 'कितना', 'बचा', 'मात्रा'])) {
        const item = MOCK_INVENTORY.find(item =>
            lowerQuery.includes(item.name.toLowerCase()) ||
            lowerQuery.includes(getItemName(item, lang).toLowerCase())
        );

        if (item) {
            const itemName = getItemName(item, lang);
            const status = item.quantity < 15 ? (lang === 'hi' ? "Stock kam hai, reorder karein." : "Low stock, consider restocking.") : (lang === 'hi' ? "Stock paryapt hai." : "Stock levels are healthy.");

            if (lang === 'hi') return { response: `Sir, ${itemName} ke ${item.quantity} ${item.unit} stock mein hain. ${status}`, lang, isFallback: false };
            return { response: `Current inventory: ${item.quantity} ${item.unit} of ${itemName}. ${status}`, lang, isFallback: false };
        }
    }

    // 4. Critical Alerts (Expiring Soon)
    if (hasKeyword(['soon', 'jaldi', 'alert', 'risk', 'danger', 'kharab', 'जल्दी', 'तुरंत', 'खतरा', 'ध्यान दें'])) {
        const expiringItems = MOCK_INVENTORY.filter(item => item.expiry <= 5);
        const itemList = expiringItems.map(item => getItemName(item, lang)).join(', ');

        if (lang === 'hi') return { response: `⚠️ Critical Alert: Ye items jaldi expire hone wale hain: ${itemList}. Inhe Discount pe bech dein ya Swap karein.`, lang, isFallback: false };
        return { response: `⚠️ Critical Alert: These items need immediate attention: ${itemList}. Recommend liquidation or swapping.`, lang, isFallback: false };
    }

    // 5. Business Intelligence & Profitability (Exclusive Content)
    if (hasKeyword(['profit', 'margin', 'fayda', 'munafa', 'kamai', 'growth', 'analysis', 'report', 'मुनाफा', 'फायदा', 'लाभ', 'कमाई'])) {
        if (lang === 'hi') return { response: `📈 Business Insight: Pichle hafte aapka munafa 12% badha hai. 'Maggi Noodles' sabse zyada bikne wala item hai. Abhi 'Biscuits' ka stock badhane ka sahi samay hai.`, lang, isFallback: false };
        return { response: `📈 Exclusive Insight: Your margins are up by 12% this week. Top performer: 'Maggi Noodles'. Requirement detected: Consider increasing stock for 'Biscuits' to maximize turnover.`, lang, isFallback: false };
    }

    // 6. Swap & Trade Advice
    if (hasKeyword(['swap', 'trade', 'exchange', 'badalna', 'deal', 'offer', 'स्वैप', 'बदलना', 'अदला-बदली'])) {
        if (lang === 'hi') return { response: `💡 Smart Move: Aapke paas 'Fresh Milk' zyada hai jo jaldi kharab hoga. Isse 'Rice' ya 'Dal' ke saath swap karein jinki shelf life lambi hai.`, lang, isFallback: false };
        return { response: `💡 Recommendation: You have excess perishables. Suggest swapping 'Fresh Milk' for high-shelf-life staples like 'Rice' or 'Dal' to secure value.`, lang, isFallback: false };
    }

    // 7. General Inventory Overview
    if (hasKeyword(['bill', 'total', 'summary', 'hisab', 'khata', 'overview', 'बिल', 'कुल', 'हिसाब'])) {
        const total = MOCK_INVENTORY.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (lang === 'hi') return { response: `📊 Store Valuation: Aapki kul inventory ₹${total.toLocaleString()} ki hai. Sabse keemti asset 'Britannia Biscuits' hai.`, lang, isFallback: false };
        return { response: `📊 Valuation Report: Total inventory assets valued at ₹${total.toLocaleString()}. Top asset class: Biscuits.`, lang, isFallback: false };
    }

    // Default "Smart" Fallback
    // Default fallback alternates content based on the toggle flag
    if (lang === 'hi') {
        if (fallbackAlternate) return { response: 'Main aapki dukaan ke liye khaas insights de sakta hoon. Poochein: "Mera munafa kya hai?", "Stock report dikhao", ya "Jaldi expire hone wale items".', lang, isFallback: true };
        return { response: 'Maaf kijiye, samajh nahi paaya. Kripya poochhein: "Mera munafa kya hai?", "Stock report dikhao" ya "swap".', lang, isFallback: true };
    }
    if (fallbackAlternate) return { response: 'I can provide exclusive business insights. Try asking: "What is my profit?", "Show stock report", or "Identify expiring items".', lang, isFallback: true };
    return { response: 'Sorry, I didn\'t catch that. Try asking: "What is my profit?", "Show stock report", or "Find swaps".', lang, isFallback: true };
}

// Simulated voice queries for each language
const SIMULATED_QUERIES = {
    en: [
        'What is the price of Maggi?',
        'Show items expiring soon',
        'How many Tata Salt packets left?',
        'When does milk expire?',
        'Make a bill summary',
        'What should I swap today?',
    ],
    hi: [
        'मैगी की कीमत क्या है?',
        'जल्दी expire होने वाले items दिखाओ',
        'टाटा नमक कितना बचा है?',
        'दूध कब expire होगा?',
        'बिल बनाओ',
        'आज क्या swap करूं?',
    ],
};

interface VoiceAssistantProps {
    onClose?: () => void;
}

export function VoiceAssistant({ onClose }: VoiceAssistantProps) {
    const navigate = useNavigate();
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            type: 'assistant',
            text: 'नमस्ते! Hi! I can help you in English or Hindi. Ask me anything about your inventory!',
            timestamp: new Date(),
        },
    ]);
    const [selectedLang, setSelectedLang] = useState<Language>('en');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fallbackToggleRef = useRef<boolean>(false);

    // Speech Recognition & Synthesis Refs
    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
        } else {
            console.warn('Web Speech API not supported in this browser.');
        }
    }, []);

    // Text-to-Speech Function
    const speak = (text: string, lang: Language) => {
        if (!synthesisRef.current) return;

        // Cancel any ongoing speech
        synthesisRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Set language for TTS
        switch (lang) {
            case 'hi': utterance.lang = 'hi-IN'; break;
            default: utterance.lang = 'en-US';
        }

        // Try to find a matching voice
        const voices = synthesisRef.current.getVoices();
        const voice = voices.find(v => v.lang.startsWith(utterance.lang));
        if (voice) utterance.voice = voice;

        synthesisRef.current.speak(utterance);
    };

    const processAndRespond = (text: string) => {
        setIsThinking(true);

        // Artificial delay
        setTimeout(() => {
            setIsThinking(false);

            const lowerText = text.toLowerCase();
            let response = '';
            let lang = detectLanguage(text);

            // Navigation Commands
            if (lowerText.includes('market') || lowerText.includes('bazaar') || lowerText.includes('buy')) {
                response = lang === 'hi' ? 'Marketplace khul raha hai...' : 'Opening Marketplace...';
                navigate('/market');
            }
            else if (lowerText.includes('add') || lowerText.includes('sell') || lowerText.includes('bechna')) {
                response = lang === 'hi' ? 'Add Goods page khul raha hai...' : 'Opening Add Goods page...';
                navigate('/add-goods');
            }
            else if (lowerText.includes('dashboard') || lowerText.includes('home')) {
                response = lang === 'hi' ? 'Dashboard khul raha hai...' : 'Going to Dashboard...';
                navigate('/dashboard');
            }
            else {
                // Use existing query logic; pass current toggle for fallback alternation
                const result = processQuery(text, fallbackToggleRef.current);
                response = result.response;
                lang = result.lang;
                // Toggle if this was a fallback response so next fallback is different
                if (result.isFallback) {
                    fallbackToggleRef.current = !fallbackToggleRef.current;
                }
            }

            const assistantMessage: Message = {
                id: Date.now().toString(),
                type: 'assistant',
                text: response,
                timestamp: new Date(),
                language: lang,
            };

            setMessages(prev => [...prev, assistantMessage]);
            speak(response, lang);
        }, 500);
    };

    const handleVoiceInput = () => {
        if (!recognitionRef.current) {
            alert('Voice recognition not supported in this browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            return;
        }

        // Set language based on selection
        switch (selectedLang) {
            case 'hi': recognitionRef.current.lang = 'hi-IN'; break;
            default: recognitionRef.current.lang = 'en-US';
        }

        setIsListening(true);
        recognitionRef.current.start();

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setIsListening(false);

            const userMessage: Message = {
                id: Date.now().toString(),
                type: 'user',
                text: transcript,
                timestamp: new Date(),
                language: selectedLang,
            };

            setMessages(prev => [...prev, userMessage]);
            processAndRespond(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);

            // Optional: Give feedback on error
            if (event.error === 'no-speech') {
                // silently fail or reset
            }
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
    };

    const handleSuggestedCommand = (command: string) => {
        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            text: command,
            timestamp: new Date(),
            language: selectedLang,
        };

        setMessages(prev => [...prev, userMessage]);
        processAndRespond(command);
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-2xl border-2 overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-white">Voice Assistant</h3>
                        <p className="text-xs text-white/80">English & Hindi Support</p>
                    </div>
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-white hover:bg-white/20"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Language Selector */}
            <div className="p-3 bg-muted/30 border-b flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Language:</span>
                <div className="flex gap-2">
                    {(['en', 'hi'] as Language[]).map((lang) => (
                        <Button
                            key={lang}
                            size="sm"
                            variant={selectedLang === lang ? 'default' : 'outline'}
                            onClick={() => setSelectedLang(lang)}
                            className={`text-xs h-7 px-3 transition-all ${selectedLang === lang
                                ? 'bg-[#10B981] text-white hover:bg-[#059669] shadow-md'
                                : 'hover:border-[#10B981]'
                                }`}
                        >
                            {lang === 'en' ? 'EN' : 'हिं'}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-muted/20">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-xl p-3 shadow-md ${message.type === 'user'
                                    ? 'bg-[#10B981] text-white rounded-br-none'
                                    : 'bg-white text-[#0F172A] rounded-bl-none border-2'
                                    }`}
                            >
                                {message.type === 'assistant' && (
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="w-3 h-3 text-[#10B981]" />
                                        <span className="text-xs text-[#10B981]">AI Assistant</span>
                                    </div>
                                )}
                                <p className="text-sm leading-relaxed">{message.text}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className={`text-xs ${message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                                        }`}>
                                        {message.timestamp.toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    {message.language && (
                                        <span className={`text-xs ml-2 ${message.type === 'user' ? 'text-white/50' : 'text-muted-foreground/50'
                                            }`}>
                                            {message.language.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Listening Animation */}
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-center"
                    >
                        <div className="bg-[#F43F5E]/10 rounded-full px-6 py-3 flex items-center gap-3 border-2 border-[#F43F5E]/20">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-6 bg-[#F43F5E] rounded-full animate-pulse"></div>
                                <div className="w-2 h-8 bg-[#F43F5E] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-10 bg-[#F43F5E] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-8 bg-[#F43F5E] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                <div className="w-2 h-6 bg-[#F43F5E] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                            <span className="text-sm text-[#F43F5E]">Listening...</span>
                        </div>
                    </motion.div>
                )}

                {/* Thinking Animation */}
                {isThinking && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white border-2 rounded-xl rounded-bl-none p-3 shadow-md max-w-[80%]">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-[#10B981] animate-pulse" />
                                <span className="text-xs text-[#10B981]">AI is thinking</span>
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Commands */}
            <div className="p-3 bg-muted/30 border-t">
                <p className="text-xs text-muted-foreground mb-2">Quick commands:</p>
                <div className="flex flex-wrap gap-2">
                    {SUGGESTED_COMMANDS[selectedLang].slice(0, 3).map((command, index) => (
                        <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            onClick={() => handleSuggestedCommand(command)}
                            disabled={isListening || isThinking}
                            className="text-xs h-7 px-3 border-[#10B981]/30 hover:bg-[#10B981]/10 hover:border-[#10B981] transition-all"
                        >
                            {command}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Mic Button */}
            <div className="p-4 bg-white border-t">
                <Button
                    onClick={handleVoiceInput}
                    disabled={isListening || isThinking}
                    className={`w-full h-14 rounded-xl transition-all ${isListening
                        ? 'bg-[#F43F5E] hover:bg-[#F43F5E] animate-pulse'
                        : isThinking
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#10B981] hover:bg-[#059669] hover:shadow-lg'
                        }`}
                >
                    {isListening ? (
                        <>
                            <MicOff className="w-6 h-6 mr-2" />
                            Listening...
                        </>
                    ) : isThinking ? (
                        <>
                            <Sparkles className="w-6 h-6 mr-2 animate-pulse" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Mic className="w-6 h-6 mr-2" />
                            Tap to Speak
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
}