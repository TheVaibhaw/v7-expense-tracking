import categoriesData from '@/data/categories.json';
import expensesData from '@/data/expenses.json';
import budgetsData from '@/data/budgets.json';
import type { Category, Expense, Budget } from '@/types';

// In a real app, these functions would fetch data from an API.
// For this demo, they simply return the imported JSON data.

export const getCategories = (): Category[] => {
  return categoriesData as Category[];
};

export const getExpenses = (): Expense[] => {
  return expensesData as Expense[];
};

export const getBudgets = (): Budget[] => {
  return budgetsData as Budget[];
};

// Mock data for monthly spending chart
export const getMonthlySpending = () => {
    return [
        { month: "Jan", expenses: 2200 },
        { month: "Feb", expenses: 2500 },
        { month: "Mar", expenses: 2300 },
        { month: "Apr", expenses: 2800 },
        { month: "May", expenses: 2600 },
        { month: "Jun", expenses: 3100 },
        { month: "Jul", expenses: expensesData.reduce((sum, e) => sum + e.amount, 0) },
    ]
}
