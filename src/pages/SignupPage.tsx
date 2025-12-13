import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { User, Mail, Phone, Lock, Store, MapPin, FileText, Chrome, Loader2, CheckCircle2 } from 'lucide-react';
import { signUpWithEmail, signInWithGoogle } from '../lib/supabaseAuth';
import { toast } from 'sonner@2.0.3';
import { BackButton } from '../components/BackButton';
import logo from '../assets/logo.png';

export function SignupPage() {
  const navigate = useNavigate();
  // ... (keep existing state)
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    ownerName: '',
    shopName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    gstNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail(formData.email, formData.password, {
        ownerName: formData.ownerName,
        shopName: formData.shopName,
        phone: formData.phone,
        location: formData.location,
        gstNumber: formData.gstNumber,
      });

      toast.success('Account Created!', {
        description: 'Welcome to StockSwap. Let\'s start swapping!',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Sign-up Failed', {
        description: error.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);

    try {
      await signInWithGoogle();
      // User will be redirected to Google OAuth
      toast.success('Redirecting to Google...', {
        description: 'Please complete the sign-up process',
      });
    } catch (error: any) {
      toast.error('Google Sign-Up Failed', {
        description: error.message || 'Please try again',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton className="text-white hover:text-white/80" />
        </div>
        {/* Logo & Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={logo} alt="StockSwap" className="w-12 h-12 object-contain drop-shadow-md" />
            <h1 className="text-3xl text-white">StockSwap</h1>
          </div>
          <p className="text-gray-300 text-lg">Join India's #1 B2B Inventory Marketplace</p>
          <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-1">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Free Forever
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-1">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              GST Verified
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-1">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>

        <Card className="p-8 shadow-2xl border-2 border-gray-700 bg-white/95 backdrop-blur-sm animate-slide-up">
          <h2 className="text-2xl text-[#0F172A] mb-2">Create Your Account</h2>
          <p className="text-gray-600 mb-6">Fill in your details to get started</p>

          {/* Google Signup - Primary Option */}
          <Button
            onClick={handleGoogleSignup}
            variant="outline"
            className="w-full h-14 border-2 hover:bg-gray-50 hover:border-[#10B981] transition-all duration-300 transform hover:scale-[1.02] mb-6 text-base shadow-md"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Connecting to Google...
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5 mr-2 text-[#4285F4]" />
                Sign up with Google (Fastest!)
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Owner Name & Shop Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ownerName" className="text-sm">Your Name *</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    placeholder="Rajesh Kumar"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="pl-11 h-12 border-2 focus:border-[#10B981] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shopName" className="text-sm">Shop Name *</Label>
                <div className="relative mt-2">
                  <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="shopName"
                    name="shopName"
                    type="text"
                    placeholder="Kumar Traders"
                    value={formData.shopName}
                    onChange={handleChange}
                    className="pl-11 h-12 border-2 focus:border-[#10B981] transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-sm">Email Address *</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@shop.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-11 h-12 border-2 focus:border-[#10B981] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm">Mobile Number *</Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-11 h-12 border-2 focus:border-[#10B981] transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-sm">Shop Location *</Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Andheri East, Mumbai, Maharashtra"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-11 h-12 border-2 focus:border-[#10B981] transition-all"
                  required
                />
              </div>
            </div>

            {/* GST Number (Optional) */}
            <div>
              <Label htmlFor="gstNumber" className="text-sm flex items-center gap-2">
                GST Number (Optional)
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                  Get Verified Badge ✓
                </Badge>
              </Label>
              <div className="relative mt-2">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="gstNumber"
                  name="gstNumber"
                  type="text"
                  placeholder="27AABCU9603R1ZM"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="pl-11 h-12 border-2 focus:border-[#10B981] transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Adding GST increases trust and visibility by 3x</p>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password" className="text-sm">Password *</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-11 h-12 border-2 focus:border-[#10B981] transition-all"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Min. 6 characters</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm">Confirm Password *</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-11 h-12 border-2 focus:border-[#10B981] transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-base"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Your Account...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#10B981] hover:text-[#059669] transition-colors font-semibold">
              Login here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
