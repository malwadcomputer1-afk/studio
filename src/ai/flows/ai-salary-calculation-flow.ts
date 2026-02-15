'use server';
/**
 * @fileOverview An AI agent for calculating staff salaries.
 *
 * - calculateSalary - A function that handles the AI-powered salary calculation process.
 * - CalculateSalaryInput - The input type for the calculateSalary function.
 * - CalculateSalaryOutput - The return type for the calculateSalary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AttendanceRecordSchema = z.object({
  date: z.string().describe('The date of the attendance record in YYYY-MM-DD format.'),
  status: z
    .enum(['Present', 'Absent', 'Half-Day', 'Overtime'])
    .describe('The attendance status for the day.'),
  hoursWorked: z.number().optional().describe('Number of hours worked on this day, applicable for Present/Overtime.'),
  overtimeHours: z.number().optional().describe('Number of overtime hours for the day.'),
});

const DeductionSchema = z.object({
  description: z.string().describe('Description of the deduction.'),
  amount: z.number().describe('Amount of the deduction.'),
});

const CalculateSalaryInputSchema = z.object({
  staffName: z.string().describe('The name of the staff member.'),
  yearlySalary: z.number().describe("The staff member's total yearly salary."),
  totalPaymentsMade: z.number().describe('Total payments already made to the staff member during this period.'),
  attendanceRecords: z.array(AttendanceRecordSchema).describe('A list of daily attendance records for the pay period.'),
  dateRange: z.object({
      from: z.string().describe('Start date of the pay period in YYYY-MM-DD format.'),
      to: z.string().describe('End date of the pay period in YYYY-MM-DD format.'),
  }),
  deductions: z.array(DeductionSchema).optional().describe('A list of other deductions for the staff member.'),
});
export type CalculateSalaryInput = z.infer<typeof CalculateSalaryInputSchema>;

const CalculateSalaryOutputSchema = z.object({
  calculatedSalary: z.number().describe('The total calculated salary.'),
  calculationBreakdown: z.string().describe('A detailed, human-readable breakdown of how the salary was calculated.'),
});
export type CalculateSalaryOutput = z.infer<typeof CalculateSalaryOutputSchema>;

export async function calculateSalary(input: CalculateSalaryInput): Promise<CalculateSalaryOutput> {
  return calculateSalaryFlow(input);
}

const calculateSalaryPrompt = ai.definePrompt({
  name: 'calculateSalaryPrompt',
  input: { schema: CalculateSalaryInputSchema },
  output: { schema: CalculateSalaryOutputSchema },
  prompt: `You are an expert payroll specialist. Calculate the final salary to be paid for {{{staffName}}} for the period from {{{dateRange.from}}} to {{{dateRange.to}}}.

Base Information:
- Staff Name: {{{staffName}}}
- Total Yearly Salary: {{{yearlySalary}}}
- Total Payments Already Made in this period: {{{totalPaymentsMade}}}
- Pay Period: {{{dateRange.from}}} to {{{dateRange.to}}}

Attendance Records for the period:
{{#each attendanceRecords}}
- Date: {{{date}}}, Status: {{{status}}}
{{/each}}

{{#if deductions.length}}
Other Deductions:
{{#each deductions}}
- Description: {{{description}}}, Amount: {{{amount}}}
{{/each}}
{{else}}
No other deductions.
{{/if}}

Calculation Rules:
1.  Determine the daily salary. You can assume a standard of 260 working days per year. Daily Salary = Yearly Salary / 260.
2.  Calculate the total earned salary for the period based on the attendance records.
    - For each 'Present' or 'Overtime' day, add one full daily salary.
    - For each 'Half-Day', add half of the daily salary.
    - 'Absent' days contribute 0 to the earned salary.
3.  The sum from step 2 is the Gross Earned Salary for the period.
4.  From the Gross Earned Salary, subtract the 'Total Payments Already Made' in this period.
5.  From the result, subtract the total amount of any 'Other Deductions'.
6.  The final result is the Net Salary to be paid.

Task:
1.  Calculate the final net salary to be paid based on the provided data and rules.
2.  Provide a detailed, step-by-step breakdown of the calculation in the 'calculationBreakdown' field. It should include:
    - The calculated daily salary.
    - A summary of days worked (present, half-day, absent).
    - The Gross Earned Salary calculation.
    - Subtraction of payments already made.
    - Subtraction of other deductions.
    - The final Net Salary.
3.  The final numeric salary must be placed in the 'calculatedSalary' field.
`,
});

const calculateSalaryFlow = ai.defineFlow(
  {
    name: 'calculateSalaryFlow',
    inputSchema: CalculateSalaryInputSchema,
    outputSchema: CalculateSalaryOutputSchema,
  },
  async (input) => {
    const { output } = await calculateSalaryPrompt(input);
    return output!;
  }
);
