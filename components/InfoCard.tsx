import React from 'react';

interface InfoCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value, unit, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-sm border border-white/30">
      <div className="text-slate-700 mb-1 scale-75 opacity-80">{icon}</div>
      <span className="text-2xl font-semibold text-slate-800">
        {value}<span className="text-sm font-normal text-slate-600 ml-0.5">{unit}</span>
      </span>
      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-1">{label}</span>
    </div>
  );
};

export default InfoCard;