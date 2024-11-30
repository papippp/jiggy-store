// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_API_KEY,
  projectId: import.meta.env.VITE_API_KEY,
  storageBucket: import.meta.env.VITE_API_KEY,
  messagingSenderId: import.meta.env.VITE_API_KEY,
  appId: import.meta.env.VITE_API_KEY
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)