const { expect } = require('chai')

const {
  millisecondsTillTimeOfDay,
  resetAtTime
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

  describe('resetAtTime', () => {
    it('calls callback', (done) => {
      const func = () => done()
      const date = new Date(2017, 5, 28, 1, 59, 950)
      resetAtTime(func, date, 2)
      setInterval(() => done(new Error('did no call function on time')), 300)
    })
  })
})