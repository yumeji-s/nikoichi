import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // ここにプロジェクトIDなどを貼り付ける
  // ここにプロジェクトIDなどを貼り付ける
  // ここにプロジェクトIDなどを貼り付ける
  // ここにプロジェクトIDなどを貼り付ける
  // ここにプロジェクトIDなどを貼り付ける
  // ここにプロジェクトIDなどを貼り付ける
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
