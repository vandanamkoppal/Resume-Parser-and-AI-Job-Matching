import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchCandidates(); }, []);

  const fetchCandidates = async (q='') => {
    try {
      const res = await axios.get(`${API}/candidates${q?`?search=${q}`:''}`);
      setCandidates(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchCandidates(e.target.value);
  };

  const deleteCandidate = async (id) => {
    if (!window.confirm('Delete this candidate?')) return;
    try {
      await axios.delete(`${API}/candidates/${id}`);
      setSelected(null);
      fetchCandidates();
    } catch(err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">👥 Candidate Database</h1>

      <div className="card">
        <input className="input" placeholder="🔍 Search by name or skill..."
          value={search} onChange={handleSearch}
          style={{marginBottom:0}} />
      </div>

      <p style={{color:'#64748b',marginBottom:16}}>{candidates.length} candidate(s) found</p>

      <div style={{display:'flex',gap:16}}>
        <div style={{flex:1}}>
          {candidates.map(c => (
            <div key={c._id} className="card" onClick={() => setSelected(c)}
              style={{cursor:'pointer',border: selected?._id===c._id ? '1px solid #4f46e5':'1px solid #2d2d44'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <h3 style={{fontWeight:700,color:'#e2e8f0'}}>{c.name}</h3>
                  <p style={{fontSize:13,color:'#64748b'}}>{c.email} • {c.experience} yrs</p>
                  <div style={{marginTop:6}}>
                    {c.skills.slice(0,4).map(s => <span key={s} className="badge badge-skill">{s}</span>)}
                    {c.skills.length>4 && <span style={{color:'#64748b',fontSize:12}}> +{c.skills.length-4} more</span>}
                  </div>
                </div>
                <span style={{color:'#4f46e5',fontSize:20}}>›</span>
              </div>
            </div>
          ))}
          {candidates.length === 0 && (
            <div className="card" style={{textAlign:'center',color:'#64748b'}}>
              No candidates yet. Upload a resume first!
            </div>
          )}
        </div>

        {selected && (
          <div style={{width:320}}>
            <div className="card" style={{position:'sticky',top:20}}>
              <h2 style={{fontSize:18,fontWeight:700,color:'#818cf8',marginBottom:16}}>
                👤 {selected.name}
              </h2>
              {[
                ['📧 Email', selected.email],
                ['📞 Phone', selected.phone],
                ['🎓 Education', selected.education],
                ['🏢 Company', selected.currentCompany||'N/A'],
                ['⏱ Experience', `${selected.experience} yrs`],
                ['📅 Added', new Date(selected.createdAt).toLocaleDateString()],
              ].map(([l,v]) => (
                <div key={l} style={{marginBottom:10}}>
                  <p style={{fontSize:11,color:'#64748b'}}>{l}</p>
                  <p style={{fontWeight:500}}>{v}</p>
                </div>
              ))}
              <div style={{marginTop:12}}>
                <p style={{fontSize:11,color:'#64748b',marginBottom:6}}>🛠 Skills</p>
                {selected.skills.map(s => <span key={s} className="badge badge-skill">{s}</span>)}
              </div>
              <button className="btn"
                style={{width:'100%',marginTop:16,background:'#1e1b4b',color:'#a5b4fc'}}
                onClick={() => setSelected(null)}>
                Close
              </button>
              <button className="btn"
                style={{width:'100%',marginTop:8,background:'#7f1d1d',color:'#fca5a5'}}
                onClick={() => deleteCandidate(selected._id)}>
                🗑 Delete Candidate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}