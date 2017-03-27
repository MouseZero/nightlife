const fetch = require('node-fetch')

const xWwwFormUrlencodedFetch = fetch => async (body, url, method = 'POST') => {
  let formBody = []
  for (let property in body) {
    var encodedKey = encodeURIComponent(property)
    var encodedValue = encodeURIComponent(body[property])
    formBody.push(encodedKey + '=' + encodedValue)
  }
  formBody = formBody.join('&')

  const answer = await fetch(url, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
  return await answer.json()
}

const bearerTokenFetch = fetch => async (body, url, token) => {
  let formBody = []
  for (let property in body) {
    var encodedKey = encodeURIComponent(property)
    var encodedValue = encodeURIComponent(body[property])
    formBody.push(encodedKey + '=' + encodedValue)
  }
  formBody = formBody.join('&')
  const urlWithQuery = (formBody) ? (url + '?' + formBody) : url
  await fetch(urlWithQuery, {
    method: 'GET',
    headers: {
      'Authorization': ('Bearer ' + token)
    }
  })
}

module.exports = () => {
  return {
    xWwwFormUrlencodedFetch: xWwwFormUrlencodedFetch(fetch),
    bearerTokenFetch: bearerTokenFetch(fetch)
  }
}

Object.assign(module.exports, {
  xWwwFormUrlencodedFetch,
  bearerTokenFetch
})
