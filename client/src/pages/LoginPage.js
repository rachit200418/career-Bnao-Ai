
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuthLayout from '../components/Auth/AuthLayout';
import styles from '../components/Auth/Auth.module.css';

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login }    = useAuth();
  const { showToast } = useToast();
  const navigate      = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      showToast(`Welcome back, ${data.user.name.split(' ')[0]}! 👋`);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Your intelligent career counseling companion">
      <h2>Welcome back</h2>
      <p className={styles.sub}>Sign in to continue your career journey</p>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>
      </form>

      <div className={styles.divider}>or</div>
      <div className={styles.switchLink}>
        Don't have an account?{' '}
        <a onClick={() => navigate('/register')}>Create one free</a>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;