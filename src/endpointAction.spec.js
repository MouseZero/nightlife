const { expect } = require('chai')
const { createUserInject } = require('./endpointAction')
const TESTUSER = 'bill'
const TESTPASS = 'password'

describe('Should be able to control user opperations', function () {
  describe('createUserInject', function () {
    it('is a function', function () {
      expect(createUserInject).to.be.a('function')
    })

    it('calls isUser', function (done) {
      const isUser = function () {
        done()
      }

      const createUser = () => {}

      createUserInject(TESTUSER, TESTPASS, {isUser, createUser})
    })
  })
})
