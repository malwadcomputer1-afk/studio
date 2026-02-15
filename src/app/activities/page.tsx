'use client';
import { PageHeader } from '@/app/components/page-header';
import { Button } from '@/components/ui/button';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { Activity } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { getColumns } from './components/columns';
import { DataTable } from '@/app/staff/components/data-table';
import { useState } from 'react';
import { ActivityForm, ActivityFormValues } from './components/activity-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ActivitiesPage() {
  const [activities, setActivities] = useLocalStorage<Activity[]>('activities', initialData.activities);
  const [open, setOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>(undefined);

  const handleFormSubmit = (values: ActivityFormValues) => {
    const title = values.notes.split('\n')[0].substring(0, 50) || `Note for ${values.date}`;
    
    if (editingActivity) {
      setActivities(activities.map((act) => (act.id === editingActivity.id ? { ...editingActivity, ...values, title } : act)));
    } else {
      setActivities([...activities, { ...values, id: crypto.randomUUID(), title, staffIds: [] }]);
    }
    closeDialog();
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setOpen(true);
  };

  const handleDelete = (activityId: string) => {
    setActivities(activities.filter((act) => act.id !== activityId));
  };
  
  const closeDialog = () => {
    setOpen(false);
    setEditingActivity(undefined);
  }

  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <>
      <PageHeader title="Activity Notes" description="Log your daily activities and notes here.">
        <Dialog open={open} onOpenChange={ (isOpen) => { if (!isOpen) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingActivity(undefined); setOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{editingActivity ? 'Edit Note' : 'Add New Note'}</DialogTitle>
            </DialogHeader>
            <ActivityForm 
              onSubmit={handleFormSubmit}
              onCancel={closeDialog}
              activity={editingActivity} 
            />
          </DialogContent>
        </Dialog>
      </PageHeader>
      <DataTable 
        columns={columns} 
        data={activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
        filterColumn={{id: 'title', placeholder: 'Filter by title...'}}
      />
    </>
  );
}
