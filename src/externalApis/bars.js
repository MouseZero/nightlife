const yelp = require('./yelpApiInterface')()
const tokenFetcher = require('./tokenFetcher')(yelp.getToken)
let token

const updateToken = async () => {
  return await tokenFetcher.updateToken(yelp.getToken)
}

const search = (updateToken, yelp) => async (location) => {
  if (!token) {
    token = await updateToken()
  }
  return await yelp.searchBars(location, token.token)
}

module.exports = () => {
  return {
    search: search(updateToken, yelp)
  }
}
Object.assign(module.exports, {
  search
})
