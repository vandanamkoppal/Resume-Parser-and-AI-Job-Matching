import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [candidateId, setCandidateId] = useState('');
  const [result, setResult] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios.get(`${API}/jobs`).then(r => setJobs(r.data));
    axios.get(`${API}/candidates`).then(r => setCandidates(r.data));
  }, []);

  const matchJob = async (job) => {
    if (!candidateId) return alert('Select a candidate first');
    const candidate = candidates.find(c => c._id === candidateId);
    if (!candidate) return;
    const res = await axios.post(`${API}/jobs/match/${job._id}`, {
      skills: candidate.skills,
      experience: candidate.experience
    });
    setSelected(job);
    setResult(res.data);
  };

  const scoreColor = (score) =>
    score >= 70 ? '#059669' : score >= 40 ? '#d97706' : '#dc2626';

  return (
    <div className="page">
      <h1 className="page-title">💼 Job Listings</h1>

      <div className="card" style={{marginBottom:24}}>
        <label style={{fontSize:14,color:'#94a3b8',marginBottom:8,display:'block'}}>
          🎯 Select Candidate to Match:
        </label>
        <select className="input" style={{width:'auto',minWidth:280}}
          value={candidateId} onChange={e => { setCandidateId(e.target.value); setResult(null); }}>
          <option value="">-- Choose Candidate --</option>
          {candidates.map(c => (
            <option key={c._id} value={c._id}>{c.name} — {c.skills.slice(0,3).join(', ')}</option>
          ))}
        </select>
      </div>

      <div className="grid-3">
        {jobs.map(job => (
          <div key={job._id} className="card" style={{cursor:'pointer'}}>
            <h3 style={{fontSize:16,fontWeight:700,color:'#818cf8',marginBottom:4}}>{job.title}</h3>
            <p style={{fontSize:12,color:'#64748b',marginBottom:12}}>
              📍 {job.location} • {job.experience}+ yrs • #{job.code}
            </p>
            <p style={{fontSize:13,color:'#94a3b8',marginBottom:12}}>{job.description}</p>
            <div style={{marginBottom:12}}>
              {job.skills.map(s => <span key={s} className="badge badge-skill">{s}</span>)}
            </div>
            <button className="btn btn-primary" style={{width:'100%'}}
              onClick={() => matchJob(job)}>
              🎯 Match Against Job
            </button>
          </div>
        ))}
      </div>

      {result && selected && (
        <div className="card" style={{marginTop:24,border:'1px solid #4f46e5'}}>
          <h2 style={{fontSize:18,fontWeight:700,marginBottom:16,color:'#818cf8'}}>
            📊 Fitment Score — {selected.title}
          </h2>
          <div style={{textAlign:'center',marginBottom:20}}>
            <div className="score-circle" style={{background:scoreColor(result.totalScore)+'22',
              border:`3px solid ${scoreColor(result.totalScore)}`,color:scoreColor(result.totalScore)}}>
              {result.totalScore}%
            </div>
            <span className={`badge ${result.totalScore>=70?'badge-green':result.totalScore>=40?'badge-yellow':'badge-red'}`}
              style={{fontSize:14}}>
              {result.totalScore>=70?'✅ Strong Match':result.totalScore>=40?'⚠️ Partial Match':'❌ Low Match'}
            </span>
          </div>
          <div className="grid-2">
            <div style={{padding:16,background:'#0f0f1a',borderRadius:8}}>
              <p style={{color:'#6ee7b7',fontWeight:600,marginBottom:8}}>✅ Matched Skills</p>
              {result.matchedSkills.length ? result.matchedSkills.map(s =>
                <span key={s} className="badge badge-green">{s}</span>
              ) : <p style={{color:'#64748b'}}>None</p>}
            </div>
            <div style={{padding:16,background:'#0f0f1a',borderRadius:8}}>
              <p style={{color:'#fca5a5',fontWeight:600,marginBottom:8}}>❌ Missing Skills</p>
              {result.missingSkills.length ? result.missingSkills.map(s =>
                <span key={s} className="badge badge-red">{s}</span>
              ) : <p style={{color:'#64748b'}}>None</p>}
            </div>
          </div>
          {result.experienceGap > 0 && (
            <p style={{marginTop:12,color:'#fcd34d'}}>
              ⚠️ Experience gap: {result.experienceGap} year(s) short
            </p>
          )}
        </div>
      )}
    </div>
  );
}