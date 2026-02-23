
import React, { useState } from 'react';
import Topbar      from '../components/Layout/Topbar';
import ChatWindow  from '../components/Chat/ChatWindow';
import ChatInput   from '../components/Chat/ChatInput';
import ChatHistory from '../components/Chat/ChatHistory';
import useChat     from '../hooks/useChat';
import styles      from './Dashboard.module.css';

const DashboardPage = () => {
  const { messages, isTyping, sendMessage, clearMessages } = useChat('general career advice');
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Topbar />

      <ChatHistory isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />

      <div className={styles.body}>
        <main className={styles.main}>

        
          <div style={{
            padding: '12px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            background: 'var(--panel)',
            flexShrink: 0,
          }}>
            <button
              onClick={() => setHistoryOpen(true)}
              style={{
                padding: '6px 14px',
                background: 'rgba(26,107,255,0.15)',
                border: '1px solid var(--border2)',
                borderRadius: 8,
                color: 'var(--blue3)',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
              }}
            >📋 History</button>

            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                style={{
                  padding: '6px 14px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text2)',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >Clear chat</button>
            )}
          </div>

          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            onSuggestion={sendMessage}
          />

          <ChatInput onSend={sendMessage} disabled={isTyping} />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;