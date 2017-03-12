const { search } = require('./yelpApiInterface')
const { expect } = require('chai')

describe('yelp api interface', function () {
  it('should return json object for successful call', async function () {
    const result = await search('irvine')
    expect(result).to.be.a('object')
  })
})
