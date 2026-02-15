import { PageHeader } from '@/app/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AttendancePage() {
  return (
    <>
      <PageHeader
        title="Attendance Tracking"
        description="View and manage daily staff attendance."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will contain a daily attendance register and a calendar-based view to see attendance history at a glance.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
