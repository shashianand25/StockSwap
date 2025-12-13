# StockSwap Authentication - Troubleshooting Guide

## Quick Diagnostics

### Check Auth Status
Open browser console and type:
```javascript
localStorage.getItem('stockswap_user')
```
- If returns `null`: Not logged in
- If returns user object: Logged in

### Check Supabase Session
```javascript
// In browser console
supabase.auth.getSession().then(console.log)
```

## Common Issues

### 🔴 Problem: Not Receiving OTP Email

**Symptoms:**
- Clicked "Send OTP" but no email arrives
- Checked spam folder, still nothing
- Waited 5+ minutes

**Solutions:**

1. **Check Email Address**
   ```
   ✓ Make sure email is spelled correctly
   ✓ No extra spaces
   ✓ Valid email format
   ```

2. **Check Spam/Junk Folder**
   - Look for emails from Supabase
   - Check "Promotions" tab in Gmail
   - Add Supabase to safe senders

3. **Check Supabase Dashboard**
   - Go to Supabase Dashboard
   - Navigate to Authentication > Logs
   - Look for email send events
   - Check for errors

4. **Verify Email Provider Settings**
   - Authentication > Settings
   - Ensure "Email" provider is enabled
   - Check SMTP settings (if custom)

5. **Try Different Email**
   - Some email providers block automated emails
   - Try Gmail, Outlook, or Yahoo
   - Corporate emails might have strict filters

**Still not working?**
- Contact Supabase support
- Check your email provider's blocking rules
- Verify Supabase project is active

---

### 🔴 Problem: "Invalid OTP" Error

**Symptoms:**
- Entered OTP code
- Getting "Invalid OTP" or "Verification Failed" error

**Solutions:**

1. **Check OTP Expiry**
   - OTP codes expire after 10 minutes
   - Click "Resend OTP" to get fresh code
   - Enter new code immediately

2. **Verify Correct Email**
   - Make sure you're checking the right email account
   - Check the email address shown on screen
   - Click "Change email" if wrong

3. **Check for Typos**
   - OTP is 6 digits
   - No spaces or dashes
   - Only numbers 0-9

4. **Try Copy-Paste**
   - Copy OTP from email
   - Paste into input field
   - Remove any spaces

5. **Check for Multiple OTPs**
   - You might have multiple OTP emails
   - Use the LATEST one
   - Ignore older codes

**Still failing?**
```javascript
// Check console for detailed error
// Look for red error messages starting with ❌
```

---

### 🔴 Problem: Sign Out Not Working

**Symptoms:**
- Clicked "Sign Out"
- Still see user profile in navbar
- Can still access dashboard

**Solutions:**

1. **Hard Refresh**
   - Press `Ctrl + Shift + R` (Windows)
   - Press `Cmd + Shift + R` (Mac)
   - This clears browser cache

2. **Check Console Logs**
   ```javascript
   // Look for:
   👋 Signing out user...
   ✅ Signed out successfully
   
   // If you see errors, report them
   ```

3. **Manual Sign Out**
   ```javascript
   // In browser console:
   localStorage.removeItem('stockswap_user')
   location.reload()
   ```

4. **Clear Browser Data**
   - Open browser settings
   - Clear cookies and site data
   - For StockSwap domain only
   - Refresh page

**Still logged in?**
- Close all StockSwap tabs
- Clear browser cache completely
- Restart browser
- Try incognito mode

---

### 🔴 Problem: Session Lost on Page Refresh

**Symptoms:**
- Login successfully
- Refresh page (F5)
- Logged out again

**Solutions:**

1. **Check localStorage**
   ```javascript
   // In browser console:
   console.log(localStorage.getItem('stockswap_user'))
   // Should show user object
   ```

2. **Enable localStorage**
   - Check browser settings
   - Ensure cookies/local storage enabled
   - Disable private/incognito mode

3. **Check Browser Extensions**
   - Privacy extensions might block localStorage
   - Try disabling extensions
   - Test in incognito mode

4. **Check Supabase Session**
   ```javascript
   supabase.auth.getSession().then(res => {
     console.log('Session:', res.data.session)
   })
   ```

**Still losing session?**
- Your browser might not support localStorage
- Check browser compatibility
- Try different browser

---

### 🔴 Problem: Navbar Not Updating After Login

**Symptoms:**
- Login successful
- Redirected to dashboard
- Navbar still shows "Login" button

**Solutions:**

1. **Hard Refresh**
   - `Ctrl + Shift + R` (Windows)
   - `Cmd + Shift + R` (Mac)

2. **Check Console**
   ```javascript
   // Look for:
   ✅ User logged in: your-email@example.com
   ```

3. **Manual Fix**
   ```javascript
   // Force navbar update
   window.dispatchEvent(new Event('storage'))
   ```

