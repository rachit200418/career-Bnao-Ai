
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Topbar.module.css';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.logo}>
        <div className={styles.icon}>🧠</div>
        <span className={styles.name}>Career Bnao Ai</span>
      </div>
      <div className={styles.right}>
        <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
        <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
};

export default Topbar;
