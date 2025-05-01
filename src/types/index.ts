export interface MathProblem {
  id: string;
  expression: string;
  type: 'equation' | 'graph';
  timestamp: number;
}

export interface Solution {
  steps: SolutionStep[];
  result: string;
  isLoading: boolean;
  error?: string;
}

export interface SolutionStep {
  explanation: string;
  expression: string;
}

export interface HistoryItem extends MathProblem {
  result?: string;
}

export interface GraphOptions {
  xRange: [number, number];
  yRange: [number, number];
  grid: boolean;
  showPoints: boolean;
}