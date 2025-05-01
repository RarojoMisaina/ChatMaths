import React, { useState, KeyboardEvent, useRef } from 'react';
import { Send } from 'lucide-react';
import MathKeyboard from './MathKeyboard';
import MathRenderer from './MathRenderer';

interface MathInputProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
  initialValue?: string;
  isLoading?: boolean;
}

const MathInput: React.FC<MathInputProps> = ({
  onSubmit,
  placeholder = 'Enter a math problem (e.g., 2x + 3 = 7)',
  initialValue = '',
  isLoading = false
}) => {
  const [value, setValue] = useState(initialValue);
  const [useLatexInput, setUseLatexInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSymbolClick = (symbol: string) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue = value.substring(0, start) + symbol + value.substring(end);
      setValue(newValue);

      const newCursorPos = start + symbol.length;
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  return (
    <div className="w-full relative space-y-2">
      <div className="flex justify-between mb-2 items-center">
        <label className="text-sm text-gray-600">
          <input
            type="checkbox"
            checked={useLatexInput}
            onChange={(e) => setUseLatexInput(e.target.checked)}
            className="mr-2"
          />
          Use LaTeX input
        </label>
      </div>

      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 border rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          className="absolute right-2 p-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          aria-label="Submit"
        >
          <Send size={20} />
        </button>
      </div>

      {useLatexInput && value && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Preview:</p>
          <div className="border rounded p-2 bg-gray-50">
            <MathRenderer math={value} display="block" />
          </div>
        </div>
      )}

      <MathKeyboard onSymbolClick={handleSymbolClick} />

      <p className="text-xs text-gray-500">
        Tip: Use symbols like +, -, *, /, ^, = and click the symbols above for special mathematical notation
      </p>
    </div>
  );
};

export default MathInput;