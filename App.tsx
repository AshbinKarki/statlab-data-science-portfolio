import React, { useState, useEffect } from 'react';
import { generateDataset, downloadCSV } from './services/dataService';
import { Employee, StatModule, DescriptiveStats } from './types';
import { INITIAL_DATA_SIZE, FEATURE_LABELS } from './constants';
import { getDescriptiveStats } from './services/statsService';
import DataView from './components/DataView';
import StatsCard from './components/StatsCard';
import HypothesisTester from './components/HypothesisTester';
import RegressionAnalysis from './components/RegressionAnalysis';
import { 
  LayoutDashboard, 
  Table, 
  GitGraph, 
  Download, 
  RefreshCcw, 
  Sigma,
  PieChart
} from 'lucide-react';
import { generateStatisticalInsight } from './services/geminiService';

const App: React.FC = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [activeModule, setActiveModule] = useState<StatModule>('overview');
  const [loading, setLoading] = useState(false);
  const [generalInsight, setGeneralInsight] = useState<string | null>(null);

  // Initialize Data
  useEffect(() => {
    regenerateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const regenerateData = () => {
    setLoading(true);
    setTimeout(() => {
      const newData = generateDataset(INITIAL_DATA_SIZE);
      setData(newData);
      setLoading(false);
      setGeneralInsight(null); // Reset insight on new data
    }, 600);
  };

  const handleDownload = () => {
    if (data.length > 0) downloadCSV(data);
  };

  // Compute Overall Stats for Dashboard
  const salaryStats: DescriptiveStats = data.length ? getDescriptiveStats(data.map(e => e.salary)) : {} as any;
  const churnRate = data.length ? (data.filter(e => e.churned).length / data.length) * 100 : 0;

  const handleStatExplain = async (metric: string, val: string) => {
    const context = `Overall dataset statistics for a Tech Company. Metric: ${metric}`;
    const summary = `Value: ${val}. This is a descriptive statistic summarizing the central tendency or spread of the data.`;
    const insight = await generateStatisticalInsight(context, summary);
    alert(`AI Insight:\n\n${insight}`); // Simple alert for this specific demo interaction, ideally a modal.
  };

  const renderContent = () => {
    switch(activeModule) {
      case 'overview':
        return (
          <div className="space-y-6 animate-fade-in">
             {/* Key Metrics Row */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                  title="Total Employees" 
                  value={data.length} 
                  icon={<Sigma size={20} />}
                />
                <StatsCard 
                  title="Avg Salary" 
                  value={`$${salaryStats.mean?.toLocaleString(undefined, {maximumFractionDigits: 0})}`} 
                  subtitle={`SD: $${salaryStats.stdDev?.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
                  colorClass="bg-white"
                  onExplain={() => handleStatExplain("Average Salary", `$${salaryStats.mean}`)}
                />
                <StatsCard 
                  title="Churn Rate" 
                  value={`${churnRate.toFixed(1)}%`}
                  subtitle="Target: < 15%"
                  colorClass={churnRate > 15 ? "border-red-200 bg-red-50" : "bg-white"}
                  onExplain={() => handleStatExplain("Churn Rate", `${churnRate}%`)}
                />
                 <StatsCard 
                  title="Median Exp." 
                  value={`${getDescriptiveStats(data.map(e => e.yearsExperience)).median} Yrs`} 
                  icon={<PieChart size={20} />}
                />
             </div>

             {/* Distribution Grid (Simple Visualization) */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DataView data={data} />
                
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-lg">
                   <h3 className="text-lg font-bold mb-4">Why this project?</h3>
                   <div className="space-y-4 text-indigo-100 text-sm leading-relaxed">
                      <p>
                        This application demonstrates core <strong>Data Science competencies</strong>:
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Synthetic Data Generation:</strong> Creating realistic datasets using statistical distributions (Normal, Box-Muller transform).</li>
                        <li><strong>Hypothesis Testing:</strong> Implementing T-Tests to compare group means (e.g., Engineering vs Sales salaries).</li>
                        <li><strong>Regression Analysis:</strong> Calculating slopes, intercepts, and R-squared values to model relationships.</li>
                        <li><strong>Insight Automation:</strong> Using Gemini AI to translate statistical output into business language.</li>
                      </ul>
                      <div className="pt-4 mt-4 border-t border-indigo-800">
                        <p className="italic text-xs opacity-70">
                          Built with React, TypeScript, Tailwind, Recharts, and Google GenAI.
                        </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'hypothesis':
        return <HypothesisTester data={data} />;
      case 'regression':
        return <RegressionAnalysis data={data} />;
      default:
        return <DataView data={data} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
         <div className="p-6 border-b border-slate-100">
            <h1 className="text-xl font-extrabold text-indigo-600 flex items-center gap-2">
              <Sigma className="stroke-2"/> StatLab
            </h1>
            <p className="text-xs text-slate-400 mt-1">Data Science Portfolio</p>
         </div>
         
         <nav className="flex-1 p-4 space-y-1">
            <button 
              onClick={() => setActiveModule('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeModule === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
               <LayoutDashboard size={18} /> Overview
            </button>
            <button 
              onClick={() => setActiveModule('hypothesis')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeModule === 'hypothesis' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
               <FlaskConical size={18} /> Hypothesis Testing
            </button>
            <button 
              onClick={() => setActiveModule('regression')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeModule === 'regression' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
               <GitGraph size={18} /> Regression
            </button>
         </nav>

         <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-500 mb-2">Dataset Controls</p>
              <button 
                onClick={regenerateData}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 text-xs bg-white border border-slate-200 text-slate-700 py-2 rounded shadow-sm hover:bg-slate-50 active:scale-95 transition-all mb-2"
              >
                 <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Regenerate
              </button>
              <button 
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 text-xs bg-indigo-600 text-white py-2 rounded shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
              >
                 <Download size={14} /> Download CSV
              </button>
            </div>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
         {/* Mobile Header */}
         <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h1 className="font-bold text-indigo-600">StatLab</h1>
            <div className="flex gap-2">
              <button onClick={regenerateData} className="p-2 bg-slate-100 rounded-full"><RefreshCcw size={16}/></button>
            </div>
         </div>

         {/* View Content */}
         <div className="max-w-6xl mx-auto">
           {renderContent()}
         </div>
      </main>

      {/* Simple Mobile Nav (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
          <button onClick={() => setActiveModule('overview')} className={`p-2 rounded-full ${activeModule === 'overview' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}><LayoutDashboard size={20}/></button>
          <button onClick={() => setActiveModule('hypothesis')} className={`p-2 rounded-full ${activeModule === 'hypothesis' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}><FlaskConical size={20}/></button>
          <button onClick={() => setActiveModule('regression')} className={`p-2 rounded-full ${activeModule === 'regression' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}><GitGraph size={20}/></button>
      </div>

    </div>
  );
};

// Icon needed for Sidebar
const FlaskConical = ({size, className}: {size?: number, className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>
);

export default App;