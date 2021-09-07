const mongoose = require('mongoose')
const checkAndInsertData = require('./services/checkAndInsertData')

let macAddress
mongoose.connect('mongodb://host.docker.internal:27017/performance', { useNewUrlParser: true })

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