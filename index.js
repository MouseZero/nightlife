const PORT = process.argv[2] || 3000
const app = require('express')()
const routes = require('./src/routes')
const bodyParser = require('body-parser')
const resetIntervals = require('./src/reset-intervals')
const pg = require('pg')
const config = require('./src/databaseCredentialsFromEnv')
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
