const yelp = require('./yelpApiInterface')()
const tokenFetcher = require('./tokenFetcher')(yelp.getToken)
let token

const updateToken = async () => {
  return await tokenFetcher.updateToken(yelp.getToken)
}

const searchBars = yelp.searchBars

const search = (updateToken, searchBars) => async (location) => {
  //add code here to only update the token if its needed
  token = await updateToken(token)
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
