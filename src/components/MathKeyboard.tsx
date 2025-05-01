import React from 'react';
//import { Button } from './Button';

interface MathKeyboardProps {
  onSymbolClick: (symbol: string) => void;
}

const MathKeyboard: React.FC<MathKeyboardProps> = ({ onSymbolClick }) => {
  const symbols = [
    { label: '√', value: '\\sqrt{}' },
    { label: '²', value: '^2' },
    { label: 'ⁿ', value: '^{}' },
    { label: '∫', value: '\\int' },
    { label: '∑', value: '\\sum' },
    { label: '±', value: '\\pm' },
    { label: '×', value: '\\times' },
    { label: '÷', value: '\\div' },
    { label: '≠', value: '\\neq' },
    { label: '≤', value: '\\leq' },
    { label: '≥', value: '\\geq' },
    { label: 'π', value: '\\pi' },
    { label: '∞', value: '\\infty' },
    { label: '∂', value: '\\partial' },
    { label: 'θ', value: '\\theta' }
  ];

  return (
    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-5 gap-1">
        {symbols.map((symbol) => (
          <button
            key={symbol.value}
            onClick={() => onSymbolClick(symbol.value)}
            className="p-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 rounded transition-colors"
            aria-label={`Insert ${symbol.label}`}
          >
            {symbol.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MathKeyboard;