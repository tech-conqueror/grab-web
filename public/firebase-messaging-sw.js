importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBz-FYRolSVNzuD3Jzzw66EtbJZ81zP8nE",
  authDomain: "grab-e366a.firebaseapp.com",
  projectId: "grab-e366a",
  storageBucket: "grab-e366a.firebasestorage.app",
  messagingSenderId: "745121493248",
  appId: "1:745121493248:web:628717004fc3a9a98e03e5",
  measurementId: "G-BHGVTCESME",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.image,
  });
});
