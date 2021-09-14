const mongoose = require('mongoose')
const Machine = require('../models/Machine')
const checkAndInsertData = require('./check-and-insert-data')
require('dotenv').config()

const { MONGO_URI = 'mongodb://localhost:27017/performance' } = process.env

let macAddress
mongoose.connect(MONGO_URI, { useNewUrlParser: true })

module.exports = function (io, socket) {
	console.log('Socket connected', socket.id)

	// TODO: secure client-auth key in env vars
	socket.on('client-auth', (key) => {
		if (key === 'abcd1234') {
			// valid node client joins
			socket.join('clients')
		} else if (key === '1234abcd') {
			// valid ui client
			socket.join('ui')
			console.log('A react app joined the room...')
			Machine.find({}, (err, documents) => {
				if (err) console.error(err)
				for (let machine of documents) {
					// on initial fetch from db, set all machines as offline
					machine.isOnline = false
					io.in('ui').emit('data', machine)
				}
			})
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
		console.log(JSON.stringify(data))
		io.in('ui').emit('data', data)
	})

	socket.on('disconnect', async () => {
		Machine.findById({macAddress}, (err, documents) => {
			if (err) console.error(err)
			if (!!documents.length) {
				const [machine] = documents
				machine.isActive = false
				io.in('ui').emit('data', machine)
			}
		})
	})
}