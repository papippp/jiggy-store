// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAOd-8qRiBL5e6XXmwOEPv0pFFqYKz7z8",
  authDomain: "jiggystore-b7849.firebaseapp.com",
  projectId: "jiggystore-b7849",
  storageBucket: "jiggystore-b7849.firebasestorage.app",
  messagingSenderId: "717350021374",
  appId: "1:717350021374:web:2f5b984750dc0186c6ddaf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)