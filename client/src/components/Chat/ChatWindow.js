import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Chat.module.css';

const SUGGESTIONS = [
  { icon: '📄', title: 'Resume Review',   desc: 'Get tips to stand out',   msg: 'How do I write a compelling resume that gets noticed?' },
  { icon: '🎤', title: 'Interview Coach', desc: 'Prepare to impress',      msg: 'What are the best strategies for acing a job interview?' },
  { icon: '💰', title: 'Salary Strategy', desc: 'Get what you deserve',    msg: 'How do I negotiate a higher salary effectively?' },
  { icon: '🔄', title: 'Career Pivot',    desc: 'Navigate transitions',    msg: 'I want to change careers — where do I start?' },
];

const formatText = (text) => {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/`(.+?)`/g,       '<code>$1</code>')
    .replace(/^### (.+)$/gm,   '<h4>$1</h4>')
    .replace(/^## (.+)$/gm,    '<h3>$1</h3>')
    .replace(/^[-•] (.+)$/gm,  '<li>$1</li>')
    .split('\n\n')
    .map(para => {
      if (para.startsWith('<')) return para;
      return `<p>${para}</p>`;
    })
    .join('');
};

const ChatWindow = ({ messages, isTyping, onSuggestion }) => {
  const { user }   = useAuth();
  const bottomRef  = useRef(null);
  const showWelcome = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className={styles.messages}>
      {showWelcome ? (
        <div className={styles.welcome}>
          <div className={styles.welcomeIcon}>🚀</div>
          <h2>Let's accelerate your career</h2>
          <p>Ask me anything about your career — from landing your first job to reaching the C-suite.</p>
          <div className={styles.suggestionGrid}>
            {SUGGESTIONS.map(s => (
              <div key={s.title} className={styles.sugCard} onClick={() => onSuggestion(s.msg)}>
                <div className={styles.sugIcon}>{s.icon}</div>
                <div className={styles.sugTitle}>{s.title}</div>
                <div className={styles.sugDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        messages.map((msg, i) => (
          <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.ai}`}>
            <div className={`${styles.msgAvatar} ${msg.role === 'user' ? styles.userAvatar : styles.aiAvatar}`}>
              {msg.role === 'user' ? user?.name?.[0]?.toUpperCase() || 'U' : '🧠'}
            </div>
            <div
              className={styles.bubble}
              dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
            />
          </div>
        ))
      )}

      {isTyping && (
        <div className={`${styles.message} ${styles.ai}`}>
          <div className={`${styles.msgAvatar} ${styles.aiAvatar}`}>🧠</div>
          <div className={styles.typingBubble}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
