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
require('dotenv').config()

const { SERVER_URL } = process.env
let socket = io(SERVER_URL)

socket.on('connect', () => {
    // identify the connected machine uniquely
    const networkInterfaces = os.networkInterfaces()
    let macAddress
    // loop through all network interfaces and find external one
    for (let key in networkInterfaces) {
        if (!networkInterfaces[key][0].internal) {
            macAddress = networkInterfaces[key][0].mac
            break
        }
    }
    // TODO: Client auth with single key value
    socket.emit('client-auth', 'abcd1234')
    getPerformanceData().then((data) => {
        data['macAddress'] = macAddress
        socket.emit('init-performance-data', data)
    })
    // send performance data in 1s interval
    let getPerformanceDataInterval = setInterval(async () => {
        console.log('sending performance data...')
        const data = await getPerformanceData()
        data['macAddress'] = macAddress
        socket.emit('performance-data', data)
    }, 1000)
    socket.on('disconnect', () => {
        clearInterval(getPerformanceDataInterval)
    })
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
            const isOnline = true

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
                cpuLoad,
                isOnline
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
