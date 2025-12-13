# 🚀 START HERE - OTP Setup

## 👋 Hey! Welcome to StockSwap!

Your authentication code is **already perfect**! You just need to update **ONE** Supabase email template.

---

## ⚡ 30-Second Fix

### Step 1: Open Supabase
```
https://app.supabase.com/project/YOUR_PROJECT_ID/auth/templates
```

### Step 2: Edit "Magic Link" Template

### Step 3: Paste This
```html
<h2>Your Login Code for StockSwap</h2>
<p>Your 6-digit verification code is:</p>
<h1 style="font-size: 32px; font-weight: bold; color: #10B981; letter-spacing: 5px; text-align: center; background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0;">
  {{ .Token }}
</h1>
<p><strong>⏰ This code expires in 10 minutes.</strong></p>
<p>Enter this code in the StockSwap app to complete your login.</p>
```

### Step 4: Click Save

### Step 5: Test!
Go to `/login`, enter email, check inbox for **6-digit code** ✨

---

## 📚 Need More Help?

### 🎯 Quick Navigation

| I want to... | Read this file | Time |
|--------------|----------------|------|
| **Fix it ASAP** | `/OTP_QUICK_FIX.md` | 30s |
| **Just get the template** | `/SUPABASE_TEMPLATE_CHEATSHEET.md` | 10s |
| **See step-by-step with visuals** | `/SUPABASE_VISUAL_GUIDE.md` | 3m |
| **Understand everything** | `/README_OTP_FIX.md` | 10m |
| **Advanced troubleshooting** | `/SUPABASE_EMAIL_OTP_SETUP.md` | 10m |
| **See all guides** | `/OTP_DOCS_INDEX.md` | 2m |

---

## ✅ What's Working Already

Your StockSwap app has:
- ✅ Two-step OTP authentication flow
- ✅ Email OTP sending (`signInWithOtp`)
- ✅ OTP verification (`verifyOtp`)
- ✅ Session management
- ✅ Beautiful UI with countdown timer
- ✅ Resend OTP functionality
- ✅ Error handling
- ✅ Console logging for debugging

**Everything is production-ready!** 🎉

---

## 🎯 The Only Issue

Supabase sends **magic links** by default, even when using `signInWithOtp()`.

You need to update the **email template** to show `{{ .Token }}` (the 6-digit OTP code) instead.

---

## 🔍 How to Know It's Working

### ✅ CORRECT Email (After Fix)
```
Subject: Your Login Code for StockSwap

Your 6-digit verification code is:

  483921

⏰ This code expires in 10 minutes.
```

### ❌ WRONG Email (Before Fix)
```
Subject: Confirm Your Email

Click here to confirm your email:
[Confirm Email Button]
```

---

## 🐛 Debugging

Press **F12** in your browser to see helpful logs:

```
╔═══════════════════════════════════════════════════════════╗
║   🚀 StockSwap - OTP Authentication Ready!              ║
╚═══════════════════════════════════════════════════════════╝

📧 Watch below for real-time OTP flow logs...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When you send OTP:
🚀 Starting OTP request for: your@email.com
📧 Sending OTP to: your@email.com
✅ OTP sent successfully

When you verify:
🔐 Verifying OTP: 48****
✅ OTP verified successfully
🎉 Login successful! Redirecting to dashboard...
```

---

## 🆘 Quick Troubleshooting

### Issue: Still getting magic links
**Fix:** Make sure template contains `{{ .Token }}` and you clicked Save

### Issue: No email received
**Fix:** Check spam folder, verify email in Supabase dashboard

### Issue: "Invalid OTP" error
**Fix:** OTP expires in 10 minutes, request a new one

### Issue: Template not updating
**Fix:** Wait 1-2 minutes after saving, clear browser cache

---

## 💡 Pro Tip

The **magic line** in your template:
```
{{ .Token }}
```

This displays the 6-digit OTP code!

**Don't use:**
- ❌ `{{ .TokenHash }}` (shows long hash)
- ❌ `{{ .ConfirmationURL }}` (creates magic link)

**Always use:**
- ✅ `{{ .Token }}` (shows 6-digit code)

---

## 🎨 Want to Customize the Email?

Check `/SUPABASE_TEMPLATE_CHEATSHEET.md` for:
- 3 ready-to-use templates (Minimal, Standard, Colorful)
- How to change colors
- How to add your logo
- Template variables reference

---

## 📖 Full Documentation

For complete details, read:
- **Quick reference:** `/OTP_QUICK_FIX.md`
- **Complete guide:** `/README_OTP_FIX.md`
- **All guides:** `/OTP_DOCS_INDEX.md`

---

## ✨ Summary

1. Your code is **perfect** ✅
2. Just update **one** email template
3. Add `{{ .Token }}` to show OTP code
4. Takes **30 seconds** ⚡
5. You're done! 🎉

---

## 🚀 Let's Do This!

1. Go to: https://app.supabase.com → Your Project → Auth → Email Templates
2. Edit "Magic Link" template
3. Paste the template from Step 3 above
4. Save
5. Test login!

**You've got this!** 💪

---

**Need more details?** → Read `/OTP_QUICK_FIX.md`  
**Want all guides?** → Check `/OTP_DOCS_INDEX.md`  
**Ready to test?** → Go to `/login` page!

---

<div align="center">
  <h3>🎊 Your StockSwap OTP Authentication Will Be Live in 1 Minute! 🎊</h3>
</div>
