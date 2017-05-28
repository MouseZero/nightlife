const { expect } = require('chai')

const {
  millisecondsTillTimeOfDay
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
})


// new Date(year, month[, date[, hours[, minutes[, seconds[, milliseconds]]]]]);