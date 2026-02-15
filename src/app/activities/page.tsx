import { PageHeader } from '@/app/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActivitiesPage() {
  return (
    <>
      <PageHeader
        title="Daily Farm Activities"
        description="Log daily activities like plowing, planting, and harvesting."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will allow you to log daily farm activities, link them to staff members, and add notes or photos.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
