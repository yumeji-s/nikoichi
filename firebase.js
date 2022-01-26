import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUrptN8t4xu05ZvR7xrWDhMOJ2xm-YyHc",
  authDomain: "nikoichi-a750b.firebaseapp.com",
  projectId: "nikoichi-a750b",
  storageBucket: "nikoichi-a750b.appspot.com",
  messagingSenderId: "98599187081",
  appId: "1:98599187081:web:2f69c10d4ae48a1d840c58",
  measurementId: "G-BNQXVVER2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);