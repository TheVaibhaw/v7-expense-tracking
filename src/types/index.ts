export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  date: string;
  type: 'cash' | 'card' | 'upi';
};

export type Budget = {
  id: string;
  categoryId: string;
  limit: number;
  month: string;
};

export type BudgetGoal = {
  id: string;
  categoryName: string;
  categoryColor: string;
  limit: number;
  spent: number;
};
