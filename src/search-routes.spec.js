const {
  search,
  addNumberGoing,
  searchImplementer,
  mergeData,
  goingImplementer,
  going
} = require('./search-routes')
const run = require('express-unit')
const { BadRequest } = require('./custom-errors')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('search-routes', () => {
  describe('requestBarData', () => {
    it('is Asyn Function', () => {
      expect(searchImplementer).to.be.a('AsyncFunction')
    })
    it('throws error if location is not passed in', () => {
      const searchBars = () => {}
      return expect(searchImplementer(searchBars, {})).to.be.rejectedWith(BadRequest)
    })
    it('throws error if searchBars fails', async () => {
      const searchBars = () => new Promise.Reject(new Error())
      return expect(searchImplementer(searchBars, {location: 'irvine'})).to.be.rejectedWith(Error)
    })
    it('passes data to searchBars', async () => {
      let xArg
      const searchBars = (x) => { xArg = x }
      await searchImplementer(searchBars, {location: 'irvine'})
      expect(xArg).to.equal('irvine')
    })
  })

  describe('search', () => {
    it('should be a function', () => {
      expect(search).to.be.a('function')
    })
    it('should return a function', () => {
      expect(search()).to.be.a('function')
    })
    it('calls requestBarData with the right params', async () => {
      let argA, argB
      const requestBarData = (a, {location}) => {
        argA = a
        argB = location
      }
      const setup = (req, res, next) => {
        req.query.location = 'irvine'
        next()
      }
      await run(setup, search(requestBarData, {location: 'searchBars'}))
      expect(argA).to.deep.equal({location: 'searchBars'})
      expect(argB).to.equal('irvine')
    })
  })

  describe('mergeData', () => {
    it('adds data to object', () => {
      const objArray = [
        {id: 'foo'},
        {id: 'bar'},
        {id: 'baz'}
      ]
      const dataArray = ['fooer', 'barer', 'bazer']
      const newObj = mergeData(objArray, 'newStuff', dataArray)
      expect(newObj[0]).to.deep.equal({id: 'foo', newStuff: 'fooer'})
      expect(newObj[1]).to.deep.equal({id: 'bar', newStuff: 'barer'})
      expect(newObj[2]).to.deep.equal({id: 'baz', newStuff: 'bazer'})
    })
    it('does note alter original', () => {
      const objArray = [
        {id: 'foo'},
        {id: 'bar'},
        {id: 'baz'}
      ]
      const objArrayCopy = objArray.map(x => Object.assign({}, x))
      const dataArray = ['fooer', 'barer', 'bazer']
      const dataArrayCopy = dataArray.slice()
      mergeData(objArrayCopy, 'newStuff', dataArrayCopy)
      expect(objArrayCopy).to.deep.equal(objArray)
      expect(dataArrayCopy).to.deep.equal(dataArray)
    })
  })

  describe('going', () => {
    it('calls implementer with right arguments', async () => {
      let passedAdd, bar, user
      const add = 'foo'
      const implementer = (a, params) => {
        passedAdd = a
        bar = params['bar_id']
        user = params['id']
      }
      const setup = (req, res, next) => {
        req.body.bar_id = 'bar1'
        req.decoded = {id: 5}
        next()
      }
      await run(setup, going(implementer, add))
      expect(passedAdd).to.equal(add)
      expect(bar).to.equal('bar1')
      expect(user).to.equal(5)
    })
  })

  describe('goingImplementer', () => {
    it('returns success for resolved update', async () => {
      const update = () => Promise.resolve()
      const result = await goingImplementer(update, {})
      expect(result.success).to.equal(true)
    })
    it('calls update with barId and users', async () => {
      let barId, userId
      const update = (a, b) => {
        barId = a
        userId = b
      }
      await goingImplementer(update, {barId: 'bar1', userId: 5})
      expect(barId).to.equal('bar1')
      expect(userId).to.equal(5)
    })
    it('reutrns success false for update reject promise', async () => {
      const update = () => Promise.reject(new Error())
      const result = await goingImplementer(update, {})
      expect(result.success).to.equal(false)
    })
  })

  describe('addNumberGoing', () => {
    it('should add "numberGoing" to data', () => {
      const exampleData = [ { 'id': 'business1' }, { 'id': 'business2' } ]
      const lookup = (id) => (id === 'business1') ? 6 : 5
      const result = addNumberGoing(lookup)(exampleData)
      expect(result[0].numberGoing).to.equal(6)
      expect(result[1].numberGoing).to.equal(5)
    })
    it('returns zero if lookup returns null', () => {
      const exampleData = [{ 'id': 'something' }]
      const lookup = () => null
      const result = addNumberGoing(lookup)(exampleData)
      expect(result[0].numberGoing).to.equal(0)
    })
  })
})
