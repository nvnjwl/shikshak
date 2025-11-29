import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
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
const auth = getAuth(app);
const db = getFirestore(app);

const admins = [
    { email: 'admin@edutainverse.com', password: 'admin1234', role: 'super_admin', name: 'Super Admin' },
    { email: 'nvnjwl@gmail.com', password: 'admin1234', role: 'teacher', name: 'Teacher Admin' },
    { email: 'nvnjwl2@gmail.com', password: 'admin1234', role: 'growth', name: 'Growth Admin' },
    { email: 'nvnjwl3@gmail.com', password: 'admin1234', role: 'sales', name: 'Sales Admin' }
];

async function seedAdmins() {
    console.log('Starting Admin Seeding...');

    for (const admin of admins) {
        try {
            console.log(`Processing ${admin.email}...`);
            let userCredential;

            try {
                // Try to login first
                userCredential = await signInWithEmailAndPassword(auth, admin.email, admin.password);
                console.log(`  - Logged in existing user.`);
            } catch (loginError) {
                if (loginError.code === 'auth/user-not-found' || loginError.code === 'auth/invalid-credential') {
                    // Create user if not found (or if password wrong, we try creating which might fail if email exists but pass wrong, but let's assume clean slate or correct pass)
                    // Actually if password is wrong for existing email, create will fail too. 
                    // Let's try create if login fails.
                    try {
                        userCredential = await createUserWithEmailAndPassword(auth, admin.email, admin.password);
                        console.log(`  - Created new user.`);
                    } catch (createError) {
                        if (createError.code === 'auth/email-already-in-use') {
                            console.log(`  - User exists but login failed (wrong password?). Skipping auth, trying to update Firestore if we can... (Wait, we need UID)`);
                            // If we can't login, we can't get UID easily without Admin SDK.
                            // But maybe the user meant "Pre created" as in they exist.
                            // Let's assume the password provided is correct for them.
                            console.error(`  - Could not login or create ${admin.email}. Check password.`);
                            continue;
                        }
                        throw createError;
                    }
                } else {
                    throw loginError;
                }
            }

            if (userCredential && userCredential.user) {
                const uid = userCredential.user.uid;

                // Update Firestore
                await setDoc(doc(db, 'users', uid), {
                    profile: {
                        name: admin.name,
                        email: admin.email,
                        role: admin.role,
                        isAdmin: true,
                        adminStatus: 'approved',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                }, { merge: true });

                console.log(`  - Updated Firestore role to: ${admin.role}`);

                // Sign out to prepare for next
                await signOut(auth);
            }

        } catch (error) {
            console.error(`  - Error processing ${admin.email}:`, error.message);
        }
    }

    console.log('Seeding Complete!');
}

seedAdmins();
