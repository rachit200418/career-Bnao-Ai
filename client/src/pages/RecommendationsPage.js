
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Layout/Topbar';

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [assessment, setAssessment]           = useState(null);
  const [expanded, setExpanded]               = useState(null);
  const navigate                               = useNavigate();

  useEffect(() => {
    const rec = localStorage.getItem('cm_recommendations');
    const ass = localStorage.getItem('cm_assessment');
    if (rec) setRecommendations(JSON.parse(rec));
    if (ass) setAssessment(JSON.parse(ass));
  }, []);

  const matchColor = (match) => {
    if (match >= 85) return '#00d4ff';
    if (match >= 70) return '#1a6bff';
    return '#8ca0c8';
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', position:'relative', zIndex:10 }}>
      <Topbar />

      <div style={{ flex:1, overflowY:'auto', padding:'32px 24px', display:'flex', flexDirection:'column', alignItems:'center' }}>

        {recommendations.length === 0 ? (
          /* ── No Recommendations ── */
          <div style={{
            flex:1, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            textAlign:'center', gap:16, paddingTop:80,
          }}>
            <div style={{ fontSize:72 }}>📭</div>
            <h2 style={{
              fontFamily:'Syne,sans-serif', fontSize:26, fontWeight:800,
              background:'linear-gradient(135deg,var(--text),var(--blue3))',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            }}>No Recommendations Yet</h2>
            <p style={{ color:'var(--text2)', fontSize:15, maxWidth:380, lineHeight:1.7 }}>
              Complete your Career Assessment first and our AI will generate personalized career recommendations just for you!
            </p>
            <button
              onClick={() => navigate('/assessment')}
              style={{
                marginTop:8, padding:'13px 32px',
                background:'linear-gradient(135deg,var(--blue1),var(--blue2))',
                border:'none', borderRadius:12, color:'white',
                fontSize:15, fontWeight:600, cursor:'pointer',
                fontFamily:'Space Grotesk,sans-serif',
                boxShadow:'0 6px 20px rgba(26,107,255,0.4)',
              }}
            >
              🎯 Start Assessment
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ width:'100%', maxWidth:800, marginBottom:32, textAlign:'center' }}>
              <h1 style={{
                fontFamily:'Syne,sans-serif', fontSize:'clamp(24px,3vw,36px)', fontWeight:800,
                background:'linear-gradient(135deg,var(--text),var(--blue3))',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                marginBottom:8,
              }}>Your Career Recommendations 🎯</h1>
              <p style={{ color:'var(--text2)', fontSize:14 }}>
                Based on your assessment — AI found {recommendations.length} best career matches for you
              </p>

              {/* Assessment Summary chips */}
              {assessment && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', marginTop:16 }}>
                  {[
                    `📍 ${assessment.city}`,
                    `🎓 ${assessment.education}`,
                    `💼 ${assessment.currentStatus}`,
                    `⏱️ Goal: ${assessment.timeframe}`,
                  ].map((tag, i) => (
                    <span key={i} style={{
                      padding:'4px 12px', borderRadius:20,
                      background:'rgba(26,107,255,0.1)', border:'1px solid var(--border2)',
                      fontSize:12, color:'var(--text2)',
                    }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Cards */}
            <div style={{ width:'100%', maxWidth:800, display:'flex', flexDirection:'column', gap:16 }}>
              {recommendations.map((rec, i) => (
                <div key={i} style={{
                  background:'var(--panel)', border:'1px solid var(--border)',
                  borderRadius:20, overflow:'hidden',
                  transition:'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: expanded === i ? '0 8px 40px rgba(26,107,255,0.2)' : 'none',
                  borderColor: expanded === i ? 'var(--blue1)' : 'var(--border)',
                }}>
                  {/* Card Header */}
                  <div
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    style={{
                      padding:'20px 24px', cursor:'pointer',
                      display:'flex', alignItems:'center', gap:16,
                      position:'relative',
                    }}
                  >
                    {/* Rank badge */}
                    <div style={{
                      width:40, height:40, borderRadius:12, flexShrink:0,
                      background:'linear-gradient(135deg,var(--blue1),var(--cyan))',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:16, fontWeight:800, color:'white',
                      boxShadow:'0 0 15px var(--glow)',
                    }}>#{i+1}</div>

                    <div style={{ flex:1 }}>
                      <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, marginBottom:3 }}>
                        {rec.title}
                      </h3>
                      <p style={{ fontSize:13, color:'var(--text2)' }}>
                        {rec.field} • {rec.salary}
                      </p>
                    </div>

                    {/* Match % */}
                    <div style={{ textAlign:'center', flexShrink:0 }}>
                      <div style={{
                        fontSize:22, fontWeight:800,
                        color: matchColor(rec.match),
                        fontFamily:'Syne,sans-serif',
                      }}>{rec.match}%</div>
                      <div style={{ fontSize:10, color:'var(--text2)' }}>Match</div>
                    </div>

                    <span style={{ color:'var(--text2)', marginLeft:8 }}>
                      {expanded === i ? '▲' : '▼'}
                    </span>
                  </div>

                  {/* Match bar */}
                  <div style={{ height:3, background:'var(--panel2)', margin:'0 24px' }}>
                    <div style={{
                      height:'100%',
                      background:`linear-gradient(90deg,var(--blue1),${matchColor(rec.match)})`,
                      width: expanded === i ? `${rec.match}%` : '0%',
                      transition:'width 0.6s ease',
                      borderRadius:2,
                    }} />
                  </div>

                  {/* Expanded Details */}
                  {expanded === i && (
                    <div style={{ padding:'20px 24px', borderTop:'1px solid var(--border)', marginTop:12 }}>

                      {/* Description */}
                      <p style={{ fontSize:14, color:'var(--text2)', lineHeight:1.7, marginBottom:20 }}>
                        {rec.description}
                      </p>

                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                        {/* Skills needed */}
                        <div>
                          <h4 style={{ fontSize:12, fontWeight:600, color:'var(--cyan)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>
                            🛠️ Skills Needed
                          </h4>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                            {(rec.skills || []).map((s, j) => (
                              <span key={j} style={{
                                padding:'4px 10px', borderRadius:20,
                                background:'rgba(26,107,255,0.15)',
                                border:'1px solid var(--border2)',
                                fontSize:12, color:'var(--blue3)',
                              }}>{s}</span>
                            ))}
                          </div>
                        </div>

                        {/* Steps */}
                        <div>
                          <h4 style={{ fontSize:12, fontWeight:600, color:'var(--cyan)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>
                            🗺️ How to Get There
                          </h4>
                          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                            {(rec.steps || []).map((step, j) => (
                              <div key={j} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                                <div style={{
                                  width:20, height:20, borderRadius:'50%', flexShrink:0,
                                  background:'var(--blue1)', display:'flex',
                                  alignItems:'center', justifyContent:'center',
                                  fontSize:10, fontWeight:700, color:'white',
                                }}>{j+1}</div>
                                <span style={{ fontSize:12, color:'var(--text2)', lineHeight:1.5 }}>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Chat button */}
                      <button
                        onClick={() => {
                          localStorage.setItem('cm_chat_context', `I want to know more about becoming a ${rec.title}. Give me detailed guidance.`);
                          navigate('/dashboard');
                        }}
                        style={{
                          marginTop:20, padding:'10px 20px',
                          background:'rgba(26,107,255,0.15)', border:'1px solid var(--border2)',
                          borderRadius:10, color:'var(--blue3)',
                          fontSize:13, fontWeight:600, cursor:'pointer',
                          fontFamily:'Space Grotesk,sans-serif',
                        }}
                      >
                        💬 Chat with AI about this career →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Redo Assessment */}
            <button
              onClick={() => navigate('/assessment')}
              style={{
                marginTop:24, padding:'10px 24px',
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:12, color:'var(--text2)',
                fontSize:13, fontWeight:600, cursor:'pointer',
                fontFamily:'Space Grotesk,sans-serif',
              }}
            >
              🔄 Redo Assessment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;