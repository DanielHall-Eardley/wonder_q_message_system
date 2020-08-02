# Wonder Technical Challenge

## Task
Design a queue based messaging system with a many to many relationship between producers that write the messages and consumers that read the messages. When a reader requests to get the newest messages they are sent all the messages from the queue, at this point all those messages are moved into a 'message session' unique to that reader and cannot be retrieved by other readers. The reader can mark an individual message to be permantly deleted from the database or clear all messages. If a reader does not take any action and a certain amount of time has transpired, all their messages are placed back into the start of the queue.

## Scalability ideas 
 
- Batch “processed” confirmation calls, if the the amount of time allowed to read messages is known, the app can wait until the time is almost expired before collecting all messages that the user has read.

## React App

This app will be responsible for generating messages, sending them to the server and allowing the consumer to request all the queued messages from the server.

## Node Server

This server will be responsible for receiving the messages and placing them in a queue, sending messages from the queue, moving messages to a pending queue and deleting messages on read confirmation

- Received messages are placed at the front of the queue array
- When a message request occurs all messages are placed in a pending queue array and a timer is started

- As messages are confirmed to be read they are removed from the pending queue array

- Any messages left in the pending queue array after the timer finishes are placed back into the main queue.

## Chrome Extension

### Build an extension to which shows:

- Total messages written

- Total messages currently unread

- Total messages currently being read

- If the server is active

## API documentation

### Retrieve an existing message session

`http://localhost:8000/api/message/pending/:id`

This endpoint is for retrieving a reader's current message session. An example
use case would be retrieving a reader's message after a page refresh.

**params**

`id: String, A valid reader id`

**response**

Below are examples of the response depending on if it finds a valid session
for the given reader id.
```
{
  message: "No current message session"
}

{
  session: {
    expiration: "2020-08-02T19:38:01.826Z"
    messages: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
    readerId: "78ec73bb-4363-454f-93d1-bfe07b4d2158"
  }
}
```

