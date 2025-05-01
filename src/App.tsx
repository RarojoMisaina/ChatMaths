import React, { useState, useEffect } from 'react';
import { Calculator, LineChart, History, X } from 'lucide-react';
import TabNavigation from './components/TabNavigation';
import EquationSolver from './pages/EquationSolver';
import GraphingTool from './pages/GraphingTool';
import HistoryPanel from './components/HistoryPanel';
import { getHistory, clearHistory, removeFromHistory } from './services/historyService';
import { HistoryItem } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('solver');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const tabs = [
    { id: 'solver', label: 'Equation Solver', icon: <Calculator size={20} /> },
    { id: 'grapher', label: 'Graphing Tool', icon: <LineChart size={20} /> }
  ];

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
    setActiveTab(item.type === 'equation' ? 'solver' : 'grapher');
    setShowHistory(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Neuronal Network Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <svg 
          width="100%" 
          height="100%" 
          xmlns="http://www.w3.org/2000/svg"
          className="animate-pulse"
        >
          <defs>
            <pattern 
              id="network" 
              width="120" 
              height="120" 
              patternUnits="userSpaceOnUse"
            >
              {/* Neurons (circles) */}
              <circle cx="20" cy="20" r="3" fill="currentColor" className="text-blue-400">
                <animate attributeName="r" values="3;5;3" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="60" cy="40" r="3" fill="currentColor" className="text-purple-400">
                <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="20" r="3" fill="currentColor" className="text-indigo-400">
                <animate attributeName="r" values="3;5;3" dur="5s" repeatCount="indefinite" />
              </circle>
              <circle cx="40" cy="80" r="3" fill="currentColor" className="text-pink-400">
                <animate attributeName="r" values="3;5;3" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="80" cy="100" r="3" fill="currentColor" className="text-teal-400">
                <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Connections (lines) */}
              <line x1="20" y1="20" x2="60" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-blue-200">
                <animate attributeName="stroke-width" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
              </line>
              <line x1="60" y1="40" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-purple-200">
                <animate attributeName="stroke-width" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
              </line>
              <line x1="20" y1="20" x2="40" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-indigo-200">
                <animate attributeName="stroke-width" values="0.5;1;0.5" dur="5s" repeatCount="indefinite" />
              </line>
              <line x1="40" y1="80" x2="80" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-pink-200">
                <animate attributeName="stroke-width" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
              </line>
              <line x1="80" y1="100" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-teal-200">
                <animate attributeName="stroke-width" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
              </line>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-sm shadow-sm"
        >
          <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6">
            <div className="flex justify-between items-center">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
              >
                <Calculator className="text-blue-600" size={24} />
                <h1 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MathSolver AI
                </h1>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHistory(!showHistory)}
                className={`
                  p-2 rounded-md transition-all flex items-center
                  ${showHistory ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-600 hover:bg-gray-100'}
                `}
                aria-label="Toggle history"
              >
                <History size={20} />
              </motion.button>
            </div>
          </div>
        </motion.header>

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
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'solver' && <EquationSolver />}
                    {activeTab === 'grapher' && <GraphingTool />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* History sidebar */}
          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 right-0 w-64 bg-white/95 backdrop-blur-sm shadow-lg z-10"
              >
                <div className="h-full flex flex-col border-l border-gray-200">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50">
                    <h2 className="font-semibold text-gray-800">History</h2>
                    <motion.button
                      whileHover={{ rotate: 90, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowHistory(false)}
                      className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
                      aria-label="Close history"
                    >
                      <X size={25} />
                    </motion.button>
                  </div>
                  
                  <div className="flex-grow overflow-hidden">
                    <HistoryPanel
                      history={history}
                      onSelect={handleSelectHistoryItem}
                      onClear={handleClearHistory}
                      onRemove={handleRemoveHistoryItem}
                    />
                  </div>

                  <motion.div 
                    className="p-3 border-t border-gray-200 bg-gray-50"
                    whileHover={{ scale: 1.01 }}
                  >
                    <button
                      onClick={handleClearHistory}
                      className="w-full py-2 px-4 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 rounded-md border border-red-100 flex items-center justify-center space-x-2 hover:shadow-sm transition-all"
                    >
                      <X size={16} />
                      <span>Clear All History</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer
      className="bg-white/90 backdrop-blur-sm border-t border-gray-200 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-gray-500 text-sm">
        <p className="mb-4">Mention AI-ENI &copy; {new Date().getFullYear()} - By Rojo*Rado*Manda*Naval</p>
        
        <div className="mb-4">
          <p className="text-lg text-gray-700 font-semibold">À propos</p>
          <p className="text-sm">Un projet dédié à l’intelligence artificielle et la résolution mathématique, visant à améliorer les méthodes d'enseignement.</p>
        </div>

        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://facebook.com/misaina.rarojo" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com/raojomisaina" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400">
            <FaTwitter size={24} />
          </a>
          <a href="https://linkedin.com/in/rarojo%20misaina" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700">
            <FaLinkedin size={24} />
          </a>
          <a href="mailto:rojo075tah@gmail.com" className="text-gray-500 hover:text-gray-800">
            <FaEnvelope size={24} />
          </a>
        </div>
        <div className="mb-4">
          <p className="text-sm">Développé avec passion par Mr ROJO</p>
        </div>
        <div>
          <p className="text-xs">
            Pour plus d’informations, contactez-nous à <a href="mailto:rojo075tah@gmail.com" className="text-blue-600">Notre Email</a>
          </p>
        </div>
      </div>
    </motion.footer>
      </div>
    </div>
  );
};

export default App;