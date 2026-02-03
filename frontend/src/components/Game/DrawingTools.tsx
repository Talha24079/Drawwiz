import React, { useState } from 'react';

interface DrawingToolsProps {
  currentColor: string;
  currentWidth: number;
  currentTool: 'pen' | 'fill';
  onColorChange: (color: string) => void;
  onWidthChange: (width: number) => void;
  onToolChange: (tool: 'pen' | 'fill') => void;
}

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00',
  '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FF8800', '#8800FF', '#00FF88', '#FF0088',
  '#88FF00', '#0088FF', '#888888', '#FF8888'
];

const PEN_SIZES = [2, 5, 10, 15, 20];

export function DrawingTools({
  currentColor,
  currentWidth,
  currentTool,
  onColorChange,
  onWidthChange,
  onToolChange
}: DrawingToolsProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Tools</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onToolChange('pen')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              currentTool === 'pen'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pen
          </button>
          <button
            onClick={() => onToolChange('fill')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              currentTool === 'fill'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Fill
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Pen Size</h3>
        <div className="flex gap-2 justify-between">
          {PEN_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onWidthChange(size)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                currentWidth === size
                  ? 'bg-blue-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <div
                className={`rounded-full ${
                  currentWidth === size ? 'bg-white' : 'bg-gray-700'
                }`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Colors</h3>
        <div className="grid grid-cols-8 gap-2 mb-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                currentColor === color
                  ? 'border-blue-600 scale-110'
                  : 'border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm"
        >
          Custom Color
        </button>

        {showColorPicker && (
          <div className="mt-2 p-3 bg-gray-100 rounded-lg">
            <div className="flex gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <button
                onClick={() => {
                  onColorChange(customColor);
                  setShowColorPicker(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current:</span>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg border-2 border-gray-300"
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-sm font-semibold text-gray-700">
              {currentWidth}px
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
