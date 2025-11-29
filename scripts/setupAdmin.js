// Admin Setup Script
// Run this once to create the admin user in Firebase
// Usage: node scripts/setupAdmin.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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
const db = getFirestore(app);

async function setupAdmin() {
    const adminEmail = 'nvnjwl2@gmail.com';
    const adminPassword = 'admin123';

    try {
        console.log('Creating admin user...');

        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        const user = userCredential.user;

        console.log('Admin user created in Authentication:', user.uid);

        // Create admin profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            profile: {
                name: 'Admin',
                email: adminEmail,
                isAdmin: true,
                onboardingCompleted: true,
                onboardingSkipped: false,
                createdAt: new Date().toISOString()
            }
        });

        console.log('Admin profile created in Firestore');
        console.log('\n✅ Admin setup complete!');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        console.log('\nYou can now login at /admin/login');

        process.exit(0);
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('⚠️  Admin user already exists');
            console.log('If you need to update the password, use the Firebase Console or password reset.');
        } else {
            console.error('Error setting up admin:', error);
        }
        process.exit(1);
    }
}

setupAdmin();
