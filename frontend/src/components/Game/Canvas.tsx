import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Socket } from 'socket.io-client';

interface CanvasProps {
  socket: Socket | null;
  roomCode: string;
  isDrawing: boolean;
  currentColor: string;
  currentWidth: number;
  currentTool: 'pen' | 'fill';
  onUndo: () => void;
  onRedo: () => void;
}

export function Canvas({
  socket,
  roomCode,
  isDrawing,
  currentColor,
  currentWidth,
  currentTool,
  onUndo,
  onRedo
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false,
      width: 800,
      height: 600,
      backgroundColor: '#ffffff'
    });

    fabricCanvasRef.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = isDrawing && currentTool === 'pen';

    if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = currentColor;
      canvas.freeDrawingBrush.width = currentWidth;
    }
  }, [isDrawing, currentColor, currentWidth, currentTool]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !socket) return;

    const handlePathCreated = (e: any) => {
      if (!isDrawing) return;

      const path = e.path;
      const pathData = {
        type: path.type,
        path: path.path,
        stroke: path.stroke,
        strokeWidth: path.strokeWidth,
        fill: path.fill
      };

      socket.emit('draw-stroke', {
        roomCode,
        strokeData: pathData
      });

      saveState();
    };

    const handleMouseDown = (e: any) => {
      if (!isDrawing || currentTool !== 'fill') return;

      const pointer = canvas.getPointer(e.e);
      socket.emit('draw-fill', {
        roomCode,
        fillData: {
          x: pointer.x,
          y: pointer.y,
          color: currentColor
        }
      });

      floodFill(pointer.x, pointer.y, currentColor);
      saveState();
    };

    canvas.on('path:created', handlePathCreated);
    canvas.on('mouse:down', handleMouseDown);

    return () => {
      canvas.off('path:created', handlePathCreated);
      canvas.off('mouse:down', handleMouseDown);
    };
  }, [socket, roomCode, isDrawing, currentTool, currentColor]);

  useEffect(() => {
    if (!socket) return;

    const handleDrawingUpdate = ({ type, data }: any) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      if (type === 'stroke') {
        fabric.Path.fromObject(data, (path: any) => {
          canvas.add(path);
          canvas.renderAll();
        });
      } else if (type === 'fill') {
        floodFill(data.x, data.y, data.color);
      } else if (type === 'clear') {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
      } else if (type === 'undo') {
        performUndo();
      } else if (type === 'redo') {
        performRedo();
      }
    };

    socket.on('drawing-update', handleDrawingUpdate);

    return () => {
      socket.off('drawing-update', handleDrawingUpdate);
    };
  }, [socket]);

  const saveState = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const state = JSON.stringify(canvas.toJSON());
    setUndoStack(prev => {
      const newStack = [...prev, state];
      return newStack.slice(-50); // Keep last 50 actions
    });
    setRedoStack([]);
  };

  const performUndo = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || undoStack.length === 0) return;

    const currentState = JSON.stringify(canvas.toJSON());
    const previousState = undoStack[undoStack.length - 1];

    setRedoStack(prev => [...prev, currentState]);
    setUndoStack(prev => prev.slice(0, -1));

    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll();
    });
  };

  const performRedo = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || redoStack.length === 0) return;

    const currentState = JSON.stringify(canvas.toJSON());
    const nextState = redoStack[redoStack.length - 1];

    setUndoStack(prev => [...prev, currentState]);
    setRedoStack(prev => prev.slice(0, -1));

    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
    });
  };

  const floodFill = (x: number, y: number, fillColor: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Simple implementation - just create a rectangle
    // A full flood fill would require pixel manipulation
    const rect = new fabric.Rect({
      left: x - 10,
      top: y - 10,
      width: 20,
      height: 20,
      fill: fillColor
    });

    canvas.add(rect);
    canvas.renderAll();
  };

  const handleClear = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !socket || !isDrawing) return;

    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();

    socket.emit('draw-clear', { roomCode });
    setUndoStack([]);
    setRedoStack([]);
  };

  const handleUndoClick = () => {
    if (!socket || !isDrawing) return;

    performUndo();
    socket.emit('draw-undo', { roomCode });
  };

  const handleRedoClick = () => {
    if (!socket || !isDrawing) return;

    performRedo();
    socket.emit('draw-redo', { roomCode });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="border-4 border-gray-300 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>

      {isDrawing && (
        <div className="flex gap-2 mt-4 justify-center">
          <button
            onClick={handleUndoClick}
            disabled={undoStack.length === 0}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            Undo
          </button>
          <button
            onClick={handleRedoClick}
            disabled={redoStack.length === 0}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            Redo
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
