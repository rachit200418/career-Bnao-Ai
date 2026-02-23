
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Layout/Topbar';

const cards = [
  {
    icon: '📋',
    title: 'Career Assessment',
    desc: 'Take our comprehensive assessment to discover careers that match your profile',
    btn: 'Start Assessment',
    color: 'var(--blue1)',
    route: '/assessment',
  },
  {
    icon: '💬',
    title: 'AI Career Chat',
    desc: 'Chat with our AI counselor for personalized career guidance and answers',
    btn: 'Start Chat',
    color: 'var(--cyan)',
    route: '/dashboard',
  },
  {
    icon: '📈',
    title: 'My Recommendations',
    desc: 'View your personalized career recommendations and insights',
    btn: 'View Results',
    color: 'var(--blue3)',
    route: '/recommendations',
  },
];

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', position:'relative', zIndex:10 }}>
      <Topbar />

      <div style={{
        flex:1, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'40px 24px',
      }}>

    
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h1 style={{
            fontFamily:'Syne,sans-serif', fontWeight:800,
            fontSize:'clamp(28px,4vw,42px)',
            background:'linear-gradient(135deg, var(--text), var(--blue3))',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            backgroundClip:'text', marginBottom:12,
          }}>
            Welcome to Your Dashboard
          </h1>
          <p style={{ color:'var(--text2)', fontSize:16 }}>
            Hey <strong style={{ color:'var(--cyan)' }}>{user?.name?.split(' ')[0]}</strong>! Choose an option below to start your career discovery journey 🚀
          </p>
        </div>

      
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',
          gap:24,
          width:'100%',
          maxWidth:960,
        }}>
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                background:'var(--panel)',
                border:'1px solid var(--border)',
                borderRadius:20,
                padding:28,
                display:'flex',
                flexDirection:'column',
                gap:16,
                position:'relative',
                overflow:'hidden',
                transition:'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                cursor:'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = card.color;
                e.currentTarget.style.boxShadow = `0 12px 40px rgba(26,107,255,0.2)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
           
              <div style={{
                position:'absolute', top:0, left:0, right:0, height:2,
                background:`linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                opacity:0.6,
              }} />

              <div style={{
                width:54, height:54, borderRadius:14,
                background:`rgba(26,107,255,0.12)`,
                border:`1px solid ${card.color}40`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:24,
              }}>
                {card.icon}
              </div>

          
              <div>
                <h3 style={{
                  fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, marginBottom:8,
                }}>{card.title}</h3>
                <p style={{ color:'var(--text2)', fontSize:14, lineHeight:1.6 }}>
                  {card.desc}
                </p>
              </div>

             
              <button
                onClick={() => navigate(card.route)}
                style={{
                  marginTop:'auto',
                  padding:'13px',
                  background:`linear-gradient(135deg, ${card.color}, var(--blue2))`,
                  border:'none', borderRadius:12,
                  color:'white', fontSize:14, fontWeight:600,
                  cursor:'pointer', fontFamily:'Space Grotesk,sans-serif',
                  transition:'transform 0.15s, box-shadow 0.15s',
                  width:'100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,107,255,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {card.btn}
              </button>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{
          display:'flex', gap:32, marginTop:48,
          flexWrap:'wrap', justifyContent:'center',
        }}>
          {[
            { value:'10K+', label:'Careers Guided' },
            { value:'95%',  label:'Success Rate' },
            { value:'24/7', label:'AI Available' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{
                fontFamily:'Syne,sans-serif', fontSize:28, fontWeight:800,
                background:'linear-gradient(135deg,var(--blue1),var(--cyan))',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}>{stat.value}</div>
              <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HomePage;