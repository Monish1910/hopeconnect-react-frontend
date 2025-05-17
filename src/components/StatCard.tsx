
import React from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon, className = '' }) => {
  return (
    <div className={`stat-card ${className}`}>
      {icon && <div className="mb-3 text-medical-blue">{icon}</div>}
      <h3 className="text-3xl md:text-4xl font-bold text-medical-blue mb-2">{value}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

export default StatCard;
