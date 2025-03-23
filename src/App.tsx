import { useEffect, useState } from "react";
import "./App.css";
import Map from "./components/map/Map";
import {
  requestPermission,
  setupOnMessageListener,
} from "./notification/push-notifications";

function App() {
  type Notification = {
    title: string;
    body: string;
  };

  const [, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    requestPermission().then((token) => {
      if (token) {
        console.log("FCM Token:", token);
      }
    });

    setupOnMessageListener((payload) => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
    });
  }, []);

  return (
    <div className="App">
      <Map />
    </div>
  );
}

export default App;
