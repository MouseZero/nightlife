const PORT = process.argv[2] || 3000
const app = require('express')()
const routes = require('./src/routes')
const bodyParser = require('body-parser')
const resetIntervals = require('./src/reset-intervals')
const pg = require('pg')
const config = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  connectionNumber: parseInt(process.env.DATABASE_CONNECTION_NUMBER),
  idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT_MILLISECONDS)
}
const pool = new pg.Pool(config)
const usersDb = require('./src/persistence/users-factory')(pool)
const statusDb = require('./src/persistence/status-factory')(pool)

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', routes(usersDb, statusDb))

resetIntervals(statusDb)

app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}`)
})
