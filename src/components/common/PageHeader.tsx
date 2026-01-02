import Logo from '@/components/common/Logo';
import AddExpenseButton from '@/components/expense/AddExpenseButton';

const PageHeader = () => {
  return (
    <div className="flex items-center justify-between space-y-2 mb-4">
      <Logo />
      <AddExpenseButton />
    </div>
  );
};

export default PageHeader;

