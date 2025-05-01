import React, { useState } from 'react';
import { Solution } from '../types';
import MathRenderer from './MathRenderer';
import { Clock, AlertCircle, ChevronDown, ChevronUp, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface SolutionDisplayProps {
  solution: Solution | null;
}

const MAX_VISIBLE_STEPS = 3;

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution }) => {
  const [showAllSteps, setShowAllSteps] = useState(false);

  const handleExportPDF = () => {
    const element = document.getElementById('solution-content');
    if (!element) return;

    html2pdf()
      .set({
        margin: 0.5,
        filename: 'solution.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save();
  };

  if (!solution) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p>Enter a math problem above to see the solution</p>
      </div>
    );
  }

  if (solution.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 flex items-center">
          <Clock className="mr-2" size={16} />
          Solving your problem...
        </p>
      </div>
    );
  }

  if (solution.error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-4">
        <div className="flex items-start">
          <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <h3 className="text-red-800 font-medium">Unable to solve problem</h3>
            <p className="text-red-700 text-sm mt-1">{solution.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const visibleSteps = showAllSteps
    ? solution.steps
    : solution.steps.slice(0, MAX_VISIBLE_STEPS);

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      {!solution.error && (
        <div className="flex justify-end mb-3">
          <button
            onClick={handleExportPDF}
            className="text-sm flex items-center text-green-600 hover:text-green-800"
          >
            <Download size={16} className="mr-1" /> Export as PDF
          </button>
        </div>
      )}

      <div id="solution-content">
        {solution.result && (
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Result</h3>
            <div className="bg-blue-50 p-3 rounded-md overflow-x-auto">
              <MathRenderer math={solution.result} display="block" />
            </div>
          </div>
        )}

        {solution.steps.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Step-by-step solution</h3>
            <div className="space-y-4">
              {visibleSteps.map((step, index) => (
                <div
                  key={index}
                  className="p-3 rounded-md transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex items-center mb-1">
                    <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{step.explanation}</p>
                  </div>
                  <div className="pl-8 overflow-x-auto">
                    <MathRenderer math={step.expression} display="block" />
                  </div>
                </div>
              ))}
            </div>

            {solution.steps.length > MAX_VISIBLE_STEPS && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAllSteps(!showAllSteps)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                >
                  {showAllSteps ? (
                    <>
                      <ChevronUp size={16} className="mr-1" /> See less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="mr-1" /> See more
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionDisplay;
