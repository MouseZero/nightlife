const requestEndpoints = require('./requestEndpoints')
const { spy } = require('sinon')
const { expect } = require('chai')

describe('requestEndpoints', () => {
  describe('xWwwFormUrlencodedFetch', () => {
    context('successful response', () => {
      let fetch
      beforeEach(() => {
        fetch = spy((x) => {
          return Promise.resolve({ json: () => 'success' })
        })
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
      it('calls the right header', async () => {
        let heads
        const fetch = spy((_, { headers }) => {
          heads = headers
          return Promise.resolve({json: () => 'success'})
        })
        await requestEndpoints(fetch).xWwwFormUrlencodedFetch()
        expect(heads['Content-Type']).to.equal('application/x-www-form-urlencoded')
        expect(heads.Accept).to.equal('application/json')
      })
    })
    context('unsuccessful response', () => {
      let fetch
      beforeEach(() => {
        fetch = spy((x) => {
          return Promise.reject(new Error('err'))
        })
      })
      it('throws error', (done) => {
        requestEndpoints(fetch)
          .xWwwFormUrlencodedFetch()
          .then(() => done('should have errored'))
          .catch(() => done())
      })
    })
  })

  describe('bearerTokenFetch', () => {
    context('successful response', () => {
      it('should call fetch', async () => {
        const fetch = spy(() => {
          return Promise.resolve({json: () => 'success'})
        })
        await requestEndpoints(fetch).bearerTokenFetch()
        expect(fetch.called).to.equal(true)
      })
      it('calls fetch with the right options', async () => {
        let optionsCloj
        let urlCloj
        const fetch = spy((url, options) => {
          optionsCloj = options
          urlCloj = url
          return Promise.resolve({json: () => 'success'})
        })
        await requestEndpoints(fetch)
        .bearerTokenFetch(
          {},
          'https://test.com',
          'mytoken')
        expect(optionsCloj.headers['Authorization']).to.equal('Bearer mytoken')
        expect(urlCloj).to.equal('https://test.com')
        expect(optionsCloj.method).to.equal('GET')
      })
      it('creates the right url', async () => {
        let urlCloj
        const fetch = spy((url, options) => {
          urlCloj = url
          return Promise.resolve({json: () => 'success'})
        })
        await requestEndpoints(fetch).bearerTokenFetch(
          {
            foo: 'bar',
            baz: 'qux quxx'
          },
          'https://test.com'
        )
        expect(urlCloj).to.equal('https://test.com?foo=bar&baz=qux%20quxx')
      })
    })
  })
})
