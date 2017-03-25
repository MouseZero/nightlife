const requestEndpoints = require('./requestEndpoints')
const { stub } = require('sinon')
const t = Object.assign({}, { fetch: '' })
const { expect } = require('chai')

describe('requestEndpoints', () => {
  describe('xWwwFormUrlencodedFetch', () => {
    context('successful response', () => {
      let fetch
      beforeEach(() => {
        fetch = stub(t, 'fetch').callsFake((x) => {
          return Promise.resolve({ json: () => 'success' })
        })
      })
      afterEach(() => {
        fetch.restore()
      })

      it('calls fetch', async () => {
        await requestEndpoints(fetch)
          .xWwwFormUrlencodedFetch()
        expect(fetch.called).to.equal(true)
      })

      it('gets json from a response', async () => {
        const result = await requestEndpoints(fetch)
          .xWwwFormUrlencodedFetch()
        expect(result).to.equal('success')
      })
    })

    context('unsuccessful response', () => {
      let fetch
      beforeEach(() => {
        fetch = stub(t, 'fetch').callsFake((x) => {
          return Promise.reject(new Error('err'))
        })
      })
      afterEach(() => {
        fetch.restore()
      })

      it('throws error', (done) => {
        requestEndpoints(fetch)
          .xWwwFormUrlencodedFetch()
          .then(() => done('should have errored'))
          .catch(() => done())
      })
    })

    context('gives the right params to fetch', async () => {
      let fetch
      beforeEach(() => {
      })
      afterEach(() => {
        fetch.restore()
      })

      it('calls the right headers', (done) => {
        fetch = stub(t, 'fetch').callsFake((_, { headers }) => {
          if (
            headers.Accept === 'application/json' &&
            headers['Content-Type'] === 'application/x-www-form-urlencoded'
          ) {
            done()
          } else {
            done(new Error('Wrong headers'))
          }

          return Promise.resolve({ json: () => 'success' })
        })
        requestEndpoints(fetch).xWwwFormUrlencodedFetch()
      })
    })
  })
})
