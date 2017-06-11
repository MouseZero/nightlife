const { Router } = require('express')
const userRoutes = require('./users-routes')
const { errorHandler, testError } = require('./custom-errors')
const searchRoutes = require('./search-routes')
const jwtMiddleware = require('./jwt-middleware')

const router = Router()
module.exports = router
module.exports = (usersDb, statusDb) => {
  const { authenticate } = jwtMiddleware(usersDb)
  return router
    .use('/users', userRoutes(usersDb))
    .post('/authenticate', authenticate)
    .get('/testError', testError)
    .use('/search', searchRoutes(statusDb, usersDb))
    .use(errorHandler)
}
