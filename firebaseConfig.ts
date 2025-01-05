import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADmTjYHpDuhKUbmEwU5b2xqnWEgT14p9k",
  authDomain: "sports-duniya.firebaseapp.com",
  projectId: "sports-duniya",
  storageBucket: "sports-duniya.appspot.com",
  messagingSenderId: "338752024972",
  appId: "1:338752024972:web:3eaa878fe21e582a0366a9",
  measurementId: "G-1VCH5Z5PFL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app); // For Authentication
export const db = getFirestore(app); // For Firestore
