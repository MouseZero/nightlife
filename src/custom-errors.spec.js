const {
  CustomError,
  NotFound,
  BadRequest,
  InternalServerError,
  errorHandler,
  testError
} = require('./custom-errors')
const { expect } = require('chai')
const run = require('express-unit')

describe('custom-errors', () => {
  describe('CustomError', () => {
    it('has method toJson function', () => {
      expect((new CustomError()).toJSON).is.a('function')
    })
    it('converts statusCode, error, message members to json', () => {
      const customError = new CustomError()
      customError.statusCode = '400'
      customError.message = 'test message'
      customError.error = 'Not Found'
      const json = customError.toJSON()
      expect(json.statusCode).to.equal('400')
      expect(json.message).to.equal('test message')
      expect(json.error).to.equal('Not Found')
    })
  })

  describe('Not Found', () => {
    it('returns the correct info', () => {
      expect(new NotFound().statusCode).to.equal('404')
      expect(new NotFound().error).to.equal('Not Found')
    })
  })

  describe('Bad Request', () => {
    it('returns the correct info', () => {
      expect(new BadRequest().statusCode).to.equal('400')
      expect(new BadRequest().error).to.equal('Bad Request')
    })
  })

  describe('InternalServerError', () => {
    it('returns the correct info', () => {
      expect(new InternalServerError().statusCode).to.equal('500')
      expect(new InternalServerError().error).to.equal('Internal Server Error')
    })
  })

  describe('errorHandler', () => {
    it('handles the passed in custom errors correctly', async () => {
      let status, tError
      const setup = (req, res, next) => {
        res.status = (x) => {
          status = x
          return {
            json: (x) => { tError = x }
          }
        }
        next(new NotFound('error text'))
      }
      await run(setup, errorHandler)
      expect(status).to.equal('404')
      expect(tError).to.include.keys('message')
      expect(tError.message).to.equal('error text')
    })
  })

  describe('testError', () => {
    it('should return a Not Found error', async () => {
      await run(null, testError, (err) => {
        expect(err).to.not.equal(null)
        expect(err.statusCode).to.equal('404')
        expect(err.message).to.equal('This is a test error page')
      })
    })
  })
})
