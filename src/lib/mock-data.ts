import { FarmData } from './types';
import { subDays, format } from 'date-fns';

const today = new Date();

export const initialData: FarmData = {
  staff: [
    {
      id: '1',
      name: 'John Doe',
      role: 'Farm Manager',
      yearlySalary: 60000,
      hourlyRate: 28.85,
      contact: 'john.doe@example.com',
      joiningDate: '2022-01-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Field Worker',
      yearlySalary: 40000,
      hourlyRate: 19.23,
      contact: 'jane.smith@example.com',
      joiningDate: '2023-03-20',
    },
    {
        id: '3',
        name: 'Peter Jones',
        role: 'Tractor Operator',
        yearlySalary: 48000,
        hourlyRate: 23.08,
        contact: 'peter.jones@example.com',
        joiningDate: '2022-07-11',
      },
  ],
  attendance: [
    { id: 'att1', staffId: '1', date: format(today, 'yyyy-MM-dd'), status: 'Present', hoursWorked: 8 },
    { id: 'att2', staffId: '2', date: format(today, 'yyyy-MM-dd'), status: 'Present', hoursWorked: 8 },
    { id: 'att3', staffId: '3', date: format(today, 'yyyy-MM-dd'), status: 'Absent' },
    { id: 'att4', staffId: '1', date: format(subDays(today, 1), 'yyyy-MM-dd'), status: 'Present', hoursWorked: 8 },
    { id: 'att5', staffId: '2', date: format(subDays(today, 1), 'yyyy-MM-dd'), status: 'Present', hoursWorked: 8 },
    { id: 'att6', staffId: '3', date: format(subDays(today, 1), 'yyyy-MM-dd'), status: 'Present', hoursWorked: 8 },
    { id: 'att7', staffId: '1', date: format(subDays(today, 2), 'yyyy-MM-dd'), status: 'Half-Day', hoursWorked: 4 },
  ],
  activities: [
    {
      id: 'act1',
      title: 'Plowing Field A',
      date: format(subDays(today, 2), 'yyyy-MM-dd'),
      notes: 'Completed plowing for the north sector.',
      staffIds: ['3'],
    },
    {
      id: 'act2',
      title: 'Planting Corn in Field B',
      date: format(subDays(today, 1), 'yyyy-MM-dd'),
      notes: 'Used the new seed variant.',
      staffIds: ['2'],
    },
    {
      id: 'act3',
      title: 'Irrigation System Check',
      date: format(today, 'yyyy-MM-dd'),
      notes: 'All sprinklers are functional.',
      staffIds: ['1'],
    },
  ],
  expenses: [
    {
      id: 'exp1',
      service: 'Corn Seeds',
      amount: 500,
      date: format(subDays(today, 5), 'yyyy-MM-dd'),
    },
    {
      id: 'exp2',
      service: 'Diesel Fuel',
      amount: 150,
      date: format(subDays(today, 2), 'yyyy-MM-dd'),
    },
    {
      id: 'exp3',
      service: 'NPK Fertilizer',
      amount: 800,
      date: format(subDays(today, 10), 'yyyy-MM-dd'),
    },
  ],
  payments: [
    {
      id: 'pay1',
      staffId: '1',
      amount: 5000,
      date: format(subDays(today, 15), 'yyyy-MM-dd'),
      notes: 'Monthly salary for previous month.',
    },
    {
      id: 'pay2',
      staffId: '2',
      amount: 3333,
      date: format(subDays(today, 15), 'yyyy-MM-dd'),
      notes: 'Monthly salary for previous month.',
    },
    {
        id: 'pay3',
        staffId: '3',
        amount: 4000,
        date: format(subDays(today, 0), 'yyyy-MM-dd'),
        notes: 'Current month salary.',
      },
  ],
};
