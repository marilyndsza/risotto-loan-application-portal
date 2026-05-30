import { NavLink } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function AgentShell({ children }) {
  return (
    <div className="dashboard-shell">
      <div className="mobile-dashboard-nav">
        <Navbar />
      </div>
      <Navbar variant="sidebar" />
      <div className="dashboard-content">
        <header className="dashboard-topbar">
          <div className="search-box">Search borrowers...</div>
          <nav>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/apply">Applications</NavLink>
            <button type="button" onClick={() => alert('Reports coming soon')}>Reports</button>
          </nav>
        </header>

        {children}
      </div>
    </div>
  );
}
