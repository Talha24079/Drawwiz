import { useEffect, useState } from 'react'
import { useDrawing } from '../hooks/useDrawing'
import { redrawAllStrokes } from '../utils/canvasRenderer'

function Canvas({ socket, roomId, isDrawer }) {
    const [color, setColor] = useState('#000000')
    const [thickness, setThickness] = useState(5)

    const {
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
    } = useDrawing({ socket, roomId, isDrawer })

    // Initialize canvas when component mounts
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        // Initialize canvas dimensions
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        console.log('Canvas initialized:', canvas.width, 'x', canvas.height)

        // Load saved strokes from localStorage
        const savedStrokes = localStorage.getItem(`canvas_${roomId}`)
        if (savedStrokes) {
            try {
                const parsedStrokes = JSON.parse(savedStrokes)
                console.log('Loading saved strokes from localStorage:', parsedStrokes.length)
                loadCanvasState(parsedStrokes)
            } catch (error) {
                console.error('Error loading saved strokes:', error)
            }
        }
    }, [roomId, loadCanvasState])

    // Redraw canvas whenever strokes change
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        console.log('Redrawing canvas with', strokes.length, 'strokes')
        redrawAllStrokes(canvas, strokes)
    }, [strokes])

    // Save strokes to localStorage whenever they change
    useEffect(() => {
        if (strokes.length > 0) {
            localStorage.setItem(`canvas_${roomId}`, JSON.stringify(strokes))
            console.log('Saved', strokes.length, 'strokes to localStorage')
        } else {
            // Clear localStorage if canvas is empty
            localStorage.removeItem(`canvas_${roomId}`)
            console.log('Cleared localStorage for canvas')
        }
    }, [strokes, roomId])

    // Listen for socket events
    useEffect(() => {
        if (!socket) return

        console.log('Setting up socket listeners for canvas')

        socket.on('draw', ({ stroke }) => {
            console.log('Received draw event:', stroke)
            addReceivedStroke(stroke)
        })

        socket.on('undo', () => {
            handleRemoteUndo()
        })

        socket.on('clearCanvas', () => {
            handleRemoteClear()
        })

        socket.on('canvasState', ({ strokes: initialStrokes }) => {
            loadCanvasState(initialStrokes)
        })

        return () => {
            console.log('Cleaning up socket listeners')
            socket.off('draw')
            socket.off('undo')
            socket.off('clearCanvas')
            socket.off('canvasState')
        }
    }, [socket, addReceivedStroke, handleRemoteUndo, handleRemoteClear, loadCanvasState])

    const colors = [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00',
        '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
        '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    ]

    console.log('Canvas render:', { isDrawer, isDrawing, strokeCount: strokes.length })

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar - Only show for drawer */}
            {isDrawer && (
                <div className="card p-4">
                    {/* Color Palette */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                            Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => {
                                        console.log('Color selected:', c)
                                        setColor(c)
                                    }}
                                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${color === c ? 'border-primary-500 scale-110' : 'border-dark-300'
                                        }`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Brush Thickness */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                            Thickness: {thickness}px
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={thickness}
                            onChange={(e) => {
                                const newThickness = Number(e.target.value)
                                console.log('Thickness changed:', newThickness)
                                setThickness(newThickness)
                            }}
                            className="w-full"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                console.log('Undo clicked')
                                undoStroke()
                            }}
                            className="btn-secondary flex-1 text-sm py-2"
                        >
                            ↶ Undo
                        </button>
                        <button
                            onClick={() => {
                                console.log('Clear clicked')
                                clearCanvas()
                            }}
                            className="btn-secondary flex-1 text-sm py-2"
                        >
                            🗑️ Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Canvas */}
            <div className="card p-2 overflow-hidden">
                <canvas
                    ref={canvasRef}
                    onMouseDown={(e) => startDrawing(e, color, thickness)}
                    onMouseMove={continueDrawing}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={(e) => startDrawing(e, color, thickness)}
                    onTouchMove={continueDrawing}
                    onTouchEnd={stopDrawing}
                    className={`w-full bg-white rounded-lg ${isDrawer ? 'cursor-crosshair' : 'cursor-not-allowed'
                        }`}
                    style={{ aspectRatio: '4/3', maxHeight: '600px' }}
                />
            </div>

            {/* Info Text */}
            {!isDrawer && (
                <div className="text-center text-gray-600 text-sm">
                    Watch and guess what is being drawn!
                </div>
            )}

            {isDrawer && (
                <div className="text-center text-primary-600 text-sm font-semibold">
                    🎨 You are drawing! Click and drag to draw.
                </div>
            )}
        </div>
    )
}

export default Canvas
