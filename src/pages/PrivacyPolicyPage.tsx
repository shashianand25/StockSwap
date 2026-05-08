import React from 'react';

export function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-white">Privacy Policy</h1>
      
      <div className="bg-[#1E293B] p-8 rounded-lg shadow-xl text-gray-300 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">1. Information Collection</h2>
          <p>We collect information necessary to facilitate B2B transactions and liquidation of inventory on StockSwap.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">2. Data Usage</h2>
          <p>Your data is used to improve our hyperlocal marketplace experience and ensure secure authentication via Supabase.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">3. Security</h2>
          <p>We implement industry-standard security measures to protect your business information.</p>
        </section>

        <p className="text-sm text-gray-500 pt-6">Last Updated: May 2026</p>
      </div>
    </div>
  );
}
