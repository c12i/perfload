const mongoose = require('mongoose')
const checkAndInsertData = require('./check-and-insert-data')
require('dotenv').config()

const { MONGO_URI = 'mongodb://localhost:27017/performance' } = process.env

let macAddress
mongoose.connect(MONGO_URI, { useNewUrlParser: true })

module.exports = function (io, socket) {
	console.log('Socket connected', socket.id)

	socket.on('client-auth', (key) => {
		if (key === 'abcd1234') {
			// valid node client joins
			socket.join('clients')
		} else if (key === '1234abcd') {
			// valid ui client
			socket.join('ui')
		} else {
			// invalid client
			socket.disconnect(true)
		}
	})

	socket.on('init-performance-data', async (data) => {
		macAddress = data.macAddress
		// check and insert performance-data in mongo if !exists
		await checkAndInsertData(data)
	})

	socket.on('performance-data', data => {
		console.log(data)
	})
}