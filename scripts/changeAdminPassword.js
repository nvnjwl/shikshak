// Change Admin Password Script
// This script uses Firebase Auth to update the admin password
// Usage: node scripts/changeAdminPassword.js

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKYfrEonJ7X4bAU4fAAyBGfmF2Dy_u_v8",
    authDomain: "trackitude-firebase-march.firebaseapp.com",
    projectId: "trackitude-firebase-march",
    storageBucket: "trackitude-firebase-march.firebasestorage.app",
    messagingSenderId: "631353894361",
    appId: "1:631353894361:web:fb45d71e2ad931c7ed25c8",
    measurementId: "G-KC7G5066GT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function changeAdminPassword() {
    const adminEmail = 'admin@edutainverse.com';
    const currentPassword = 'admin123'; // Current password
    const newPassword = 'admin123'; // Change this to your desired password

    try {
        console.log('Logging in as admin...');

        // Sign in with current credentials
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, currentPassword);
        const user = userCredential.user;

        console.log('Logged in successfully. Updating password...');

        // Update password
        await updatePassword(user, newPassword);

        console.log('\n✅ Password changed successfully!');
        console.log('Email:', adminEmail);
        console.log('New Password:', newPassword);
        console.log('\n⚠️  IMPORTANT: Update this password in your secure password manager!');
        console.log('You can now login at /admin/login with the new password.');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error changing password:');

        if (error.code === 'auth/wrong-password') {
            console.error('Current password is incorrect.');
            console.error('Please update the "currentPassword" variable in this script.');
        } else if (error.code === 'auth/user-not-found') {
            console.error('Admin user not found.');
            console.error('Please run setupAdmin.js first to create the admin account.');
        } else if (error.code === 'auth/weak-password') {
            console.error('New password is too weak.');
            console.error('Password should be at least 6 characters.');
        } else if (error.code === 'auth/requires-recent-login') {
            console.error('This operation requires recent authentication.');
            console.error('Please use the browser-based password change at /admin/change-password');
        } else {
            console.error(error.message);
        }

        process.exit(1);
    }
}

console.log('=== Admin Password Change ===\n');
console.log('Current Password: admin123');
console.log('New Password: NewAdmin@2024');
console.log('\n⚠️  Edit this script to change the new password before running!\n');

changeAdminPassword();
