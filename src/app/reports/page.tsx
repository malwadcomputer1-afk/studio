'use client';

import { PageHeader } from '@/app/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { generateExpensesPdf, generatePaymentsPdf } from '@/lib/pdf-generator';
import { Expense, Payment, Staff } from '@/lib/types';
import { FileDown } from 'lucide-react';

export default function ReportsPage() {
  const [expenses] = useLocalStorage<Expense[]>('expenses', initialData.expenses);
  const [payments] = useLocalStorage<Payment[]>('payments', initialData.payments);
  const [staff] = useLocalStorage<Staff[]>('staff', initialData.staff);

  const handleDownloadExpenses = () => {
    generateExpensesPdf(expenses);
  };

  const handleDownloadPayments = () => {
    generatePaymentsPdf(payments, staff);
  };

  return (
    <>
      <PageHeader
        title="Download Reports"
        description="Generate and download PDF reports for your farm's financial data."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Report</CardTitle>
            <CardDescription>
              Download a detailed report of all recorded expenses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDownloadExpenses} disabled={expenses.length === 0}>
              <FileDown className="mr-2 h-4 w-4" />
              Download Expenses PDF
            </Button>
            {expenses.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">No expense data available to generate a report.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Salary Payments Report</CardTitle>
            <CardDescription>
              Download a comprehensive report of all salary payments made to staff.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDownloadPayments} disabled={payments.length === 0}>
              <FileDown className="mr-2 h-4 w-4" />
              Download Payments PDF
            </Button>
             {payments.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">No payment data available to generate a report.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
