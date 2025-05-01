import React, { useState } from 'react';
import MathInput from '../components/MathInput';
import { EquationSolution, solveEquation } from '../services/mathService';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, RotateCw, AlertCircle, CheckCircle, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import MathRenderer from '../components/MathRenderer';

const EquationSolver: React.FC = () => {
  const [solution, setSolution] = useState<EquationSolution | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>('');
  const [systemMode, setSystemMode] = useState<boolean>(false);
  const [equations, setEquations] = useState<string[]>(['', '']);
  const [showSteps, setShowSteps] = useState<boolean>(true);

  const handleSolve = async (expr: string) => {
    setIsLoading(true);
    setSolution(null);
    setExpression(expr);

    try {
      const result = solveEquation(expr);
      setSolution(result);
      
      // Vérification des solutions
      if (result.result && !result.error) {
        verifySolution(expr, result.result);
      }
    } catch (error) {
      setSolution({
        steps: [],
        result: '',
        error: error instanceof Error ? error.message : "Erreur inconnue"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemSolve = async (expr: string, index: number) => {
    const newEquations = [...equations];
    newEquations[index] = expr;
    setEquations(newEquations);

    if (newEquations[0] && newEquations[1]) {
      setIsLoading(true);
      try {
        const result = solveEquation(newEquations);
        setSolution(result);
      } catch (error) {
        setSolution({
          steps: [],
          result: '',
          error: error instanceof Error ? error.message : "Erreur inconnue"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const verifySolution = (equation: string, solution: string) => {
    // Implémentation basique de vérification
    console.log(`Vérification de la solution ${solution} pour l'équation ${equation}`);
    // Ici vous pourriez implémenter une vraie vérification par substitution
  };

  const resetSolver = () => {
    setSolution(null);
    setExpression('');
    setEquations(['', '']);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* En-tête avec basculement de mode */}
      <div className="mb-6 flex justify-between items-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {systemMode ? "Système d'Équations" : "Solveur d'Équations"}
          </h1>
          <p className="text-gray-600">
            {systemMode ? "Résolvez des systèmes linéaires" : "Résolvez des équations algébriques"}
          </p>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetSolver();
            setSystemMode(!systemMode);
          }}
          className={`p-2 rounded-lg flex items-center space-x-2 ${
            systemMode ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          }`}
        >
          {systemMode ? (
            <>
              <ChevronUp size={18} />
              <span>Mode Simple</span>
            </>
          ) : (
            <>
              <ChevronDown size={18} />
              <span>Mode Système</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Saisie des équations */}
      {systemMode ? (
        <div className="space-y-4 mb-6">
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            whileHover={{ y: -2 }}
          >
            <MathInput
              onSubmit={(expr) => handleSystemSolve(expr, 0)}
              isLoading={isLoading}
              placeholder="Première équation (ex: 2x + 3y = 5)"
              initialValue={equations[0]}
            />
          </motion.div>
          
          <div className="flex justify-center">
            <Plus className="text-gray-400" />
          </div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            whileHover={{ y: -2 }}
          >
            <MathInput
              onSubmit={(expr) => handleSystemSolve(expr, 1)}
              isLoading={isLoading}
              placeholder="Deuxième équation (ex: x - y = 1)"
              initialValue={equations[1]}
            />
          </motion.div>
        </div>
      ) : (
        <motion.div 
          className="mb-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          whileHover={{ y: -2 }}
        >
          <MathInput
            onSubmit={handleSolve}
            isLoading={isLoading}
            placeholder="Entrez une équation (ex: 2x + 5 = 13, x^2 -4 = 0)"
            initialValue={expression}
          />
        </motion.div>
      )}

      {/* Indicateur de chargement */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center p-6 mb-6 bg-blue-50 rounded-xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-blue-600"
            >
              <RotateCw size={24} />
            </motion.div>
            <span className="ml-3 text-blue-700 font-medium">
              {systemMode ? "Résolution du système..." : "Résolution de l'équation..."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Affichage des erreurs */}
      <AnimatePresence>
        {solution?.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 shadow-sm"
          >
            <div className="flex items-center text-red-600">
              <AlertCircle className="mr-2" size={20} />
              <h3 className="font-medium">Erreur de résolution</h3>
            </div>
            <p className="mt-2 text-red-700">{solution.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Affichage de l'équation saisie */}
      {expression && !isLoading && !systemMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
              <Calculator className="mr-2 text-blue-600" size={18} />
              Équation à résoudre:
            </h3>
            <div className="p-3 bg-white rounded-lg shadow-inner">
              <MathRenderer math={expression} display="block" className="text-lg" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Affichage du système saisi */}
      {systemMode && equations.every(eq => eq) && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
              <Calculator className="mr-2 text-blue-600" size={18} />
              Système à résoudre:
            </h3>
            <div className="space-y-3">
              {equations.map((eq, index) => (
                <div key={index} className="p-3 bg-white rounded-lg shadow-inner">
                  <MathRenderer math={eq} display="block" className="text-lg" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Affichage du résultat */}
      {solution?.result && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 bg-green-50 rounded-xl border border-green-200 shadow-sm overflow-hidden"
        >
          <div className="p-5 bg-gradient-to-r from-green-50 to-teal-50">
            <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
              <CheckCircle className="mr-2 text-green-600" size={18} />
              Solution:
            </h3>
            <div className="p-3 bg-white rounded-lg shadow-inner">
              <MathRenderer 
                math={solution.result} 
                display="block" 
                className="text-xl font-bold text-green-700" 
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Bouton pour afficher/masquer les étapes */}
      {solution?.steps && solution.steps.length > 0 && (
        <div className="mb-4 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSteps(!showSteps)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center space-x-2"
          >
            <span>{showSteps ? "Masquer les étapes" : "Afficher les étapes"}</span>
            {showSteps ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </motion.button>
        </div>
      )}

      {/* Affichage des étapes */}
      <AnimatePresence>
        {showSteps && solution?.steps && solution.steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700">Étapes de résolution</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {solution.steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      {step.equation && (
                        <div className="p-2 bg-gray-50 rounded-lg mb-2">
                          <MathRenderer math={step.equation} display="block" />
                        </div>
                      )}
                      <p className="text-sm text-gray-600">{step.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EquationSolver;