import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, Calculator, LineChart } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onRemove: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelect,
  onClear,
  onRemove
}) => {
  if (history.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Clock className="mx-auto mb-2" size={24} />
        <p>No history yet</p>
        <p className="text-sm mt-1">Solved problems will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h3 className="text-md font-medium">History</h3>
        <button
          onClick={onClear}
          className="text-xs text-red-600 hover:text-red-800 flex items-center"
        >
          <Trash2 size={14} className="mr-1" />
          Clear All
        </button>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onSelect(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {item.type === 'equation' ? (
                  <Calculator size={16} className="text-blue-600 mr-2" />
                ) : (
                  <LineChart size={16} className="text-purple-600 mr-2" />
                )}
                <div className="truncate max-w-[180px]">
                  <div className="text-sm font-medium truncate">{item.expression}</div>
                  {item.result && (
                    <div className="text-xs text-gray-500 truncate">{item.result}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <div className="text-xs text-gray-400">
                  {formatDate(item.timestamp)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  className="ml-2 text-gray-400 hover:text-red-600 p-1"
                  aria-label="Remove from history"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to format timestamp
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // If it's today, show only time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Otherwise show date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export default HistoryPanel;