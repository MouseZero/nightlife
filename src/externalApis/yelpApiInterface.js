const appID = process.env.YELP_APP_ID
const appSecret = process.env.YELP_APP_SECRET

const fetch = require('node-fetch')
const {
  xWwwFormUrlencodedFetch,
  bearerTokenFetch
 } = require('./requestEndpoints')(fetch)

const getToken = (endpointInterface, appID, appSecret) => async () => {
  const body = {
    'client_id': appID,
    'client_secret': appSecret
  }
  const result = await endpointInterface(body, 'https://api.yelp.com/oauth2/token')
  if (result && result.error) {
    console.log(result.error)
  }
  return result
}

const searchBars = (endpointInterface) => async (location, token) => {
  const body = {
    categories: 'bars',
    location
  }
  const result = await endpointInterface(body, 'https://api.yelp.com/v3/businesses/search', token)
  if (result && result.error) {
    console.log(result.error)
  }
  return result
}

module.exports = () => {
  return {
    getToken: getToken(xWwwFormUrlencodedFetch, appID, appSecret),
    searchBars: searchBars(bearerTokenFetch)
  }
}

Object.assign(module.exports, {
  getToken,
  searchBars
})
