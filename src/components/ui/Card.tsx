import type { CardProps } from '../../types';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
}: CardProps) => {
  const baseClasses = 'bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-shadow duration-300';
  
  const hoverClass = hoverable ? 'hover:shadow-xl cursor-pointer' : '';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`${baseClasses} ${hoverClass} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

