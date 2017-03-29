const yelp = require('./yelpApiInterface')()
let token

const search = (yelp) => async (location) => {
  token = await yelp.getToken()
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
