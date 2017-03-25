const { getToken } = require('./yelpApiInterface')()


getToken()
  .then(x => console.log(x))
