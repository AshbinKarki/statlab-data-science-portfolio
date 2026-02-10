import { Employee, Department } from '../types';

// Box-Muller transform for normal distribution
const randomNormal = (mean: number, stdDev: number): number => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
};

export const generateDataset = (size: number): Employee[] => {
  const data: Employee[] = [];
  const departments = Object.values(Department);

  for (let i = 0; i < size; i++) {
    const dept = departments[Math.floor(Math.random() * departments.length)];
    
    // 1. Generate Experience (Skewed right naturally, but let's use normal for simplicity 2-15 years)
    let experience = Math.abs(randomNormal(5, 3)); 
    if (experience > 30) experience = 30;
    
    // 2. Age is correlated with Experience
    // Base age 22 + experience + random noise
    const age = Math.floor(22 + experience + randomNormal(2, 2));

    // 3. Salary is correlated with Experience & Department
    let baseSalary = 50000;
    if (dept === Department.Engineering) baseSalary = 80000;
    if (dept === Department.DataScience) baseSalary = 85000;
    if (dept === Department.Sales) baseSalary = 60000;
    if (dept === Department.Marketing) baseSalary = 55000;

    // Salary increases with experience (Linear relationship + Noise)
    const salary = Math.floor(baseSalary + (experience * 5000) + randomNormal(0, 5000));

    // 4. Performance Score (Normal dist, but Data Science/Eng might have higher variance)
    // Correlated slightly with hours worked
    const hoursWorked = Math.max(30, Math.min(70, randomNormal(40, 5)));
    
    let performance = 70 + (hoursWorked - 40) * 0.5 + randomNormal(0, 10);
    // Sales performance is more volatile
    if (dept === Department.Sales) performance += randomNormal(0, 15);
    
    // Cap performance
    performance = Math.max(0, Math.min(100, performance));

    // 5. Churn (Logistic-like probability)
    // Higher probability if Low Salary relative to experience OR Overworked
    const salaryRatio = salary / (baseSalary + experience * 5000);
    let churnProb = 0.1; 
    if (salaryRatio < 0.9) churnProb += 0.3; // Underpaid
    if (hoursWorked > 55) churnProb += 0.2; // Burnout
    if (performance < 50) churnProb += 0.2; // Poor performance (fired)

    const churned = Math.random() < churnProb;

    data.push({
      id: i + 1,
      age,
      yearsExperience: parseFloat(experience.toFixed(1)),
      salary,
      performanceScore: parseFloat(performance.toFixed(1)),
      hoursWorkedPerWeek: parseFloat(hoursWorked.toFixed(1)),
      department: dept,
      churned
    });
  }

  return data;
};

export const downloadCSV = (data: Employee[]) => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).join(','));
  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "synthetic_employee_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};