const {
  search,
  addNumberGoing,
  searchImplementer,
  mergeData,
  goingImplementer,
  going,
  mapGoing
} = require('./search-routes')
const run = require('express-unit')
const sinon = require('sinon')
const { BadRequest } = require('./custom-errors')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

const yelpApiExample = {
  'businesses': [
    {
      'id': 'ynk-you-never-know-irvine',
      'name': 'YNK - You Never Know',
      'image_url': 'https://s3-media4.fl.yelpcdn.com/bphoto/Oa_yDzZ4srS-f132pXzijw/o.jpg',
      'is_closed': false,
      'url': 'https://www.yelp.com/biz/ynk-you-never-know-irvine?adjust_creative=hcilRpViSFY6RRg5EJc-8Q&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=hcilRpViSFY6RRg5EJc-8Q',
      'review_count': 20,
      'categories': [
        {
          'alias': 'lounges',
          'title': 'Lounges'
        }
      ],
      'rating': 5,
      'coordinates': {
        'latitude': 33.6784501289585,
        'longitude': -117.850069887936
      },
      'transactions': [],
      'price': '$$',
      'location': {
        'address1': '18000 Von Karman Ave',
        'address2': null,
        'address3': 'Irvine Marriott',
        'city': 'Irvine',
        'zip_code': '92612',
        'country': 'US',
        'state': 'CA',
        'display_address': [
          '18000 Von Karman Ave',
          'Irvine Marriott',
          'Irvine, CA 92612'
        ]
      },
      'phone': '+19495530100',
      'display_phone': '(949) 553-0100',
      'distance': 5248.160094024
    },
    {
      'id': 'red-bar-and-lounge-irvine-2',
      'name': 'Red Bar & Lounge',
      'image_url': 'https://s3-media2.fl.yelpcdn.com/bphoto/DIvXre8s6sjBPKm6_FV6Eg/o.jpg',
      'is_closed': false,
      'url': 'https://www.yelp.com/biz/red-bar-and-lounge-irvine-2?adjust_creative=hcilRpViSFY6RRg5EJc-8Q&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=hcilRpViSFY6RRg5EJc-8Q',
      'review_count': 92,
      'categories': [
        {
          'alias': 'lounges',
          'title': 'Lounges'
        },
        {
          'alias': 'cocktailbars',
          'title': 'Cocktail Bars'
        }
      ],
      'rating': 4,
      'coordinates': {
        'latitude': 33.6779,
        'longitude': -117.84067
      },
      'transactions': [],
      'price': '$$',
      'location': {
        'address1': '17900 Jamboree Rd',
        'address2': '',
        'address3': 'Hotel Irvine',
        'city': 'Irvine',
        'zip_code': '92614',
        'country': 'US',
        'state': 'CA',
        'display_address': [
          '17900 Jamboree Rd',
          'Hotel Irvine',
          'Irvine, CA 92614'
        ]
      },
      'phone': '+19492256757',
      'display_phone': '(949) 225-6757',
      'distance': 4346.37752947
    }
  ]
}


describe('search-routes', () => {
  describe('searchImplementer', () => {
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
      const spy = sinon.spy()
      const setup = (req, res, next) => {
        req.query.location = 'irvine'
        next()
      }
      await run(setup, search(spy, 'funcs'))
      expect(spy.firstCall.args[0]).to.equal('funcs')
      expect(spy.firstCall.args[1]).to.deep.equal({location: 'irvine'})
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
    it('does not alter original', () => {
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
      const setup = (req, res, next) => {
        req.body.bar_id = 'bar1'
        req.decoded = {id: 5}
        next()
      }
      const spy = sinon.spy()
      await run(setup, going(spy, 'foo'))
      expect(spy.calledWith('foo', {id: 5, bar_id: 'bar1'})).to.equal(true)
      expect(spy.callCount).to.equal(1)
    })
  })

  describe('goingImplementer', () => {
    it('returns success for resolved update', async () => {
      const update = () => Promise.resolve()
      const result = await goingImplementer(update, {})
      expect(result.success).to.equal(true)
    })
    it('calls update with func and params', async () => {
      const add = sinon.spy()
      await goingImplementer(add, {bar_id: 'bar1', id: 5})
      expect(add.calledWith('bar1', 5)).to.equal(true)
      expect(add.callCount).to.equal(1)
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

  describe('mapGoing', () => {
    it('is an async function', () => {
      expect(mapGoing).to.be.an('AsyncFunction')
    })
    it('should return data with an added goingStatus field')
  })
})