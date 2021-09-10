import { io } from 'socket.io-client'
import {useMemo} from 'react'

const { REACT_APP_SERVER_URL } = process.env

// FIXME: dead code, needs fix
const useSocket = () => {
	const socket = useMemo(() => {
		const socket = io(REACT_APP_SERVER_URL)
		return socket
	},[])
	return socket
}

export default useSocket