# StockSwap - Product Roadmap (2026)

## Phase 1: Foundation & Trust (Current)
* [x] **Design System:** Radix UI components with "Premium" aesthetics and mobile-first responsive layout.
* [x] **Global Layout:** Persistent navigation and SplashScreen implementation.

## Phase 2: Transactional Intelligence (Next 4 Weeks)
* [ ] **Swap Calculator Logic:** Implementation of the `SwapCalculatorModal` to calculate fair-value trades based on `priceUtils.ts`.
* [ ] **Live Chat Integration:** Real-time messaging between traders.
* [ ] **Map Density View:** Enhancing `MapPage` to show clusters of "Expiring Goods" for localized liquidation.

## Phase 3: Advanced Interaction (Q3 2026)
* [ ] **Global Voice Navigator:** Full wiring of `GlobalVoiceAssistant` to trigger route changes (e.g., "Show me fruits near expiry").
* [ ] **Auto-Match Engine:** Boltsy-driven skill to automatically suggest swaps to users based on their "Wanted" items vs. available market "Liquidation" items.
* [ ] **3D Visualization:** Polishing the Three.js avatar in `VoiceAssistant.tsx` for higher engagement.

## Phase 4: Geo-Expansion
* [ ] **Multi-Currency/Region Support.**
* [ ] **Enterprise Inventory Sync:** Connect Boltsy to external retailer APIs to auto-populate "Liquidation" lists.

---

**Orchestration Note:**
Boltsy should prioritize Phase 2 feature development now that Phase 1 is finalized.
