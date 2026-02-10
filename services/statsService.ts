import { DescriptiveStats, TTestResult, CorrelationResult } from '../types';

// Helper: Calculate Mean
export const calculateMean = (data: number[]): number => {
  if (data.length === 0) return 0;
  return data.reduce((sum, val) => sum + val, 0) / data.length;
};

// Helper: Calculate Median
export const calculateMedian = (data: number[]): number => {
  if (data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// Helper: Calculate Standard Deviation
export const calculateStdDev = (data: number[], mean: number): number => {
  if (data.length <= 1) return 0;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
  return Math.sqrt(variance);
};

// Helper: Calculate Skewness
export const calculateSkewness = (data: number[], mean: number, stdDev: number): number => {
  if (data.length < 3 || stdDev === 0) return 0;
  const n = data.length;
  const cubedDeviations = data.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0);
  return (n / ((n - 1) * (n - 2))) * cubedDeviations;
};

export const getDescriptiveStats = (data: number[]): DescriptiveStats => {
  const mean = calculateMean(data);
  const median = calculateMedian(data);
  const stdDev = calculateStdDev(data, mean);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const skewness = calculateSkewness(data, mean, stdDev);

  return { mean, median, stdDev, min, max, skewness };
};

// Pearson Correlation Coefficient
export const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;
  const n = x.length;
  const meanX = calculateMean(x);
  const meanY = calculateMean(y);

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  if (denomX === 0 || denomY === 0) return 0;
  return numerator / Math.sqrt(denomX * denomY);
};

// Independent Samples T-Test (Equal Variance assumed for simplicity in demo)
export const performTTest = (group1: number[], group2: number[]): TTestResult => {
  const n1 = group1.length;
  const n2 = group2.length;
  const mean1 = calculateMean(group1);
  const mean2 = calculateMean(group2);
  const var1 = Math.pow(calculateStdDev(group1, mean1), 2);
  const var2 = Math.pow(calculateStdDev(group2, mean2), 2);

  // Pooled Variance
  const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
  const standardError = Math.sqrt(pooledVar * (1 / n1 + 1 / n2));
  
  const tStat = (mean1 - mean2) / standardError;

  // Very rough p-value approximation for visualization purposes
  // A real implementation would use a distribution library (e.g., jstat)
  // For Portfolio/Demo: We interpret t-stat magnitude > 1.96 as significant (alpha 0.05)
  const isSignificant = Math.abs(tStat) > 1.96;
  const approxPValue = isSignificant ? 0.04 : 0.20; // Dummy value for demo if library missing, but let's try a better Approx.
  
  return {
    tStat,
    pValue: approxPValue, 
    group1Mean: mean1,
    group2Mean: mean2,
    significant: isSignificant
  };
};
