import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
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

async function promoteAdmin() {
    try {
        console.log('Searching for user with email: admin@edutainverse.com');
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('profile.email', '==', 'admin@edutainverse.com'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('No user found with that email. Please ensure you have logged in at least once.');
            return;
        }

        snapshot.forEach(async (userDoc) => {
            console.log(`Found user: ${userDoc.id}`);
            const userRef = doc(db, 'users', userDoc.id);
            await updateDoc(userRef, {
                'profile.isAdmin': true,
                'profile.role': 'admin'
            });
            console.log(`Successfully promoted ${userDoc.id} to Admin.`);
        });

    } catch (error) {
        console.error('Error promoting admin:', error);
    }
}

promoteAdmin();
