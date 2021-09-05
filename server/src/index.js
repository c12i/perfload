//See https://github.com/elad/node-cluster-socket.io
const express = require('express');
const cluster = require('cluster');
const net = require('net');
const socketio = require('socket.io');
const socketMain = require('./socket-main');
// const expressMain = require('./express-main');

const port = 8181;
const num_processes = require('os').cpus().length;
const io_redis = require('socket.io-redis');
const farmhash = require('farmhash');

if (cluster.isMaster) {
	// This stores our workers. We need to keep them to be able to reference
	// them based on source IP address.
	let workers = [];
	// Helper function for spawning worker at index 'i'.
	let spawn = function (i) {
		workers[i] = cluster.fork();
		workers[i].on('exit', function (code, signal) {
			// console.log('respawning worker', i);
			spawn(i);
		});
	};
	// Spawn workers for each cpu
	for (let i = 0; i < num_processes; i++) {
		spawn(i);
	}
	// Helper function for getting a worker index based on IP address.
	const worker_index = function (ip, len) {
		return farmhash.fingerprint32(ip) % len; // Farmhash is the fastest and works with IPv6, too
	};
	const server = net.createServer({ pauseOnConnect: true }, (connection) => {
		// Get the worker for this connection's source IP and pass
		// it the connection.
		let worker = workers[worker_index(connection.remoteAddress, num_processes)];
		worker.send('sticky-session:connection', connection);
	});
	server.listen(port);
	console.log(`Master listening on port ${port}`);
} else {
	let app = express();
	const server = app.listen(0, 'localhost');
	console.log("Worker listening...");    
	const io = socketio(server);
	io.adapter(io_redis({ host: 'localhost', port: 6379 }));

	io.on('connection', function (socket) {
		socketMain(io, socket);
		console.log(`connected to worker: ${cluster.worker.id}`);
	});
	// Listen to messages sent from the master. Ignore everything else.
	process.on('message', function (message, connection) {
		if (message !== 'sticky-session:connection') {
			return;
		}
		server.emit('connection', connection);
		connection.resume();
	});
}


