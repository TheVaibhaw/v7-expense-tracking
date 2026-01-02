"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddExpenseModal from '@/components/expense/AddExpenseModal';

const AddExpenseButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 gap-2"
        size="lg"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
        <span className="font-semibold">Add Expense</span>
      </Button>
      <AddExpenseModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default AddExpenseButton;
