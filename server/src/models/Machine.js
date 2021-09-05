const { model, Schema } = require('mongoose')

const Machine = new Schema({
	macAddress: String,
	cpuLoad: Number,
	freeMem: Number,
	totalMem: Number,
	usedMem: Number,
	memUsage: Number,
	osType: String,
	uptime: String,
	cpuModel: String,
	coreCount: Number,
	cpuSpeed: Number
})

module.exports = model('Machine', Machine)
