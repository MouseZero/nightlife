const PORT = process.argv[2] || 3000
const app = require('express')()
const routes = require('./src/routes')
const bodyParser = require('body-parser')
//Database Setup
const pg = require('pg')
const { database: config } = require('./config.json')
const pool = new pg.Pool(config)
const usersDb = require('./src/persistence/users-factory')(pool)
const statusDb = require('./src/persistence/status-factory')(pool)

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', routes(usersDb, statusDb))

app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}`)
})
