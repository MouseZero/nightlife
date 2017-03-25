const { getToken } = require('./yelpApiInterface')
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
})
