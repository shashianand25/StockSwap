import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

interface CategoryProduct {
  id: string;
  title: string;
  shopName?: string;
  price?: number; // optional estimated value
}

interface ProposeSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CategoryProduct | null;
}

export function ProposeSwapModal({ isOpen, onClose, product }: ProposeSwapModalProps) {
  const [message, setMessage] = useState('Hi, I have rice to propose for swap');
  const [riceKg, setRiceKg] = useState<string>('');
  const [showCalculation, setShowCalculation] = useState(false);

  // Fixed prices
  const RICE_PRICE_PER_KG = 60;
  const POTATO_PRICE_PER_KG = 30;

  useEffect(() => {
    if (!isOpen) {
      setRiceKg('');
      setShowCalculation(false);
      setMessage('Hi, I have rice to propose for swap');
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const calculateSwap = () => {
    const kg = parseFloat(riceKg) || 0;
    if (kg <= 0) {
      alert('Please enter a valid amount of rice in kg');
      return;
    }
    setShowCalculation(true);
  };

  const sendSwapRequest = () => {
    const kg = parseFloat(riceKg) || 0;
    const riceValue = kg * RICE_PRICE_PER_KG;
    const potatoKg = riceValue / POTATO_PRICE_PER_KG;

    const offer = {
      id: 'offer-' + Date.now(),
      productId: product.id,
      fromUserId: 'me',
      riceKg: kg,
      riceValue,
      potatoKg,
      potatoValue: riceValue,
      productTitle: product.title || '',
      message,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    const offers = JSON.parse(localStorage.getItem('offers') || '[]');
    offers.push(offer);
    localStorage.setItem('offers', JSON.stringify(offers));

    alert('Offer sent!');
    onClose();
  };

  const kg = parseFloat(riceKg) || 0;
  const riceValue = kg * RICE_PRICE_PER_KG;
  const potatoKg = riceValue / POTATO_PRICE_PER_KG;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg p-0 overflow-hidden">
        <div className="p-4 flex items-center justify-between bg-[#10B981] text-white">
          <div>
            <h3 className="text-lg">Propose Swap</h3>
            <p className="text-sm">Proposing for {product.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <X />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {!showCalculation ? (
            <>
              <div>
                <label className="block text-sm mb-2">Enter Rice Quantity (kg)</label>
                <Input
                  type="number"
                  value={riceKg}
                  onChange={(e) => setRiceKg(e.target.value)}
                  placeholder="e.g., 5"
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  1 kg rice = ₹{RICE_PRICE_PER_KG}, 1 kg potato = ₹{POTATO_PRICE_PER_KG}
                </p>
              </div>

              <div>
                <label className="block text-sm mb-2">Message</label>
                <Input value={message} onChange={(e) => setMessage(e.target.value)} className="h-12" />
              </div>

              <div className="flex items-center justify-between">
                <Button onClick={calculateSwap} className="bg-[#10B981]">Calculate Swap</Button>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-4">Swap Calculation</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><strong>You offer:</strong> {kg} kg rice (₹{riceValue.toFixed(2)})</p>
                  <p><strong>You get:</strong> {potatoKg.toFixed(2)} kg potatoes (₹{riceValue.toFixed(2)})</p>
                  <p className="text-sm text-muted-foreground">
                    Based on market rates: Rice ₹{RICE_PRICE_PER_KG}/kg, Potatoes ₹{POTATO_PRICE_PER_KG}/kg
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Message</label>
                <Input value={message} onChange={(e) => setMessage(e.target.value)} className="h-12" />
              </div>

              <div className="flex items-center justify-between">
                <Button onClick={sendSwapRequest} className="bg-[#10B981]">Send Swap Request</Button>
                <Button variant="outline" onClick={() => setShowCalculation(false)}>Back</Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default ProposeSwapModal;
