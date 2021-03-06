# Wonder Technical Challenge

## Run

- Clone the repo to your local machine
- Navigate to the project directory in your terminal
- Run `node server.js`

## Task
Design a queue based messaging system with a many to many relationship between producers that write the messages and consumers that read the messages. When a reader requests to get messages, they are sent all the current messages from the queue, at this point all those messages are moved into a 'message session' unique to that reader and cannot be retrieved by other readers. The reader can mark an individual message to be permantly deleted from the database or clear all messages. If a reader does not take any action and a certain amount of time has transpired, all their unread messages are placed back into the start of the queue.

## Scalability ideas 

- micro-service architecture
 
- Seperate each message session into its own dedicated worker process responsible for keeping track of the remaining expiration time and
merging unread messages back into the main message queue. 

- Seperate the main message queue in to its own dedicated server

- Need a reliable database that can deal with a high volume of constant insertions and deletions

## React App

This app is responsible for generating messages, sending them to the server and allowing the consumer to request all the queued messages from the server.

## Node Server

This server is responsible for receiving messages and placing them in a queue, moving messages to message sessions and deleting messages on confirmation and returning an individual reader's messages session.

## Chrome Extension

### This extension shows:

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

### Create a message session

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

### Add a message to the queue

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

`http://localhost:8000/api/message/clear`

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
