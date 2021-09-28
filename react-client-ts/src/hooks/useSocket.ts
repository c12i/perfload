import { io } from 'socket.io-client'
import { useMemo } from 'react'

const { REACT_APP_SERVER_URL } = process.env

const useSocket = (namespace: string = '/') => {
  const socket = useMemo(() => {
    const socket = io(`${REACT_APP_SERVER_URL}${namespace}`)
    // TODO: secure client-auth key in env vars
    socket.emit('client-auth', '1234abcd')
    return socket
  }, [namespace])
  return socket
}

export default useSocket
