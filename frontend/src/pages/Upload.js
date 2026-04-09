import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const API = 'http://localhost:8000/api';

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [progress, setProgress] = useState(0);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const onDrop = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    const data = new FormData();
    data.append('resume', file);
    setUploading(true);
    try {
      const res = await axios.post(`${API}/upload`, data, {
        onUploadProgress: e => setProgress(Math.round(e.loaded * 100 / e.total))
      });
      setCandidate(res.data.candidate);
      setForm(res.data.candidate);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxSize: 5*1024*1024
  });

  const saveEdit = async () => {
    try {
      const res = await axios.put(`${API}/candidates/${candidate._id}`, form);
      setCandidate(res.data);
      setEditing(false);
      alert('Saved!');
    } catch { alert('Save failed'); }
  };

  return (
    <div className="page">
      <h1 className="page-title">📄 Upload Resume</h1>

      <div className="card">
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <div style={{fontSize:48}}>📁</div>
          <p style={{fontSize:18,fontWeight:600,margin:'12px 0',color:'#818cf8'}}>
            {isDragActive ? 'Drop it here!' : 'Drag & Drop your Resume'}
          </p>
          <p style={{color:'#64748b'}}>PDF only • Max 5MB</p>
          <button className="btn btn-primary" style={{marginTop:16}}>
            Browse File
          </button>
        </div>

        {uploading && (
          <div style={{marginTop:16}}>
            <p style={{marginBottom:8,color:'#818cf8'}}>Uploading... {progress}%</p>
            <div style={{background:'#2d2d44',borderRadius:8,height:8}}>
              <div style={{width:`${progress}%`,background:'#4f46e5',height:8,borderRadius:8,transition:'width 0.3s'}}/>
            </div>
          </div>
        )}
      </div>

      {candidate && (
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <h2 style={{fontSize:20,fontWeight:700,color:'#818cf8'}}>✅ Parsed Result</h2>
            <button className="btn btn-primary" onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : '✏️ Edit'}
            </button>
          </div>

          {editing ? (
            <div>
              {['name','email','phone','currentCompany'].map(field => (
                <div key={field}>
                  <label style={{fontSize:12,color:'#64748b',textTransform:'uppercase'}}>{field}</label>
                  <input className="input" value={form[field]||''}
                    onChange={e => setForm({...form,[field]:e.target.value})} />
                </div>
              ))}
              <div>
                <label style={{fontSize:12,color:'#64748b',textTransform:'uppercase'}}>Skills (comma separated)</label>
                <input className="input" value={(form.skills||[]).join(', ')}
                  onChange={e => setForm({...form, skills: e.target.value.split(',').map(s=>s.trim())})} />
              </div>
              <div>
                <label style={{fontSize:12,color:'#64748b',textTransform:'uppercase'}}>Experience (years)</label>
                <input className="input" type="number" value={form.experience||0}
                  onChange={e => setForm({...form, experience: parseInt(e.target.value)})} />
              </div>
              <button className="btn btn-success" onClick={saveEdit}>💾 Save</button>
            </div>
          ) : (
            <div className="grid-2">
              {[
                ['👤 Name', candidate.name],
                ['📧 Email', candidate.email],
                ['📞 Phone', candidate.phone],
                ['🏢 Company', candidate.currentCompany||'N/A'],
                ['🎓 Education', candidate.education],
                ['⏱ Experience', `${candidate.experience} years`],
              ].map(([label,val]) => (
                <div key={label} style={{padding:'12px',background:'#0f0f1a',borderRadius:8}}>
                  <p style={{fontSize:12,color:'#64748b'}}>{label}</p>
                  <p style={{fontWeight:600}}>{val}</p>
                </div>
              ))}
              <div style={{gridColumn:'1/-1',padding:'12px',background:'#0f0f1a',borderRadius:8}}>
                <p style={{fontSize:12,color:'#64748b',marginBottom:8}}>🛠 Skills</p>
                {candidate.skills.map(s => (
                  <span key={s} className="badge badge-skill">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}