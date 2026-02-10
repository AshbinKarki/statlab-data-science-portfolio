import React from 'react';
import { Info } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  colorClass?: string;
  onExplain?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon, colorClass = "bg-white", onExplain }) => {
  return (
    <div className={`p-6 rounded-xl shadow-sm border border-slate-200 ${colorClass} transition-all duration-200 hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
           {icon && <div className="p-2 bg-slate-100 rounded-lg text-slate-600">{icon}</div>}
           {onExplain && (
             <button 
               onClick={(e) => { e.stopPropagation(); onExplain(); }}
               className="p-2 hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 rounded-lg transition-colors"
               title="Ask AI to explain this"
             >
               <Info size={18} />
             </button>
           )}
        </div>
       
      </div>
    </div>
  );
};

export default StatsCard;