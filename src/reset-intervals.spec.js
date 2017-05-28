const { expect } = require('chai')
const sinon = require('sinon')

const {
  millisecondsTillTimeOfDay,
  setTimeoutTimeOfDay,
  startIntervalsAtTime
} = require('./reset-intervals')

describe('reset-intervals', () => {
  describe('millisecondsTillTimeOfDay', () => {
    it('returns correct number of milliseconds for time less then', () => {
      const date = new Date(2017, 5, 28, 1, 30)
      const result = millisecondsTillTimeOfDay(4, date)
      expect(result).to.equal(9000000)
    })
    it('returns correct number of milliseconds for time already passed', () => {
      const date = new Date(2017, 5, 28, 23, 30)
      const result = millisecondsTillTimeOfDay(13, date)
      expect(result).to.equal(48600000)
    })
  })

  describe('setTimeoutTimeOfDay', () => {
    it('calls callback', (done) => {
      const func = () => done()
      const date = new Date(2017, 5, 28, 1, 59, 950)
      setTimeoutTimeOfDay(func, date, 2)
      setInterval(() => done(new Error('did no call function on time')), 300)
    })
  })

  describe('startIntervalsAtTime', () => {
    it('calls callback the first time when it should', (done) => {
      const spy = sinon.spy()
      const date = new Date(2017, 5, 28, 1, 59, 950)
      const oneDay = 86400000
      startIntervalsAtTime(spy, date, 2, oneDay)
      setTimeout(() => {
        if (spy.callCount === 1) {
          done()
        } else {
          done(new Error('expected spy to be called once not ' + spy.callCount))
        }
      }, 100)
    })
    it('calls callback the right number of times for intervals', (done) => {
      const spy = sinon.spy()
      const date = new Date(2017, 5, 28, 1, 59, 990)
      const intervals = 20
      startIntervalsAtTime(spy, date, 2, intervals)
      setTimeout(() => {
        const times = 5
        if (spy.callCount === times) {
          done()
        } else {
          done(new Error('expected spy to be called ' + times + ' times not ' + spy.callCount))
        }
      }, 100)

    })
  })
})