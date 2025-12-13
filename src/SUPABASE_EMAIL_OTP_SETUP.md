# 🔐 Supabase Email OTP Setup Guide

Your code is **already correct**! The issue is that Supabase needs to be configured to send OTP codes instead of magic links.

## ✅ Your Code Status
- ✅ Two-step OTP flow implemented correctly
- ✅ `signInWithEmailOTP()` sends the OTP request
- ✅ `verifyEmailOTP()` verifies the 6-digit code
- ✅ No `emailRedirectTo` option (which would trigger magic links)

## 🚨 The Problem
Supabase sends **magic links by default** even when you use `signInWithOtp()`. You need to update the **email template** to show the OTP code instead.

---

## 📧 Fix: Update Supabase Email Template

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to: **Authentication** → **Email Templates**

### Step 2: Find "Magic Link" Template
Look for the template called **"Magic Link"** or **"Confirm signup"**

### Step 3: Replace the Template Content

**Replace the current template with this:**

```html
<h2>Your Login Code for StockSwap</h2>

<p>Hi there!</p>

<p>Your 6-digit verification code is:</p>

<h1 style="font-size: 32px; font-weight: bold; color: #10B981; letter-spacing: 5px; text-align: center; background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0;">
  {{ .Token }}
</h1>

<p><strong>This code expires in 10 minutes.</strong></p>

<p>Enter this code in the StockSwap app to complete your login.</p>

<p>If you didn't request this code, please ignore this email.</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

<p style="color: #6b7280; font-size: 14px;">
  StockSwap - Your trusted B2B marketplace for Indian retailers<br>
  This is an automated message, please do not reply.
</p>
```

### Step 4: Important Template Variables

Make sure your template includes **`{{ .Token }}`** - this is what displays the 6-digit OTP code!

**Available Supabase variables:**
- `{{ .Token }}` - The 6-digit OTP code (REQUIRED!)
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your app URL
- `{{ .TokenHash }}` - Token hash (not needed for OTP)
- `{{ .ConfirmationURL }}` - Magic link URL (remove this for OTP!)

### Step 5: Save the Template
Click **Save** at the bottom of the page.

---

## ⚙️ Additional Settings to Check

### 1. Disable Email Confirmation (Optional)
If you want users to login immediately after entering OTP:

1. Go to **Authentication** → **Settings**
2. Find **"Enable email confirmations"**
3. Toggle it **OFF** (or keep ON if you want extra security)

### 2. Set OTP Expiration Time
1. Stay in **Authentication** → **Settings**
2. Look for **"OTP expiration time"**
3. Default is 3600 seconds (60 minutes)
4. Recommended: **600 seconds (10 minutes)** for better security

### 3. Rate Limiting
Check **Authentication** → **Rate Limits** to prevent OTP spam:
- **Email OTP**: 3 requests per hour per email (recommended)

---

## 🧪 Testing Your Setup

### 1. Test the OTP Flow
```bash
1. Go to your app's login page
2. Enter your email
3. Click "Send OTP"
4. Check your email inbox (and spam folder!)
5. You should see a 6-digit code like: 123456
6. Enter the code and verify
```

### 2. Check Console Logs
Open browser DevTools (F12) and watch for these logs:
```
📧 Sending OTP to: your@email.com
✅ OTP sent successfully - Check your Supabase Email Templates!
🔐 Verifying OTP for: your@email.com
✅ OTP verified successfully
👤 Saving user profile...
```

### 3. If You Still See Magic Links
**Problem:** Email still contains "Click here to login" instead of OTP code

**Solution:**
1. Make sure you saved the template changes
2. Wait 1-2 minutes for Supabase to update
3. Clear your browser cache
4. Try sending a new OTP
5. Check you're editing the correct template (Magic Link / Confirm Signup)

---

## 🎯 Expected Email Content

**CORRECT Email (with OTP):**
```
Subject: Your Login Code for StockSwap

Your 6-digit verification code is:

  123456

This code expires in 10 minutes.
Enter this code in the StockSwap app to complete your login.
```

**INCORRECT Email (magic link - you DON'T want this):**
```
Subject: Confirm Your Email

Click here to confirm your email:
https://yourproject.supabase.co/auth/v1/verify?...
```

---

## 🔧 Alternative: Use Supabase CLI (Advanced)

If you prefer to set templates via code:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to your project
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Update email template
supabase auth update email-templates \
  --template magic-link \
  --subject "Your StockSwap Login Code" \
  --body-path ./email-template.html
```

---

## 🆘 Troubleshooting

### Issue 1: Still Receiving Magic Links
- ✅ Verify you saved the email template changes
- ✅ Check you edited the **"Magic Link"** template (not "Invite" or "Recovery")
- ✅ Make sure `{{ .Token }}` is in the template
- ✅ Remove any `{{ .ConfirmationURL }}` from the template
- ✅ Wait 2-3 minutes for changes to propagate

### Issue 2: Not Receiving Any Email
- ✅ Check spam/junk folder
- ✅ Verify email in Supabase **Authentication** → **Users**
- ✅ Check Supabase rate limits
- ✅ Verify your email provider isn't blocking Supabase emails

### Issue 3: "Invalid OTP" Error
- ✅ OTP expires in 10 minutes - request a new one
- ✅ Make sure you're entering exactly 6 digits
- ✅ Email must match the one you entered in step 1
- ✅ Check console for verification errors

### Issue 4: OTP Appears as Magic Link Hash
Your template might still have `{{ .TokenHash }}` instead of `{{ .Token }}`:
- **Wrong:** `{{ .TokenHash }}` → Shows: `abc123def456...` (long hash)
- **Correct:** `{{ .Token }}` → Shows: `123456` (6 digits)

---

## 📚 References

- [Supabase Email OTP Docs](https://supabase.com/docs/guides/auth/auth-email)
- [Supabase Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth)

---

## ✅ Checklist

Before testing, verify:
- [ ] Email template updated with `{{ .Token }}`
- [ ] Template saved in Supabase dashboard
- [ ] No `{{ .ConfirmationURL }}` in template
- [ ] OTP expiration time set (10 minutes recommended)
- [ ] Rate limiting configured
- [ ] Code already implements two-step flow ✅ (already done!)

---

## 🎉 You're All Set!

Once you've updated the Supabase email template, your OTP flow will work perfectly! Your code is already production-ready.

**Need help?** Check the console logs for detailed debugging information.
