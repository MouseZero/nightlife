const { expect } = require('chai')
const { createUserInject } = require('./endpointAction')
const TESTUSER = 'bill'
const TESTPASS = 'password'

describe('Should be able to control user opperations', function () {
  describe('createUserInject', function () {
    it('is a function', function () {
      expect(createUserInject).to.be.a('function')
    })

    it('should retern success if makeUser is successful', function (done) {
      const makeUser = () => Promise.resolve(true)
      createUserInject(TESTUSER, TESTPASS, { makeUser })
      .then(result => {
        if (result.success) {
          done()
        } else {
          done('should have been a success')
        }
      })
    })

    it('should return err if makeUser errors', function (done) {
      const makeUser = () => {
        return Promise.reject(new Error('Was not able to create user'))
      }

      createUserInject(TESTUSER, TESTPASS, { makeUser })
      .then(function (result) {
        if (typeof result.success !== 'undefined' && !result.success) {
          done()
        } else {
          done('could not find {success: false}')
        }
      })
      .catch(() => done('Should not have throwen an error'))
    })
  })
})
