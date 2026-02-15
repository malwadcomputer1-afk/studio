'use client';
import { calculateSalary } from '@/ai/flows/ai-salary-calculation-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { Attendance, Staff, Payment } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { addDays, format, isAfter, isBefore } from 'date-fns';
import { DateRange } from 'react-day-picker';

const formSchema = z.object({
  staffId: z.string().min(1, 'Please select a staff member.'),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

type SalaryFormValues = z.infer<typeof formSchema>;
type SalaryOutput = { calculatedSalary: number; calculationBreakdown: string; };

export function SalaryCalculator() {
  const [staff] = useLocalStorage<Staff[]>('staff', initialData.staff);
  const [attendance] = useLocalStorage<Attendance[]>('attendance', initialData.attendance);
  const [payments] = useLocalStorage<Payment[]>('payments', initialData.payments);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SalaryOutput | null>(null);

  const form = useForm<SalaryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      staffId: '',
      dateRange: {
        from: addDays(new Date(), -30),
        to: new Date(),
      }
    },
  });

  async function onSubmit(values: SalaryFormValues) {
    setIsLoading(true);
    setResult(null);

    const selectedStaff = staff.find((s) => s.id === values.staffId);
    if (!selectedStaff) {
      toast({ title: 'Error', description: 'Selected staff not found.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    const { from, to } = values.dateRange;

    const attendanceRecords = attendance.filter((a) => {
      const recordDate = new Date(a.date);
      return (
        a.staffId === values.staffId &&
        !isBefore(recordDate, from) &&
        !isAfter(recordDate, to)
      );
    });

    const totalPaymentsMade = payments
        .filter(p => {
            const paymentDate = new Date(p.date);
            return p.staffId === values.staffId &&
                   !isBefore(paymentDate, from) &&
                   !isAfter(paymentDate, to);
        })
        .reduce((sum, p) => sum + p.amount, 0);

    try {
      const output = await calculateSalary({
        staffName: selectedStaff.name,
        yearlySalary: selectedStaff.yearlySalary,
        totalPaymentsMade: totalPaymentsMade,
        attendanceRecords: attendanceRecords,
        dateRange: {
            from: format(from, 'yyyy-MM-dd'),
            to: format(to, 'yyyy-MM-dd')
        }
      });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({ title: 'AI Calculation Failed', description: 'Could not calculate salary.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Salary Calculator</CardTitle>
          <CardDescription>Select a staff member and date range to calculate salary.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff Member</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a staff member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staff.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Pay Period</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, 'LLL dd, y')} -{' '}
                                  {format(field.value.to, 'LLL dd, y')}
                                </>
                              ) : (
                                format(field.value.from, 'LLL dd, y')
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value as DateRange}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Calculate Salary
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Calculation Result</CardTitle>
          <CardDescription>The AI-powered salary calculation and breakdown.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {result && !isLoading && (
             <div className="space-y-4">
               <div>
                 <p className="text-sm text-muted-foreground">Total Salary</p>
                 <p className="text-3xl font-bold text-primary">
                    {result.calculatedSalary.toLocaleString()}
                 </p>
               </div>
                <div className="prose prose-sm max-w-none text-foreground prose-p:my-1 prose-headings:my-2 prose-headings:font-headline">
                    <h3 className="font-semibold">Breakdown:</h3>
                    <p className="whitespace-pre-wrap">{result.calculationBreakdown}</p>
                </div>
             </div>
          )}
          {!result && !isLoading && (
             <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Results will be displayed here.</p>
             </div>
          )}
        </CardContent>
        {result && <CardFooter>
            <Button className="w-full">Create Payment Record</Button>
        </CardFooter>}
      </Card>
    </div>
  );
}
