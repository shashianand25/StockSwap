import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Mail, Loader2, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { signInWithEmailOTP, verifyEmailOTP } from '../lib/supabaseAuth';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { BackButton } from '../components/BackButton';
import logo from '../assets/logo.png';

export function LoginPage() {
  const navigate = useNavigate();
  // ... (keep state variables as is)
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  React.useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, step]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🚀 Starting OTP request for:', email);
      await signInWithEmailOTP(email);
      setStep('otp');
      setCountdown(60);
      setCanResend(false);
      toast.success('OTP Sent!', {
        description: `A 6-digit code has been sent to ${email}. Check your inbox and spam folder.`,
      });
      console.log('✅ OTP sent! Check your email for the 6-digit code.');
    } catch (error: any) {
      console.error('❌ OTP send failed:', error);
      toast.error('Failed to send OTP', {
        description: error.message || 'Please check your email and try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Verifying OTP:', otp.substring(0, 2) + '****'); // Log partially for security
      await verifyEmailOTP(email, otp);
      console.log('🎉 Login successful! Redirecting to dashboard...');
      toast.success('Welcome to StockSwap!', {
        description: 'Successfully logged in to your account',
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Verification failed:', error.message);
      toast.error('Verification Failed', {
        description: error.message || 'Invalid OTP code. Please try again.',
      });
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      await signInWithEmailOTP(email);
      setCountdown(60);
      setCanResend(false);
      setOtp('');
      toast.success('New OTP Sent!', {
        description: `A new code has been sent to ${email}`,
      });
    } catch (error: any) {
      toast.error('Failed to resend OTP', {
        description: error.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    if (username.length <= 3) return email;
    return `${username.slice(0, 2)}${'*'.repeat(username.length - 2)}@${domain}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={logo} alt="StockSwap" className="w-12 h-12 object-contain drop-shadow-md" />
            <h1 className="text-3xl text-white">StockSwap</h1>
          </div>
          <p className="text-gray-300 text-lg">Welcome back, shopkeeper!</p>
          <p className="text-gray-400 text-sm mt-2">
            {step === 'email' ? 'Enter your email to continue' : 'Enter the OTP we sent you'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-8 shadow-2xl border-2 border-gray-700 bg-white/95 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {/* Step 1: Email Input */}
              {step === 'email' && (
                <motion.form
                  key="email-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSendOtp}
                  className="space-y-6"
                >
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-900">
                          <strong>Secure Login:</strong> We'll send a 6-digit verification code to your email.
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          No password needed!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@yourshop.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 h-12 border-2 focus:border-[#10B981] transition-all"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={loading || !email}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.form>
              )}

              {/* Step 2: OTP Verification */}
              {step === 'otp' && (
                <motion.form
                  key="otp-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-6"
                >
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-green-900">OTP sent to {maskEmail(email)}</p>
                        <p className="text-xs text-green-700 mt-1">Check your inbox and enter the code below</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="otp" className="text-sm">Enter 6-Digit OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="h-14 border-2 focus:border-[#10B981] text-center text-2xl tracking-widest mt-2"
                      maxLength={6}
                      required
                      autoFocus
                      pattern="[0-9]{6}"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Verify & Login
                      </>
                    )}
                  </Button>

                  {/* Resend OTP */}
                  <div className="text-center">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-sm text-[#10B981] hover:text-[#059669] transition-colors font-medium"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Resend OTP in {countdown}s
                      </p>
                    )}
                  </div>

                  {/* Change Email */}
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setOtp('');
                      setCountdown(60);
                      setCanResend(false);
                    }}
                    className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Change email address
                  </button>

                  {/* Security Note */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-600 text-center">
                      🔒 For security, this code expires in 10 minutes
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Sign Up Link */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#10B981] hover:text-[#059669] transition-colors font-semibold">
                  Sign up now
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/60 text-sm mt-6"
        >
          {step === 'otp' && "Didn't receive the code? Check your spam folder."}
        </motion.p>
      </div>
    </div>
  );
}