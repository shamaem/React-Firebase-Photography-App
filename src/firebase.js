import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCOWd_VK9F87D-aiuB4gl11rtD9EbNVX8A",
  authDomain: "react-photographers.firebaseapp.com",
  projectId: "react-photographers",
  storageBucket: "react-photographers.firebasestorage.app",
  messagingSenderId: "577363350688",
  appId: "1:577363350688:web:8e20f92a64b426d01a65c5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
