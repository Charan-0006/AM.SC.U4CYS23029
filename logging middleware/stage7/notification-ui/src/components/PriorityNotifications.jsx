import { useEffect, useState } from "react";

function PriorityNotifications() {

  const [priorityNotifications, setPriorityNotifications] = useState([]);

  const weights = {
    Placement: 3,
    Result: 2,
    Event: 1
  };

  useEffect(() => {

    const sampleData = [
      {
        ID: "1",
        Type: "Placement",
        Message: "CSX Corporation hiring",
        Timestamp: "2026-04-22 17:51:18"
      },
      {
        ID: "2",
        Type: "Result",
        Message: "mid-sem result published",
        Timestamp: "2026-04-22 17:51:30"
      },
      {
        ID: "3",
        Type: "Event",
        Message: "Tech fest starts tomorrow",
        Timestamp: "2026-04-22 17:50:06"
      }
    ];

    const sorted = sampleData.sort((a, b) => {
      return weights[b.Type] - weights[a.Type];
    });

    setPriorityNotifications(sorted.slice(0, 10));

  }, []);

  return (
    <div style={{ padding: "20px" }}>

      <h2>Top Priority Notifications</h2>

      {priorityNotifications.map((notification) => (

        <div
          key={notification.ID}
          style={{
            border: "1px solid blue",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "10px"
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

export default PriorityNotifications;