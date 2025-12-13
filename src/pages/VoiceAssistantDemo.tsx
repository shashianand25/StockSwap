import React from 'react';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { BackButton } from '../components/BackButton';

export function VoiceAssistantDemo() {
  return (
    <div className="bg-gradient-to-br from-[#F8FAFC] via-white to-[#10B981]/5 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <BackButton />
          </div>
          <h1 className="text-[#0F172A] mb-2">Voice Assistant Demo</h1>
          <p className="text-muted-foreground">
            Experience AI-powered voice assistance in English and Hindi
          </p>
        </div>

        {/* Demo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Voice Assistant */}
          <div className="lg:col-span-2">
            <VoiceAssistant />
          </div>

          {/* Features & Instructions */}
          <div className="space-y-6">
            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2">
              <h3 className="text-[#0F172A] mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span>2 Indian languages: English and Hindi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span>Automatic language detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span>Check prices, expiry dates, and stock levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span>Smart swap recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span>Bill calculation and inventory summaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span>Expiry alerts and urgent notifications</span>
                </li>
              </ul>
            </div>

            {/* Sample Queries */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2">
              <h3 className="text-[#0F172A] mb-4">Sample Queries</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">English</p>
                  <p className="text-sm text-[#0F172A]">"What is the price of Maggi?"</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Hindi</p>
                  <p className="text-sm text-[#0F172A]">"दूध कब expire होगा?"</p>
                </div>
              </div>
            </div>

            {/* Mock Inventory Info */}
            <div className="bg-gradient-to-br from-[#10B981]/10 to-white rounded-xl shadow-lg p-6 border-2">
              <h3 className="text-[#0F172A] mb-4">Demo Inventory</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Tata Salt</span>
                  <span className="text-[#10B981]">₹20 • 12 pcs • 15d</span>
                </div>
                <div className="flex justify-between">
                  <span>Maggi Noodles</span>
                  <span className="text-[#F43F5E]">₹14 • 22 pcs • 5d</span>
                </div>
                <div className="flex justify-between">
                  <span>Parle-G Biscuits</span>
                  <span className="text-[#F43F5E]">₹5 • 30 pcs • 3d</span>
                </div>
                <div className="flex justify-between">
                  <span>Fresh Milk</span>
                  <span className="text-[#F43F5E]">₹28 • 10 pcs • 1d</span>
                </div>
                <div className="flex justify-between">
                  <span>Bread Loaf</span>
                  <span className="text-[#F43F5E]">₹35 • 6 pcs • 2d</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
