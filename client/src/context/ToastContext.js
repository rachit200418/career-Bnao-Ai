
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: 'var(--panel)',
            border: `1px solid ${t.type === 'error' ? 'rgba(255,80,80,0.4)' : 'rgba(26,107,255,0.4)'}`,
            color: t.type === 'error' ? '#ff8080' : 'var(--cyan)',
            borderRadius: 12,
            padding: '13px 18px',
            fontSize: 13,
            fontFamily: 'Space Grotesk, sans-serif',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            maxWidth: 300,
            animation: 'toastIn 0.3s ease',
          }}>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
