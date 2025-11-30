import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
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

async function checkSyllabusData() {
    try {
        console.log('\n🔍 Checking Firestore Syllabus Data...\n');
        console.log('='.repeat(80));

        const syllabusRef = collection(db, 'syllabus');
        const snapshot = await getDocs(syllabusRef);

        let totalDocs = 0;
        let missingSubjectName = 0;
        let hasSubjectName = 0;

        const issues = [];

        snapshot.forEach((docSnap) => {
            totalDocs++;
            const data = docSnap.data();
            const docId = docSnap.id;

            console.log(`\n📄 Document: ${docId}`);
            console.log(`   Class ID: ${data.classId || 'MISSING'}`);
            console.log(`   Subject ID: ${data.subjectId || 'MISSING'}`);
            console.log(`   Subject Name: ${data.subject_name || 'MISSING ❌'}`);
            console.log(`   Subject Code: ${data.subject_code || 'N/A'}`);
            console.log(`   Chapters: ${data.chapters?.length || 0}`);

            if (!data.subject_name) {
                missingSubjectName++;
                issues.push({
                    docId,
                    classId: data.classId,
                    subjectId: data.subjectId,
                    reason: 'Missing subject_name field'
                });
                console.log(`   ⚠️  WARNING: Missing subject_name!`);
            } else {
                hasSubjectName++;
                console.log(`   ✅ Has subject_name`);
            }
        });

        console.log('\n' + '='.repeat(80));
        console.log('\n📊 SUMMARY:');
        console.log(`   Total Documents: ${totalDocs}`);
        console.log(`   ✅ With subject_name: ${hasSubjectName}`);
        console.log(`   ❌ Missing subject_name: ${missingSubjectName}`);

        if (issues.length > 0) {
            console.log('\n⚠️  ISSUES FOUND:');
            issues.forEach((issue, index) => {
                console.log(`   ${index + 1}. ${issue.docId}`);
                console.log(`      Class: ${issue.classId}, Subject: ${issue.subjectId}`);
                console.log(`      Reason: ${issue.reason}`);
            });

            console.log('\n💡 RECOMMENDATION:');
            console.log('   Run: npm run seed:syllabus');
            console.log('   This will re-seed the syllabus data with proper subject names.');
        } else {
            console.log('\n✅ All syllabus documents have subject_name field!');
            console.log('   The issue might be with how the data is being queried.');
            console.log('   Check the Dashboard.jsx console logs for more details.');
        }

        console.log('\n' + '='.repeat(80));
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error checking syllabus data:', error);
        process.exit(1);
    }
}

checkSyllabusData();
