'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Expense } from '@/lib/types';
import { format } from 'date-fns';

const formSchema = z.object({
  service: z.string().min(2, {
    message: 'Service name must be at least 2 characters.',
  }),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
});

type ExpenseFormValues = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (values: ExpenseFormValues) => void;
  onCancel: () => void;
}

export function ExpenseForm({ expense, onSubmit, onCancel }: ExpenseFormProps) {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: expense ? {
        ...expense,
        amount: Number(expense.amount)
    } : {
      service: '',
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  function handleSubmit(values: ExpenseFormValues) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service/Item</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Tractor Repair" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="150.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Expense</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Expense</Button>
        </div>
      </form>
    </Form>
  );
}
