import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAH0QXyU-906JIGEWLdQ393zRQrL7BkO9E",
  authDomain: "bazaarnow-d4548.firebaseapp.com",
  databaseURL: "https://bazaarnow-d4548-default-rtdb.firebaseio.com",
  projectId: "bazaarnow-d4548",
  storageBucket: "bazaarnow-d4548.firebasestorage.app",
  messagingSenderId: "330276271836",
  appId: "1:330276271836:web:0fefd4338f8f14493be619"
};

import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
