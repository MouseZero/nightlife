const { Router } = require('express')
const pg = require('pg')
const { database: config } = require('../config.json')
const pool = new pg.Pool(config)
const usersDb = require('./persistence/users-factory')(pool)
const userRoutes = require('./users-routes')
const searchRoutes = require('./search-routes')()
const jwt = require('jsonwebtoken');

const router = Router()
module.exports = router
  .use('/users', userRoutes(usersDb))
  .use('/search', searchRoutes)
