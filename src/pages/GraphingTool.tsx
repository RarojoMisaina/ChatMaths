import React, { useState } from 'react';
import MathInput from '../components/MathInput';
import Graph from '../components/Graph';
import { GraphOptions, MathProblem } from '../types';
//import { generateGraphData } from '../services/mathService';
import { saveToHistory } from '../services/historyService';
import { v4 as uuidv4 } from '../utils/uuid';
import { Sliders, Plus, Trash2 } from 'lucide-react';

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
    
    // Format the expression to ensure it's in the form y = f(x)
    const formattedExpression = expression.trim().toLowerCase();
    const finalExpression = formattedExpression.startsWith('y=') || formattedExpression.startsWith('y =') 
      ? formattedExpression
      : `y = ${formattedExpression}`;
    
    const newExpressions = [...expressions, finalExpression];
    setExpressions(newExpressions);
    setCurrentExpression('');
    
    // Save to history
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

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <MathInput 
          onSubmit={handleAddExpression}
          placeholder="Enter a function to graph (e.g:, x^2, sin(x))"
          initialValue={currentExpression}
        />
      </div>

      {expressions.length > 0 ? (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Functions</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="text-xs flex items-center text-gray-600 hover:text-gray-800"
              >
                <Sliders size={20} className="mr-1" />
                {showOptions ? 'Hide Options' : 'Show Options'}
              </button>
              <button
                onClick={handleClearAll}
                className="text-xs flex items-center text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} className="mr-1" />
                Clear All
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {expressions.map((expr, index) => (
                <div key={index} className="p-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: getColor(index) }}
                    ></div>
                    <span className="text-sm">{expr}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveExpression(index)}
                    className="text-gray-400 hover:text-red-600 p-1"
                    aria-label="Remove function"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center bg-gray-50 p-4 rounded-lg mb-4">
          <Plus className="mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-gray-600">Add a function to see its graph</p>
          <p className="text-sm text-gray-500 mt-1">Try: x^2, sin(x), or 2*x+1</p>
        </div>
      )}

      {showOptions && (
        <div className="mb-4 bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Graph Options</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">X-Axis Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={options.xRange[0]}
                  onChange={(e) => handleRangeChange('x', 0, parseInt(e.target.value))}
                  className="w-full p-1 text-sm border rounded"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  value={options.xRange[1]}
                  onChange={(e) => handleRangeChange('x', 1, parseInt(e.target.value))}
                  className="w-full p-1 text-sm border rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Y-Axis Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={options.yRange[0]}
                  onChange={(e) => handleRangeChange('y', 0, parseInt(e.target.value))}
                  className="w-full p-1 text-sm border rounded"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  value={options.yRange[1]}
                  onChange={(e) => handleRangeChange('y', 1, parseInt(e.target.value))}
                  className="w-full p-1 text-sm border rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.grid}
                onChange={(e) => setOptions({...options, grid: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Show grid</span>
            </label>
          </div>
        </div>
      )}

      {expressions.length > 0 && (
        <Graph 
          expressions={expressions} 
          options={options}
          className="mt-4"
        />
      )}
    </div>
  );
};

// Helper function to get colors for each expression
const getColor = (index: number): string => {
  const colors = ['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444'];
  return colors[index % colors.length];
};

export default GraphingTool;