'use client';
import { PageHeader } from '@/app/components/page-header';
import { StatCard } from '@/app/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { Activity, Attendance, Expense, Payment, Staff } from '@/lib/types';
import {
  Users,
  CalendarCheck,
  DollarSign,
  Tractor,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { format, isToday } from 'date-fns';

export default function DashboardPage() {
  const [staff] = useLocalStorage<Staff[]>('staff', initialData.staff);
  const [attendance] = useLocalStorage<Attendance[]>(
    'attendance',
    initialData.attendance
  );
  const [payments] = useLocalStorage<Payment[]>(
    'payments',
    initialData.payments
  );
  const [activities] = useLocalStorage<Activity[]>(
    'activities',
    initialData.activities
  );
  const [expenses] = useLocalStorage<Expense[]>(
    'expenses',
    initialData.expenses
  );

  const todayAttendance = attendance.filter((a) => isToday(new Date(a.date)));
  const presentToday = todayAttendance.filter(
    (a) => a.status === 'Present' || a.status === 'Overtime'
  ).length;

  const totalExpensesThisMonth = expenses
    .filter(
      (e) => new Date(e.date).getMonth() === new Date().getMonth()
    )
    .reduce((sum, e) => sum + e.amount, 0);

  const recentActivities = activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <>
      <PageHeader title="Dashboard" description="Welcome to Verdant Farm Manager." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Staff"
          value={staff.length.toString()}
          icon={Users}
          description="Number of active staff members"
        />
        <StatCard
          title="Present Today"
          value={`${presentToday} / ${staff.length}`}
          icon={CalendarCheck}
          description="Staff present today"
        />
        <StatCard
          title="Total Payments"
          value={payments.length.toString()}
          icon={DollarSign}
          description="Salary payments recorded"
        />
        <StatCard
          title="Upcoming Activities"
          value={
            activities.filter((a) => new Date(a.date) >= new Date()).length.toString()
          }
          icon={Tractor}
          description="Planned farm activities"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="bg-secondary p-2 rounded-full">
                       <Tractor className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(activity.date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent activities logged.</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Financials at a Glance</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
             <div className="flex items-center gap-4">
                <div className="bg-destructive/20 p-3 rounded-full">
                    <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
                <div>
                    <p className="text-muted-foreground">Expenses This Month</p>
                    <p className="text-2xl font-bold">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalExpensesThisMonth)}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <p className="text-muted-foreground">Total Payments Made</p>
                    <p className="text-2xl font-bold">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payments
                        .reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
