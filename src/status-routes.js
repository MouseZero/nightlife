const add = (statusCreate, statusGet, statusUpdate) => async (locationId, userId) => {
	if (statusGet(locationId)) {
		statusUpdate(locationId, userId)
	} else {
		statusCreate(locationId, userId)
	}
}

module.exports = {
	add
}