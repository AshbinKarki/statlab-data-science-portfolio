import { Department } from './types';

export const DEPARTMENTS = Object.values(Department);

export const CHART_COLORS = {
  primary: '#4f46e5', // Indigo 600
  secondary: '#06b6d4', // Cyan 500
  accent: '#f59e0b', // Amber 500
  danger: '#ef4444', // Red 500
  success: '#10b981', // Emerald 500
  neutral: '#64748b', // Slate 500
};

export const INITIAL_DATA_SIZE = 200;

export const FEATURE_LABELS: Record<string, string> = {
  age: "Age (Years)",
  yearsExperience: "Experience (Years)",
  salary: "Annual Salary ($)",
  performanceScore: "Performance Score (0-100)",
  hoursWorkedPerWeek: "Weekly Hours",
};