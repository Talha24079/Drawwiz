import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export const useSocket = () => {
    const socketRef = useRef(null)

    useEffect(() => {
        // Connect to the backend server
        socketRef.current = io('http://localhost:3001', {
            transports: ['websocket', 'polling'],
        })

        socketRef.current.on('connect', () => {
            console.log('Connected to server:', socketRef.current.id)
        })

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from server')
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, [])

    return socketRef.current
}
