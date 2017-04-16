const { search, addNumberGoing, requestBarData } = require('./search-routes')
const run = require('express-unit')
const sinon = require('sinon')
const { BadRequest, NotFound } = require('./custom-errors')
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('search-routes', () => {
  describe('requestBarData', () => {
    it('is Asyn Function', () => {
      expect(requestBarData).to.be.a('AsyncFunction')
    })
    it('throws error if location is not passed in', () => {
      const searchBars = () => {}
      return expect(requestBarData(searchBars)).to.be.rejectedWith(BadRequest)
    })
    it('throws error if searchBars fails', async () => {
      const searchBars = () => new Promise.reject(new Error)
      return expect(requestBarData(searchBars, 'irvine')).to.be.rejectedWith(Error)
    })
    it('passes data to searchBars', async () => {
      let xArg
      const searchBars = (x) => {xArg = x}
      await requestBarData(searchBars, 'irvine')
      expect(xArg).to.equal('irvine')
    })
  })

  //TODO fix this test to only test search
  describe('search', () => {
    it('should be a function', () => {
      expect(search).to.be.a('function')
    })
    it('should return a function', () => {
      expect(search()).to.be.a('function')
    })
    it('returns json from requestBarData promise')
  })

  describe('addNumberGoing', () => {
    it('should add "numberGoing" to data', () => {
      const exampleData = [ { "id": "business1" }, { "id": "business2" } ]
      const lookup = (id) => (id === "business1") ? 6 : 5
      const result = addNumberGoing(lookup)(exampleData)
      expect(result[0].numberGoing).to.equal(6)
      expect(result[1].numberGoing).to.equal(5)
    })
    it('returns zero if lookup returns null', () => {
      const exampleData = [ { "id": "something" }]
      const lookup = () => null
      const result = addNumberGoing(lookup)(exampleData)
      expect(result[0].numberGoing).to.equal(0)
    })
  })
})
