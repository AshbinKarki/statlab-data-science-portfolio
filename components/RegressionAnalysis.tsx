import React, { useState, useMemo } from 'react';
import { Employee } from '../types';
import { calculateCorrelation, calculateMean } from '../services/statsService';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface RegressionAnalysisProps {
  data: Employee[];
}

const RegressionAnalysis: React.FC<RegressionAnalysisProps> = ({ data }) => {
  const [xMetric, setXMetric] = useState<keyof Employee>('yearsExperience');
  const [yMetric, setYMetric] = useState<keyof Employee>('salary');

  // Prepare Data
  const chartData = useMemo(() => {
    return data.map(item => ({
      x: Number(item[xMetric]),
      y: Number(item[yMetric]),
      id: item.id
    }));
  }, [data, xMetric, yMetric]);

  // Calculate Regression Line (Simple Linear: y = mx + c)
  const stats = useMemo(() => {
    const xVals = chartData.map(d => d.x);
    const yVals = chartData.map(d => d.y);
    const n = chartData.length;
    
    const meanX = calculateMean(xVals);
    const meanY = calculateMean(yVals);
    
    const numerator = xVals.reduce((sum, x, i) => sum + (x - meanX) * (yVals[i] - meanY), 0);
    const denominator = xVals.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0);
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    const correlation = calculateCorrelation(xVals, yVals);
    const rSquared = Math.pow(correlation, 2);

    // Generate line points for chart
    const minX = Math.min(...xVals);
    const maxX = Math.max(...xVals);
    const lineData = [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];

    return { slope, intercept, correlation, rSquared, lineData };
  }, [chartData]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
           <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
             <TrendingUp size={24} />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800">Regression Analysis</h2>
             <p className="text-sm text-slate-500">Visualize relationships between variables using Linear Regression.</p>
           </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
             <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Independent Variable (X)</label>
                <select 
                  value={xMetric} 
                  onChange={(e) => setXMetric(e.target.value as keyof Employee)}
                  className="w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="yearsExperience">Years Experience</option>
                  <option value="age">Age</option>
                  <option value="hoursWorkedPerWeek">Hours Worked/Week</option>
                </select>
             </div>
             <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Dependent Variable (Y)</label>
                <select 
                  value={yMetric} 
                  onChange={(e) => setYMetric(e.target.value as keyof Employee)}
                  className="w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="salary">Salary</option>
                  <option value="performanceScore">Performance Score</option>
                  <option value="hoursWorkedPerWeek">Hours Worked/Week</option>
                </select>
             </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 border rounded-lg">
                <p className="text-xs text-slate-500">Correlation (r)</p>
                <p className="text-lg font-bold text-slate-800">{stats.correlation.toFixed(3)}</p>
            </div>
            <div className="p-3 border rounded-lg">
                <p className="text-xs text-slate-500">R-Squared</p>
                <p className="text-lg font-bold text-slate-800">{stats.rSquared.toFixed(3)}</p>
            </div>
            <div className="p-3 border rounded-lg">
                <p className="text-xs text-slate-500">Slope (m)</p>
                <p className="text-lg font-bold text-slate-800">{stats.slope.toFixed(2)}</p>
            </div>
            <div className="p-3 border rounded-lg">
                <p className="text-xs text-slate-500">Intercept (c)</p>
                <p className="text-lg font-bold text-slate-800">{stats.intercept.toFixed(2)}</p>
            </div>
        </div>

        {/* Chart */}
        <div className="h-80 w-full border border-slate-100 rounded-lg p-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name={xMetric} label={{ value: xMetric, position: 'bottom', offset: 0 }} />
                <YAxis type="number" dataKey="y" name={yMetric} label={{ value: yMetric, angle: -90, position: 'insideLeft' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Employees" data={chartData} fill="#10b981" fillOpacity={0.6} />
                {/* We overlay a Line chart for the regression line. Note: Recharts Scatter doesn't support lines easily, so we use ComposedChart logic or custom svg. 
                    Actually, straightforward way in Recharts for mixed types is ComposedChart, but sticking to Scatter + manual SVG line or just a separate Scatter line is easier. 
                    Let's use a Scatter line for simplicity hack. */}
                <Scatter name="Trend" data={stats.lineData} line={{ stroke: '#ef4444', strokeWidth: 2 }} shape={() => null} legendType="none" /> 
              </ScatterChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default RegressionAnalysis;