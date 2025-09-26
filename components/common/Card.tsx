
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden ${className}`}>
      {title && <h3 className="text-xl font-bold p-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{title}</h3>}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
