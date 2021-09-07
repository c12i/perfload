const mongoose = require('mongoose')
mongoose.connect('mongodb://host.docker.internal:27017/performance', { useNewUrlParser: true })

let macAddress

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

	socket.on('init-performance-data', (data) => {
		macAddress = data.macAddress
		// check and add in mongo if !exists
	})

	socket.on('performance-data', data => {
		console.log(data)
	})
}