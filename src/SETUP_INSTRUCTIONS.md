# 🚀 FINAL SETUP - 2 Simple Steps!

## ✅ Your Supabase is Connected!

I can see your credentials are already here. Just do these 2 things:

---

## Step 1: Create the Database Table

Go to your Supabase dashboard:
**https://supabase.com/dashboard/project/hzwpwbxvimqbmykignhc**

1. Click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy and paste this SQL:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
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

4. Click **RUN** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

---

## Step 2: Enable Google OAuth

Still in Supabase dashboard:

1. Go to **Authentication** → **Providers** (left sidebar)
2. Find **Google** in the list
3. Click to expand it
4. Toggle **Enable Sign in with Google** to ON
5. You'll need to add Google OAuth credentials:

### Get Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add these URLs:

**Authorized JavaScript origins:**
```
http://localhost:5173
https://hzwpwbxvimqbmykignhc.supabase.co
```

**Authorized redirect URIs:**
```
https://hzwpwbxvimqbmykignhc.supabase.co/auth/v1/callback
```

7. Copy the **Client ID** and **Client Secret**
8. Paste them into Supabase Google provider settings
9. Click **Save**

---

## 🎉 THAT'S IT!

Now refresh your app and click **"Continue with Google"**

It will:
1. Redirect to Google login
2. Ask permission
3. Redirect back to your app
4. Automatically create profile in database
5. Log you in!

---

## 🧪 Test Email/Password Too!

While you're at it, test email signup:

1. Fill out the signup form
2. Click "Create Account"
3. Check your email for confirmation (Supabase sends it automatically)
4. Click the link to verify
5. Login!

---

## ⚠️ Optional: Disable Email Confirmation

If you want instant signups without email confirmation:

1. Go to **Authentication** → **Email Templates**
2. Scroll to **Confirm signup** template
3. Toggle **Enable email confirmation** to OFF

Now users can sign up and login immediately!

---

## 🐛 Troubleshooting

**Table creation failed?**
- Make sure you're in the SQL Editor
- Check for any red error messages
- Try running each CREATE statement separately

**Google OAuth not working?**
- Double-check the redirect URI exactly matches
- Make sure both Client ID and Secret are copied correctly
- Wait 1-2 minutes after saving (Google can be slow)

**Still see demo mode warning?**
- Hard refresh the page (Ctrl+Shift+R)
- Clear browser cache
- Restart your dev server

---

## ✅ Success Indicators

You'll know it's working when:

✅ Console shows: `✅ Supabase connected: https://hzwpwbxvimqbmykignhc.supabase.co`
✅ No "demo mode" warnings
✅ Google login redirects to actual Google
✅ After login, you see your real Google name/email
✅ Profile appears in Supabase Dashboard → Table Editor → profiles

---

**Questions? Check the browser console for detailed error messages!**

**YOUR APP IS READY! 🚀**
