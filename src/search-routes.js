const _ = require('lodash')
// const { Router } = require('express')
const wrap = require('express-async-wrap')

const search = (searchBars) => wrap(async ({ body: { location } }, res) => {
  const result = await searchBars(location)
  res.json({
    success: true,
    result
  })
})

module.exports = {
  search
}
