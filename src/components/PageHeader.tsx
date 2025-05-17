
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`bg-gradient-to-r from-medical-blue to-medical-teal text-white py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{title}</h1>
        {subtitle && <p className="text-lg text-white/90">{subtitle}</p>}
      </div>
    </div>
  );
};

export default PageHeader;
