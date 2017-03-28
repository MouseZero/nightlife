const BUFFER = 10000

const yelpToToken = (getToken) => async () => {
  const { access_token, expires_in } = await getToken()
  if (!access_token || !expires_in) {
    return Promise.reject(new Error(
      'wrong format expected "access_token" & "expires_in"'
    ))
  }
  return {
    token: access_token,
    expiresIn: expires_in,
    issuedAt: new Date()
  }
}

const updateToken = (getNewToken) => async ({issuedAt, expiresIn, token}) => {
  const expires = (expiresIn + (+issuedAt)) - BUFFER
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
  updateToken,
  yelpToToken
})
