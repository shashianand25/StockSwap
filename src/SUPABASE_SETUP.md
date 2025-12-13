# 🔥 Supabase Google OAuth Setup Guide

## ✅ CREDENTIALS ALREADY CONFIGURED!

Your Supabase project is connected:
- **Project ID:** `hzwpwbxvimqbmykignhc`
- **URL:** `https://hzwpwbxvimqbmykignhc.supabase.co`

---

## 🚀 Quick Setup (3 Steps):

### 1. **Create the Profiles Table in Supabase**

Go to your Supabase SQL Editor and run this:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  shop_name TEXT,
  phone TEXT,
  location TEXT,
  gst_number TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 2. **Configure Google OAuth in Supabase**

1. Go to **Authentication > Providers** in your Supabase dashboard
2. Enable **Google** provider
3. Add these **Authorized redirect URIs** in your Google Cloud Console:
   - `https://hzwpwbxvimqbmykignhc.supabase.co/auth/v1/callback`
   - `http://localhost:5173/auth/callback` (for local testing)

### 3. **Set Environment Variables**

Make sure you have these in your `.env` file (they should already be there from Supabase connection):

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. **How It Works Now:**

#### **Google Sign-In/Sign-Up:**
- Click "Continue with Google" or "Sign up with Google"
- User is redirected to Google OAuth
- After successful login, they're redirected back to `/dashboard`
- Their profile is automatically created in the `profiles` table
- User info is saved to localStorage for quick access

#### **Email/Password Sign-Up:**
- User fills out the form with name, shop, email, phone, location, GST
- Account is created in Supabase Auth
- Profile is saved to `profiles` table
- User is redirected to dashboard

#### **Email/Password Login:**
- User enters email and password
- Supabase verifies credentials
- User profile is loaded from database
- Redirected to dashboard

#### **OTP Login:**
- User enters phone number
- Supabase sends OTP via SMS
- User enters 6-digit code
- After verification, logged in and redirected

### 5. **Test It Out:**

1. **Sign up with Google:**
   - Click "Sign up with Google"
   - Complete Google OAuth
   - Should land on dashboard with your Google name/email

2. **Sign up with Email:**
   - Fill out the form
   - Create account
   - Check Supabase Auth dashboard to see new user

3. **Login:**
   - Try logging out (click profile dropdown → Sign Out)
   - Try logging back in with email/password or Google

### 6. **Troubleshooting:**

**If Google OAuth doesn't redirect:**
- Check that redirect URL is correct in Google Cloud Console
- Make sure you added the Supabase callback URL
- Check browser console for errors

**If user data doesn't save:**
- Run the SQL to create the profiles table
- Check RLS policies are enabled
- Look at Supabase logs for errors

**If nothing happens:**
- Open browser console (F12)
- Check for error messages
- Verify environment variables are loaded

---

## 🎉 YOU'RE ALL SET!

The app now has **REAL** authentication with:
- ✅ Google OAuth (one-click sign-in)
- ✅ Email/Password signup and login
- ✅ OTP/SMS login (if Twilio is configured)
- ✅ Persistent sessions
- ✅ Auto profile creation
- ✅ Secure sign-out

**Try it now and let me know if it works!** 🚀