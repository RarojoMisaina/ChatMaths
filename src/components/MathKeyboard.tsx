import React from 'react';
import { motion } from 'framer-motion';
import { Infinity as InfinityIcon, Pi, SquareDot, FunctionSquare, Divide, X, Plus, Minus, Braces, Parentheses, Brackets, Superscript, Subscript } from 'lucide-react';

interface MathKeyboardProps {
  onSymbolClick: (symbol: string) => void;
  onClose?: () => void;

  customStyles?: React.CSSProperties;
}

const MathKeyboard: React.FC<MathKeyboardProps> = ({ onSymbolClick, onClose }) => {
  const categories = [
    {
      name: "Opérations",
      symbols: [
        { label: <Plus size={18} />, value: '+' },
        { label: <Minus size={18} />, value: '-' },
        { label: <X size={18} />, value: '\\times' },
        { label: <Divide size={18} />, value: '\\div' },
        { label: '=', value: '\\eq' },
        { label: '≤', value: '\\leq' },
        { label: '±', value: '\\pm' },
        { label: '≠', value: '\\neq' }
      ]
    },
    {
      name: "Puissances & Indices",
      symbols: [
        { label: <Superscript size={18} />, value: '^2' },
        { label: <Superscript size={18} />, value: '^{}' },
        { label: <Subscript size={18} />, value: '_{}' },
        { label: 'xʸ', value: '^{}' },
        { label: 'x_y', value: '_{}' }
      ]
    },
    {
      name: "Fonctions",
      symbols: [
        { label: <SquareDot size={18} />, value: '\\sqrt{}' },
        { label: <FunctionSquare size={18} />, value: 'f()' },
        { label: 'sin', value: '\\sin()' },
        { label: 'cos', value: '\\cos()' },
        { label: 'tan', value: '\\tan()' },
        { label: 'log', value: '\\log()' },
        { label: 'ln', value: '\\ln()' }
      ]
    },
    {
      name: "Lettres Grecques",
      symbols: [
        { label: 'α', value: '\\alpha' },
        { label: 'β', value: '\\beta' },
        { label: 'γ', value: '\\gamma' },
        { label: 'δ', value: '\\delta' },
        { label: 'θ', value: '\\theta' },
        { label: 'ω', value: '\\omega' },
        { label: <Pi size={18} />, value: '\\pi' }
      ]
    },
    {
      name: "Calcul",
      symbols: [
        { label: '∫', value: '\\int' },
        { label: '∑', value: '\\sum' },
        { label: 'lim', value: '\\lim_{}' },
        { label: '∂', value: '\\partial' },
        { label: '→', value: '\\to' },
        { label: <InfinityIcon size={18} />, value: '\\infty' }
      ]
    },
    {
      name: "Structures",
      symbols: [
        { label: <Parentheses size={18} />, value: '\\left(\\right)' },
        { label: <Brackets size={18} />, value: '\\left[\\right]' },
        { label: <Braces size={18} />, value: '\\left\\{\\right\\}' },
        { label: 'frac', value: '\\frac{}{}' },
        { label: '∣', value: '\\mid' },
        { label: '∴', value: '\\therefore' }
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Math Symbols</h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close keyboard"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-3 max-h-96 overflow-y-auto">
        {categories.map((category) => (
          <div key={category.name} className="mb-4 last:mb-0">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {category.name}
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {category.symbols.map((symbol) => (
                <motion.button
                  key={symbol.value}
                  whileHover={{ scale: 1.1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSymbolClick(symbol.value)}
                  className="p-2 flex items-center justify-center bg-gray-50 hover:bg-blue-50 rounded-lg transition-all border border-gray-100"
                  aria-label={`Insert ${typeof symbol.label === 'string' ? symbol.label : symbol.value}`}
                >
                  <span className="text-gray-700">
                    {symbol.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSymbolClick('\\left(\\right)')}
            className="p-2 bg-white rounded-lg border border-gray-200 flex items-center justify-center"
          >
            <Parentheses size={16} className="mr-1" />
            <span className="text-xs">Parens</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSymbolClick('\\frac{}{}')}
            className="p-2 bg-white rounded-lg border border-gray-200 flex items-center justify-center"
          >
            <span className="text-xs">Fraction</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSymbolClick('\\sqrt{}')}
            className="p-2 bg-white rounded-lg border border-gray-200 flex items-center justify-center"
          >
            <SquareDot size={16} className="mr-1" />
            <span className="text-xs">Root</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MathKeyboard;