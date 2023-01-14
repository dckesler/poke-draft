import React from 'react';
import styles from './styles.module.css';

type PageProps = {
  children: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ children }) => {
  return (
    <div className={styles.page}>
      {children}
    </div>
  )
}
