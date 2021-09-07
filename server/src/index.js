//See https://github.com/elad/node-cluster-socket.io
const cluster = require('cluster');
const express = require('express');
const net = require('net');
const socketio = require('socket.io');

const socketMain = require('./services/socket-main');
// const expressMain = require('./services/express-main');

const num_processes = require('os').cpus().length;
const io_redis = require('socket.io-redis');
const farmhash = require('farmhash');

const { REDIS_HOST, REDIS_PORT } = process.env
const PORT = 8181;

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
	const server = net.createServer({ pauseOnConnect: true });
	server.on('connection', (connection) => {
		// Get the worker for this connection's source IP and pass
		// it the connection.
		let worker = workers[worker_index(connection.remoteAddress, num_processes)];
		worker.send('sticky-session:connection', connection);
	})
	server.listen(PORT);
	console.log(`Master listening on port ${PORT}`);
} else {
	let app = express();
	const server = app.listen(0, 'localhost');
	console.log("Worker listening...");
	const io = socketio(server);

	io.adapter(io_redis({ host: REDIS_HOST, port: REDIS_PORT }));

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


