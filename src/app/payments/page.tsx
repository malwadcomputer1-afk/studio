import { PageHeader } from '@/app/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentsPage() {
  return (
    <>
      <PageHeader
        title="Payment Tracking"
        description="Record and view salary payments."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will allow you to record salary payments and view payment history with filters for staff, date range, and status.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
