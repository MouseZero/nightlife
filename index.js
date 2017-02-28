const PORT = process.argv[2] || 3333
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.json({
    success: true,
    msg: 'it worked'
  })
})

app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}`)
})
