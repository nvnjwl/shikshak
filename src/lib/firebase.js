import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// TODO: Replace with actual config from Firebase Console
// const firebaseConfig = {
//     apiKey: "API_KEY",
//     authDomain: "PROJECT_ID.firebaseapp.com",
//     projectId: "PROJECT_ID",
//     storageBucket: "PROJECT_ID.appspot.com",
//     messagingSenderId: "SENDER_ID",
//     appId: "APP_ID"
// };



const firebaseConfig = {
    apiKey: "AIzaSyCKYfrEonJ7X4bAU4fAAyBGfmF2Dy_u_v8",
    authDomain: "trackitude-firebase-march.firebaseapp.com",
    projectId: "trackitude-firebase-march",
    storageBucket: "trackitude-firebase-march.firebasestorage.app",
    messagingSenderId: "631353894361",
    appId: "1:631353894361:web:fb45d71e2ad931c7ed25c8",
    measurementId: "G-KC7G5066GT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
