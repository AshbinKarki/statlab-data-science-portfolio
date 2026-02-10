import React, { useState } from 'react';
import { Employee, Department, TTestResult } from '../types';
import { performTTest } from '../services/statsService';
import { generateStatisticalInsight } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FlaskConical, BrainCircuit } from 'lucide-react';

interface HypothesisTesterProps {
  data: Employee[];
}

const HypothesisTester: React.FC<HypothesisTesterProps> = ({ data }) => {
  const [metric, setMetric] = useState<keyof Employee>('salary');
  const [dept1, setDept1] = useState<Department>(Department.Engineering);
  const [dept2, setDept2] = useState<Department>(Department.Sales);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Filter Data
  const group1Data = data.filter(e => e.department === dept1).map(e => Number(e[metric]));
  const group2Data = data.filter(e => e.department === dept2).map(e => Number(e[metric]));

  // Run Test
  const result: TTestResult = performTTest(group1Data, group2Data);

  const chartData = [
    { name: dept1, value: result.group1Mean },
    { name: dept2, value: result.group2Mean },
  ];

  const handleAiExplain = async () => {
    setLoadingAi(true);
    const summary = `
      Comparing: ${dept1} vs ${dept2} on metric: ${metric}.
      Group 1 Mean: ${result.group1Mean.toFixed(2)}.
      Group 2 Mean: ${result.group2Mean.toFixed(2)}.
      T-Statistic: ${result.tStat.toFixed(3)}.
      P-Value: ${result.pValue < 0.05 ? '< 0.05' : '> 0.05'}.
      Significant Difference: ${result.significant}.
    `;
    const insight = await generateStatisticalInsight("Independent Samples T-Test (Hypothesis Testing)", summary);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
           <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
             <FlaskConical size={24} />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800">Hypothesis Testing Lab</h2>
             <p className="text-sm text-slate-500">Perform T-Tests to compare means between different departments.</p>
           </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Metric to Compare</label>
            <select 
              value={metric} 
              onChange={(e) => setMetric(e.target.value as keyof Employee)}
              className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="salary">Salary</option>
              <option value="performanceScore">Performance Score</option>
              <option value="hoursWorkedPerWeek">Hours Worked/Week</option>
              <option value="yearsExperience">Years Experience</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Group 1 (Department)</label>
            <select 
              value={dept1} 
              onChange={(e) => setDept1(e.target.value as Department)}
              className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Group 2 (Department)</label>
            <select 
              value={dept2} 
              onChange={(e) => setDept2(e.target.value as Department)}
              className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {Object.values(Department).filter(d => d !== dept1).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Results Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Stats & Logic */}
          <div className="space-y-4">
             <h3 className="font-semibold text-slate-700">Test Results</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase">T-Statistic</p>
                  <p className="text-xl font-mono font-bold text-slate-800">{result.tStat.toFixed(4)}</p>
                </div>
                <div className={`p-4 rounded-lg border ${result.significant ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <p className="text-xs text-slate-500 uppercase">Significance (p &lt; 0.05)</p>
                  <p className={`text-xl font-bold ${result.significant ? 'text-green-700' : 'text-red-700'}`}>
                    {result.significant ? "Significant" : "Not Significant"}
                  </p>
                </div>
             </div>
             
             <div className="bg-white border border-slate-200 rounded-lg p-4">
               <div className="flex justify-between items-center mb-2">
                 <h4 className="font-medium text-slate-800 flex items-center gap-2">
                   <BrainCircuit size={16} className="text-indigo-500"/>
                   AI Analysis
                 </h4>
                 <button 
                  onClick={handleAiExplain}
                  disabled={loadingAi}
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition disabled:opacity-50"
                 >
                   {loadingAi ? 'Thinking...' : 'Generate Insight'}
                 </button>
               </div>
               <p className="text-sm text-slate-600 leading-relaxed min-h-[80px]">
                 {aiInsight || "Click 'Generate Insight' to get a data scientist's interpretation of these results using Gemini."}
               </p>
             </div>
          </div>

          {/* Visualization */}
          <div className="h-64 bg-slate-50 rounded-lg border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-center text-slate-500 mb-2">Mean Comparison</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HypothesisTester;