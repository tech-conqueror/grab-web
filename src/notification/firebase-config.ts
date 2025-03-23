import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBz-FYRolSVNzuD3Jzzw66EtbJZ81zP8nE",
  authDomain: "grab-e366a.firebaseapp.com",
  projectId: "grab-e366a",
  storageBucket: "grab-e366a.firebasestorage.app",
  messagingSenderId: "745121493248",
  appId: "1:745121493248:web:628717004fc3a9a98e03e5",
  measurementId: "G-BHGVTCESME",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging: Messaging = getMessaging(app);

export { messaging, getToken, onMessage };
