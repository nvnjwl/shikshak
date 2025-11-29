import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, updateDoc, doc, setDoc } from "firebase/firestore";
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

const admins = [
    { email: 'admin@edutainverse.com', role: 'super_admin', name: 'Super Admin' },
    { email: 'nvnjwl@gmail.com', role: 'teacher', name: 'Teacher Admin' },
    { email: 'nvnjwl2@gmail.com', role: 'growth', name: 'Growth Admin' },
    { email: 'nvnjwl3@gmail.com', role: 'sales', name: 'Sales Admin' }
];

async function setRoles() {
    console.log('Setting Roles...');
    const usersRef = collection(db, 'users');

    for (const admin of admins) {
        try {
            const q = query(usersRef, where('profile.email', '==', admin.email));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                snapshot.forEach(async (userDoc) => {
                    await updateDoc(doc(db, 'users', userDoc.id), {
                        'profile.role': admin.role,
                        'profile.isAdmin': true,
                        'profile.adminStatus': 'approved',
                        'profile.name': admin.name
                    });
                    console.log(`Updated ${admin.email} to ${admin.role}`);
                });
            } else {
                console.log(`User ${admin.email} not found in Firestore. (They might need to login first or be created via Auth)`);
            }
        } catch (error) {
            console.error(`Error processing ${admin.email}:`, error);
        }
    }
}

setRoles();
