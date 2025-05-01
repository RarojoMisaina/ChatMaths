import { HistoryItem, MathProblem } from '../types';

const HISTORY_KEY = 'math_solver_history';

export const saveToHistory = (problem: MathProblem, result?: string): void => {
  const historyItems = getHistory();
  
  // Create history item with result if provided
  const historyItem: HistoryItem = {
    ...problem,
    result
  };
  
  // Add to beginning of history (most recent first)
  historyItems.unshift(historyItem);
  
  // Limit history to 50 items
  const limitedHistory = historyItems.slice(0, 50);
  
  // Save to localStorage
  localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
};

export const getHistory = (): HistoryItem[] => {
  try {
    const historyData = localStorage.getItem(HISTORY_KEY);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    console.error('Error retrieving history:', error);
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

export const removeFromHistory = (id: string): void => {
  const historyItems = getHistory();
  const filteredItems = historyItems.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredItems));
};