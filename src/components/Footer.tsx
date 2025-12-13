import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="StockSwap" className="w-8 h-8 object-contain" />
              <span className="text-xl text-white">StockSwap</span>
            </div>
            <p className="text-sm text-gray-400">
              India's first hyperlocal B2B marketplace for retailers to liquidate dead inventory.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-[#10B981] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/market" className="hover:text-[#10B981] transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#10B981] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-[#10B981] transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#terms" className="hover:text-[#10B981] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-[#10B981] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#refund" className="hover:text-[#10B981] transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#shipping" className="hover:text-[#10B981] transition-colors">
                  Shipping Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#10B981]" />
                <a href="mailto:support@stockswap.in" className="hover:text-[#10B981] transition-colors">
                  support@stockswap.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#10B981]" />
                <a href="tel:+911800123456" className="hover:text-[#10B981] transition-colors">
                  1800-123-456
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#10B981]" />
                <span>Mumbai, Maharashtra</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 StockSwap. All rights reserved. Made with ❤️ for Indian Retailers.</p>
        </div>
      </div>
    </footer>
  );
}
