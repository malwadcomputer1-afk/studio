import { PageHeader } from '@/app/components/page-header';

export default function CropsAndFieldsPage() {
  return (
    <>
      <PageHeader
        title="Crops & Fields"
        description="Manage your crops and fields."
      />
       <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Crop and field management coming soon.</p>
      </div>
    </>
  );
}
