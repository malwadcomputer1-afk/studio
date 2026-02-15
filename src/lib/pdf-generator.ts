'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense, Payment, Staff } from './types';
import { format } from 'date-fns';

const generatePdf = (title: string, head: any[], body: any[], fileName: string) => {
  const doc = new jsPDF();

  doc.text(title, 14, 20);
  autoTable(doc, {
    head,
    body,
    startY: 25,
    theme: 'striped',
    headStyles: { fillColor: [107, 142, 35] }, // Olive Drab
  });

  doc.save(`${fileName}.pdf`);
};

export const generateExpensesPdf = (expenses: Expense[]) => {
  const head = [['Date', 'Service', 'Amount']];
  const body = expenses.map(exp => [
    format(new Date(exp.date), 'MMM d, yyyy'),
    exp.service,
    exp.amount.toLocaleString(),
  ]);
  
  generatePdf('Expense Report', head, body, `expense-report-${format(new Date(), 'yyyy-MM-dd')}`);
};

export const generatePaymentsPdf = (payments: Payment[], staff: Staff[]) => {
    const staffMap = new Map(staff.map(s => [s.id, s.name]));
    
    const head = [['Date', 'Staff Member', 'Amount', 'Notes']];
    const body = payments.map(p => [
      format(new Date(p.date), 'MMM d, yyyy'),
      staffMap.get(p.staffId) || 'Unknown',
      p.amount.toLocaleString(),
      p.notes || '',
    ]);

    generatePdf('Salary Payments Report', head, body, `payments-report-${format(new Date(), 'yyyy-MM-dd')}`);
};
