// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
