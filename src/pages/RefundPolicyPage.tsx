import React from 'react';

export function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-white">Refund Policy</h1>
      
      <div className="bg-[#1E293B] p-8 rounded-lg shadow-xl text-gray-300 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">1. Eligibility for Refunds</h2>
          <p>Refunds are typically considered for specific circumstances, such as duplicate orders or non-delivery of services within agreed timelines.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">2. Refund Process</h2>
          <p>To request a refund, please contact our support team at support@stockswap.in within 7 days of the transaction. Include your order details and the reason for the refund request.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">3. Non-Refundable Items</h2>
          <p>Certain items, particularly those that are perishable or have passed their expiry date upon listing, may be non-refundable.</p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#10B981]">4. Partial Refunds</h2>
          <p>Partial refunds may be issued at our discretion based on the condition of the returned goods or the specific circumstances of the transaction.</p>
        </section>

        <p className="text-sm text-gray-500 pt-6">Last Updated: May 2026</p>
      </div>
    </div>
  );
}
