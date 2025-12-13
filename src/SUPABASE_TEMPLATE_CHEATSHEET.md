# 📄 Supabase OTP Template - Copy & Paste Cheatsheet

## 🎯 The Template (Copy Everything Below)

```html
<h2>Your Login Code for StockSwap</h2>

<p>Hello!</p>

<p>Your 6-digit verification code is:</p>

<h1 style="font-size: 32px; font-weight: bold; color: #10B981; letter-spacing: 5px; text-align: center; background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0;">
  {{ .Token }}
</h1>

<p><strong>⏰ This code expires in 10 minutes.</strong></p>

<p>Enter this code in the StockSwap app to complete your login.</p>

<p>If you didn't request this code, please ignore this email.</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

<p style="color: #6b7280; font-size: 14px;">
  StockSwap - Your trusted B2B marketplace for Indian retailers<br>
  This is an automated message, please do not reply.
</p>
```

---

## 🔗 Where to Paste

**URL:** `https://app.supabase.com/project/YOUR_PROJECT_ID/auth/templates`

**Template Name:** "Magic Link" or "Confirm signup"

**Action:** Replace ALL existing content with the template above

---

## ✅ Critical Line

This line MUST be in your template:

```
{{ .Token }}
```

This displays the 6-digit OTP code!

---

## 🎨 Alternative Minimal Template

If you want something simpler:

```html
<h2>Your StockSwap Login Code</h2>
<h1 style="font-size:32px;color:#10B981;text-align:center;padding:20px;">{{ .Token }}</h1>
<p>Expires in 10 minutes.</p>
```

---

## 🌈 Alternative Colorful Template

Want more style?

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #F8FAFC; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo h1 { color: #0F172A; margin: 0; font-size: 28px; }
    .code-box { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 30px; border-radius: 12px; margin: 30px 0; }
    .info { color: #64748B; font-size: 14px; line-height: 1.6; }
    .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>🛒 StockSwap</h1>
      <p style="color: #64748B; margin: 5px 0;">Your B2B Marketplace</p>
    </div>
    
    <h2 style="color: #0F172A;">Your Verification Code</h2>
    
    <p>Hello! We received a login request for your StockSwap account.</p>
    
    <div class="code-box">
      {{ .Token }}
    </div>
    
    <div class="warning">
      <strong>⏰ Time Sensitive:</strong> This code expires in <strong>10 minutes</strong>.
    </div>
    
    <p>Enter this code in the StockSwap app to complete your login.</p>
    
    <div class="info">
      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
      <p>If you didn't request this code, you can safely ignore this email.</p>
      <p style="margin-top: 20px;">
        <strong>StockSwap</strong><br>
        Hyperlocal B2B Marketplace for Indian Retailers<br>
        This is an automated message. Please do not reply.
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 🚀 Available Template Variables

Use these in your custom template:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{ .Token }}` | 6-digit OTP code | `483921` |
| `{{ .Email }}` | User's email | `user@example.com` |
| `{{ .SiteURL }}` | Your app URL | `https://yourapp.com` |
| `{{ .TokenHash }}` | Token hash (DON'T USE) | Long hash string |
| `{{ .ConfirmationURL }}` | Magic link (DON'T USE) | Creates magic link |

---

## ❌ Common Mistakes

### Mistake #1: Using TokenHash
```html
<!-- WRONG ❌ -->
<h1>{{ .TokenHash }}</h1>
<!-- Shows: abc123def456ghi789... (long hash) -->

<!-- CORRECT ✅ -->
<h1>{{ .Token }}</h1>
<!-- Shows: 483921 (6 digits) -->
```

### Mistake #2: Including Confirmation URL
```html
<!-- WRONG ❌ -->
<a href="{{ .ConfirmationURL }}">Click to Login</a>
<!-- This creates a magic link! -->

<!-- CORRECT ✅ -->
<h1>{{ .Token }}</h1>
<!-- Just show the OTP code -->
```

### Mistake #3: Wrong Template
```
❌ Editing "Invite User" template
❌ Editing "Reset Password" template
✅ Edit "Magic Link" or "Confirm signup" template
```

---

## 🎯 Quick Test

After updating the template:

1. Go to login page
2. Enter email
3. Check inbox
4. Should see: **6-digit number** (e.g., 483921)
5. Should NOT see: Magic link or "Click here" button

---

## 🎨 Customization Tips

### Change Colors
```css
/* Primary color (green) */
color: #10B981;

/* Navy blue (brand color) */
color: #0F172A;

/* Rose red (urgent) */
color: #F43F5E;
```

### Add Logo
```html
<img src="YOUR_LOGO_URL" alt="StockSwap" style="width: 100px; height: auto;" />
```

### Change Subject Line
At the top of the template settings (not in HTML):
```
Subject: Your StockSwap Verification Code
```

---

## 💾 Save for Later

Bookmark this page! You can reuse these templates for:
- Testing
- Different projects
- Custom styling
- Troubleshooting

---

## 🆘 Emergency Minimal Template

If nothing works, use this absolute minimum:

```
Your StockSwap login code: {{ .Token }}

Expires in 10 minutes.
```

This will work even without HTML styling!

---

## ✅ Final Checklist

Before testing:
- [ ] Copied template
- [ ] Pasted in Supabase "Magic Link" template
- [ ] Contains `{{ .Token }}`
- [ ] Does NOT contain `{{ .ConfirmationURL }}`
- [ ] Clicked Save button
- [ ] Waited 1-2 minutes

---

## 📞 Need Help?

1. **Quick fix:** `/OTP_QUICK_FIX.md`
2. **Visual guide:** `/SUPABASE_VISUAL_GUIDE.md`
3. **Full docs:** `/README_OTP_FIX.md`
4. **Console logs:** Press F12 in browser

---

**That's it! Copy, paste, save, and you're done!** 🎉
