import { PageHeader } from '@/app/components/page-header';

export default function CalendarPage() {
  return (
    <>
      <PageHeader
        title="Calendar"
        description="View and manage farm events."
      />
      <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Calendar functionality coming soon.</p>
      </div>
    </>
  );
}
