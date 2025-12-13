# 🎯 Quick Visual Guide: Fix OTP in 3 Minutes

## 🚀 The FASTEST Way to Fix Your OTP Issue

Your code is perfect! You just need to update **ONE** email template in Supabase.

---

## 📍 Step-by-Step (3 Minutes)

### 1️⃣ Open Supabase Dashboard
Go to: https://app.supabase.com/project/YOUR_PROJECT_ID

### 2️⃣ Navigate to Email Templates
```
Left Sidebar → Authentication (🔐 icon) → Email Templates
```

### 3️⃣ Find This Template
Look for: **"Magic Link"** or **"Confirm signup"**

### 4️⃣ Copy & Paste This ENTIRE Template

```html
<h2>Your Login Code for StockSwap</h2>

<p>Hello!</p>

<p>Your 6-digit verification code is:</p>

<h1 style="font-size: 32px; font-weight: bold; color: #10B981; letter-spacing: 5px; text-align: center; background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0;">
  {{ .Token }}
</h1>

<p><strong>⏰ This code expires in 10 minutes.</strong></p>

<p>Enter this code in StockSwap to login.</p>

<p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
If you didn't request this, ignore this email.
</p>
```

### 5️⃣ Click SAVE Button
Bottom of the page → **Save** button

### 6️⃣ Test It!
1. Go to your StockSwap login page
2. Enter your email
3. Check your inbox
4. You should see a **6-digit code** like `123456`

---

## ✅ What to Look For

### CORRECT Email (You Want This! ✅)
```
Subject: Your Login Code for StockSwap

Your 6-digit verification code is:

  483921

⏰ This code expires in 10 minutes.
```

### WRONG Email (Magic Link - You DON'T Want This ❌)
```
Subject: Confirm Your Email

Click here to confirm:
https://yourproject.supabase.co/auth/v1/verify?token=abc...
```

---

## 🎨 Visual Location in Supabase

```
Supabase Dashboard
│
├── 🏠 Home
├── 🔐 Authentication ← CLICK HERE!
│   ├── Users
│   ├── Policies
│   ├── Providers
│   ├── Email Templates ← THEN CLICK HERE!
│   │   ├── Confirm signup (Magic Link) ← EDIT THIS ONE!
│   │   ├── Invite user
│   │   ├── Reset password
│   │   └── Change email address
│   └── Settings
│
└── Other sections...
```

---

## 🔑 The Magic Line

This is the **MOST IMPORTANT** line in your template:

```html
{{ .Token }}
```

☝️ This displays the 6-digit OTP code!

**Don't use:**
- ❌ `{{ .TokenHash }}` (shows long hash)
- ❌ `{{ .ConfirmationURL }}` (creates magic link)

**Always use:**
- ✅ `{{ .Token }}` (shows 6-digit OTP)

---

## 🆘 Still Not Working?

### Check #1: Is it the right template?
- Template name should be **"Magic Link"** or **"Confirm signup"**
- NOT "Invite user" or "Reset password"

### Check #2: Did you save?
- Click the green **Save** button at bottom
- Wait 1-2 minutes for changes to apply

### Check #3: Check spam folder
- OTP emails might go to spam initially
- Mark as "Not Spam" to fix future emails

### Check #4: Open browser console
Press **F12** in your browser and look for:
```
📧 Sending OTP to: your@email.com
✅ OTP sent successfully
```

---

## 💡 Pro Tips

### Tip 1: Customize Your Email
Feel free to change colors, text, or add your logo!
Just **keep the `{{ .Token }}` line**!

### Tip 2: Subject Line
Change the subject at the top of the template:
```html
Subject: {{ .Subject }} <!-- Keep default -->
```
Or customize it:
```html
Subject: StockSwap Login Code - {{ .Token }}
```

### Tip 3: Add Expiration Time
Your code already sets 10-minute expiration. To change:
```
Authentication → Settings → "OTP expiration" → 600 seconds
```

---

## 🎉 Success Checklist

After updating the template:
- [ ] Template contains `{{ .Token }}`
- [ ] Saved the template
- [ ] Waited 1-2 minutes
- [ ] Tested login flow
- [ ] Received email with 6-digit code
- [ ] Successfully logged in

---

## 📞 Need More Help?

1. Check console logs (F12 in browser)
2. Read `/SUPABASE_EMAIL_OTP_SETUP.md` for detailed guide
3. Verify your template looks like the example above
4. Make sure you're editing "Magic Link" template

---

## 🚨 TLDR (Too Long Didn't Read)

1. Go to Supabase → Authentication → Email Templates
2. Edit "Magic Link" template
3. Add `{{ .Token }}` somewhere in the HTML
4. Save
5. Test!

That's it! Your OTP will work perfectly! 🎊
