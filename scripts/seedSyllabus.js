import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, writeBatch } from "firebase/firestore";
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

const SYLLABUS_DIR = path.join(__dirname, '../src/syllabus');

async function seedSyllabus() {
    try {
        console.log('Starting syllabus seeding...');
        const classes = fs.readdirSync(SYLLABUS_DIR).filter(file => {
            return fs.statSync(path.join(SYLLABUS_DIR, file)).isDirectory();
        });

        for (const classDir of classes) {
            console.log(`Processing Class ${classDir}...`);
            const classPath = path.join(SYLLABUS_DIR, classDir);
            const subjects = fs.readdirSync(classPath).filter(file => file.endsWith('.json'));

            for (const subjectFile of subjects) {
                const subjectName = path.basename(subjectFile, '.json');
                console.log(`  - Uploading ${subjectName}...`);

                const filePath = path.join(classPath, subjectFile);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const syllabusData = JSON.parse(fileContent);

                // Create a reference to the specific subject document
                // Structure: syllabus/{classId}_{subjectId}
                // This makes it easy to query: collection('syllabus').where('class', '==', 6)

                const docId = `class${classDir}_${subjectName}`;
                const docRef = doc(db, 'syllabus', docId);

                await setDoc(docRef, {
                    ...syllabusData,
                    classId: classDir,
                    subjectId: subjectName,
                    updatedAt: new Date().toISOString()
                });
            }
        }

        console.log('Syllabus seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding syllabus:', error);
        process.exit(1);
    }
}

seedSyllabus();
