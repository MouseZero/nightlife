const {
  search,
  searchImplementer,
  goingToggleImplementer,
  going
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
    it('throws error if searchBars fails', async () => {
      const searchBars = () => new Promise.Reject(new Error())
      return expect(searchImplementer(searchBars, {location: 'irvine'}))
        .to.be.rejectedWith(Error)
    })
    it('"your_going" and "users_going" get added to the data', async () => {
      const params = {}
      params.searchBars = () => Promise.resolve(yelpApiExample)
      params.userId = 7
      params.getStatus = sinon.stub()
      params.getStatus.onCall(0).returns({users_going: [1, 2, 4, 9]})
      params.getStatus.onCall(1).returns({users_going: [7]})
      const {result: {businesses}} = await searchImplementer(params)
      expect(businesses[1]['your_going']).to.equal(true)
      expect(businesses[1]['users_going']).to.equal(1)
    })
  })

  describe('search', () => {
    it('should be a function', () => {
      expect(search).to.be.a('function')
    })
    it('should return a function', () => {
      expect(search()).to.be.a('function')
    })
    it('errors when location not in query', async () => {
      const func = () => {}
      const setup = (req, res, next) => {
        req.decoded = { id: 7 }
        next()
      }
      const [error] = await run(setup, search(func, '', func))
      expect(error).to.be.instanceof(BadRequest)
    })
    it('errors when id not in decoded', async () => {
      const func = () => {}
      const setup = (req, res, next) => {
        req.query.location = 'irvine'
        next()
      }
      const [error] = await run(setup, search(func, '', func))
      expect(error).to.be.instanceof(BadRequest)
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
      await run(setup, going(spy, {
        add: true,
        delUser: true,
        get: true
      }))
      expect(spy.calledWith({
        id: 5,
        bar_id: 'bar1',
        add: true,
        delUser: true,
        get: true
      })).to.equal(true)
      expect(spy.callCount).to.equal(1)
    })
  })

  describe('goingToggleImplementer', () => {
    it('when already going changes to not going')
    it('when not going changes to going')
  })
})
