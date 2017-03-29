const { getToken, searchBars } = require('./yelpApiInterface')
const sinon = require('sinon')
const { expect } = require('chai')
const requestEndpoints = require('./requestEndpoints')()

describe('yelpApiInterface', () => {
  describe('getToken', () => {
    let stub
    beforeEach(() => {
      stub = sinon.stub(requestEndpoints, 'xWwwFormUrlencodedFetch')
    })
    afterEach(() => {
      requestEndpoints.xWwwFormUrlencodedFetch.restore()
    })

    it(`calls interface`, async () => {
      await getToken(stub)()
      expect(stub.called).to.equal(true)
    })

    it(`gives right body to the interface`, (done) => {
      stub.callsFake(async body => {
        if (!!body['client_id'] && !!body['client_secret']) return done()
        done(new Error(`body doesn't have the right keys`))
      })
      getToken(stub)()
    })

    it(`uses https for its url`, (done) => {
      stub.callsFake(async (_, url) => {
        if (url.slice(0, 8) === 'https://') return done()
        done(new Error('not an https url'))
      })
      getToken(stub)()
    })
  })

  describe('searchBars', () => {
    let stub
    beforeEach(() => {
      stub = sinon.stub(requestEndpoints, 'bearerTokenFetch')
    })
    afterEach(() => {
      stub.restore()
    })
    it(`calls endpoint`, async () => {
      await searchBars(stub)()
      expect(stub.called).to.equal(true)
    })
    it('calls endpointInterface with correct params', async () => {
      let tBody, tUrl, tToken
      stub.callsFake((body, url, token) => {
        tBody = body
        tUrl = url
        tToken = token
      })
      await searchBars(stub)('irvine', 'mytoken')
      expect(tBody.categories).to.equal('bars')
      expect(tBody.location).to.equal('irvine')
      expect(tUrl).to.equal('https://api.yelp.com/v3/businesses/search')
      expect(tToken).to.equal('mytoken')
    })
    it('Errors when request fails', (done) => {
      stub.callsFake(() => Promise.reject('error'))
      searchBars(stub)()
        .then(() => done('Should have thrown an error'))
        .catch(() => done())
    })
  })
})
