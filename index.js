const PORT = process.env.PORT || process.argv[2] || 3000
require('./src/checkEnvVars')()
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

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token')
  next()
})

app.use('/', routes(usersDb, statusDb))

resetIntervals(statusDb)

app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}`)
})
