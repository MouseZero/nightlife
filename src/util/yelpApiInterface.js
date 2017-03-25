const { yelp: { app_id, app_secret } } = require('../../config')
const fetch = require('node-fetch')
const { xWwwFormUrlencodedFetch } = require('./requestEndpoints')(fetch)

async function search (searchFor) {
  const body = {
    'client_id': app_id,
    'client_secret': app_secret
  }
  return await xWwwFormUrlencodedFetch(body, 'https://api.yelp.com/oauth2/token')
}

module.exports = {
  search
}
