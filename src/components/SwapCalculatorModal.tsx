import React, { useState, useEffect } from 'react';
import { X, Calculator, ArrowRightLeft, Info } from 'lucide-react';

interface SwapCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SwapCalculatorModal({ isOpen, onClose }: SwapCalculatorModalProps) {
  const [myItemValue, setMyItemValue] = useState<string>('');
  const [theirItemValue, setTheirItemValue] = useState<string>('');
  const [showInfo, setShowInfo] = useState(false);
  const [daysExpiry1, setDaysExpiry1] = useState<string>('0');
  const [daysExpiry2, setDaysExpiry2] = useState<string>('0');
  const [demand1, setDemand1] = useState<string>('0.5');
  const [demand2, setDemand2] = useState<string>('0.5');
  const [distanceKm, setDistanceKm] = useState<string>('0');

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const myVal = parseFloat(myItemValue) || 0;
  const theirVal = parseFloat(theirItemValue) || 0;
  const e1 = Math.max(0, parseFloat(daysExpiry1) || 0);
  const e2 = Math.max(0, parseFloat(daysExpiry2) || 0);
  const d1 = Math.min(1, Math.max(0, parseFloat(demand1) || 0));
  const d2 = Math.min(1, Math.max(0, parseFloat(demand2) || 0));
  const dist = Math.max(0, parseFloat(distanceKm) || 0);

  // Expiry risk and penalties
  const expiryRisk1 = Math.max(0, (30 - e1) / 30);
  const expiryRisk2 = Math.max(0, (30 - e2) / 30);
  const expiryPenalty1 = expiryRisk1 * 20;
  const expiryPenalty2 = expiryRisk2 * 20;

  // Adjusted prices
  const p1_adj = myVal * (1 - expiryRisk1);
  const p2_adj = theirVal * (1 - expiryRisk2);

  // Variation
  const avgAdj = (p1_adj + p2_adj) / 2 || 0;
  const variation = avgAdj === 0 ? 0 : (Math.abs(p1_adj - p2_adj) / avgAdj) * 100;

  // Demand boost (average)
  const demandBoost = ((d1 + d2) / 2 - 0.5) * 20;

  // Distance penalty
  const distancePenalty = (dist / 5) * 10;

  // Final score
  let rawScore = 100 - variation - ((expiryPenalty1 + expiryPenalty2) / 2) + demandBoost - distancePenalty;
  let score = Math.max(0, Math.min(100, rawScore));

  // Rating
  const rating = score >= 90 ? { text: 'Excellent Trade', color: 'green' }
    : score >= 75 ? { text: 'Good Trade', color: 'green' }
      : score >= 60 ? { text: 'Fair Trade', color: 'yellow' }
        : { text: 'Poor Trade', color: 'red' };

  const recommendation = score >= 75 ? 'Recommended' : score >= 60 ? 'Negotiate' : 'Not Recommended';

