import { initializeApp } from "firebase/app";
import {
  Messaging,
  getMessaging,
  getToken,
  onMessage,
} from "firebase/messaging";

export type Notification = {
  title: string;
  body: string;
};

const firebaseConfig = {
  apiKey: "AIzaSyBz-FYRolSVNzuD3Jzzw66EtbJZ81zP8nE",
  authDomain: "grab-e366a.firebaseapp.com",
  projectId: "grab-e366a",
  storageBucket: "grab-e366a.firebasestorage.app",
  messagingSenderId: "745121493248",
  appId: "1:745121493248:web:628717004fc3a9a98e03e5",
  measurementId: "G-BHGVTCESME",
};

// Function to request permission and get FCM token
const requestPermission = async (messaging: Messaging): Promise<void> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey:
        "BO_hqCZyEA3HyFDeb9O2GOVRxrmgY6iYkChZo1P347kmIFr0MEoIxoFHCrlXE1aOga5pFJRO21zMyoKsxfpLmts",
    });

    console.log("FCM Token:", token);
  } catch (error) {
    console.error("Error getting notification token:", error);
  }
};

// Function to handle incoming messages
export const setupOnNotificationListener = async (
  callback: (payload: any) => void
): Promise<void> => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const messaging: Messaging = getMessaging(app);

  await requestPermission(messaging);

  onMessage(messaging, (payload) => {
    console.log("Message received:", payload);
    callback(payload);

    // Ensure notification object exists before accessing properties
    const title = payload.notification?.title || "No Title";
    const body = payload.notification?.body || "No Body";
    const icon = payload.notification?.image || "/default-icon.png"; // Fallback to a default icon

    new Notification(title, { body, icon });
  });
};
