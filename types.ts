export enum Department {
  Engineering = 'Engineering',
  Sales = 'Sales',
  HR = 'HR',
  Marketing = 'Marketing',
  DataScience = 'Data Science'
}

export interface Employee {
  id: number;
  age: number;
  yearsExperience: number;
  salary: number;
  performanceScore: number; // 0-100
  hoursWorkedPerWeek: number;
  department: Department;
  churned: boolean; // 0 or 1
}

export interface DescriptiveStats {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  skewness: number;
}

export interface TTestResult {
  tStat: number;
  pValue: number; // Simplified estimation
  group1Mean: number;
  group2Mean: number;
  significant: boolean;
}

export interface CorrelationResult {
  featureA: string;
  featureB: string;
  correlation: number;
}

export type StatModule = 'overview' | 'distributions' | 'correlations' | 'hypothesis' | 'regression';
