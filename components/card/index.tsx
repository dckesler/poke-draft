import React, { FC, ReactNode } from 'react';
import styles from './styles.module.css';

type CardProps = {
  children: ReactNode;
}

export const Card: FC<CardProps> = ({ children }) => {
  return (
    <div className={styles.card}>
      {children}
    </div>
  )
}
