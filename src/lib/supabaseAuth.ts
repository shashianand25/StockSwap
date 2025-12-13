import { supabase } from './supabase';
import { User, setCurrentUser, logout as clearUser } from './auth';

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }

  return data;
};

export const signInWithOTP = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    console.error('OTP send error:', error);
    throw error;
  }

  return data;
};

// Email OTP Functions
export const signInWithEmailOTP = async (email: string) => {
  console.log('📧 Sending OTP to:', email);
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      // IMPORTANT: No emailRedirectTo means Supabase will send OTP, not magic link
      // Make sure your Supabase email template contains {{ .Token }} for the OTP code
    },
  });

  if (error) {
    console.error('❌ Email OTP send error:', error);
    throw error;
  }

  console.log('✅ OTP sent successfully - Check your Supabase Email Templates!');
  return data;
};

export const verifyEmailOTP = async (email: string, token: string) => {
  console.log('🔐 Verifying OTP for:', email);
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    console.error('❌ Email OTP verification error:', error);
    throw error;
  }

  console.log('✅ OTP verified successfully');
  
  if (data.user) {
    console.log('👤 Saving user profile...');
    await saveUserProfile(data.user);
  }

  return data;
};

export const verifyOTP = async (phone: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error) {
    console.error('OTP verification error:', error);
    throw error;
  }

  if (data.user) {
    await saveUserProfile(data.user);
  }

  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }

  if (data.user) {
    await saveUserProfile(data.user);
  }

  return data;
};

export const signUpWithEmail = async (email: string, password: string, userData: {
  ownerName: string;
  shopName: string;
  phone: string;
  location: string;
  gstNumber?: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    console.error('Sign-up error:', error);
    throw error;
  }

  if (data.user) {
    // Save to profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email,
        name: userData.ownerName,
        shop_name: userData.shopName,
        phone: userData.phone,
        location: userData.location,
        gst_number: userData.gstNumber,
        verified: !!userData.gstNumber,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    await saveUserProfile(data.user);
  }

  return data;
};

export const signOutUser = async () => {
  console.log('👋 Signing out user...');
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('❌ Sign-out error:', error);
    throw error;
  }

  console.log('✅ Signed out successfully');
  clearUser();
};

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Session error:', error);
    return null;
  }

  if (session?.user) {
    await saveUserProfile(session.user);
  }

  return session;
};

const saveUserProfile = async (supabaseUser: any) => {
  // Try to get profile from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();

  const user: User = {
    id: supabaseUser.id,
    name: profile?.name || supabaseUser.user_metadata?.ownerName || supabaseUser.user_metadata?.full_name || 'User',
    email: supabaseUser.email || '',
    phone: profile?.phone || supabaseUser.phone || supabaseUser.user_metadata?.phone || '',
    shopName: profile?.shop_name || supabaseUser.user_metadata?.shopName || 'My Shop',
    location: profile?.location || supabaseUser.user_metadata?.location || 'India',
    gstNumber: profile?.gst_number || supabaseUser.user_metadata?.gstNumber,
    verified: profile?.verified || !!profile?.gst_number || false,
    avatar: supabaseUser.user_metadata?.avatar_url,
  };

  setCurrentUser(user);
  return user;
};

// Listen to auth state changes
export const initAuthListener = (callback?: (user: User | null) => void) => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, session?.user?.email);
    
    if (session?.user) {
      const user = await saveUserProfile(session.user);
      callback?.(user);
    } else {
      clearUser();
      callback?.(null);
    }
  });
};