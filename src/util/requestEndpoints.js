module.exports = (fetch) => {
  async function xWwwFormUrlencodedFetch (body, url, method = 'POST') {
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

  return {
    xWwwFormUrlencodedFetch
  }
}
