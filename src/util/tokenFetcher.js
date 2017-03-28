const BUFFER = 10000

const updateToken = (getNewToken) => async ({issuedAt, expiresIn, token}) => {
  const expires = (expiresIn + issuedAt) - BUFFER
  if (expires <= new Date()) {
    return await getNewToken()
  }
  return {issuedAt, expiresIn, token}
}

module.exports = (getNewToken) => {
  return {
    updateToken: updateToken(getNewToken)
  }
}

Object.assign(module.exports, {
  updateToken
})
