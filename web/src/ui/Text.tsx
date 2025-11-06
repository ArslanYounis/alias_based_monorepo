import React from 'react';

export interface TextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Text: React.FC<TextProps> = ({ children, style, className }) => {
  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
};

