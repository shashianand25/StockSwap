import React from 'react';

export function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-white">Shipping Policy</h1>
      
      <div className="bg-[#1E293B] p-8 rounded-lg shadow-xl text-gray-300 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">1. Shipping Scope</h2>
          <p>StockSwap facilitates the liquidation of goods. Shipping arrangements are typically handled between the buyer and seller directly or via third-party logistics after a successful transaction.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">2. Delivery Timeframes</h2>
          <p>Delivery timeframes are subject to the agreed-upon terms between the buyer and seller. StockSwap does not directly manage shipping logistics.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">3. Shipping Costs</h2>
          <p>Any shipping costs associated with the transaction are to be borne by the buyer or negotiated between the parties.</p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">4. International Shipping</h2>
          <p>International shipping is not directly supported by StockSwap. All transactions and deliveries are assumed to be within India unless otherwise explicitly agreed upon by the transacting parties.</p>
        </section>

        <p className="text-sm text-gray-500 pt-6">Last Updated: May 2026</p>
      </div>
    </div>
  );
}
