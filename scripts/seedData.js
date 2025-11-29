import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');

let env = {};
try {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.log('Could not read .env file');
}

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const students = [
    {
        profile: { name: 'Aarav Patel', email: 'aarav@example.com', class: '6th', subjects: ['Math', 'Science'], createdAt: new Date().toISOString() },
        subscription: { status: 'active', plan: 'monthly', startDate: new Date().toISOString() }
    },
    {
        profile: { name: 'Diya Sharma', email: 'diya@example.com', class: '7th', subjects: ['English', 'Social Science'], createdAt: new Date().toISOString() },
        subscription: { status: 'free_trial', plan: 'free', startDate: new Date().toISOString() }
    },
    {
        profile: { name: 'Ishaan Gupta', email: 'ishaan@example.com', class: '8th', subjects: ['Math', 'Science'], createdAt: new Date().toISOString() },
        subscription: { status: 'expired', plan: 'monthly', startDate: new Date(Date.now() - 86400000 * 30).toISOString() }
    }
];

const coupons = [
    { code: 'WELCOME50', discount: 50, maxUsage: 100, currentUsage: 12, validUntil: new Date(Date.now() + 86400000 * 30), active: true },
    { code: 'SUMMER25', discount: 25, maxUsage: 50, currentUsage: 5, validUntil: new Date(Date.now() + 86400000 * 60), active: true }
];

const tickets = [
    {
        subject: 'Login Issue',
        message: 'I cannot log in to my account.',
        status: 'open',
        priority: 'high',
        userEmail: 'aarav@example.com',
        userName: 'Aarav Patel',
        createdAt: new Date()
    },
    {
        subject: 'Subscription Question',
        message: 'How do I upgrade my plan?',
        status: 'in_progress',
        priority: 'medium',
        userEmail: 'diya@example.com',
        userName: 'Diya Sharma',
        createdAt: new Date()
    }
];

async function seedData() {
    try {
        console.log('Seeding Students...');
        for (const student of students) {
            await addDoc(collection(db, 'users'), student);
        }

        console.log('Seeding Coupons...');
        for (const coupon of coupons) {
            await addDoc(collection(db, 'coupons'), { ...coupon, createdAt: serverTimestamp() });
        }

        console.log('Seeding Tickets...');
        for (const ticket of tickets) {
            await addDoc(collection(db, 'support_tickets'), { ...ticket, createdAt: serverTimestamp() });
        }

        console.log('Seeding complete!');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

seedData();
