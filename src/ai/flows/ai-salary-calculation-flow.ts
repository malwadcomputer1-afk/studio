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
    .enum(['Present', 'Absent', 'Half-Day'])
    .describe('The attendance status for the day.'),
  hoursWorked: z.number().optional().describe('Number of hours worked on this day, applicable for Present.'),
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
  prompt: `You are an expert payroll specialist. Your task is to calculate the final salary to be paid for {{{staffName}}} for the period from {{{dateRange.from}}} to {{{dateRange.to}}}.

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
1.  **Calculate salaries based on a 30-day month.**
2.  **Determine Monthly Salary:** Monthly Salary = Yearly Salary / 12.
3.  **Determine Daily Salary:** Daily Salary = Monthly Salary / 30.
4.  **Calculate Gross Earned Salary:**
    -   Start with the full Monthly Salary for the period.
    -   For each 'Absent' day, subtract one full Daily Salary.
    -   For each 'Half-Day', subtract half of a Daily Salary.
    -   'Present' days do not change the salary from the base monthly amount.
5.  **Calculate Net Salary:**
    -   From the Gross Earned Salary, subtract the 'Total Payments Already Made' in this period.
    -   From the result, subtract the total amount of any 'Other Deductions'.
6.  **The final result is the Net Salary to be paid.**

Task:
1.  Calculate the final net salary to be paid using the rules above.
2.  Provide a detailed, step-by-step breakdown in the 'calculationBreakdown' field, including:
    -   Calculated Monthly Salary.
    -   Calculated Daily Salary.
    -   A summary of deductions for absent and half-days.
    -   The Gross Earned Salary calculation.
    -   Subtraction of payments already made.
    -   Subtraction of other deductions.
    -   The final Net Salary.
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
