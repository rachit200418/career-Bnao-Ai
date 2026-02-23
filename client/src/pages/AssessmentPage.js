
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import Topbar from '../components/Layout/Topbar';

const STEPS = [
  {
    id: 'basic',
    title: 'Basic Information',
    subtitle: 'Tell us about yourself',
    icon: '👤',
  },
  {
    id: 'education',
    title: 'Education & Skills',
    subtitle: 'Your academic background',
    icon: '🎓',
  },
  {
    id: 'interests',
    title: 'Interests & Passions',
    subtitle: 'What excites you?',
    icon: '❤️',
  },
  {
    id: 'workstyle',
    title: 'Work Style',
    subtitle: 'How do you like to work?',
    icon: '💼',
  },
  {
    id: 'goals',
    title: 'Career Goals',
    subtitle: 'Where do you want to go?',
    icon: '🎯',
  },
];

const INTERESTS = [
  'Technology', 'Design', 'Business', 'Finance', 'Healthcare',
  'Education', 'Marketing', 'Law', 'Science', 'Arts & Media',
  'Engineering', 'Entrepreneurship', 'Social Work', 'Sports',
  'Environment', 'Government', 'Hospitality', 'Real Estate',
];

const SKILLS = [
  'Problem Solving', 'Communication', 'Leadership', 'Creativity',
  'Data Analysis', 'Programming', 'Project Management', 'Sales',
  'Writing', 'Research', 'Teaching', 'Networking', 'Design',
  'Critical Thinking', 'Teamwork', 'Public Speaking',
];

const WORK_STYLES = [
  { value: 'remote',  label: 'Remote Work',    icon: '🏠' },
  { value: 'office',  label: 'Office Work',    icon: '🏢' },
  { value: 'hybrid',  label: 'Hybrid',         icon: '🔀' },
  { value: 'travel',  label: 'Travel-Based',   icon: '✈️' },
];

const ENV_PREFS = [
  { value: 'startup',    label: 'Startup',         icon: '🚀' },
  { value: 'corporate',  label: 'Corporate',        icon: '🏦' },
  { value: 'freelance',  label: 'Freelance',        icon: '💻' },
  { value: 'government', label: 'Government',       icon: '🏛️' },
  { value: 'ngo',        label: 'NGO / Non-Profit', icon: '🤝' },
];

const AssessmentPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading]         = useState(false);
  const { user }                      = useAuth();
  const { showToast }                 = useToast();
  const navigate                      = useNavigate();

  const [form, setForm] = useState({
    // Basic
    age: '',
    city: '',
    currentStatus: '',
    // Education
    education: '',
    fieldOfStudy: '',
    skills: [],
    // Interests
    interests: [],
    // Work Style
    workStyle: '',
    envPref: '',
    // Goals
    salaryExpectation: '',
    careerGoal: '',
    timeframe: '',
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleArray = (key, val) => {
    setForm(prev => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val],
      };
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return form.age && form.city && form.currentStatus;
      case 1: return form.education && form.skills.length >= 2;
      case 2: return form.interests.length >= 2;
      case 3: return form.workStyle && form.envPref;
      case 4: return form.careerGoal && form.timeframe;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const prompt = `Based on this user's profile, generate exactly 4 career recommendations in JSON format.

User Profile:
- Name: ${user.name}
- Age: ${form.age}
- City: ${form.city}
- Current Status: ${form.currentStatus}
- Education: ${form.education} in ${form.fieldOfStudy || 'General'}
- Top Skills: ${form.skills.join(', ')}
- Interests: ${form.interests.join(', ')}
- Work Style: ${form.workStyle}
- Environment Preference: ${form.envPref}
- Salary Expectation: ${form.salaryExpectation || 'Not specified'}
- Career Goal: ${form.careerGoal}
- Timeframe: ${form.timeframe}

Return ONLY a valid JSON array with exactly 4 objects. Each object must have:
{
  "title": "Job Title",
  "field": "Industry Field",
  "match": 85,
  "salary": "₹8-15 LPA",
  "description": "2 sentence description of why this fits the user",
  "skills": ["skill1", "skill2", "skill3"],
  "steps": ["Step 1 to get there", "Step 2", "Step 3"]
}

Return ONLY the JSON array, no extra text.`;

      const apiKey = localStorage.getItem('cm_gemini_key') || '';
      const { data } = await axios.post('/api/chat/message', {
        message: prompt,
        topic: 'career recommendations',
        apiKey,
        history: [],
      });

      
      let recommendations = [];
      try {
        const clean = data.reply.replace(/```json|```/g, '').trim();
        recommendations = JSON.parse(clean);
      } catch {
        const match = data.reply.match(/\[[\s\S]*\]/);
        if (match) recommendations = JSON.parse(match[0]);
      }

      // Save to localStorage
      localStorage.setItem('cm_assessment', JSON.stringify(form));
      localStorage.setItem('cm_recommendations', JSON.stringify(recommendations));

      showToast('Assessment complete! 🎉 Recommendations ready!');
      navigate('/recommendations');
    } catch (err) {
      showToast('Failed to generate recommendations. Try again!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const chip = (label, selected, onClick) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        padding: '8px 14px',
        borderRadius: 20,
        border: `1px solid ${selected ? 'var(--blue1)' : 'var(--border)'}`,
        background: selected ? 'rgba(26,107,255,0.2)' : 'var(--bg2)',
        color: selected ? 'var(--text)' : 'var(--text2)',
        fontSize: 13, cursor: 'pointer',
        fontFamily: 'Space Grotesk, sans-serif',
        transition: 'all 0.15s',
        fontWeight: selected ? 600 : 400,
      }}
    >{label}</button>
  );

  const inputStyle = {
    width: '100%', background: 'var(--bg2)',
    border: '1px solid var(--border)', borderRadius: 10,
    padding: '12px 16px', color: 'var(--text)',
    fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
    outline: 'none',
  };

  const selectStyle = { ...inputStyle };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', position:'relative', zIndex:10 }}>
      <Topbar />

    {/* back button */}
      <div style={{ padding:'12px 24px', position:'relative', zIndex:10 }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            display:'flex', alignItems:'center', gap:8,
            background:'var(--panel2)', border:'1px solid var(--border)',
            borderRadius:10, padding:'8px 16px',
            color:'var(--text2)', fontSize:13, fontWeight:600,
            cursor:'pointer', fontFamily:'Space Grotesk,sans-serif',
            transition:'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='var(--blue1)'; e.currentTarget.style.color='var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text2)'; }}
        >
          ← Back to Home
        </button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'32px 24px', display:'flex', flexDirection:'column', alignItems:'center' }}>

        {/* Progress bar */}
        <div style={{ width:'100%', maxWidth:640, marginBottom:32 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{
                  width:36, height:36, borderRadius:'50%',
                  background: i < currentStep ? 'var(--blue1)' : i === currentStep ? 'linear-gradient(135deg,var(--blue1),var(--cyan))' : 'var(--panel2)',
                  border: `2px solid ${i <= currentStep ? 'var(--blue1)' : 'var(--border)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize: i < currentStep ? 14 : 16,
                  color: i <= currentStep ? 'white' : 'var(--text2)',
                  boxShadow: i === currentStep ? '0 0 15px var(--glow)' : 'none',
                  transition:'all 0.3s',
                }}>
                  {i < currentStep ? '✓' : s.icon}
                </div>
                <span style={{ fontSize:10, color: i === currentStep ? 'var(--cyan)' : 'var(--text2)', display: window.innerWidth < 500 ? 'none' : 'block' }}>
                  {s.title.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
          <div style={{ height:4, background:'var(--panel2)', borderRadius:4, overflow:'hidden' }}>
            <div style={{
              height:'100%', borderRadius:4,
              background:'linear-gradient(90deg,var(--blue1),var(--cyan))',
              width:`${(currentStep / (STEPS.length - 1)) * 100}%`,
              transition:'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Card */}
        <div style={{
          width:'100%', maxWidth:640,
          background:'var(--panel)', border:'1px solid var(--border)',
          borderRadius:20, padding:32,
          boxShadow:'0 0 60px rgba(0,0,0,0.4)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', top:0, left:0, right:0, height:2,
            background:'linear-gradient(90deg,transparent,var(--blue3),transparent)',
          }} />

          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, marginBottom:4 }}>
            {STEPS[currentStep].icon} {STEPS[currentStep].title}
          </h2>
          <p style={{ color:'var(--text2)', fontSize:13, marginBottom:28 }}>
            {STEPS[currentStep].subtitle}
          </p>

          {/* ── STEP 0: Basic ── */}
          {currentStep === 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Your Age</label>
                <input style={inputStyle} type="number" placeholder="e.g. 22" value={form.age} onChange={e => update('age', e.target.value)} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>City / Location</label>
                <input style={inputStyle} type="text" placeholder="e.g. Mumbai, Delhi, Bangalore" value={form.city} onChange={e => update('city', e.target.value)} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Current Status</label>
                <select style={selectStyle} value={form.currentStatus} onChange={e => update('currentStatus', e.target.value)}>
                  <option value="">Select...</option>
                  <option>Student</option>
                  <option>Fresh Graduate</option>
                  <option>Working Professional</option>
                  <option>Freelancer</option>
                  <option>Job Seeker</option>
                  <option>Career Changer</option>
                </select>
              </div>
            </div>
          )}

          {/* ── STEP 1: Education ── */}
          {currentStep === 1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Highest Education</label>
                <select style={selectStyle} value={form.education} onChange={e => update('education', e.target.value)}>
                  <option value="">Select...</option>
                  <option>10th Pass</option>
                  <option>12th Pass</option>
                  <option>Diploma</option>
                  <option>Bachelor's Degree</option>
                  <option>Master's Degree</option>
                  <option>PhD</option>
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Field of Study (optional)</label>
                <input style={inputStyle} type="text" placeholder="e.g. Computer Science, Commerce, Arts" value={form.fieldOfStudy} onChange={e => update('fieldOfStudy', e.target.value)} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>
                  Your Skills (select at least 2)
                </label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {SKILLS.map(s => chip(s, form.skills.includes(s), () => toggleArray('skills', s)))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Interests ── */}
          {currentStep === 2 && (
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>
                Select your interests (at least 2)
              </label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {INTERESTS.map(i => chip(i, form.interests.includes(i), () => toggleArray('interests', i)))}
              </div>
            </div>
          )}

          {/* ── STEP 3: Work Style ── */}
          {currentStep === 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>
                  Preferred Work Style
                </label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {WORK_STYLES.map(w => (
                    <div key={w.value} onClick={() => update('workStyle', w.value)} style={{
                      padding:'14px', borderRadius:12, cursor:'pointer',
                      border:`1px solid ${form.workStyle === w.value ? 'var(--blue1)' : 'var(--border)'}`,
                      background: form.workStyle === w.value ? 'rgba(26,107,255,0.15)' : 'var(--bg2)',
                      display:'flex', alignItems:'center', gap:10, transition:'all 0.15s',
                    }}>
                      <span style={{ fontSize:22 }}>{w.icon}</span>
                      <span style={{ fontSize:13, fontWeight:600 }}>{w.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>
                  Preferred Work Environment
                </label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {ENV_PREFS.map(e => (
                    <div key={e.value} onClick={() => update('envPref', e.value)} style={{
                      padding:'14px', borderRadius:12, cursor:'pointer',
                      border:`1px solid ${form.envPref === e.value ? 'var(--blue1)' : 'var(--border)'}`,
                      background: form.envPref === e.value ? 'rgba(26,107,255,0.15)' : 'var(--bg2)',
                      display:'flex', alignItems:'center', gap:10, transition:'all 0.15s',
                    }}>
                      <span style={{ fontSize:22 }}>{e.icon}</span>
                      <span style={{ fontSize:13, fontWeight:600 }}>{e.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Goals ── */}
          {currentStep === 4 && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Salary Expectation (optional)</label>
                <select style={selectStyle} value={form.salaryExpectation} onChange={e => update('salaryExpectation', e.target.value)}>
                  <option value="">Select range...</option>
                  <option>Under ₹3 LPA</option>
                  <option>₹3–6 LPA</option>
                  <option>₹6–10 LPA</option>
                  <option>₹10–20 LPA</option>
                  <option>₹20+ LPA</option>
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Your Career Goal</label>
                <textarea
                  style={{ ...inputStyle, resize:'none', height:100, lineHeight:1.5 }}
                  placeholder="e.g. I want to become a software engineer at a top company and eventually start my own startup..."
                  value={form.careerGoal}
                  onChange={e => update('careerGoal', e.target.value)}
                />
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Timeframe to Achieve Goal</label>
                <select style={selectStyle} value={form.timeframe} onChange={e => update('timeframe', e.target.value)}>
                  <option value="">Select...</option>
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>1 year</option>
                  <option>2–3 years</option>
                  <option>5+ years</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display:'flex', gap:12, marginTop:28 }}>
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(s => s - 1)}
                style={{
                  flex:1, padding:13,
                  background:'var(--bg2)', border:'1px solid var(--border)',
                  borderRadius:12, color:'var(--text2)', fontSize:14,
                  fontWeight:600, cursor:'pointer', fontFamily:'Space Grotesk,sans-serif',
                }}
              >← Back</button>
            )}
            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStep(s => s + 1)}
                disabled={!canProceed()}
                style={{
                  flex:2, padding:13,
                  background: canProceed() ? 'linear-gradient(135deg,var(--blue1),var(--blue2))' : 'var(--panel2)',
                  border:'none', borderRadius:12,
                  color: canProceed() ? 'white' : 'var(--text2)',
                  fontSize:14, fontWeight:600, cursor: canProceed() ? 'pointer' : 'not-allowed',
                  fontFamily:'Space Grotesk,sans-serif',
                  transition:'all 0.2s',
                }}
              >Next →</button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                style={{
                  flex:2, padding:13,
                  background: canProceed() ? 'linear-gradient(135deg,var(--cyan),var(--blue1))' : 'var(--panel2)',
                  border:'none', borderRadius:12,
                  color: canProceed() ? 'white' : 'var(--text2)',
                  fontSize:14, fontWeight:600, cursor: canProceed() ? 'pointer' : 'not-allowed',
                  fontFamily:'Space Grotesk,sans-serif',
                }}
              >
                {loading ? '⏳ Generating...' : '🚀 Get My Recommendations'}
              </button>
            )}
          </div>
        </div>

        <p style={{ color:'var(--text2)', fontSize:12, marginTop:16 }}>
          Step {currentStep + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
};

export default AssessmentPage;