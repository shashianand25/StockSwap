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
  const [message, setMessage] = useState('Hi, I have an item to propose for swap');
  const [myItems, setMyItems] = useState<CategoryProduct[]>([]);
  const [selectedMyItemId, setSelectedMyItemId] = useState<string | null>(null);
  const [myOfferValue, setMyOfferValue] = useState<string>('');
  const [theirEstimatedValue, setTheirEstimatedValue] = useState<string>('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('userProducts') || '[]');
    // map to the shape we need and include a numeric price if available
    const items = stored.map((p: any) => ({ id: p.id, title: p.productName, shopName: p.userId, price: parseFloat(p.sellingPrice || p.asking_price || '0') || 0 }));
    setMyItems(items);
    if (items.length) setSelectedMyItemId(items[0].id);
  }, [isOpen]);

  useEffect(() => {
    // when modal opens, set default values for amounts
    if (isOpen && product) {
      // default their value from product.price if available
      const theirDefault = (product as any).price || (product as any).asking_price || 0;
      setTheirEstimatedValue(theirDefault ? String(theirDefault) : '');

      // default myOfferValue from selectedMyItem, if available
      if (selectedMyItemId) {
        const mine = myItems.find(i => i.id === selectedMyItemId);
        if (mine && mine.price) setMyOfferValue(String(mine.price));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product, selectedMyItemId]);

  if (!isOpen || !product) return null;

  const computeRisk = (myVal: number, theirVal: number) => {
    if (theirVal === 0) return { diff: myVal - theirVal, percent: 100, level: 'high' as const };
    const diff = theirVal - myVal; // positive => shopkeeper loses (giving higher value)
    const pct = Math.abs(diff) / (theirVal || 1) * 100;
    let level: 'low' | 'medium' | 'high' = 'low';
    if (pct <= 10) level = 'low';
    else if (pct <= 30) level = 'medium';
    else level = 'high';
    return { diff, percent: Math.min(100, pct), level };
  };

  const submitOffer = () => {
    const myVal = parseFloat(myOfferValue) || 0;
    const theirVal = parseFloat(theirEstimatedValue) || 0;
    const risk = computeRisk(myVal, theirVal);
    // basic validation
    if (!selectedMyItemId) {
      alert('Please select one of your items to propose');
      return;
    }
    if (!myVal || !theirVal) {
      if (!confirm('One of the values is missing or zero. Proceed anyway?')) return;
    }
    const myItem = myItems.find(i => i.id === selectedMyItemId);
    const offer = {
      id: 'offer-' + Date.now(),
      productId: product.id,
      fromUserId: 'me',
      myItemId: selectedMyItemId,
      myItemTitle: myItem?.title || '',
      productTitle: product.title || '',
      myOfferValue: myVal,
      theirEstimatedValue: theirVal,
      risk,
      message,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    const offers = JSON.parse(localStorage.getItem('offers') || '[]');
    offers.push(offer);
    localStorage.setItem('offers', JSON.stringify(offers));

    // Notify and close
    alert('Offer sent!');
    onClose();
  };

  const myValNum = parseFloat(myOfferValue) || 0;
  const theirValNum = parseFloat(theirEstimatedValue) || 0;
  const riskState = computeRisk(myValNum, theirValNum);

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
          <div>
            <label className="block text-sm mb-2">Pick one of your items to propose</label>
            <div className="flex flex-col gap-2">
              {myItems.length === 0 && <p className="text-sm text-muted-foreground">No items found. Add items in your inventory first.</p>}
              {myItems.map(item => (
                <label key={item.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="myItem"
                    checked={selectedMyItemId === item.id}
                    onChange={() => {
                      setSelectedMyItemId(item.id);
                      setMyOfferValue(String(item.price || ''));
                    }}
                  />
                  <span>{item.title} {item.price ? `— ₹${item.price}` : ''}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Commitments: values for the two items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Your Offered Value (₹)</label>
              <Input
                type="number"
                value={myOfferValue}
                onChange={(e) => setMyOfferValue(e.target.value)}
                placeholder="e.g., 500"
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Their Estimated Value (₹)</label>
              <Input
                type="number"
                value={theirEstimatedValue}
                onChange={(e) => setTheirEstimatedValue(e.target.value)}
                placeholder="e.g., 450"
                className="h-12"
              />
            </div>
          </div>

          {/* Risk bar and profit/loss */}
          <div>
            <label className="block text-sm mb-2">Fair Value Risk</label>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                style={{ width: `${riskState.percent}%`, backgroundColor: (riskState.level === 'low' ? '#16a34a' : riskState.level === 'medium' ? '#f59e0b' : '#ef4444') }}
                className="h-full transition-width"
              />
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span>Risk: <strong className={`ml-1 ${riskState.level === 'low' ? 'text-green-600' : riskState.level === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>{riskState.level.toUpperCase()}</strong></span>
              <span>{riskState.percent.toFixed(0)}%</span>
            </div>
            <div className="mt-2 text-sm">
              {/** compute shopkeeper profit/loss */}
              {(() => {
                const myVal = parseFloat(myOfferValue) || 0;
                const theirVal = parseFloat(theirEstimatedValue) || 0;
                const profit = myVal - theirVal; // positive -> shopkeeper profits
                if (profit > 0) return <span className="text-green-600">Shopkeeper profit: ₹{profit.toFixed(2)}</span>;
                if (profit < 0) return <span className="text-red-600">Shopkeeper loss: ₹{Math.abs(profit).toFixed(2)}</span>;
                return <span className="text-green-600">Neutral trade</span>;
              })()}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Message</label>
            <Input value={message} onChange={(e) => setMessage(e.target.value)} className="h-12" />
          </div>

          <div className="flex items-center justify-between">
            <Button onClick={submitOffer} className="bg-[#10B981]">Send Offer</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProposeSwapModal;
