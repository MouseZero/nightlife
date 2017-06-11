const PORT = process.env.PORT || process.argv[2] || 3000
require('dotenv/config')
require('./src/checkEnvVars')()
const app = require('express')()
const routes = require('./src/routes')
const bodyParser = require('body-parser')
const pg = require('pg')
const config = require('./src/databaseCredentialsFromEnv')
const pool = new pg.Pool(config)
const usersDb = require('./src/persistence/users-factory')(pool)
const statusDb = require('./src/persistence/status-factory')(pool)
const cors = require('cors')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// CORS
app.use(cors())
app.options('*', cors())

app.use('/', routes(usersDb, statusDb))

app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}`)
})
