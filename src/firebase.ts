// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: 'AIzaSyCdzs7P4Jbrkf58OP-mT_SOPkHvZsItAME',
  authDomain: 'marketmate-217b1.firebaseapp.com',
  projectId: 'marketmate-217b1',
  storageBucket: 'marketmate-217b1.appspot.com',
  messagingSenderId: '...',
  appId: '...',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
