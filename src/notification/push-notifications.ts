import { messaging, getToken, onMessage } from "./firebase-config";

// Function to request permission and get FCM token
export const requestPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BO_hqCZyEA3HyFDeb9O2GOVRxrmgY6iYkChZo1P347kmIFr0MEoIxoFHCrlXE1aOga5pFJRO21zMyoKsxfpLmts",
      });
      console.log("FCM Token:", token);
      return token; // Send this token to your backend for later use
    } else {
      console.log("Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("Error getting notification token:", error);
    return null;
  }
};

// Function to handle incoming messages
export const setupOnMessageListener = (
  callback: (payload: any) => void
): void => {
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
