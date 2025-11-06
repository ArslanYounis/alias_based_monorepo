import { ReactNode } from 'react';

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  style?: Record<string, any>;
}

export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
}

