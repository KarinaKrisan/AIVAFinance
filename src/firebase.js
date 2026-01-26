import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBP0zktM6dLddWb_qHpm52OiBWU9785R28",
  authDomain: "dashboard-financeiro-8ae9f.firebaseapp.com",
  projectId: "dashboard-financeiro-8ae9f",
  storageBucket: "dashboard-financeiro-8ae9f.firebasestorage.app",
  messagingSenderId: "823921146728",
  appId: "1:823921146728:web:5e08ae294276d866c0b4dd",
  measurementId: "G-1TLN43R0PM"
};

const app = initializeApp(firebaseConfig);

// Serviços exportados para uso no app
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);