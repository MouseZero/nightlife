const add = (statusCreate, statusGet, statusUpdate) => async (locationId, userId) => {
	if (statusGet(locationId)) {
		statusUpdate(locationId, userId)
	} else {
		statusCreate(locationId, userId)
	}
}

const get = (statusGet) => async (locationId) => {
	statusGet(locationId)
}

module.exports = {
	add, get
}