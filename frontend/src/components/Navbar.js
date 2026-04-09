import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="navbar">
      <span className="nav-brand">🧠 ResumeAI</span>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${pathname==='/' ? 'active':''}`}>📄 Upload</Link>
        <Link to="/jobs" className={`nav-link ${pathname==='/jobs' ? 'active':''}`}>💼 Jobs</Link>
        <Link to="/candidates" className={`nav-link ${pathname==='/candidates' ? 'active':''}`}>👥 Candidates</Link>
      </div>
    </nav>
  );
}