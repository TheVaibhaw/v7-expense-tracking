import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Layers className="h-6 w-6 text-primary" />
      <h1 className="text-2xl font-bold text-foreground font-headline">V7 Expense Tracking</h1>
    </div>
  );
};

export default Logo;
