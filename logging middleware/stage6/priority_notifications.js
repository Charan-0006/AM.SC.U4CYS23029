const notifications = [
  {
    ID: "1",
    Type: "Placement",
    Message: "CSX Corporation hiring",
    Timestamp: "2026-04-22 17:51:18"
  },
  {
    ID: "2",
    Type: "Result",
    Message: "mid-sem",
    Timestamp: "2026-04-22 17:51:30"
  },
  {
    ID: "3",
    Type: "Event",
    Message: "farewell",
    Timestamp: "2026-04-22 17:51:06"
  },
  {
    ID: "4",
    Type: "Placement",
    Message: "AMD hiring",
    Timestamp: "2026-04-22 17:49:42"
  }
];

const weights = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function calculatePriority(notification) {

  const weight = weights[notification.Type] || 0;

  const timeValue = new Date(notification.Timestamp).getTime();

  return weight * 1000000000 + timeValue;
}

notifications.forEach(notification => {
  notification.priority = calculatePriority(notification);
});

notifications.sort((a, b) => b.priority - a.priority);

const top10 = notifications.slice(0, 10);

console.log("Top Priority Notifications:\n");

top10.forEach((notification, index) => {

  console.log(`${index + 1}.`);
  console.log(`Type: ${notification.Type}`);
  console.log(`Message: ${notification.Message}`);
  console.log(`Timestamp: ${notification.Timestamp}`);
  console.log("----------------------");
});