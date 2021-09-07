import { io } from 'socket.io-client'

const { REACT_APP_SERVER_URL } = process.env

let socket = io(REACT_APP_SERVER_URL)

// TODO: secure client-auth key in env vars
socket.emit('client-auth', '1234abcd')

export default socket
