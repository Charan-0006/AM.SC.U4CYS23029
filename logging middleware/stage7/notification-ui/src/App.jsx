import Notifications from "./components/Notifications";
import PriorityNotifications from "./components/PriorityNotifications";

function App() {
  return (
    <div>
      <h1 style={{textAlign:"center"}}>Notification Dashboard</h1>

      <Notifications />

      <PriorityNotifications />
    </div>
  );
}

export default App;