const express = require('express')
const {
  getMessageSession,
  createMessageSession,
  addMessage,
  processMessage,
  getStatusUpdate,
  endMessageSession
} = require('./controller.js')

const router = express.Router()

router.get('/message/pending/:id', getMessageSession)

router.get('/status', getStatusUpdate)

router.get('/message/list/:id', createMessageSession)

router.post('/message/submit', addMessage)

router.delete('/message/clear', endMessageSession)

router.delete('/message/delete', processMessage)

module.exports = router











