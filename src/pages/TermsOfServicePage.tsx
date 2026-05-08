import React from 'react';

export function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-white">Terms of Service</h1>
      
      <div className="bg-[#1E293B] p-8 rounded-lg shadow-xl text-gray-300 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">1. Acceptance of Terms</h2>
          <p>By accessing StockSwap, you agree to be bound by these terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">2. Marketplace Use</h2>
          <p>You agree to use our hyperlocal B2B marketplace only for lawful liquidation of dead inventory.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">3. Intellectual Property</h2>
          <p>All content and technology on StockSwap are owned by our company.</p>
        </section>

        <p className="text-sm text-gray-500 pt-6">Last Updated: May 2026</p>
      </div>
    </div>
  );
}
