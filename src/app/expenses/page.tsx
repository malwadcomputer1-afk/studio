import { PageHeader } from '@/app/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExpensesPage() {
  return (
    <>
      <PageHeader
        title="Expense Tracking"
        description="Record and categorize all farm-related expenses."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will allow you to record farm expenses, categorize them, and tag them by field or crop for detailed analysis.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
