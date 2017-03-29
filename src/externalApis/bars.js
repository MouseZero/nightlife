const { getToken, searchBars } = require('./yelpApiInterface')()
let token

const search = async (location) => {
  token = await getToken()
  return await searchBars(location, token.access_token)
}

module.exports = {
  search
}
