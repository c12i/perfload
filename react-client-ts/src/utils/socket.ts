import { io } from 'socket.io-client'

let socket = io('http://localhost:8181')

export default socket
