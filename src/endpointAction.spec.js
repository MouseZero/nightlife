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
        return Promise.resolve(true)
      }

      const createUser = () => Promise.resolve('none')

      createUserInject(TESTUSER, TESTPASS, {isUser, createUser})
    })

    it('should not create a user if it already exists', function (done) {
      const isUser = () => Promise.resolve(true)
      const createUser = () => {
        done('created a user when it wasn\'t suposed to')
        return Promise.resolve(false)
      }
      createUserInject(TESTUSER, TESTPASS, {isUser, createUser})
      .then((x) => done())
      .catch(err => console.log(err))
    })

    it('should create a user if they don\'t already exist', function (done) {
      let makeUserWasCalled = false
      const isUser = () => Promise.resolve(false)
      const makeUser = () => {
        makeUserWasCalled = true
        return Promise.resolve(true)
      }
      createUserInject(TESTUSER, TESTPASS, {isUser, makeUser})
      .then((createdUser) => {
        if (createdUser && makeUserWasCalled) {
          done()
        } else {
          done('did not create the user as expected')
        }
      })
      .catch(err => done(err))
    })
  })
})
