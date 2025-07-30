import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDSdo8hr_kQVK4tgdMnKNDzn0vq6hwOtwE",
  authDomain: "sellup-fdede.firebaseapp.com",
  projectId: "sellup-fdede",
  storageBucket: "sellup-fdede.firebasestorage.app",
  messagingSenderId: "15420218676",
  appId: "1:15420218676:web:46ca70689d6487d2c69961",
  measurementId: "G-NY5Y14K8XC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the app for backward compatibility with existing components
export const Firebase = {
  auth: () => auth,
  firestore: () => db,
  storage: () => storage
};

export default app;