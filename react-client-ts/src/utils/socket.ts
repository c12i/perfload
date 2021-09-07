import { io } from 'socket.io-client'

const { REACT_APP_SERVER_URL } = process.env

let socket = io(REACT_APP_SERVER_URL) 

export default socket
