
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TOPICS = [
  { icon: '🎯', label: 'Career Planning',    value: 'general career advice' },
  { icon: '📄', label: 'Resume Building',    value: 'resume writing and optimization' },
  { icon: '🤝', label: 'Interview Prep',     value: 'job interview preparation' },
  { icon: '💰', label: 'Salary Negotiation', value: 'salary negotiation strategies' },
  { icon: '🌐', label: 'Networking',         value: 'networking and LinkedIn strategies' },
  { icon: '🔄', label: 'Career Change',      value: 'career change and pivot strategies' },
  { icon: '📚', label: 'Skill Development',  value: 'skill development and learning paths' },
  { icon: '👑', label: 'Leadership Growth',  value: 'leadership and management career growth' },
];

const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown Date';
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const groupByDate = (messages) => {
  const groups = {};
  messages.forEach((msg, i) => {
    const date = msg.createdAt ? formatDate(msg.createdAt) : 'Today';
    if (!groups[date]) groups[date] = [];
    groups[date].push({ ...msg, index: i });
  });
  return groups;
};

const ChatHistory = ({ isOpen, onClose }) => {
  const [sessions, setSessions]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [activeTab, setActiveTab]   = useState(null);
  const popupRef                    = useRef(null);

  useEffect(() => {
    if (isOpen) fetchAllHistory();
  }, [isOpen]);

  useEffect(() => {
    const handleClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  const fetchAllHistory = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        TOPICS.map(t =>
          axios.get(`/api/chat/history/${encodeURIComponent(t.value)}`)
            .then(res => ({ ...t, messages: res.data.messages || [] }))
            .catch(() => ({ ...t, messages: [] }))
        )
      );
      const withMessages = results.filter(s => s.messages.length > 0);
      setSessions(withMessages);
      if (withMessages.length > 0) setActiveTab(withMessages[0].value);
    } finally {
      setLoading(false);
    }
  };

  const clearTopic = async (topicValue, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/chat/history/${encodeURIComponent(topicValue)}`);
      const updated = sessions.filter(s => s.value !== topicValue);
      setSessions(updated);
      setActiveTab(updated.length > 0 ? updated[0].value : null);
    } catch {}
  };

  const activeSession = sessions.find(s => s.value === activeTab);
  const dateGroups    = activeSession ? groupByDate(activeSession.messages) : {};

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      zIndex: 200,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: 70,
    }}>
    
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
      }} />

     
      <div ref={popupRef} style={{
        position: 'relative',
        width: '90%',
        maxWidth: 700,
        maxHeight: '80vh',
        background: 'var(--panel)',
        border: '1px solid var(--border2)',
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(26,107,255,0.1)',
        animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes popIn {
            from { opacity:0; transform:scale(0.92) translateY(-10px); }
            to   { opacity:1; transform:scale(1) translateY(0); }
          }
        `}</style>

       
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--panel2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700 }}>
              📋 Chat History
            </h3>
            <p style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>
              {sessions.reduce((a,s) => a + s.messages.length, 0)} total messages • {sessions.length} topics
            </p>
          </div>
          <button onClick={onClose} style={{
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:8, color:'var(--text2)',
            width:32, height:32, cursor:'pointer', fontSize:16,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>✕</button>
        </div>

        {loading ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, color:'var(--text2)', padding:40 }}>
            <div style={{ fontSize:36, animation:'spin 1s linear infinite' }}>⏳</div>
            <p>Loading history...</p>
            <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, color:'var(--text2)', padding:40 }}>
            <div style={{ fontSize:48 }}>💬</div>
            <p style={{ fontSize:15, fontWeight:600 }}>Abhi koi history nahi</p>
            <p style={{ fontSize:13 }}>Pehle AI se kuch baat karo!</p>
          </div>
        ) : (
          <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

           
            <div style={{
              width:180, flexShrink:0,
              borderRight:'1px solid var(--border)',
              overflowY:'auto',
              background:'var(--panel2)',
              padding:'8px',
            }}>
              {sessions.map(s => (
                <div
                  key={s.value}
                  onClick={() => setActiveTab(s.value)}
                  style={{
                    padding:'10px 12px',
                    borderRadius:10,
                    cursor:'pointer',
                    marginBottom:4,
                    background: activeTab === s.value ? 'rgba(26,107,255,0.2)' : 'transparent',
                    border: `1px solid ${activeTab === s.value ? 'var(--blue1)' : 'transparent'}`,
                    transition:'all 0.15s',
                  }}
                >
                  <div style={{ fontSize:18, marginBottom:3 }}>{s.icon}</div>
                  <div style={{ fontSize:12, fontWeight:600, color: activeTab === s.value ? 'var(--text)' : 'var(--text2)' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize:11, color:'var(--text2)', marginTop:2 }}>
                    {s.messages.length} msgs
                  </div>
                </div>
              ))}
            </div>

            
            <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>
             
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:20 }}>{activeSession?.icon}</span>
                  <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15 }}>
                    {activeSession?.label}
                  </span>
                </div>
                <button
                  onClick={(e) => clearTopic(activeTab, e)}
                  style={{
                    background:'rgba(255,80,80,0.1)', border:'1px solid rgba(255,80,80,0.3)',
                    borderRadius:8, color:'#ff8080', fontSize:12,
                    padding:'5px 12px', cursor:'pointer', fontFamily:'Space Grotesk,sans-serif',
                  }}
                >
                  🗑️ Clear
                </button>
              </div>

             
              {Object.entries(dateGroups).map(([date, msgs]) => (
                <div key={date} style={{ marginBottom:24 }}>
                 
                  <div style={{
                    display:'flex', alignItems:'center', gap:10, marginBottom:12,
                  }}>
                    <div style={{
                      padding:'3px 12px',
                      background:'rgba(26,107,255,0.15)',
                      border:'1px solid var(--border2)',
                      borderRadius:20, fontSize:11, fontWeight:600, color:'var(--blue3)',
                    }}>
                      📅 {date}
                    </div>
                    <div style={{ flex:1, height:1, background:'var(--border)' }} />
                  </div>

                  
                  {msgs.map((msg, i) => (
                    <div key={i} style={{
                      display:'flex', gap:10, alignItems:'flex-start',
                      marginBottom:10,
                      animation:'msgIn 0.2s ease',
                    }}>
                      <div style={{
                        width:28, height:28, borderRadius:8, flexShrink:0,
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg,#2d1b8e,var(--blue1))'
                          : 'linear-gradient(135deg,var(--blue1),var(--cyan))',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:12, color:'white', fontWeight:700,
                      }}>
                        {msg.role === 'user' ? 'U' : '🧠'}
                      </div>
                      <div style={{
                        flex:1,
                        background: msg.role === 'user' ? 'rgba(26,107,255,0.1)' : 'var(--panel2)',
                        border:'1px solid var(--border)',
                        borderRadius:10,
                        padding:'10px 14px',
                      }}>
                        <div style={{
                          fontSize:11, color:'var(--text2)', marginBottom:5,
                          display:'flex', alignItems:'center', gap:6,
                        }}>
                          <span style={{ fontWeight:600, color: msg.role === 'user' ? 'var(--blue3)' : 'var(--cyan)' }}>
                            {msg.role === 'user' ? 'You' : 'CareerMind AI'}
                          </span>
                          {msg.createdAt && (
                            <span>• {formatTime(msg.createdAt)}</span>
                          )}
                        </div>
                        <div style={{ fontSize:13, color:'var(--text)', lineHeight:1.6 }}>
                          {msg.text.length > 300 ? msg.text.slice(0, 300) + '...' : msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;