const yelp = require('./yelpApiInterface')()
const tokenFetcher = require('./tokenFetcher')(yelp.getToken)
let token

const search = (yelp) => async (location) => {
  if (!token) {
    token = await tokenFetcher.updateToken(yelp.getToken)
  }
  return await yelp.searchBars(location, token.token)
}

module.exports = () => {
  return {
    search: search(yelp)
  }
}
Object.assign(module.exports, {
  search
})
