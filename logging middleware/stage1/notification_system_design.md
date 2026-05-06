# Stage 1

## Core Notification Actions

- Send Notification
- Get All Notifications
- Get Notification by ID
- Mark Notification as Read
- Delete Notification

---

## 1. Send Notification

### Endpoint
POST /notifications

### Headers
Content-Type: application/json

### Request Body

```json
{
  "userId": "101",
  "title": "Payment Successful",
  "message": "Your payment has been completed",
  "type": "payment"
}
```

### Response

```json
{
  "success": true,
  "message": "Notification created successfully"
}
```

---

## 2. Get All Notifications

### Endpoint
GET /notifications

### Headers
Content-Type: application/json

### Response

```json
[
  {
    "id": "1",
    "title": "Payment Successful",
    "message": "Your payment has been completed",
    "read": false
  }
]
```

---

## 3. Mark Notification as Read

### Endpoint
PUT /notifications/{id}/read

### Headers
Content-Type: application/json

### Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 4. Delete Notification

### Endpoint
DELETE /notifications/{id}

### Headers
Content-Type: application/json

### Res

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## Real-Time Notification Mechanism

The system uses WebSockets for real-time notifications.

When a new notification is created:
- Server pushes notification instantly
- Connected users receive updates without refreshing

Benefits:
- Faster communication
- Real-time updates
- Better user experience


# Stage 2

## Database Choice

MongoDB is used because:
- Flexible schema
- Easy JSON storage
- Scalable
- Good for notification systems

---

## Notification Collection Schema

```json
{
  "_id": "ObjectId",
  "userId": "101",
  "title": "Payment Successful",
  "message": "Your payment has been completed",
  "type": "payment",
  "read": false,
  "createdAt": "2026-05-06T10:00:00Z"
}
```

---

## Possible Problems with Increasing Data

- Slow query performance
- Large storage usage
- Increased response time

---

## Solutions

- Use indexing on userId
- Pagination for API results
- Archive old notifications
- Use caching

---

## Sample Queries

### Insert Notification

```js
db.notifications.insertOne({
  userId: "101",
  title: "Payment Successful",
  message: "Your payment has been completed",
  type: "payment",
  read: false
})
```

---

### Get User Notifications

```js
db.notifications.find({ userId: "101" })
```

---

### Mark as Read

```js
db.notifications.updateOne(
  { _id: ObjectId("123") },
  { $set: { read: true } }
)
```

---

### Delete Notification

```js
db.notifications.deleteOne(
  { _id: ObjectId("123") }
)
```




# Stage 3

## Query Analysis

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

---

## Is the Query Correct?

Yes, the query is logically correct because:
- It fetches unread notifications
- Filters notifications for a specific student
- Sorts by creation time

---

## Why is the Query Slow?

Reasons:
- Large number of notifications
- Full table scan may occur
- Sorting operation increases execution time
- Missing indexes on filtering columns

---

## Suggested Improvements

Instead of:
```sql
SELECT *
```

Fetch only required columns.

Example:

```sql
SELECT id, title, message, createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

---

