// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5vKNyYqoeDgudvSQoeoFQrEVA_fF8",
  authDomain: "astra-domini.firebaseapp.com",
  projectId: "astra-domini",
  storageBucket: "astra-domini.firebasestorage.app",
  messagingSenderId: "711846096621",
  appId: "1:711846096621:web:fc97db572dc81c002ea6e4",
  measurementId: "G-YBZY4XPSGD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
