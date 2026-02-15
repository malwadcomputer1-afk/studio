'use client';

import { PageHeader } from '@/app/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { generateExpensesPdf, generatePaymentsPdf } from '@/lib/pdf-generator';
import { Expense, Payment, Staff } from '@/lib/types';
import { FileDown, User } from 'lucide-react';

export default function ReportsPage() {
  const [expenses] = useLocalStorage<Expense[]>('expenses', initialData.expenses);
  const [payments] = useLocalStorage<Payment[]>('payments', initialData.payments);
  const [staff] = useLocalStorage<Staff[]>('staff', initialData.staff);

  const handleDownloadExpenses = () => {
    generateExpensesPdf(expenses);
  };

  const handleDownloadPayments = (staffMember: Staff) => {
    const staffPayments = payments.filter(p => p.staffId === staffMember.id);
    generatePaymentsPdf(staffPayments, [staffMember]);
  };

  const handleDownloadAllPayments = () => {
    generatePaymentsPdf(payments, staff);
  }

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
              Select a staff member to download their payment report, or download a combined report for all staff.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <h4 className="font-medium text-sm">By Staff Member</h4>
                {staff.map(s => (
                    <Button 
                        key={s.id} 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleDownloadPayments(s)}
                        disabled={!payments.some(p => p.staffId === s.id)}
                    >
                        <User className="mr-2 h-4 w-4"/>
                        {s.name}
                    </Button>
                ))}
                 {staff.length === 0 && <p className="text-sm text-muted-foreground">No staff found.</p>}
            </div>
            <div className="border-t pt-4">
                 <h4 className="font-medium text-sm mb-2">Complete Report</h4>
                <Button onClick={handleDownloadAllPayments} disabled={payments.length === 0}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download All Payments
                </Button>
            </div>

             {payments.length === 0 && (
                <p className="text-sm text-muted-foreground pt-4">No payment data available to generate a report.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
