
import React from 'react';
import styles from './Auth.module.css';

const AuthLayout = ({ children, subtitle }) => (
  <div className={styles.page}>
    <div className={styles.container}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🧠</div>
        <h1 className={styles.logoTitle}>Career Bnao Ai
        </h1>
        <p className={styles.logoSub}>{subtitle || 'Your intelligent career counseling companion'}</p>
      </div>
      <div className={styles.card}>
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
