import {
  getCategories,
  getExpenses,
  getBudgets,
  getMonthlySpending,
} from '@/lib/data';
import type { Category, Expense, BudgetGoal } from '@/types';
import { TOTAL_INCOME } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BudgetGoals from '@/components/dashboard/BudgetGoals';
import PageHeader from '@/components/common/PageHeader';
import CategorySpendingChart from '@/components/charts/CategorySpendingChart';
import MonthlyExpensesChart from '@/components/charts/MonthlyExpensesChart';
import SpendingTrendChart from '@/components/charts/SpendingTrendChart';

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CircleDot,
} from 'lucide-react';

export default async function DashboardPage() {
  const categories = getCategories();
  const expenses = getExpenses();
  const budgets = getBudgets();
  const monthlySpending = getMonthlySpending();

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = TOTAL_INCOME - totalExpenses;
  const budgetUsagePercentage = (totalExpenses / TOTAL_INCOME) * 100;

  const categorySpending = categories.map(category => {
    const categoryExpenses = expenses.filter(
      expense => expense.categoryId === category.id
    );
    const total = categoryExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    return { ...category, total };
  });

  const topSpendingCategory = categorySpending.reduce(
    (top, current) => (current.total > top.total ? current : top),
    categorySpending[0] || { name: 'N/A', total: 0 }
  );

  const budgetGoals: BudgetGoal[] = budgets.map(budget => {
    const category = categories.find(c => c.id === budget.categoryId);
    const spent =
      categorySpending.find(cs => cs.id === budget.categoryId)?.total || 0;
    return {
      id: budget.id,
      categoryName: category?.name || 'Unknown',
      categoryColor: category?.color || '#888888',
      limit: budget.limit,
      spent,
    };
  });

  const recentTransactions = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(TOTAL_INCOME)}
          icon={DollarSign}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          change={`-${budgetUsagePercentage.toFixed(1)}% from budget`}
        />
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(remainingBudget)}
          icon={TrendingUp}
          change={`+${(100 - budgetUsagePercentage).toFixed(1)}% of budget`}
        />
        <StatCard
          title="Top Spending"
          value={topSpendingCategory.name}
          icon={CircleDot}
          change={formatCurrency(topSpendingCategory.total)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <MonthlyExpensesChart data={monthlySpending} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Budget Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetGoals goals={budgetGoals} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategorySpendingChart data={categorySpending} />
          </CardContent>
        </Card>
         <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions
              transactions={recentTransactions}
              categories={categories}
            />
          </CardContent>
        </Card>
      </div>
       <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SpendingTrendChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
