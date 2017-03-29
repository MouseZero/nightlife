const BUFFER = 10000

const yelpToToken = (getToken) => async () => {
  const { access_token: token, expires_in: expiresIn } = await getToken()
  if (!token || !expiresIn) {
    return Promise.reject(new Error(
      'wrong format expected "access_token" & "expires_in"'
    ))
  }
  return {
    token,
    expiresIn,
    issuedAt: (+ new Date())
  }
}

const updateToken = (getNewToken) => async ({issuedAt, expiresIn, token}) => {
  if (!token) return await yelpToToken(getNewToken)()
  const expires = (expiresIn + issuedAt) - BUFFER
  if (expires <= new Date()) return await yelpToToken(getNewToken)()
  return {issuedAt, expiresIn, token}
}

module.exports = (getNewToken) => {
  return {
    updateToken: updateToken(getNewToken)
  }
}

Object.assign(module.exports, {
  updateToken,
  yelpToToken
})
