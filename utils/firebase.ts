// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore is often used in RN
import { getAuth } from "firebase/auth"; // If you plan to use Firebase Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAyCf17lTTyA8Yr2FxNmpVrqBTE0Sddtg",
  authDomain: "abpdevmobilern.firebaseapp.com",
  projectId: "abpdevmobilern",
  storageBucket: "abpdevmobilern.appspot.com",
  messagingSenderId: "751237064868",
  appId: "1:751237064868:web:67101d44eea075543bde31",
  measurementId: "G-1NSCDH5R6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore instance for database interactions
export const db = getFirestore(app);

// (Optional) Firebase Auth instance if you're using authentication
export const auth = getAuth(app);
