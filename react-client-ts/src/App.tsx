import { useEffect, useState } from 'react'

import SystemInfoCard from './components/SystemInfoCard'
import useSocket from './hooks/useSocket'

const App = () => {
  const socket = useSocket()
  const [performanceData, setPerformanceData] = useState(null)
  useEffect(() => {
    socket.on('data', (data) => {
      const currentState = { ...performanceData }
      currentState[data.macAddress] = data
      setPerformanceData(currentState)
    })
  }, [])
  console.log(performanceData)
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {!!performanceData &&
        Object.entries(performanceData).map(([macAddress, data]) => (
          <SystemInfoCard data={data} key={macAddress} />
        ))}
    </div>
  )
}

export default App
