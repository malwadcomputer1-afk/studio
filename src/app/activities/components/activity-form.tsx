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
import { Textarea } from '@/components/ui/textarea';
import { Activity } from '@/lib/types';
import { format } from 'date-fns';

const formSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  notes: z.string().min(1, {
    message: 'Note cannot be empty.',
  }),
});

export type ActivityFormValues = z.infer<typeof formSchema>;

interface ActivityFormProps {
  activity?: Activity;
  onSubmit: (values: ActivityFormValues) => void;
  onCancel: () => void;
}

export function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: activity ? {
        ...activity
    } : {
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    },
  });

  function handleSubmit(values: ActivityFormValues) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your notes here..." className="min-h-[200px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{activity ? 'Save Changes' : 'Save Note'}</Button>
        </div>
      </form>
    </Form>
  );
}
