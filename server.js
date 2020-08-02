const express = require('express')
const cors = require('cors')
const routes = require('./server/routes.js')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', routes)
app.use('/wonder', express.static(path.join(__dirname, 'build')))
app.get('/wonder', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'build/index.html'))
})

app.use((err, req, res, next) => {
  const status = res.statusCode
  const errorMessage = err.message || 'An error occured'

  res.status(status).json({
    error: `Message: ${errorMessage}`
  })
})

app.listen(8000)