# Stage 1 fullstack role

## Core Notification Actions

- Send Notification
- Get All Notifications
- Get Notification by ID
- Mark Notification as Read
- Delete Notification

---

## 1. Send Notfication

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


## Recommended Index

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentID, isRead, createdAt);
```

---

## Computational Cost

Without indexes:
- Time Complexity ≈ O(n)

With indexes:
- Faster searching and sorting
- Reduced query execution time

---

## Is Adding Indexes on Every Column Effective?

No.

Reasons:
- Increased storage usage
- Slower insert/update operations
- Unnecessary indexes reduce performance

Indexes should only be created on:
- Frequently searched columns
- Filtering columns
- Sorting columns

---

## Query for Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```


# Stage 4

## Problem Analysis

Notifications are fetched on every page load for every student.

Problems:
- High database load
- Increased response time
- Poor user experience
- Server overload

---

## Suggested Solutions

### 1. Caching

Store frequently accessed notifications in cache.

Tools:
- Redis
- Memory cache

Benefits:
- Faster response
- Reduced DB queries

Tradeoff:
- Extra memory usage

---

### 2. Pagination

Fetch limited notifications per request.

Example:
- 10 notifications per page

Benefits:
- Smaller response size
- Faster loading

Tradeoff:
- Multiple API calls needed

---

### 3. Real-Time Notifications

Use WebSockets instead of repeated polling.

Benefits:
- Instant updates
- Reduced repeated requests

Tradeoff:
- More complex implementation

---

### 4. Background Processing

Use message queues for notification delivery.

Benefits:
- Better scalability
- Reduced server blocking

Tradeoff:
- Additional infrastructure required

---

### 5. Database Indexing

Use indexes on:
- studentID
- createdAt
- notificationType

Benefits:
- Faster query execution

Tradeoff:
- Slightly slower writes

---

## Recommended Final Approach

Best performance can be achieved using:
- Pagination
- Redis caching
- WebSockets
- Proper indexing


# Stage 5

## Problems in Current Implementation

- Emails are sent sequentially
- Slow processing for 50,000 students
- Failure for some students stops reliability
- No retry mechanism
- Database save and email sending tightly coupled

---

## What Happens if Email Fails for 200 Students?

Some students may:
- Receive notification in app but not email
- Receive inconsistent updates

This creates reliability issues.

---

## Better Design

Use:
- Message Queue
- Background Workers
- Retry Mechanism
- Async Processing



---

## Should DB Save and Email Sending Happen Together?

No.

Reason:
- Database storage is critical
- Email sending is external and may fail
- Separating improves reliability

Recommended flow:
1. Save notification in DB
2. Push email task to queue
3. Worker sends email asynchronously

---

## Revised Pseudocode

```python
def notify_all(student_ids, message):

    for student_id in student_ids:

        save_notification_to_db(student_id, message)

        push_email_job_to_queue(student_id, message)


def email_worker():

    while True:

        job = get_next_job()

        try:
            send_email(job.student_id, job.message)

        except:
            retry_job(job)
```



# Stage 6

## Priority Inbox Design

Priority is calculated using:
- Notification Type Weight
- Recency

Priority Order:
1. Placement
2. Result
3. Event

Weights:
- Placement = 3
- Result = 2
- Event = 1

More recent notifications receive higher priority.

---

## Efficient Top 10 Maintenance

Approach:
- Use Priority Queue / Heap
- Store only top 10 notifications
- Replace low priority items when higher priority notifications arrive

Benefits:
- Faster processing
- Lower memory usage
- Efficient updates

---

## API Usage

Notifications are fetched using the provided API.

No hardcoded notifications are used.

---

## Files Included

- stage6/priority_notifications.js
- stage6/output.png

---

## Output

The program fetches notifications, calculates priority scores, sorts them, and displays the top 10 notifications.
