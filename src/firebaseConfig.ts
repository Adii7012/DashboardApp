// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Import Firebase Authentication
import { getFirestore } from 'firebase/firestore';  // Import Firestore
import { getStorage } from 'firebase/storage';  // Import Firebase Storage

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBSv31tiWfRJhDDgLm9x7JL2Kh2G57kKiQ',
  authDomain: 'dashboard-4fe30.firebaseapp.com',
  projectId: 'dashboard-4fe30',
  storageBucket: 'dashboard-4fe30.firebasestorage.app',
  messagingSenderId: '1032222429903',
  appId: '1:1032222429903:web:0f40da4622ca840fd51dba',
  measurementId: 'G-ZVVM9C3G5R',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);  // Using the modular import for authentication
const firestore = getFirestore(app);  // Using the modular import for Firestore
const storage = getStorage(app);  // Using the modular import for Storage

// Export Firebase services
export { auth, firestore, storage };
