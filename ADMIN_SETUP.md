# Admin Setup Guide

## Quick Setup (Recommended)

The easiest way to create the admin account is through the browser:

1. Navigate to: `http://localhost:5173/admin/setup`
2. Click "Create Admin Account"
3. Wait for confirmation
4. You'll be redirected to `/admin/login`

**Admin Credentials:**
- Email: `admin@edutainverse.com`
- Password: `admin123`

---

## Alternative: Node Script

If you prefer to run a script:

```bash
node scripts/setupAdmin.js
```

**Note:** This requires Node.js ESM support. If you get errors, use the browser method instead.

---

## After Setup

1. Go to `/admin/login`
2. Login with the credentials above
3. You'll have full admin access to:
   - Student management
   - Sales dashboard
   - Syllabus management
   - Coupon management

---

## Changing Admin Password

### Option 1: Browser (Recommended) ✨

1. Go to: `http://localhost:5173/admin/change-password`
2. Enter current password: `admin123`
3. Enter new password (min 6 characters)
4. Confirm new password
5. Click "Change Password"

### Option 2: Node Script

1. Edit `scripts/changeAdminPassword.js`
2. Update the `newPassword` variable with your desired password
3. Run: `node scripts/changeAdminPassword.js`
4. The script will login and update the password

**Example:**
```javascript
const newPassword = 'YourSecurePassword123!'; // Change this line
```

### Option 3: Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `trackitude-firebase-march`
3. Go to Authentication → Users
4. Find `admin@edutainverse.com`
5. Click the three dots → Reset password
6. Follow the email instructions

---

## Security Notes

⚠️ **Important:**
- Change the default password immediately in production
- Never commit real credentials to version control
- Use environment variables for sensitive data
- Enable 2FA for admin accounts in production

---

## Troubleshooting

**"Email already in use" error:**
- The admin account already exists
- Just login at `/admin/login`
- Or delete the user from Firebase Console and try again

**"Permission denied" error:**
- Check Firebase security rules
- Ensure Firestore rules allow user creation

**Script doesn't run:**
- Use the browser method at `/admin/setup` instead
- It's simpler and more reliable
