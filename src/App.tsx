import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { LiquidationPage } from './pages/LiquidationPage';
import { WantedPage } from './pages/WantedPage';
import { SwapPage } from './pages/SwapPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { OTPVerifyPage } from './pages/OTPVerifyPage';
import { MapPage } from './pages/MapPage';
import { VoiceAssistantDemo } from './pages/VoiceAssistantDemo';
import { AddGoodsPage } from './pages/AddGoodsPage';
import { Toaster } from './components/ui/sonner';
import { initAuthListener } from './lib/supabaseAuth';

import { SplashScreen } from './components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  // Initialize auth listener on app start
  React.useEffect(() => {
    // Log helpful OTP setup info
    console.log('%c╔═══════════════════════════════════════════════════════════╗', 'color: #10B981;');
    console.log('%c║   🚀 StockSwap - OTP Authentication Ready!              ║', 'color: #10B981; font-size: 16px; font-weight: bold;');
    console.log('%c╚═══════════════════════════════════════════════════════════╝', 'color: #10B981;');
    console.log('');
    console.log('%c⚠️  Still receiving magic links instead of OTP codes?', 'color: #F59E0B; font-weight: bold;');
    console.log('');
    console.log('%c📋 Quick Fix (1 minute):', 'color: #3B82F6; font-weight: bold;');
    console.log('   1. Go to: https://app.supabase.com → Your Project → Authentication → Email Templates');
    console.log('   2. Edit "Magic Link" template');
    console.log('   3. Add this line: %c{{ .Token }}%c (displays 6-digit OTP)', 'color: #10B981; font-weight: bold;', 'color: inherit;');
    console.log('   4. Save template');
    console.log('');
    console.log('%c📖 Full Guide: /OTP_QUICK_FIX.md or /README_OTP_FIX.md', 'color: #8B5CF6;');
    console.log('');
    console.log('%c📧 Watch below for real-time OTP flow logs...', 'color: #10B981; font-weight: bold;');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    initAuthListener((user) => {
      // This callback is triggered when auth state changes
      if (user) {
        console.log('✅ User logged in:', user.email);
      } else {
        console.log('👋 User logged out');
      }
    });
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/market" element={<MarketplacePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:categoryId" element={<CategoryDetailPage />} />
          <Route path="/swap" element={<SwapPage />} />
          <Route path="/liquidation" element={<LiquidationPage />} />
          <Route path="/wanted" element={<WantedPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/otp-verify" element={<OTPVerifyPage />} />
          <Route path="/map/:productId" element={<MapPage />} />
          <Route path="/voice-assistant" element={<VoiceAssistantDemo />} />
          <Route path="/add-goods" element={<AddGoodsPage />} />
          <Route path="/sell" element={<AddGoodsPage />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}