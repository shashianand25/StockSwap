# StockSwap Project Overview

## Overview
StockSwap is a Vite + React + TypeScript web application designed as a mobile-first platform for users to swap, buy, sell, and liquidate goods. The application is styled using Tailwind CSS and Radix UI components, and utilizes Supabase for backend services, specifically authentication (Email OTP flow).

## Technology Stack
- **Frontend Framework**: React 18 with TypeScript, managed by Vite.
- **Routing**: `react-router-dom` for handling client-side navigation.
- **Styling**: Tailwind CSS combined with Radix UI components for accessible and consistent design. `framer-motion` (via `motion`) is used for animations.
- **Backend/Auth**: Supabase. A major focus is placed on the Email OTP authentication flow, as evidenced by the extensive documentation and logs built into the app startup.
- **Other Key Libraries**:
  - `lucide-react` for icons.
  - `@react-three/fiber` and `@react-three/drei` for 3D/voice assistant visuals.
  - `recharts` for charting/dashboard elements.
  - `sonner` for toast notifications.

## Key Features & Pages

The application is structured into several core routes:
1. **Onboarding & Auth**:
   - `/` (LandingPage): The entry point of the app.
   - `/login`, `/signup`, `/otp-verify`: Handles the Supabase OTP-based authentication flow.
2. **Core Marketplace**:
   - `/market` (MarketplacePage): Browsing items available for sale/swap.
   - `/categories` & `/category/:categoryId`: Browsing items by category.
   - `/map/:productId` (MapPage): Location-based viewing of products.
3. **Swapping & Trading**:
   - `/swap` (SwapPage): Interface for proposing and managing item swaps.
   - `/add-goods` & `/sell` (AddGoodsPage): Listing new items.
   - `/liquidation` (LiquidationPage): Dedicated flow for liquidating items.
   - `/wanted` (WantedPage): Items that users are looking for.
4. **User Portal**:
   - `/dashboard` (DashboardPage): User overview and analytics.
   - `/profile` (ProfilePage): Managing user settings and profile.
5. **Experimental / Advanced**:
   - `/voice-assistant` (VoiceAssistantDemo): A global voice assistant feature to navigate or interact with the app via voice.

## Folder Structure
- `/src/components`: Contains reusable UI components, layout elements (Navbar, Footer, BottomNav), modals (ProposeSwapModal, SwapCalculatorModal), and the Voice Assistant components.
- `/src/pages`: Contains the route-level page components for the features described above.
- `/src/lib`: Contains utilities for Supabase client configuration, authentication flows (`supabaseAuth.ts`), mock data (`mockData.ts`), and pricing utilities.
- Extensive documentation on OTP authentication is available at the root (`OTP_DOCS_INDEX.md`, `README_AUTH.md`, `SUPABASE_EMAIL_OTP_SETUP.md`, etc.), highlighting its importance to the project's current state.

## Startup Flow
- The `App.tsx` component is the main entry point.
- It displays a `SplashScreen` initially.
- It initializes an authentication listener to monitor Supabase session changes.
- It logs significant debugging and setup information regarding the OTP flow to the console to assist developers in configuring Supabase correctly.
