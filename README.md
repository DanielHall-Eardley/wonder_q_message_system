# Wonder Technical Challenge

## Run

- Clone the repo to your local machine
- Navigate to the project directory in your terminal
- Run `node server.js`

## Task
Design a queue based messaging system with a many to many relationship between producers that write the messages and consumers that read the messages. When a reader requests to get the newest messages they are sent all the messages from the queue, at this point all those messages are moved into a 'message session' unique to that reader and cannot be retrieved by other readers. The reader can mark an individual message to be permantly deleted from the database or clear all messages. If a reader does not take any action and a certain amount of time has transpired, all their messages are placed back into the start of the queue.

## Scalability ideas 

- micro-service architecture
 
- Seperate each message session into its own dedicated worker process responsible for keep track of the remaining expiration time and
merging unread messages back into the main message queue. 

- Seperate the main message queue on its own dedicated server

- Need a reliable database that can deal with a high volume of constant requests

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

**method**

`GET`

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

### create a message session

`http://localhost:8000/api/message/list/:id`

This endpoint is for creating unique message session for a reader. A session 
will not be created if the message queue is empty or a session already exists 
with the given reader id.

**method**

`GET`

**params**

`id: String, A valid reader id`

**response**

Below are examples of successful and error responses.

```
{
 messageList: [
  {
   message...
  },
  {
   message...
  },
 ]
}

{
 error: 'Some error occurred
}

```

### add a message to the queue

`http://localhost:8000/api/message/submit`

This endpoint is for adding a new message to the queue.

**method**

`POST`

**body**

`content: String, a message to add`

**response**

The response is a confirmation message with a unique message id.

```
{
 message: Message sent! Confirmation ID: 75cc7fb2-dc6d-46ed-8222-86352184bd61
}

```

### Process (delete) a message

`http://localhost:8000/api/message/delete`

This endpoint is for deleting a message. 

**method**

`DELETE`

**body**

`readerId: String, unique reader id`,
`messageId: String, unique message id`,

**response**

The response is an updated array of messages, or an empty array
if the reader's message session could not be found.

```
{
 messageList: [
  {
   message...
  },
  {
   message...
  },
 ]
}

```

### Clear all current messages

`http://localhost:8000/api/message/delete`

This endpoint deletes the reader's current message session
and permantly deletes all associated messages. 

**method**

`DELETE`

**body**

`readerId: String, unique reader id`,

**response**

The response is a confirmation message

```
{
 message: 'Message session cleared'
}
```

### Get app status

`http://localhost:8000/api/status`

This endpoint gets information about the current state of the app. 

**method**

`GET`

**response**

The response is a status object.

```
{
 active: 'active',
 totalMessages: 52,
 totalReaders: 7,
 availableMessages: 12
}
```

### Error Handling

Any time an error occurs a response is returned in the following format:

```
{
 error: 'Some error message'
}
```
