const {Queue, Sessions} = require('./models.js') 

module.exports = {
  messageQueue: new Queue(),
  sessions: new Sessions()
}

