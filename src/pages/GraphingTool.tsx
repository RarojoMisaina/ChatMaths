import React, { useState } from 'react';
import MathInput from '../components/MathInput';
import Graph from '../components/Graph';
import { GraphOptions, MathProblem } from '../types';
import { saveToHistory } from '../services/historyService';
import { v4 as uuidv4 } from '../utils/uuid';
import { Sliders, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GraphingTool: React.FC = () => {
  const [expressions, setExpressions] = useState<string[]>([]);
  const [currentExpression, setCurrentExpression] = useState<string>('');
  const [options, setOptions] = useState<GraphOptions>({
    xRange: [-10, 10],
    yRange: [-10, 10],
    grid: true,
    showPoints: false
  });
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const handleAddExpression = (expression: string) => {
    if (!expression.trim() || expressions.includes(expression)) return;
    
    const formattedExpression = expression.trim().toLowerCase();
    const finalExpression = formattedExpression.startsWith('y=') || formattedExpression.startsWith('y =') 
      ? formattedExpression
      : `y = ${formattedExpression}`;
    
    const newExpressions = [...expressions, finalExpression];
    setExpressions(newExpressions);
    setCurrentExpression('');
    
    const problem: MathProblem = {
      id: uuidv4(),
      expression: finalExpression,
      type: 'graph',
      timestamp: Date.now()
    };
    saveToHistory(problem);
  };

  const handleRemoveExpression = (index: number) => {
    const newExpressions = expressions.filter((_, i) => i !== index);
    setExpressions(newExpressions);
  };

  const handleClearAll = () => {
    setExpressions([]);
  };

  const handleRangeChange = (axis: 'x' | 'y', index: 0 | 1, value: number) => {
    setOptions(prev => ({
      ...prev,
      [`${axis}Range`]: axis === 'x' 
        ? index === 0 
          ? [value, prev.xRange[1]] 
          : [prev.xRange[0], value]
        : index === 0 
          ? [value, prev.yRange[1]] 
          : [prev.yRange[0], value]
    }));
  };
  // Remplacer dans les deux fichiers
const mathBackgroundStyle = {
  background: `
    linear-gradient(to bottom right,rgb(135, 188, 241),rgb(64, 187, 166)),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
rgb(188, 124, 231) 10px,
rgb(221, 158, 195) 20px
    )
  `,
  backgroundBlendMode: 'overlay'
};

<div className="min-h-screen" style={mathBackgroundStyle}></div>

  return (
    <div 
      className="w-full max-w-3xl mx-auto p-4 min-h-screen"
      style={{
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Mathematical Graphing Tool
        </h1>
        
        <div className="mb-6">
          <MathInput 
            onSubmit={handleAddExpression}
            placeholder="Enter a function to graph (e.g:, x^2, sin(x))"
            initialValue={currentExpression}
          />
        </div>

        <AnimatePresence>
          {expressions.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Functions</h3>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowOptions(!showOptions)}
                    className="text-sm flex items-center px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-blue-600 hover:text-blue-800 border border-blue-100"
                  >
                    <Sliders size={16} className="mr-1" />
                    {showOptions ? 'Hide Options' : 'Show Options'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearAll}
                    className="text-sm flex items-center px-3 py-1 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg text-red-600 hover:text-red-800 border border-red-100"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Clear All
                  </motion.button>
                </div>
              </div>

              <motion.div 
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                <div className="divide-y divide-gray-100">
                  {expressions.map((expr, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <motion.div 
                          className="w-4 h-4 rounded-full mr-3 shadow-sm"
                          style={{ backgroundColor: getColor(index) }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        />
                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {expr}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveExpression(index)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        aria-label="Remove function"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg mb-4 border border-gray-200 shadow-inner"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Plus className="mx-auto mb-3 text-blue-400" size={28} />
              </motion.div>
              <p className="text-gray-700 font-medium">Add a function to see its graph</p>
              <p className="text-sm text-gray-600 mt-2 font-mono">
                Try: x^2, sin(x), or 2*x+1
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showOptions && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Sliders className="mr-2 text-purple-600" size={18} />
                Graph Options
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">X-Axis Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={options.xRange[0]}
                      onChange={(e) => handleRangeChange('x', 0, parseInt(e.target.value))}
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <span className="text-gray-500 font-mono">→</span>
                    <input
                      type="number"
                      value={options.xRange[1]}
                      onChange={(e) => handleRangeChange('x', 1, parseInt(e.target.value))}
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Y-Axis Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={options.yRange[0]}
                      onChange={(e) => handleRangeChange('y', 0, parseInt(e.target.value))}
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <span className="text-gray-500 font-mono">→</span>
                    <input
                      type="number"
                      value={options.yRange[1]}
                      onChange={(e) => handleRangeChange('y', 1, parseInt(e.target.value))}
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <motion.label 
                  className="flex items-center cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={options.grid}
                      onChange={(e) => setOptions({...options, grid: e.target.checked})}
                      className="sr-only"
                    />
                    <div className={`block w-10 h-6 rounded-full ${options.grid ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div 
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${options.grid ? 'transform translate-x-4' : ''}`}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">Show grid</span>
                </motion.label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {expressions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-white p-4 rounded-xl border border-gray-200 shadow-lg"
          >
            <Graph 
              expressions={expressions} 
              options={options}
              className="w-full h-96"
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const getColor = (index: number): string => {
  const colors = [
    '#3B82F6', // blue-500
    '#8B5CF6', // violet-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#EC4899', // pink-500
    '#14B8A6', // teal-500
    '#F97316'  // orange-500
  ];
  return colors[index % colors.length];
};

export default GraphingTool;