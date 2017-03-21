const PORT = process.argv[2] || 3333
const app = require('express')()
const routes = require('./src/routes')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', routes)

app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}`)
})
