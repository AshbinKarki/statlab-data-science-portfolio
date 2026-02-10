import React from 'react';
import { Employee } from '../types';

interface DataViewProps {
  data: Employee[];
}

const DataView: React.FC<DataViewProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-slate-800">Raw Dataset Preview (First 50 Rows)</h3>
        <span className="text-xs text-slate-500 font-mono">Total Rows: {data.length}</span>
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3 text-right">Age</th>
              <th className="px-6 py-3 text-right">Experience (Yrs)</th>
              <th className="px-6 py-3 text-right">Salary ($)</th>
              <th className="px-6 py-3 text-right">Perf. Score</th>
              <th className="px-6 py-3 text-right">Hours/Week</th>
              <th className="px-6 py-3 text-center">Churned</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 50).map((row) => (
              <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-medium text-slate-900">{row.id}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${row.department === 'Engineering' ? 'bg-blue-100 text-blue-700' : 
                      row.department === 'Sales' ? 'bg-green-100 text-green-700' :
                      row.department === 'HR' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'}`}>
                    {row.department}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">{row.age}</td>
                <td className="px-6 py-3 text-right">{row.yearsExperience}</td>
                <td className="px-6 py-3 text-right font-mono">${row.salary.toLocaleString()}</td>
                <td className="px-6 py-3 text-right">
                  <span className={row.performanceScore < 50 ? "text-red-500 font-bold" : "text-slate-700"}>
                    {row.performanceScore}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">{row.hoursWorkedPerWeek}</td>
                <td className="px-6 py-3 text-center">
                  {row.churned ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full text-xs font-bold">Y</span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-100 text-slate-400 rounded-full text-xs">N</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
        Showing limited rows for performance. Download CSV for full dataset.
      </div>
    </div>
  );
};

export default DataView;