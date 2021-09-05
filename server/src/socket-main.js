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

	socket.on('performance-data', data => {
		console.log(data)
	}) 
}