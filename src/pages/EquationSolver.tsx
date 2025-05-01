import React, { useState } from 'react';
import MathInput from '../components/MathInput';
import SolutionDisplay from '../components/SolutionDisplay';
import { Solution, MathProblem } from '../types';
import { solveMathProblem } from '../services/mathService';
import { saveToHistory } from '../services/historyService';
import { v4 as uuidv4 } from '../utils/uuid';
import MathRenderer from '../components/MathRenderer';

const EquationSolver: React.FC = () => {
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>('');

  const handleSolve = async (expr: string) => {
    setExpression(expr);
    setIsLoading(true);
    setSolution({ steps: [], result: '', isLoading: true });

    try {
      const problem: MathProblem = {
        id: uuidv4(),
        expression: expr,
        type: 'equation',
        timestamp: Date.now()
      };

      const result = await solveMathProblem(expr);
      setSolution(result);

      if (!result.error) {
        saveToHistory(problem, result.result);
      }
    } catch (error) {
      setSolution({
        steps: [],
        result: '',
        isLoading: false,
        error: `Unexpected error: ${(error as Error).message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <MathInput
          onSubmit={handleSolve}
          isLoading={isLoading}
          placeholder="Enter an equation (e.g., x^2 - 4 = 0)"
        />
      </div>

      {/* Résumé de l'équation entrée */}
      {expression && !isLoading && (
        <div className="mb-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
          <h3 className="text-md font-semibold text-gray-700 mb-2">You entered:</h3>
          <MathRenderer math={expression} display="block" />
        </div>
      )}

      {/* Affichage du résultat et étapes */}
      <SolutionDisplay solution={solution} />
    </div>
  );
};

export default EquationSolver;
