/**
 * Canvas renderer utility
 * Handles drawing strokes on the canvas element
 */

export function drawStroke(ctx, stroke) {
    if (!stroke || !stroke.points || stroke.points.length === 0) {
        console.warn('Invalid stroke:', stroke)
        return
    }

    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.thickness
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y)

    for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
    }

    ctx.stroke()
}

export function clearCanvasElement(canvas) {
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

export function initializeCanvas(canvas) {
    if (!canvas) return null

    // Set canvas size to match display size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear with white background
    clearCanvasElement(canvas)

    return canvas.getContext('2d')
}

export function redrawAllStrokes(canvas, strokes) {
    if (!canvas) return

    const ctx = initializeCanvas(canvas)
    if (!ctx) return

    console.log(`Redrawing ${strokes.length} strokes`)
    strokes.forEach(stroke => drawStroke(ctx, stroke))
}
