
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuthLayout from '../components/Auth/AuthLayout';
import styles from '../components/Auth/Auth.module.css';

const CAREER_STAGES = [
  'Student / Fresh Graduate',
  'Early Career (1-3 years)',
  'Mid Career (3-10 years)',
  'Senior / Leadership',
  'Career Changer',
];

const getStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', careerStage: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const { register }  = useAuth();
  const { showToast } = useToast();
  const navigate      = useNavigate();

  const strength      = getStrength(form.password);
  const strengthColor = ['#ff4040', '#ff8c00', '#3d8bff', '#00d4ff'][strength - 1] || '';
  const strengthWidth = form.password ? `${(strength / 4) * 100}%` : '0%';

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password, form.careerStage);
      showToast(`Welcome to CareerMind, ${data.user.name.split(' ')[0]}! 🎉`);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Start your personalized career journey">
      <h2>Create account</h2>
      <p className={styles.sub}>Join thousands growing their careers with AI</p>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Career Stage</label>
          <select name="careerStage" value={form.careerStage} onChange={handleChange}>
            <option value="">Select your stage...</option>
            {CAREER_STAGES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Min 8 characters"
            value={form.password}
            onChange={handleChange}
            required
          />
          <div className={styles.strengthBar}>
            <div
              className={styles.strengthFill}
              style={{ width: strengthWidth, background: strengthColor }}
            />
          </div>
        </div>
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account →'}
        </button>
      </form>

      <div className={styles.switchLink} style={{ marginTop: 20 }}>
        Already have an account?{' '}
        <a onClick={() => navigate('/login')}>Sign in</a>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;