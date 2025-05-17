// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCB7W7LI25Y_81Kz2KEq1hl2zKAMwzHEKQ",
  authDomain: "el-buen-sabor-7161f.firebaseapp.com",
  projectId: "el-buen-sabor-7161f",
  storageBucket: "el-buen-sabor-7161f.firebasestorage.app",
  messagingSenderId: "253305805955",
  appId: "1:253305805955:web:00dc34623ebc6bdc090fb6",
  measurementId: "G-EGCLEBZV8D"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
