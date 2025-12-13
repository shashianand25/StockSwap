import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Mic, TrendingUp, Package, CheckCircle, Clock, Plus, Calculator, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import SwapCalculatorModal from '../components/SwapCalculatorModal.tsx';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  value: number;
  daysUntilExpiry: number;
  addedDate: string;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Britannia Biscuits Pack',
      quantity: '50 packets',
      value: 2500,
      daysUntilExpiry: 8,
      addedDate: '2024-12-10',
    },
    {
      id: '2',
      name: 'Maggi Noodles Carton',
      quantity: '100 packets',
      value: 4200,
      daysUntilExpiry: 15,
      addedDate: '2024-12-09',
    },
  ]);

  const [isListening, setIsListening] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');

  // Load user's products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      console.log('Dashboard: Loading products, userProducts:', userProducts.length, 'currentUser:', currentUser);
      
      // Filter products for current user
      const myProducts = userProducts.filter((p: any) => {
        if (currentUser.email) {
          return p.userId === currentUser.email;
        }
        return !p.userId || p.userId === 'guest@example.com';
      });
      
      // Convert to inventory items format
      const convertedItems: InventoryItem[] = myProducts.map((p: any) => {
        const productName = p.productName || p.item_name || 'Unknown Product';
        
        let quantityStr = p.quantity;
        if (typeof p.quantity === 'string' && !p.quantity.includes(' ')) {
          quantityStr = `${p.quantity} ${p.unit || 'Pieces'}`;
        }
        
        const price = parseFloat(p.sellingPrice || p.asking_price || '0');
        const qty = parseFloat(p.quantity?.toString().split(' ')[0] || '0');
        const value = price * qty;
        
        return {
          id: p.id,
          name: productName,
          quantity: quantityStr,
          value: value,
          daysUntilExpiry: parseInt(p.daysUntilExpiry || p.days_until_expiry || '0'),
          addedDate: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        };
      });
      
      if (convertedItems.length > 0) {
        setInventoryItems(convertedItems);
      }
    };
    
    loadProducts();
    
    const handleFocus = () => loadProducts();
    window.addEventListener('focus', handleFocus);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userProducts') loadProducts();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Calculate stats
  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + item.value, 0);
  const valueRecovered = 15800; // Mock value
  const matchesFound = 12; // Mock value
  const atRiskItems = inventoryItems.filter(item => item.daysUntilExpiry <= 10);
  const valueAtRisk = atRiskItems.reduce((sum, item) => sum + item.value, 0);

  // Generate random chart data
  const generateChartData = () => {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 12; i++) {
      data.push({
        month: months[i],
        profit: Math.floor(Math.random() * 5000) + 1000,
        sales: Math.floor(Math.random() * 8000) + 2000,
        loss: Math.floor(Math.random() * 2000) + 0,
      });
    }
    return data;
  };

  const chartData = generateChartData();

  // Command dictionary
  const navigationCommands = [
    {
      path: '/add-goods',
      keywords: {
        en: ['sell', 'add', 'add goods', 'add item', 'add inventory', 'new item', 'post item'],
        hi: ['bechna', 'bechao', 'bechne', 'add karo', 'naya item', 'saman dalo', 'item add', 'vikray', 'bech'],
      },
    },
    {
      path: '/market',
      keywords: {
        en: ['market', 'marketplace', 'bazaar', 'shop', 'buy', 'shopping'],
        hi: ['market', 'bazaar', 'marketplace', 'dukaan', 'kharid', 'shopping'],
      },
    },
    {
      path: '/swap',
      keywords: {
        en: ['swap', 'trade', 'exchange', 'badalna', 'swap page'],
        hi: ['swap', 'badalna', 'adla badli', 'exchange', 'swap karo'],
      },
    },
    {
      path: '/dashboard',
      keywords: {
        en: ['dashboard', 'home', 'main menu', 'back home'],
        hi: ['dashboard', 'ghar', 'home', 'main menu', 'wapas', 'mukhya'],
      },
    },
    {
      path: '/profile',
      keywords: {
        en: ['profile', 'my profile', 'account', 'settings', 'my shop'],
        hi: ['profile', 'meri profile', 'account', 'meri dukan', 'setting'],
      },
    },
  ];

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch (err) {
        // ignore
      }
    };
  }, []);

  const handleVoiceCommand = (transcript: string) => {
    if (!transcript) return;

    const lowerText = transcript.toLowerCase().trim();
    let matchedRoute: string | null = null;
    let detectedLang: 'en' | 'hi' = 'en';

    for (const command of navigationCommands) {
      for (const keyword of command.keywords.en) {
        if (lowerText.includes(keyword.toLowerCase())) {
          matchedRoute = command.path;
          detectedLang = 'en';
          break;
        }
      }
      if (!matchedRoute) {
        for (const keyword of command.keywords.hi) {
          if (lowerText.includes(keyword.toLowerCase())) {
            matchedRoute = command.path;
            detectedLang = 'hi';
            break;
          }
        }
      }
      if (matchedRoute) break;
    }

    if (matchedRoute) {
      const successMessage = detectedLang === 'hi' 
        ? `समझ गया - ${matchedRoute === '/add-goods' ? 'बेचने का पेज' : 'पेज'} खोल रहा हूं...`
        : `Got it - Opening ${matchedRoute.replace('/', '')} page...`;
      
      toast.success(successMessage);
      setTimeout(() => navigate(matchedRoute!), 300);
    } else {
      const errorMsg = selectedLanguage === 'hi'
        ? `समझ नहीं आया। कृपया बोलें: "बेचना", "बाजार", "स्वैप"`
        : `Couldn't understand. Try: "sell", "market", "swap"`;
      toast.error(errorMsg);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice recognition not supported in this browser.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const langMessage = selectedLanguage === 'hi' 
      ? 'सुन रहा हूं... बोलिए' 
      : 'Listening... Speak your command';
    toast.info(langMessage);

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
    recognitionRef.current = rec;

    rec.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      setIsListening(false);
      if (transcript) {
        toast.info(`Heard: "${transcript}"`);
        handleVoiceCommand(transcript);
      } else {
        toast.error('Could not detect speech.');
      }
    };

    rec.onerror = (event: any) => {
      setIsListening(false);
      if (event.error !== 'no-speech') {
        toast.error('Voice recognition error');
      }
    };

    rec.onend = () => setIsListening(false);

    try {
      rec.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#0F172A] mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your inventory and track recovery value</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-lg border-2 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#10B981]/10 p-3 rounded-lg">
                <Package className="w-6 h-6 text-[#10B981]" />
              </div>
              <Badge variant="secondary" className="text-xs">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Inventory Listed</p>
            <p className="text-3xl text-[#0F172A]">{inventoryItems.length}</p>
            <p className="text-sm text-[#10B981] mt-2">₹{totalInventoryValue.toLocaleString()} total value</p>
          </Card>

          <Card className="p-6 shadow-lg border-2 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#10B981]/10 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#10B981]" />
              </div>
              <Badge className="text-xs bg-[#10B981] text-white">+₹3,200</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Value Recovered</p>
            <p className="text-3xl text-[#10B981]">₹{valueRecovered.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-2">From {matchesFound} successful swaps</p>
          </Card>

          <Card className="p-6 shadow-lg border-2 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#F43F5E]/10 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-[#F43F5E]" />
              </div>
              <Badge variant="destructive" className="text-xs">Urgent</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Value at Risk</p>
            <p className="text-3xl text-[#F43F5E]">₹{valueAtRisk.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-2">{atRiskItems.length} items expiring soon</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Voice Navigation Card */}
            <Card className="p-8 shadow-lg border-2 bg-gradient-to-br from-[#10B981]/5 to-white flex flex-col items-center justify-center min-h-[300px]">
              <div className="flex gap-2 mb-6">
                <Button size="sm" variant={selectedLanguage === 'en' ? 'default' : 'ghost'} onClick={() => setSelectedLanguage('en')} className={`rounded-full px-4 ${selectedLanguage === 'en' ? 'bg-[#10B981]' : ''}`}>English</Button>
                <Button size="sm" variant={selectedLanguage === 'hi' ? 'default' : 'ghost'} onClick={() => setSelectedLanguage('hi')} className={`rounded-full px-4 ${selectedLanguage === 'hi' ? 'bg-[#10B981]' : ''}`}>हिंदी</Button>
              </div>

              <div className="relative mb-6">
                {isListening && <div className="absolute inset-0 bg-[#F43F5E]/20 rounded-full animate-ping" />}
                <button onClick={handleVoiceInput} className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl ${isListening ? 'bg-[#F43F5E] scale-110' : 'bg-gradient-to-r from-[#10B981] to-[#059669]'}`}>
                  <Mic className="w-10 h-10 text-white" />
                </button>
              </div>

              <h3 className="text-2xl font-semibold text-[#0F172A] mb-2">{isListening ? (selectedLanguage === 'hi' ? 'सुन रहा हूं...' : 'Listening...') : 'Voice Navigation'}</h3>
              <p className="text-muted-foreground text-center max-w-xs mb-8">Tap to navigate seamlessly in English or Hindi</p>
              
              <Link to="/add-goods">
                <Button variant="outline" className="border-2 rounded-xl px-6">
                  <Plus className="w-4 h-4 mr-2 text-[#10B981]" /> Add Manually
                </Button>
              </Link>
            </Card>

            {/* Inventory List */}
            <Card className="p-6 shadow-lg border-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#0F172A]">Your Inventory</h3>
                <Link to="/market">
                  <Button variant="outline" size="sm" className="border-2">View in Market</Button>
                </Link>
              </div>

              <div className="space-y-3">
                {inventoryItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No inventory items yet</p>
                    <Button onClick={() => navigate('/add-goods')} className="bg-[#10B981] hover:bg-[#10B981]/90">
                      <Plus className="w-4 h-4 mr-2" /> Add Your First Item
                    </Button>
                  </div>
                ) : (
                  inventoryItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm">{item.name}</h4>
                          {item.daysUntilExpiry <= 10 && <Badge variant="destructive" className="text-xs">{item.daysUntilExpiry}d</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#10B981]">₹{item.value.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{item.addedDate}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Voice Assistant Widget */}
            <Card className="p-6 shadow-lg border-2 bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] text-white">
              <div className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-white mb-2">Voice Assistant</h3>
              <p className="text-sm text-gray-100 mb-4">Ask questions in English or Hindi</p>
              <Button onClick={() => setShowVoiceAssistant(true)} className="w-full bg-white text-[#10B981] hover:bg-gray-100">
                <Volume2 className="w-4 h-4 mr-2" /> Open Assistant
              </Button>
            </Card>

            {/* Calculator Widget */}
            <Card className="p-6 shadow-lg border-2 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white">
              <div className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-white mb-2">Fair Trade Calculator</h3>
              <p className="text-sm text-gray-300 mb-6">Check fairness score before swapping</p>
              <Button onClick={() => setShowCalculator(true)} className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white">
                Open Calculator
              </Button>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 shadow-lg border-2">
              <h3 className="text-[#0F172A] mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Matches Found</span>
                  <Badge className="bg-[#10B981] text-white">{matchesFound}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Chats</span>
                  <Badge variant="secondary">3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="text-sm text-[#10B981]">87%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 shadow-lg border-2">
          <h3 className="text-[#0F172A] mb-6 text-center">Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
              <Legend />
              <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} name="Profit" />
              <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} name="Sales" />
              <Line type="monotone" dataKey="loss" stroke="#EF4444" strokeWidth={3} name="Loss" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Modals */}
      <SwapCalculatorModal isOpen={showCalculator} onClose={() => setShowCalculator(false)} />

      <Dialog open={showVoiceAssistant} onOpenChange={setShowVoiceAssistant}>
        <DialogContent className="max-w-md p-0">
          <VoiceAssistant />
        </DialogContent>
      </Dialog>
    </div>
  );
}