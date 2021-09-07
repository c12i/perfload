const Machine = require('../models/Machine')

module.exports = async function checkAndInsertData (data) {
	try {
		const machine = await Machine.findOne({ macAddress: data.macAddress })
		if (!machine) {
			const newMachine = new Machine(data)
			await newMachine.save()
			return newMachine
		}
		return machine
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}