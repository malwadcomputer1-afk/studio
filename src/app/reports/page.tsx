'use client';

import { PageHeader } from '@/app/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useLocalStorage from '@/hooks/use-local-storage';
import { generateExpensesPdf, generatePaymentsPdf, generateAttendancePdf } from '@/lib/pdf-generator';
import { Expense, Payment, Staff, Attendance } from '@/lib/types';
import { FileDown, User, CalendarDays, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function ReportsPage() {
  const [expenses] = useLocalStorage<Expense[]>('expenses', []);
  const [payments] = useLocalStorage<Payment[]>('payments', []);
  const [staff] = useLocalStorage<Staff[]>('staff', []);
  const [attendance] = useLocalStorage<Attendance[]>('attendance', []);
  const [isEmailScheduled, setIsEmailScheduled] = useState(false);

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
    
    const filteredAttendance = staffMember
      ? attendance.filter(att => att.staffId === staffMember.id)
      : attendance;
    
    generateAttendancePdf(filteredAttendance, staff, today, staffMember);
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
              Download attendance reports for all recorded days.
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

        <Card>
          <CardHeader>
            <CardTitle>Automated Email Reports</CardTitle>
            <CardDescription>
              Enable to automatically send all reports to your email at the end of each month.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="email-schedule"
                checked={isEmailScheduled}
                onCheckedChange={setIsEmailScheduled}
              />
              <Label htmlFor="email-schedule">Enable Monthly Reports</Label>
            </div>
            {isEmailScheduled && (
              <div className="flex items-center text-sm text-muted-foreground p-3 bg-muted rounded-md">
                <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>Reports will be sent to:</span>
                  <span className="font-medium text-foreground">malwadcomputer1@gmail.com</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </>
  );
}
