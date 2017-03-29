const yelp = require('./yelpApiInterface')()
const tokenFetcher = require('./tokenFetcher')(yelp.getToken)
let token

const search = (yelp) => async (location) => {
  if (!token) {
    token = await yelp.getToken()
  }
  return await yelp.searchBars(location, token.access_token)
}

module.exports = () => {
  return {
    search: search(yelp)
  }
}
Object.assign(module.exports, {
  search
})
