const { Router } = require('express')
const wrap = require('express-async-wrap')
const { BadRequest, InternalServerError } = require('./custom-errors')
const _ = require('lodash')

const addRoute = wrap(async (req, res) => {
	res.json()
})
const add = ({ create, get, update}) => async (locationId, userId) => {
	if (get(locationId)) {
		update(locationId, userId)
	} else {
		create(locationId, userId)
	}
}

const get = (statusGet) => async (locationId) => {
	statusGet(locationId)
}

module.exports = {
	add, get
}