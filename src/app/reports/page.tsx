'use client';

import { PageHeader } from '@/app/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { generateExpensesPdf, generatePaymentsPdf, generateAttendancePdf } from '@/lib/pdf-generator';
import { Expense, Payment, Staff, Attendance } from '@/lib/types';
import { FileDown, User, CalendarDays } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export default function ReportsPage() {
  const [expenses] = useLocalStorage<Expense[]>('expenses', initialData.expenses);
  const [payments] = useLocalStorage<Payment[]>('payments', initialData.payments);
  const [staff] = useLocalStorage<Staff[]>('staff', initialData.staff);
  const [attendance] = useLocalStorage<Attendance[]>('attendance', initialData.attendance);

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
  
  const handleDownloadAttendance = (staffMember?: Staff) => {
    const today = new Date();
    const currentMonthInterval = {
      start: startOfMonth(today),
      end: endOfMonth(today),
    };
    
    const monthlyAttendance = attendance.filter(att => {
      const attDate = new Date(att.date);
      const inMonth = isWithinInterval(attDate, currentMonthInterval);
      if (staffMember) {
        return inMonth && att.staffId === staffMember.id;
      }
      return inMonth;
    });
    
    generateAttendancePdf(monthlyAttendance, staff, today, staffMember);
  };

  return (
    <>
      <PageHeader
        title="Download Reports"
        description="Generate and download PDF reports for your farm's financial data."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Report</CardTitle>
            <CardDescription>
              Download attendance reports for the current month.
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
                        onClick={() => handleDownloadAttendance(s)}
                        disabled={!attendance.some(p => p.staffId === s.id)}
                    >
                        <User className="mr-2 h-4 w-4"/>
                        {s.name}
                    </Button>
                ))}
                 {staff.length === 0 && <p className="text-sm text-muted-foreground">No staff found.</p>}
            </div>
            <div className="border-t pt-4">
                 <h4 className="font-medium text-sm mb-2">Complete Report</h4>
                <Button onClick={() => handleDownloadAttendance()} disabled={attendance.length === 0}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Download All Staff
                </Button>
            </div>

             {attendance.length === 0 && (
                <p className="text-sm text-muted-foreground pt-4">No attendance data available to generate a report.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
