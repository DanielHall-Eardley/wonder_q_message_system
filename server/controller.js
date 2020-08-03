const {messageQueue, sessions} = require('./database.js')
const {MessageSession, Message} = require('./models.js')
const {differenceInMilliseconds} = require('date-fns')

/*Check for an existing message session for the logged in reader*/
const getMessageSession = async (req, res, next) => {
  const readerId = req.params.id
  const readerSession = sessions.getSession(readerId)

  if (!readerSession) {
    return res.status(200).json({message: 'No current message session'})
  } 

  res.status(200).json({session: readerSession})
}

//Clear the current message session for the logged in reader
const endMessageSession = async (req, res, next) => {
  sessions.removeSession(req.body.readerId)
  res.status(200).json({message: 'Message session cleared'})
}

/*Create a new message session for the logged in reader
(if one doesn't already exist) with the current 
messages from the main message queue and set up a
session timer to add any unprocessed messages 
back into the main message queue when it expires*/
const createMessageSession = async (req, res, next) => {
  try {
    const readerId = req.params.id

    if (sessions.getSession(readerId)) {
      throw new Error('Please clear your current messages')
    }

    if (messageQueue.getQueueCount() < 1) {
      throw new Error('No messages available')
    }

    const messages = messageQueue.getMessages()

    const readerSession = new MessageSession(readerId, messages, 5)
    sessions.addSession(readerSession)
    
    const expirationInMilliseconds = differenceInMilliseconds(
      new Date(readerSession.expiration),
      new Date()
    )
    
    setTimeout(() => {
      messageQueue.addBatchedMessages(readerSession.getUnprocessedMessages())
      sessions.removeSession(readerId)
    }, expirationInMilliseconds)

    res.status(200).json({messageList: readerSession.messages})
  } catch (error) {
    next(error)
  }
}

//Add a message to the start of the queue
const addMessage = async (req, res, next) => {
  const message = new Message(req.body.content)
  messageQueue.addMessage(message)
  
  const confirmationMsg = `Message sent! Confirmation ID: ${message.id}`
  res.status(200).json({message: confirmationMsg})
}

/*Remove an individual message from a reader's 
current message session, if the resulting array of messages 
is now empty, remove the entire session*/
const processMessage = (req, res, next) => {
  const readerId = req.body.readerId
  const readerSession = sessions.getSession(readerId)

  if (!readerSession) {
    res.status(404).json({
      messageList: [],
      message: 'Message session expired'
    })
  }

  readerSession.markMessageAsProcessed(req.body.messageId)
  
  const messageList = readerSession.messages

  if (messageList.length < 1) {
    sessions.removeSession(readerId)
  }

  res.status(200).json({messageList})
}

//status update for the extension
const getStatusUpdate = (req, res, next) => {
  const status = {
    active: 'active',
    totalMessages: messageQueue.getMessageCount(),
    totalReaders: sessions.getSessionCount(),
    availableMessages: messageQueue.getQueueCount()
  }

  res.status(200).json({status})
}

module.exports = {
  getMessageSession,
  createMessageSession,
  addMessage,
  processMessage,
  getStatusUpdate,
  endMessageSession
}



