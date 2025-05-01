import React, { useState } from 'react';
import { analyzeMathProblem } from '../services/AIService';
//import { LatexRenderer } from './LatexRenderer';

export const AIAssistant: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    try {
      let response = await analyzeMathProblem(`Convert this to LaTeX and explain: ${question}`);
      
      // Post-traitement pour améliorer le LaTeX
      response = response
        .replace(/\bsqrt\b/g, '\\sqrt')
        .replace(/\^(\w)/g, '^{$1}')
        .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');
      
      setAnswer(response);
    } catch (error) {
      setAnswer("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Posez une question mathématique..."
          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
        />
        <button
          onClick={handleAsk}
          disabled={isLoading}
          className={`px-4 py-2 rounded text-white ${
            isLoading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? '...' : 'Go'}
        </button>
      </div>

      {answer && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Réponse :</h3>
          <div className="space-y-2">
            {answer.split('\n').map((paragraph, i) => (
              <LatexRenderer 
                key={i} 
                content={paragraph} 
                displayMode={paragraph.includes('=') || paragraph.includes('\\')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};