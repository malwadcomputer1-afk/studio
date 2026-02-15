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
  hourlyRate: z.number().describe('The staff member\'s hourly rate.'),
  standardWorkHoursPerDay: z.number().default(8).describe('Standard working hours per full day.'),
  halfDayHours: z.number().optional().describe('Optional: Hours counted for a half-day, if different from standardWorkHoursPerDay / 2.'),
  overtimeRateMultiplier: z.number().default(1.5).describe('Multiplier for overtime hours, e.g., 1.5 for time and a half.'),
  attendanceRecords: z.array(AttendanceRecordSchema).describe('A list of daily attendance records for the pay period.'),
  deductions: z.array(DeductionSchema).optional().describe('A list of deductions for the staff member.'),
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
  prompt: `You are an expert payroll specialist. Calculate the salary for {{{staffName}}}.

Base Information:
- Staff Name: {{{staffName}}}
- Hourly Rate: {{{hourlyRate}}}
- Standard Work Hours per Day: {{{standardWorkHoursPerDay}}}
- Overtime Rate Multiplier: {{{overtimeRateMultiplier}}}

Attendance Records:
{{#each attendanceRecords}}
- Date: {{{date}}}, Status: {{{status}}}{{#if hoursWorked}}, Hours Worked: {{{hoursWorked}}}{{/if}}{{#if overtimeHours}}, Overtime Hours: {{{overtimeHours}}}{{/if}}
{{/each}}

{{#if deductions.length}}
Deductions:
{{#each deductions}}
- Description: {{{description}}}, Amount: {{{amount}}}
{{/each}}
{{else}}
No deductions.
{{/if}}

Calculation Rules:
- 'Present' status: Use 'hoursWorked' if provided, otherwise assume {{{standardWorkHoursPerDay}}} hours.
- 'Half-Day' status: Hours are half of a standard day ({{{standardWorkHoursPerDay}}} / 2).
- 'Overtime' status: In addition to regular hours, 'overtimeHours' are paid at {{{overtimeRateMultiplier}}} times the hourly rate.
- 'Absent' status: 0 hours.
- Deduct the total amount from any 'Deductions' from the gross salary.

Task:
1.  Calculate the final salary based on the provided data and rules.
2.  Provide a detailed, step-by-step breakdown of the calculation in the 'calculationBreakdown' field. The breakdown should be clear, easy to follow, and explain how the total was reached.
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