4. **Navigate to Home**
   - Click the StockSwap logo
   - Then navigate back to dashboard
   - Navbar should update

---

### 🔴 Problem: Multiple Login Tabs/Windows Confused

**Symptoms:**
- Logged in on one tab
- Other tab doesn't update
- Inconsistent auth state

**Solutions:**

1. **Use One Tab**
   - Close all other StockSwap tabs
   - Keep only one tab open
   - Then login again

2. **Trigger Storage Event**
   - The app listens to storage events
   - Refresh all tabs
   - They should sync

3. **Manual Sync**
   ```javascript
   // In each tab's console:
   window.dispatchEvent(new Event('storage'))
   location.reload()
   ```

---

### 🔴 Problem: Can't Access Dashboard After Login

**Symptoms:**
- Login successful
- Error on dashboard page
- White screen or error message

**Solutions:**

1. **Check Console Errors**
   - Open browser console (F12)
   - Look for red error messages
   - Note the error details

2. **Check Network Tab**
   - Open DevTools > Network
   - Look for failed requests
   - Check Supabase API calls

3. **Verify Supabase Setup**
   - Ensure profiles table exists
   - Check table permissions (RLS)
   - Verify user exists in profiles

4. **Try Clean Login**
   - Sign out completely
   - Clear localStorage
   - Login again
   - Check if works

---

## Debug Mode

### Enable Verbose Logging

The app already has console logging. To see all auth events:

1. Open browser console (F12)
2. Filter logs by typing `auth` or `user`
3. Look for emoji indicators:
   - 📧 Email being sent
   - ✅ Success events
   - ❌ Error events
   - 👤 User profile events
   - 👋 Sign out events
   - 🔐 Verification events

### Check Auth Flow Step by Step

```javascript
// 1. Send OTP
📧 Sending OTP to: user@example.com
✅ OTP sent successfully

// 2. Verify OTP
🔐 Verifying OTP for: user@example.com
✅ OTP verified successfully
👤 Saving user profile...

// 3. Session created
Auth state changed: SIGNED_IN user@example.com
✅ User logged in: user@example.com

// 4. Sign out
👋 Signing out user...
✅ Signed out successfully
Auth state changed: SIGNED_OUT undefined
👋 User logged out
```

---

## Advanced Debugging

### Check Supabase Configuration

1. **Go to Supabase Dashboard**
2. **Check Authentication Settings:**
   - Email provider: ✅ Enabled
   - Confirm email: ❌ Disabled (for faster onboarding)
   - Secure email change: Your choice

3. **Check Email Templates:**
   - Go to Email Templates
   - Verify "Magic Link" template shows `{{ .Token }}`
   - Should say "Your OTP is: {{ .Token }}"

4. **Check RLS Policies:**
   - Go to Table Editor > profiles
   - Check Row Level Security
   - Ensure users can read their own profile

### Test Supabase Directly

```javascript
// In browser console
import { supabase } from './lib/supabase'

// Test OTP send
supabase.auth.signInWithOtp({ 
  email: 'test@example.com' 
}).then(console.log)

// Test OTP verify
supabase.auth.verifyOtp({
  email: 'test@example.com',
  token: '123456',
  type: 'email'
}).then(console.log)
```

---

## Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Check browser console for errors
3. ✅ Try in incognito mode
4. ✅ Try different browser
5. ✅ Check Supabase dashboard logs

### Include in Your Report

```
Browser: Chrome 120.0.0.0
OS: Windows 11
Error: [Exact error message]
Console logs: [Copy relevant logs]
Steps to reproduce: [What did you do?]
Expected: [What should happen?]
Actual: [What actually happened?]
```

### Useful Console Commands

```javascript
// Get current user
localStorage.getItem('stockswap_user')

// Get Supabase session
supabase.auth.getSession().then(console.log)

// Force sign out
localStorage.removeItem('stockswap_user')
supabase.auth.signOut()
location.reload()

// Test auth listener
// Watch console for auth events, then:
supabase.auth.signInWithOtp({ email: 'test@example.com' })
```

---

## Still Having Issues?

1. **Read Documentation**
   - `/AUTH_FLOW.md` - Complete auth flow
   - `/CHANGELOG_AUTH.md` - What changed

2. **Check Supabase Docs**
   - [OTP Authentication](https://supabase.com/docs/guides/auth/auth-otp)
   - [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

3. **Clear Everything and Start Fresh**
   ```javascript
   // Nuclear option - clear all data
   localStorage.clear()
   sessionStorage.clear()
   // Then hard refresh (Ctrl+Shift+R)
   ```

4. **Contact Support**
   - Provide detailed error logs
   - Include browser/OS info
   - Describe exact steps to reproduce
