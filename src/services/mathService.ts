import * as math from 'mathjs';
import { Solution, SolutionStep } from '../types';

// Simulates a delay to mimic API call
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const solveMathProblem = async (expression: string): Promise<Solution> => {
  await simulateDelay(800);

  if (!expression.trim()) {
    return errorSolution('Please enter a valid expression');
  }

  const isEquation = expression.includes('=');

  return isEquation
    ? solveEquation(expression)
    : evaluateExpression(expression);
};

const evaluateExpression = (expression: string): Solution => {
  try {
    const result = math.evaluate(expression);
    const resultLatex = math.parse(result.toString()).toTex();

    const steps: SolutionStep[] = [
      {
        explanation: 'Original expression',
        expression: math.parse(expression).toTex()
      },
      {
        explanation: 'Simplified result',
        expression: `= ${resultLatex}`
      }
    ];

    return {
      steps,
      result: resultLatex,
      isLoading: false
    };
  } catch (error) {
    return errorSolution(`Error evaluating expression: ${(error as Error).message}`);
  }
};

const solveEquation = (equation: string): Solution => {
  try {
    const [left, right] = equation.split('=').map(side => side.trim());

    if (!left || !right) {
      return errorSolution('Invalid equation format.');
    }

    const leftExpr = math.parse(left);
    const rightExpr = math.parse(right);

    const standardForm = new math.OperatorNode('-', 'subtract', [leftExpr, rightExpr]);
    const simplified = math.simplify(standardForm);

    const simplifiedTex = simplified.toTex();
    const variables = extractVariables(equation);

    if (variables.length === 0) {
      return errorSolution('No variable found in the equation');
    } else if (variables.length > 1) {
      return errorSolution('Only single-variable equations are supported');
    }

    const variable = variables[0];
    const polyCoeffs = getPolynomialCoefficients(simplified, variable);

    if (!polyCoeffs) {
      return errorSolution('Unable to extract polynomial coefficients');
    }

    const roots = math.roots(polyCoeffs);

    const resultTex = roots.map((r, i) => `${variable}_{${i + 1}} = ${math.parse(r.toString()).toTex()}`).join(', ');

    const steps: SolutionStep[] = [
      {
        explanation: 'Original equation',
        expression: `${leftExpr.toTex()} = ${rightExpr.toTex()}`
      },
      {
        explanation: 'Rewritten in standard form',
        expression: `${simplifiedTex} = 0`
      },
      {
        explanation: `Solving for ${variable}`,
        expression: resultTex
      }
    ];

    return {
      steps,
      result: resultTex,
      isLoading: false
    };
  } catch (error) {
    return errorSolution(`Error solving equation: ${(error as Error).message}`);
  }
};

const extractVariables = (expression: string): string[] => {
  const regex = /[a-zA-Z]/g;
  const matches = expression.match(regex);
  return matches ? [...new Set(matches)] : [];
};

// Try to get polynomial coefficients from an expression in one variable
const getPolynomialCoefficients = (expr: math.MathNode, variable: string): number[] | null => {
  try {
    const poly = math.polynomialCoefficients(expr, variable);
    return poly;
  } catch (error) {
    return null;
  }
};

const errorSolution = (message: string): Solution => ({
  steps: [],
  result: '',
  isLoading: false,
  error: message
});

export const generateGraphData = (expression: string) => {
  try {
    return {
      fn: expression,
      color: '#2563EB'
    };
  } catch (error) {
    console.error('Error generating graph data:', error);
    return null;
  }
};
