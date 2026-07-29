import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBT3gv_H2HjqN6io2FZvse-lzAzb15Uu0",
  authDomain: "mummoorthy-badminton.firebaseapp.com",
  projectId: "mummoorthy-badminton",
  storageBucket: "mummoorthy-badminton.firebasestorage.app",
  messagingSenderId: "887902139458",
  appId: "1:887902139458:web:c3cbe97a90584f28aba9db",
  measurementId: "G-GWRQRXHWY5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
