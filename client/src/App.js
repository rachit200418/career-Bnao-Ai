
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import HomePage            from './pages/HomePage';
import DashboardPage       from './pages/DashboardPage';
import AssessmentPage      from './pages/AssessmentPage';
import RecommendationsPage from './pages/RecommendationsPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/home" replace /> : children;
};

const LoadingScreen = () => (
  <div style={{
    height:'100vh', display:'flex', alignItems:'center',
    justifyContent:'center', flexDirection:'column', gap:16,
    position:'relative', zIndex:10,
  }}>
    <div style={{ fontSize:48, animation:'spin 1s linear infinite' }}>🧠</div>
    <p style={{ color:'var(--text2)', fontSize:14 }}>Loading CareerMind AI...</p>
    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
  </div>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/"                element={<Navigate to="/login" replace />} />
          <Route path="/login"           element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register"        element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/home"            element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/dashboard"       element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/assessment"      element={<PrivateRoute><AssessmentPage /></PrivateRoute>} />
          <Route path="/recommendations" element={<PrivateRoute><RecommendationsPage /></PrivateRoute>} />
          <Route path="*"                element={<Navigate to="/login" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;