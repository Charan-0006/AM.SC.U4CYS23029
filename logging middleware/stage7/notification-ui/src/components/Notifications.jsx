import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    axios
      .get("http://20.207.122.201/evaluation-service/notifications")
      .then((response) => {
        setNotifications(response.data.notifications || []);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  return (
    <div style={{padding:"20px"}}>

      <h2>All Notifications</h2>

      {notifications.map((notification) => (

        <div
          key={notification.ID}
          style={{
            border:"1px solid gray",
            padding:"10px",
            marginBottom:"10px",
            borderRadius:"10px"
          }}
        >
          <h3>{notification.Type}</h3>

          <p>{notification.Message}</p>

          <small>{notification.Timestamp}</small>
        </div>

      ))}

    </div>
  );
}

export default Notifications;