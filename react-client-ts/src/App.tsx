import { useEffect, useState } from 'react'
import socket from './utils/socket'

const App = () => {
    const [performanceData, setPerformanceData] = useState(null)
    useEffect(() => {
      socket.on('data', (data) => {
        setPerformanceData(data)
      })
    }, [])
    console.log(performanceData);
    return <div>hello from react</div>
}

export default App
