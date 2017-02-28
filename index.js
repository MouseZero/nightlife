const PORT = process.argv[2] || 3333
const express = require('express')
const app = express()
const router = express.Router()
const routes = require('./src/routes')

routes(router)
app.use('/', router)

app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}`)
})
