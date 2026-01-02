"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { Expense, Category, Budget } from '@/types';
import categoriesData from '@/data/categories.json';
import expensesData from '@/data/expenses.json';
import budgetsData from '@/data/budgets.json';
import { TOTAL_INCOME } from '@/lib/constants';

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  // Computed values
  totalExpenses: number;
  remainingBudget: number;
  budgetUsagePercentage: number;
  categorySpending: (Category & { total: number })[];
  topSpendingCategory: { name: string; total: number };
  recentTransactions: Expense[];
  monthlySpending: { month: string; expenses: number }[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(expensesData as Expense[]);
  const categories = categoriesData as Category[];
  const budgets = budgetsData as Budget[];

  // Add new expense
  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `e${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }, []);

  // Delete expense
  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  // Update expense
  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, ...updates } : expense
      )
    );
  }, []);

  // Computed: Total expenses
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  // Computed: Remaining budget
  const remainingBudget = useMemo(() => {
    return TOTAL_INCOME - totalExpenses;
  }, [totalExpenses]);

  // Computed: Budget usage percentage
  const budgetUsagePercentage = useMemo(() => {
    return (totalExpenses / TOTAL_INCOME) * 100;
  }, [totalExpenses]);

  // Computed: Category spending
  const categorySpending = useMemo(() => {
    return categories.map((category) => {
      const categoryExpenses = expenses.filter(
        (expense) => expense.categoryId === category.id
      );
      const total = categoryExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      return { ...category, total };
    });
  }, [categories, expenses]);

  // Computed: Top spending category
  const topSpendingCategory = useMemo(() => {
    return categorySpending.reduce(
      (top, current) => (current.total > top.total ? current : top),
      categorySpending[0] || { name: 'N/A', total: 0 }
    );
  }, [categorySpending]);

  // Computed: Recent transactions (top 5)
  const recentTransactions = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  // Computed: Monthly spending
  const monthlySpending = useMemo(() => {
    return [
      { month: "Jan", expenses: 2200 },
      { month: "Feb", expenses: 2500 },
      { month: "Mar", expenses: 2300 },
      { month: "Apr", expenses: 2800 },
      { month: "May", expenses: 2600 },
      { month: "Jun", expenses: 3100 },
      { month: "Jul", expenses: totalExpenses },
    ];
  }, [totalExpenses]);

  const value = useMemo(
    () => ({
      expenses,
      categories,
      budgets,
      addExpense,
      deleteExpense,
      updateExpense,
      totalExpenses,
      remainingBudget,
      budgetUsagePercentage,
      categorySpending,
      topSpendingCategory,
      recentTransactions,
      monthlySpending,
    }),
    [
      expenses,
      categories,
      budgets,
      addExpense,
      deleteExpense,
      updateExpense,
      totalExpenses,
      remainingBudget,
      budgetUsagePercentage,
      categorySpending,
      topSpendingCategory,
      recentTransactions,
      monthlySpending,
    ]
  );

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
