const { yelp: { app_id, app_secret } } = require('../../config')
const fetch = require('node-fetch')
const { xWwwFormUrlencodedFetch } = require('./requestEndpoints')(fetch)

const getToken = (endpointInterface) => async () => {
  const body = {
    'client_id': app_id,
    'client_secret': app_secret
  }
  return await endpointInterface(body, 'https://api.yelp.com/oauth2/token')
}

module.exports = () => {
  return {
    getToken: getToken(xWwwFormUrlencodedFetch)
  }
}

Object.assign(module.exports, {
  getToken
})
