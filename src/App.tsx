import Map from "./components/map/Map";
import { setupOnNotificationListener } from "./notification/push-notifications";
import "./App.css";

function App() {
  setupOnNotificationListener((payload) => {
    console.log("Notification received:", payload);
  });

  return (
    <div className="App">
      <Map />
    </div>
  );
}

export default App;
