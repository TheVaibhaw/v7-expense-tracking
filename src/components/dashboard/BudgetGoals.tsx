'use client';
import type { BudgetGoal } from '@/types';
import { Progress } from '@/components/ui/progress';
import { cn, formatCurrency } from '@/lib/utils';

interface BudgetGoalsProps {
  goals: BudgetGoal[];
}

const BudgetGoals = ({ goals }: BudgetGoalsProps) => {
  return (
    <div className="space-y-6">
      {goals.map(goal => {
        const percentage = Math.min((goal.spent / goal.limit) * 100, 100);
        const remaining = goal.limit - goal.spent;

        return (
          <div key={goal.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-foreground">
                {goal.categoryName}
              </span>
              <span className="text-sm text-muted-foreground">
                <span
                  className={cn(
                    'font-semibold',
                    remaining < 0 ? 'text-destructive' : 'text-foreground'
                  )}
                >
                  {formatCurrency(goal.spent)}
                </span>{' '}
                / {formatCurrency(goal.limit)}
              </span>
            </div>
            <Progress
              value={percentage}
              className={cn(
                percentage > 90
                  ? '[&>div]:bg-destructive'
                  : percentage > 75
                  ? '[&>div]:bg-accent'
                  : '[&>div]:bg-primary'
              )}
            />
            <p
              className={cn(
                'text-xs mt-1 text-right',
                remaining < 0 ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              {remaining >= 0
                ? `${formatCurrency(remaining)} left`
                : `${formatCurrency(Math.abs(remaining))} over`}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetGoals;
