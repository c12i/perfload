import { useEffect, useState } from 'react'
import socket from './utils/socket'

const App = () => {
    const [performaceData, setPerformanceData] = useState(null)
    useEffect(() => {
      socket.on('data', (data) => {
        console.log(data)
      })
    }, [socket])
    return <div>hello from react</div>
}

export default App
