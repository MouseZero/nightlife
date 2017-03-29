const yelp = require('./yelpApiInterface')()
const tokenFetcher = require('./tokenFetcher')(yelp.getToken)
let token

const updateToken = async () => {
  return await tokenFetcher.updateToken(yelp.getToken)
}

const searchBars = yelp.searchBars

const search = (updateToken, searchBars) => async (location) => {
  if (!token) {
    token = await updateToken()
  }
  return await searchBars(location, token.token)
}

module.exports = () => {
  return {
    search: search(updateToken, searchBars)
  }
}
Object.assign(module.exports, {
  search
})
