'use client';
import { PageHeader } from '@/app/components/page-header';
import { StatCard } from '@/app/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { Activity, Attendance, Expense, Staff } from '@/lib/types';
import {
  Users,
  CalendarCheck,
  CreditCard,
  Sprout,
  ClipboardList,
  Landmark,
} from 'lucide-react';
import { format, isToday } from 'date-fns';

export default function DashboardPage() {
  const [staff] = useLocalStorage<Staff[]>('staff', initialData.staff);
  const [attendance] = useLocalStorage<Attendance[]>(
    'attendance',
    initialData.attendance
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
    (a) => a.status === 'Present'
  ).length;

  const todayActivitiesCount = activities.filter((a) => isToday(new Date(a.date))).length;

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
      <PageHeader
        title="Welcome to Malwad Farm"
        description={`${format(new Date(), 'EEEE, MMMM d, yyyy')} — Here's your farm at a glance.`}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Staff"
          value={staff.length.toString()}
          icon={Users}
        />
        <StatCard
          title="Present Today"
          value={`${presentToday}`}
          icon={CalendarCheck}
        />
        <StatCard
          title="Pending Payments"
          value={"0"}
          icon={CreditCard}
        />
        <StatCard
          title="Active Crops"
          value={"0"}
          icon={Sprout}
        />
        <StatCard
          title="Today's Activities"
          value={todayActivitiesCount.toString()}
          icon={ClipboardList}
        />
        <StatCard
          title="Month Expenses"
          value={`₹${totalExpensesThisMonth.toLocaleString()}`}
          icon={Landmark}
        />
      </div>
      <div className="grid gap-4 mt-6">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="bg-secondary p-2 rounded-lg">
                       <ClipboardList className="h-5 w-5 text-secondary-foreground" />
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
                <p className="text-muted-foreground">No activities recorded yet. Start by adding staff and logging daily activities.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
