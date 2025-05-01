import React, { useState, useEffect } from 'react';
import { Calculator, LineChart, History, X } from 'lucide-react';
import TabNavigation from './components/TabNavigation';
import EquationSolver from './pages/EquationSolver';
import GraphingTool from './pages/GraphingTool';
import HistoryPanel from './components/HistoryPanel';
import { getHistory, clearHistory, removeFromHistory } from './services/historyService';
import { HistoryItem } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<string>('solver');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Tabs configuration
  const tabs = [
    { id: 'solver', label: 'Equation Solver', icon: <Calculator size={20} /> },
    { id: 'grapher', label: 'Graphing Tool', icon: <LineChart size={20} /> }
  ];

  // History panel handlers
  const handleHistoryUpdate = () => {
    setHistory(getHistory());
  };

  const handleClearHistory = () => {
    clearHistory();
    handleHistoryUpdate();
  };

  const handleRemoveHistoryItem = (id: string) => {
    removeFromHistory(id);
    handleHistoryUpdate();
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    // Set the appropriate tab based on the item type
    setActiveTab(item.type === 'equation' ? 'solver' : 'grapher');
    // TODO: Load the selected item into the current tool
    setShowHistory(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calculator className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-gray-800">MathSolver</h1>
            </div>
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`
                p-2 rounded-md transition-colors flex items-center 
                ${showHistory ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}
              `}
              aria-label="Toggle history"
            >
              <History size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex">
        {/* Content panel */}
        <div className="flex-grow">
          <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
            {/* Tab navigation */}
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            
            {/* Tab content */}
            <div className="mt-4">
              {activeTab === 'solver' && <EquationSolver />}
              {activeTab === 'grapher' && <GraphingTool />}
            </div>
          </div>
        </div>
        
        {/* History sidebar */}
        <div 
          className={`
            fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-10
            ${showHistory ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-medium text-gray-800">History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
                aria-label="Close history"
              >
                <X size={25} />
              </button>
            </div>
            
            <div className="flex-grow overflow-hidden">
              <HistoryPanel
                history={history}
                onSelect={handleSelectHistoryItem}
                onClear={handleClearHistory}
                onRemove={handleRemoveHistoryItem}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-gray-500 text-sm">
          <p>MathSolver &copy; {new Date().getFullYear()} - Mention IA</p>
        </div>
      </footer>
    </div>
  );
}

export default App;