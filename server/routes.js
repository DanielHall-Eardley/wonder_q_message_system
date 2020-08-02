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

router.post('/message/clear', endMessageSession)

router.put('/message/process', processMessage)

module.exports = router











