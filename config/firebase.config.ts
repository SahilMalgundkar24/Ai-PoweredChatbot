// firebase.config.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN4TTN75vToAvwZGAtEiwxlnJuT6Rq4dQ",
  authDomain: "ai-poweredchatbot.firebaseapp.com",
  projectId: "ai-poweredchatbot",
  storageBucket: "ai-poweredchatbot.firebasestorage.app",
  messagingSenderId: "908559144460",
  appId: "1:908559144460:web:c37bf859c24743ae664029",
  measurementId: "G-VMVGW26YY8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
export const firestore = getFirestore(app);

export default app;
