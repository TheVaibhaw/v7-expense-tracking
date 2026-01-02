"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExpenses } from '@/context/ExpenseContext';
import { formatCurrency } from '@/lib/utils';
import { Plus, Sparkles, CreditCard, Banknote, Smartphone } from 'lucide-react';
import type { Expense } from '@/types';

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentTypes: { value: Expense['type']; label: string; icon: React.ReactNode }[] = [
  { value: 'card', label: 'Card', icon: <CreditCard className="h-4 w-4" /> },
  { value: 'cash', label: 'Cash', icon: <Banknote className="h-4 w-4" /> },
  { value: 'upi', label: 'UPI', icon: <Smartphone className="h-4 w-4" /> },
];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ open, onOpenChange }) => {
  const { categories, addExpense, totalExpenses, remainingBudget } = useExpenses();
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentType, setPaymentType] = useState<Expense['type']>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse amount for preview calculations
  const parsedAmount = parseFloat(amount) || 0;
  const newTotalExpenses = totalExpenses + parsedAmount;
  const newRemainingBudget = remainingBudget - parsedAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !amount || !categoryId || !date) {
      return;
    }

    setIsSubmitting(true);

    // Simulate a small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    addExpense({
      title,
      amount: parsedAmount,
      categoryId,
      date,
      type: paymentType,
    });

    // Reset form
    setTitle('');
    setAmount('');
    setCategoryId('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentType('card');
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    setTitle('');
    setAmount('');
    setCategoryId('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentType('card');
    onOpenChange(false);
  };

  const selectedCategory = categories.find(c => c.id === categoryId);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-background via-background to-muted/30 border-muted">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            Add New Expense
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Track your spending by adding a new expense. All dashboard statistics will update automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Expense Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Grocery shopping, Coffee, Uber ride..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 bg-muted/50 border-muted focus:border-primary transition-colors"
              required
            />
          </div>

          {/* Amount and Category Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount (₹)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-11 pl-8 bg-muted/50 border-muted focus:border-primary transition-colors"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className="h-11 bg-muted/50 border-muted focus:border-primary transition-colors">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color.replace('hsl(var(--', 'hsl(').replace('))', ')') }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Payment Type Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 bg-muted/50 border-muted focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentType" className="text-sm font-medium">
                Payment Method
              </Label>
              <Select value={paymentType} onValueChange={(value) => setPaymentType(value as Expense['type'])}>
                <SelectTrigger className="h-11 bg-muted/50 border-muted focus:border-primary transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {type.icon}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Live Preview Card */}
          {parsedAmount > 0 && (
            <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 p-4">
              <div className="absolute top-2 right-2">
                <Sparkles className="h-4 w-4 text-primary/50 animate-pulse" />
              </div>
              <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live Preview
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Adding</p>
                  <p className="font-bold text-lg text-foreground">
                    {formatCurrency(parsedAmount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">New Total</p>
                  <p className="font-bold text-lg text-orange-500">
                    {formatCurrency(newTotalExpenses)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Balance</p>
                  <p className={`font-bold text-lg ${newRemainingBudget >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(newRemainingBudget)}
                  </p>
                </div>
              </div>
              {selectedCategory && (
                <div className="mt-3 pt-3 border-t border-primary/10">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedCategory.color.replace('hsl(var(--', 'hsl(').replace('))', ')') }}
                    />
                    Will be added to <span className="font-medium text-foreground">{selectedCategory.name}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title || !amount || !categoryId}
              className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Expense
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
