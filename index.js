const PORT = process.argv[2] || 3333
const app = require('express')()
const routes = require('./src/routes')

app.use('/', routes())

app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}`)
})
