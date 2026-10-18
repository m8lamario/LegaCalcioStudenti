import React from 'react';
import styles from './Container.module.css';

export interface ContainerProps {
  children: React.ReactNode;
  as?: 'div' | 'section' | 'article' | 'nav' | 'header' | 'footer';
  className?: string;
  fluid?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  as: Component = 'div',
  className = '',
  fluid = false
}) => {
  const containerClass = fluid ? styles.fluid : styles.container;
  return (
    <Component className={`${containerClass} ${className}`}>
      {children}
    </Component>
  );
};
