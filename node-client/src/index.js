/**
 * ## Requirements
 * - CPU load
 * - CPU Type - Core count and clock speed
 * - Memory usage
 * - Free storage
 * - Total
 * - OS Type
 * - Uptime
 */

const os = require("os")
const io = require('socket.io-client')
let socket = io('http://127.0.0.1:8181')

socket.on('connect', () => {
	console.log('I connected to the server')
})


async function getPerformanceData() {
	return new Promise(async (resolve, reject) => {
		try {
			const OS_TYPE = os.type()
			const CPUS = os.cpus()
			const TOTAL_MEM = os.totalmem()
			const FREE_MEM = os.freemem()

			const osType = OS_TYPE === 'Darwin' ? 'Mac' : OS_TYPE
			const uptime = os.uptime()

			const totalMem = TOTAL_MEM
			const freeMem = FREE_MEM
			const usedMem = TOTAL_MEM - FREE_MEM
			const memUsage = Math.floor((usedMem / totalMem) * 100) / 100

			const cpuModel = CPUS[0].model
			const cpuSpeed = CPUS[0].speed
			const cpuCoreCount = CPUS.length
			const cpuLoad = await getCPULoad()

			resolve({
				osType,
				uptime,
				freeMem,
				totalMem,
				usedMem,
				memUsage,
				cpuModel,
				cpuSpeed,
				cpuCoreCount,
				cpuLoad
			})
		} catch (err) {
			reject(err)
		}
	})
}

function getCPUAverageTimes() {
	const CPUS = os.cpus()
	let idleMs = 0
	let totalMs = 0

	for (const cpu of CPUS) {
		for (const type in cpu.times) {
			totalMs += cpu.times[type]
		}
		idleMs += cpu.times.idle
	}

	return [idleMs / CPUS.length, totalMs / CPUS.length]
}

/**
 * Since the times property is time since last boot, we will get now times and
 * 100ms from now times, compare them and that will give us the current load
 */
function getCPULoad() {
	return new Promise((resolve) => {
		const [startIdleMs, startTotalMs] = getCPUAverageTimes()
		setTimeout(() => {
			const [endIdleMs, endTotalMs] = getCPUAverageTimes()
			// calculate diff
			const idleDiff = endIdleMs - startIdleMs
			const totalDiff = endTotalMs - startTotalMs
			// calculate % diff
			const percentageCPU = 100 - Math.floor(100 - Math.floor(100 * (idleDiff / totalDiff)))
			resolve(percentageCPU)
		}, 100)
	})
}

getPerformanceData().then(console.log)