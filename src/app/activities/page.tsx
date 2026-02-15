'use client';

import { PageHeader } from '@/app/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialData } from '@/lib/mock-data';
import { Activity } from '@/lib/types';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';

export default function ActivitiesPage() {
  const [activities, setActivities] = useLocalStorage<Activity[]>('activities', initialData.activities);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedDate = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  const currentActivity = useMemo(() => activities.find(a => a.date === formattedDate), [activities, formattedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split('-').map(Number);
      setSelectedDate(new Date(year, month - 1, day));
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value;
    const newTitle = newNote.split('\n')[0].substring(0, 50) || `Note for ${formattedDate}`;

    setActivities(prevActivities => {
      const existingActivity = prevActivities.find(a => a.date === formattedDate);

      if (existingActivity) {
        if (newNote === '') {
          // If note is empty, remove the activity
          return prevActivities.filter(a => a.id !== existingActivity.id);
        }
        // Update existing activity
        return prevActivities.map(a => 
          a.id === existingActivity.id ? { ...a, notes: newNote, title: newTitle } : a
        );
      } else if (newNote !== '') {
        // Create new activity
        const newActivity: Activity = {
          id: crypto.randomUUID(),
          date: formattedDate,
          title: newTitle,
          notes: newNote,
          staffIds: [],
        };
        return [...prevActivities, newActivity];
      }
      return prevActivities;
    });
  };

  return (
    <>
      <PageHeader
        title="Daily Notepad"
        description="Log your daily activities and notes here. Your notes are saved automatically."
      />
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Notes for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
            <Input
              type="date"
              value={formattedDate}
              onChange={handleDateChange}
              className="w-full sm:w-[180px]"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Start writing your notes for the selected date..."
            className="min-h-[400px] resize-y"
            value={currentActivity?.notes || ''}
            onChange={handleNoteChange}
          />
        </CardContent>
      </Card>
    </>
  );
}
