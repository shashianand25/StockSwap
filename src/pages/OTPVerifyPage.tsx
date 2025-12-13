import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { OTPInput } from '../components/OTPInput';
import { verifyEmailOTP, signInWithEmailOTP } from '../lib/supabaseAuth';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, RefreshCw, CheckCircle2, Shield } from 'lucide-react';

export function OTPVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOTP();
    }
  }, [otp]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await verifyEmailOTP(email, otp);
      toast.success('Email verified successfully! 🎉');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      await signInWithEmailOTP(email);
      toast.success('New OTP sent to your email! 📧');
      setCountdown(60);
      setCanResend(false);
      setOtp('');
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    if (username.length <= 3) return email;
    return `${username.slice(0, 2)}${'*'.repeat(username.length - 2)}@${domain}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 md:p-10 shadow-2xl border-2 border-[#10B981]/20 bg-white">
          {/* Back Button */}
          <div className="mb-4">
            <BackButton />
          </div>
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="bg-gradient-to-br from-[#10B981] to-[#059669] p-4 rounded-full">
                <Mail className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-2xl md:text-3xl text-[#0F172A] mb-2">
              Verify Your Email
            </h1>
            <p className="text-muted-foreground">
              We've sent a 6-digit code to
            </p>
            <p className="text-[#10B981] mt-1">
              {maskEmail(email)}
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              disabled={loading}
            />
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerifyOTP}
            disabled={otp.length !== 6 || loading}
            className="w-full h-14 bg-gradient-to-r from-[#10B981] to-[#059669] text-white mb-4"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Verify OTP
              </>
            )}
          </Button>

          {/* Resend Section */}
          <div className="text-center mb-6">
            {canResend ? (
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={resending}
                className="text-[#10B981] hover:text-[#059669]"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend OTP'
                )}
              </Button>
            ) : (
              <p className="text-muted-foreground text-sm">
                Resend OTP in {countdown}s
              </p>
            )}
          </div>

          {/* Security Note */}
          <div className="bg-[#F0FDF4] border border-[#10B981]/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-[#0F172A]">
                  For your security, this code will expire in 10 minutes.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Don't share this code with anyone.
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <BackButton className="w-full border-2" />
        </Card>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          Didn't receive the code? Check your spam folder or try resending.
        </p>
      </motion.div>
    </div>
  );
}
