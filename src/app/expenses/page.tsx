'use client';
import { PageHeader } from '@/app/components/page-header';
import { Button } from '@/components/ui/button';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { Expense } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { getColumns } from './components/columns';
import { DataTable } from '@/app/staff/components/data-table';
import { useState } from 'react';
import { ExpenseForm } from './components/expense-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', initialData.expenses);
  const [open, setOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const handleFormSubmit = (values: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      setExpenses(expenses.map((exp) => (exp.id === editingExpense.id ? { ...editingExpense, ...values, amount: Number(values.amount) } : exp)));
    } else {
      setExpenses([...expenses, { ...values, id: crypto.randomUUID(), amount: Number(values.amount) }]);
    }
    closeDialog();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setOpen(true);
  };

  const handleDelete = (expenseId: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== expenseId));
  };
  
  const closeDialog = () => {
    setOpen(false);
    setEditingExpense(undefined);
  }

  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <>
      <PageHeader title="Expense Tracking" description="Record and categorize all farm-related expenses.">
        <Dialog open={open} onOpenChange={ (isOpen) => { if (!isOpen) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingExpense(undefined); setOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
            </DialogHeader>
            <ExpenseForm 
              onSubmit={handleFormSubmit}
              onCancel={closeDialog}
              expense={editingExpense} 
            />
          </DialogContent>
        </Dialog>
      </PageHeader>
      <DataTable 
        columns={columns} 
        data={expenses} 
        filterColumn={{id: 'service', placeholder: 'Filter by service...'}}
      />
    </>
  );
}
