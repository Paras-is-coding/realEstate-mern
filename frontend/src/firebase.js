

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  apiKey: "AIzaSyCwmPVPHBs-IEwEkbD4y3mPM7c4Pnkrf0k",
  authDomain: "mernestate-159d9.firebaseapp.com",
  projectId: "mernestate-159d9",
  storageBucket: "mernestate-159d9.appspot.com",
  messagingSenderId: "929002948108",
  appId: "1:929002948108:web:df8474a529baf68671d029"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);