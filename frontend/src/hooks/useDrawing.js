import { useState, useRef, useCallback } from 'react'

/**
 * Custom hook for managing canvas drawing functionality
 * Handles stroke creation, mouse/touch events, and server synchronization
 */
export function useDrawing({ socket, roomId, isDrawer }) {
    const canvasRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [strokes, setStrokes] = useState([])
    const currentStrokeRef = useRef(null)

    // Get mouse/touch position relative to canvas
    const getCanvasPosition = useCallback((e) => {
        const canvas = canvasRef.current
        if (!canvas) return null

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        let clientX, clientY

        if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = e.clientX
            clientY = e.clientY
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        }
    }, [])

    // Start a new stroke
    const startDrawing = useCallback((e, color, thickness) => {
        if (!isDrawer) {
            console.log('Not drawer - cannot draw')
            return
        }

        console.log('Starting drawing...', { isDrawer, color, thickness })
        e.preventDefault()

        const pos = getCanvasPosition(e)
        if (!pos) return

        const newStroke = {
            color,
            thickness,
            points: [pos],
        }

        currentStrokeRef.current = newStroke
        setIsDrawing(true)
        setStrokes(prev => [...prev, newStroke])

        console.log('Stroke started:', newStroke)
    }, [isDrawer, getCanvasPosition])

    // Continue drawing (add points to current stroke)
    const continueDrawing = useCallback((e) => {
        if (!isDrawing || !isDrawer || !currentStrokeRef.current) return

        e.preventDefault()
        const pos = getCanvasPosition(e)
        if (!pos) return

        // Add point to current stroke
        currentStrokeRef.current.points.push(pos)

        // Update state
        setStrokes(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { ...currentStrokeRef.current }
            return updated
        })

        // Emit to server
        if (socket) {
            socket.emit('draw', {
                roomId,
                stroke: {
                    color: currentStrokeRef.current.color,
                    thickness: currentStrokeRef.current.thickness,
                    points: currentStrokeRef.current.points.slice(-2), // Last 2 points for smooth rendering
                },
            })
            console.log('Emitted draw event')
        }
    }, [isDrawing, isDrawer, socket, roomId, getCanvasPosition])

    // Stop drawing
    const stopDrawing = useCallback(() => {
        if (!isDrawing) return

        console.log('Stopping drawing')
        setIsDrawing(false)

        // Emit complete stroke to server
        if (socket && currentStrokeRef.current) {
            socket.emit('draw', {
                roomId,
                stroke: currentStrokeRef.current,
            })
            console.log('Emitted final stroke:', currentStrokeRef.current)
        }

        currentStrokeRef.current = null
    }, [isDrawing, socket, roomId])

    // Undo last stroke
    const undoStroke = useCallback(() => {
        if (!isDrawer || strokes.length === 0) return

        console.log('Undoing last stroke')
        setStrokes(prev => prev.slice(0, -1))

        if (socket) {
            socket.emit('undo', { roomId })
        }
    }, [isDrawer, strokes.length, socket, roomId])

    // Clear all strokes
    const clearCanvas = useCallback(() => {
        if (!isDrawer) return

        console.log('Clearing canvas')
        setStrokes([])

        if (socket) {
            socket.emit('clearCanvas', { roomId })
        }
    }, [isDrawer, socket, roomId])

    // Receive strokes from other players
    const addReceivedStroke = useCallback((stroke) => {
        console.log('Received stroke from server:', stroke)
        setStrokes(prev => [...prev, stroke])
    }, [])

    // Handle undo from server
    const handleRemoteUndo = useCallback(() => {
        console.log('Received undo from server')
        setStrokes(prev => prev.slice(0, -1))
    }, [])

    // Handle clear from server
    const handleRemoteClear = useCallback(() => {
        console.log('Received clear from server')
        setStrokes([])
    }, [])

    // Load initial canvas state
    const loadCanvasState = useCallback((initialStrokes) => {
        console.log('Loading canvas state:', initialStrokes)
        setStrokes(initialStrokes)
    }, [])

    return {
        canvasRef,
        strokes,
        isDrawing,
        startDrawing,
        continueDrawing,
        stopDrawing,
        undoStroke,
        clearCanvas,
        addReceivedStroke,
        handleRemoteUndo,
        handleRemoteClear,
        loadCanvasState,
    }
}
