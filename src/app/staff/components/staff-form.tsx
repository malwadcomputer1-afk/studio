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
import { Staff } from '@/lib/types';
import { format } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  role: z.string().min(2, 'Role is required.'),
  yearlySalary: z.coerce.number().positive('Salary must be a positive number.'),
  contact: z.string().email('Invalid email address.'),
  joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
});

type StaffFormValues = z.infer<typeof formSchema>;

interface StaffFormProps {
  staff?: Staff;
  onSubmit: (values: StaffFormValues & { hourlyRate: number }) => void;
}

export function StaffForm({ staff, onSubmit }: StaffFormProps) {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: staff || {
      name: '',
      role: '',
      yearlySalary: 0,
      contact: '',
      joiningDate: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  function handleSubmit(values: StaffFormValues) {
    const hourlyRate = parseFloat((values.yearlySalary / (52 * 40)).toFixed(2));
    onSubmit({ ...values, hourlyRate });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="Farm Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearlySalary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yearly Salary (₹)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="60000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="joiningDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Joining Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{staff ? 'Save Changes' : 'Add Staff'}</Button>
      </form>
    </Form>
  );
}
