import React from 'react';
import clsx from 'clsx';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

export function Separator({ 
  orientation = 'horizontal', 
  className = '',
  spacing = 'md'
}: SeparatorProps) {
  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    lg: orientation === 'horizontal' ? 'my-6' : 'mx-6',
  };

  if (orientation === 'horizontal') {
    return (
      <div 
        className={clsx(
          'h-px bg-white/10',
          spacingClasses[spacing],
          className
        )} 
      />
    );
  }

  return (
    <div 
      className={clsx(
        'w-px h-full bg-white/10',
        spacingClasses[spacing],
        className
      )} 
    />
  );
}