  // AI reasoning (2-3 sentences)
  const reasoning = (() => {
    const s1 = `Expiry risks (${(expiryRisk1*100).toFixed(0)}%, ${(expiryRisk2*100).toFixed(0)}%) adjust prices to ₹${p1_adj.toFixed(0)} and ₹${p2_adj.toFixed(0)}.`;
    const s2 = `Price difference is ${variation.toFixed(1)}% and demand impact is ${(demandBoost).toFixed(1)}.`;
    const s3 = `Distance penalty is ${distancePenalty.toFixed(1)}; overall score is ${Math.round(score)}.`;
    return `${s1} ${s2} ${s3}`;
  })();

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#4AB792] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <h3 className="font-bold text-lg inline-flex items-center gap-2">Fair Trade Calculator</h3>
            <button
              aria-label="How it works"
              title="How it works"
              onClick={() => setShowInfo(prev => !prev)}
              className="ml-2 p-1 hover:bg-white/10 rounded-full"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Info helper box */}
          <div className={`overflow-hidden transition-[max-height,opacity] duration-300 ${showInfo ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-3 rounded-md bg-blue-50 border border-blue-100 text-blue-800 text-sm">
              ℹ️ <strong>How it works:</strong> A trade is marked <strong>FAIR</strong> if the price difference is <strong>less than 10%</strong>. Anything higher is flagged as Unbalanced.
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm mb-2 block">My Item Price (₹)</label>
              <input
                type="number"
                value={myItemValue}
                onChange={(e) => setMyItemValue(e.target.value)}
                placeholder="My Value"
                className="w-full p-2 border rounded-lg text-center font-semibold text-sm"
              />
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <input type="number" value={daysExpiry1} onChange={(e) => setDaysExpiry1(e.target.value)} placeholder="Expiry" className="p-2 border rounded text-xs text-center" />
                <input type="number" step="0.01" value={demand1} onChange={(e) => setDemand1(e.target.value)} placeholder="Demand" className="p-2 border rounded text-xs text-center" />
                <div className="p-2 text-muted-foreground text-xs">Expiry: {(expiryRisk1*100).toFixed(0)}%</div>
              </div>
            </div>

            <div>
              <label className="text-sm mb-2 block">Their Item Price (₹)</label>
              <input
                type="number"
                value={theirItemValue}
                onChange={(e) => setTheirItemValue(e.target.value)}
                placeholder="Their Value"
                className="w-full p-2 border rounded-lg text-center font-semibold text-sm"
              />
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <input type="number" value={daysExpiry2} onChange={(e) => setDaysExpiry2(e.target.value)} placeholder="Expiry" className="p-2 border rounded text-xs text-center" />
                <input type="number" step="0.01" value={demand2} onChange={(e) => setDemand2(e.target.value)} placeholder="Demand" className="p-2 border rounded text-xs text-center" />
                <div className="p-2 text-muted-foreground text-xs">Expiry: {(expiryRisk2*100).toFixed(0)}%</div>
              </div>
            </div>
          </div>

          <div className="mt-1">
            <label className="text-sm mb-2 block">Distance between shops (km)</label>
            <input type="number" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} placeholder="e.g., 2.5" className="w-full p-2 border rounded-lg" />
          </div>

          <div className="p-3 rounded-lg border-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-muted-foreground">Score</div>
                <div className="text-xl font-bold">{Math.round(score)}</div>
                <div className="text-xs mt-1">{rating.text}</div>
              </div>
              <div className="w-36">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div style={{ width: `${score}%`, backgroundColor: (rating.color === 'green' ? '#16a34a' : rating.color === 'yellow' ? '#f59e0b' : '#ef4444') }} className="h-full transition-width" />
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-2">Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="text-xs">Adjusted: ₹{p1_adj.toFixed(2)} vs ₹{p2_adj.toFixed(2)}</div>
              <div>Price variation: {variation.toFixed(1)}%</div>
              <div>Expiry penalties: {((expiryPenalty1 + expiryPenalty2)/2).toFixed(1)}</div>
              <div>Demand boost: {demandBoost.toFixed(1)}</div>
              <div>Distance penalty: {distancePenalty.toFixed(1)}</div>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-sm text-muted-foreground mb-2">AI Reasoning</div>
            <div className="p-3 rounded-md bg-gray-50 border text-sm text-gray-700 mb-3">{reasoning}</div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (score >= 75) {
                    alert('Recommended — proceed to swap.');
                  } else if (score >= 60) {
                    alert('Negotiate terms — the trade looks fair but consider changes.');
                  } else {
                    alert('Not recommended — this trade could result in a loss.');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-xl"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Action
              </button>

              <div className="flex gap-2">
                <div className={`px-3 py-1 rounded-lg border text-xs ${rating.color === 'green' ? 'border-green-600 text-green-600' : rating.color === 'yellow' ? 'border-yellow-500 text-yellow-600' : 'border-red-600 text-red-600'}`}>{recommendation}</div>
                <button onClick={onClose} className="px-3 py-1 rounded-lg border text-xs">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwapCalculatorModal;
