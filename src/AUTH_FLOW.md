# StockSwap Authentication Flow

## Overview
StockSwap now uses a **unified session-based login flow** with email OTP verification. This provides a passwordless, secure authentication experience for shopkeepers.

## Login Flow

### Step 1: Email Input
- User enters their email address
- Click "Send OTP" button

### Step 2: OTP Generation
- Supabase sends a 6-digit OTP to the user's email
- **Important**: This is NOT a magic link - it's a code that must be manually entered
- OTP is valid for 10 minutes

### Step 3: OTP Verification
- User enters the 6-digit code from their email
- System verifies the OTP with Supabase
- On success, a session is created

### Step 4: Session Creation
- User profile is fetched/created in the database
- User data is stored in localStorage
- User is redirected to dashboard
- Navbar updates to show logged-in state

## Sign Out Flow

1. User clicks "Sign Out" in the navbar dropdown
2. `signOutUser()` is called which:
   - Calls `supabase.auth.signOut()` to end the Supabase session
   - Calls `clearUser()` to remove user from localStorage
3. Navbar updates to show logged-out state
4. User is redirected to home page

## Key Features

### Security
- ✅ No passwords stored
- ✅ OTP expires after 10 minutes
- ✅ Email verification required
- ✅ Session-based authentication
- ✅ Secure Supabase backend

### User Experience
- ✅ Simple 2-step login process
- ✅ No need to remember passwords
- ✅ Resend OTP option
- ✅ Email masking for privacy
- ✅ Clear countdown timer
- ✅ Smooth animations and transitions

### Session Management
- ✅ Session persists across page refreshes
- ✅ Auth state listener handles sign in/out
- ✅ Cross-tab synchronization
- ✅ Automatic profile loading

## Technical Implementation

### Files Modified
1. **`/pages/LoginPage.tsx`** - Completely redesigned with unified flow
2. **`/lib/supabaseAuth.ts`** - Fixed `signInWithEmailOTP` to send OTP (not magic link)
3. **`/components/Navbar.tsx`** - Enhanced auth state management

### Key Functions

#### `signInWithEmailOTP(email: string)`
Sends OTP to user's email address.
```typescript
await signInWithEmailOTP('user@example.com');
```

#### `verifyEmailOTP(email: string, token: string)`
Verifies the OTP and creates a session.
```typescript
await verifyEmailOTP('user@example.com', '123456');
```

#### `signOutUser()`
Signs out the current user and clears the session.
```typescript
await signOutUser();
```

#### `getCurrentSession()`
Gets the current Supabase session.
```typescript
const session = await getCurrentSession();
```

## Supabase Configuration

### Email Templates
Make sure your Supabase project has email templates configured:

1. Go to **Authentication > Email Templates**
2. Edit the "Magic Link" template (this is actually used for OTP)
3. Ensure it displays `{{ .Token }}` clearly
4. Customize the branding to match StockSwap

### Email Settings
1. Go to **Authentication > Settings**
2. Enable "Email" provider
3. Set "Confirm email" to disabled (for faster onboarding)
4. OTP expiry is 60 seconds by default (configurable)

## Testing the Flow

### Login Test
1. Go to `/login`
2. Enter email: `test@example.com`
3. Check email for 6-digit code
4. Enter the code
5. Verify redirect to dashboard

### Sign Out Test
1. Click on user avatar in navbar
2. Click "Sign Out"
3. Verify redirect to home
4. Verify navbar shows "Login" button

### Session Persistence Test
1. Log in successfully
2. Refresh the page
3. Verify user remains logged in
4. Open in new tab
5. Verify user is still logged in

## Common Issues & Solutions

### Issue: Not receiving OTP email
**Solution**: 
- Check spam folder
- Verify email settings in Supabase dashboard
- Check Supabase logs for email delivery errors

### Issue: "Invalid OTP" error
**Solution**:
- Ensure OTP hasn't expired (10 min limit)
- Use "Resend OTP" to get a fresh code
- Check for typos in email address

### Issue: Session not persisting
**Solution**:
- Check browser localStorage is enabled
- Verify Supabase session is created (check Network tab)
- Check auth state listener in App.tsx

### Issue: Sign out not working
**Solution**:
- Check browser console for errors
- Verify `signOutUser()` is being called
- Clear localStorage manually if needed

## Future Enhancements

- [ ] Phone number OTP as alternative
- [ ] Remember device option
- [ ] Email verification badge
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Login history tracking
