// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // For authentication
import { getFirestore } from "firebase/firestore"; // For Firestore database
import { getStorage } from "firebase/storage"; // For Storage
import { getMessaging } from "firebase/messaging";

// Your web live app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5tRBBLMidrbNP5uzxKcdbNtQkmebUz2Y",
  authDomain: "suiker-switch.firebaseapp.com",
  projectId: "suiker-switch",
  storageBucket: "suiker-switch.firebasestorage.app",
  messagingSenderId: "191271279519",
  appId: "1:191271279519:web:903fc1978cf81ff206fbaa",
  measurementId: "G-LS3ZDBWPCR"
};


// testing web live app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBKSwgvfO6iHHiw-MXQrRTLx6PFXwLAd24",
//   authDomain: "hassan-e3385.firebaseapp.com",
//   projectId: "hassan-e3385",
//   storageBucket: "hassan-e3385.appspot.com",
//   messagingSenderId: "744698661206",
//   appId: "1:744698661206:web:ee64a8d4cd723d635caef7"
// };

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const analytics = getAnalytics(app);
const messaging = getMessaging()

// Initialize Firebase Services
const auth = getAuth(app);
const firestored = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, firestored, storage, messaging };
