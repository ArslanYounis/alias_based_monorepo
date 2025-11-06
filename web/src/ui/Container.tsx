import React from 'react';
import type { ContainerProps } from '@shared/types';

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '',
  style 
}) => {
  const containerClassName = `container ${className}`.trim();
  
  return (
    <div className={containerClassName} style={style}>
      {children}
    </div>
  );
};

