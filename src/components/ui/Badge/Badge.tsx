import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'aqua' | 'blue' | 'institutional' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const variantClass = styles[variant] || styles.neutral;
  const sizeClass = styles[size] || styles.md;

  return (
    <span className={`${styles.badge} ${variantClass} ${sizeClass} ${className}`}>
      {dot && <span className={styles.dotIndicator} aria-hidden="true" />}
      {children}
    </span>
  );
};
