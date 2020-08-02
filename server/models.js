const {v4: uuidv4} = require('uuid') 
const {add} = require('date-fns')

class MessageSession {
  constructor (readerId, messageArray, expiration) {
    this.readerId = readerId
    this.messages = messageArray
    this.expiration = add(new Date(), {minutes: expiration})
  }

  markMessageAsProcessed(messageId) {
    const filterMessages = this.messages.filter(message => {
      return messageId !== message.id
    })

    this.messages = filterMessages
  }

  getUnprocessedMessages() {
    return this.messages
  }
}

class Message {
  constructor (content) {
    this.id = uuidv4()
    this.content = content
  }
}

class Sessions {
  constructor () {
    this.sessions = {}
  }

  addSession(session) {
    this.sessions[session.readerId] = session
  }

  getSession(readerId) {
    return this.sessions[readerId]
  }

  getSessionCount() {
    let count = 0
    const objValues = Object.values(this.sessions)

    for (let session of objValues) {
      if (session) {
        count += 1
      } 
    }

    return count
  }

  removeSession(readerId) {
    this.sessions[readerId] = null
  }
}

class Queue {
  constructor () {
    this.queue = []
    this.count = 0
  }

  addMessage(message) {
    const newArray = [message, ...this.queue]
    this.queue = newArray
    this.count += 1
  }

  addBatchedMessages(messageArray) {
    const newArray = [...messageArray, ...this.queue]
    this.queue = newArray
    this.count += (messageArray.length + 1)
  }

  getMessages() {
    const messageArray = this.queue
    this.queue = []
    return messageArray
  }

  getQueueCount() {
    return this.queue.length 
  }

  getMessageCount() {
    return this.count
  }
}

module.exports = {
  MessageSession,
  Message,
  Sessions,
  Queue
}