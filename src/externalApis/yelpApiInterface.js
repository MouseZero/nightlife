const { yelp: { app_id, app_secret } } = require('../../config')
const fetch = require('node-fetch')
const {
  xWwwFormUrlencodedFetch,
  bearerTokenFetch
 } = require('./requestEndpoints')(fetch)

const getToken = (endpointInterface) => async () => {
  const body = {
    'client_id': app_id,
    'client_secret': app_secret
  }
  return await endpointInterface(body, 'https://api.yelp.com/oauth2/token')
}

const searchBars = (endpointInterface) => async (location, token) => {
  const body = {
    categories: 'bars',
    location
  }
  return await endpointInterface(body, 'https://api.yelp.com/v3/businesses/search', token)
}

module.exports = () => {
  return {
    getToken: getToken(xWwwFormUrlencodedFetch),
    searchBars: searchBars(bearerTokenFetch)
  }
}

Object.assign(module.exports, {
  getToken,
  searchBars
})
