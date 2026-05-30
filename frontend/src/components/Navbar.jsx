import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Navbar({ variant = 'top' }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function signOut() {
    logout();
    navigate('/login', { replace: true });
  }

  if (variant === 'sidebar') {
    return (
      <aside className="sidebar">
        <div>
          <Link to="/dashboard" className="brand">Risotto</Link>
          <div className="agent">
            <div className="agent-avatar">{user?.name?.[0] || 'A'}</div>
            <div>
              <strong>Agent ID: {user?.agentId || '8821'}</strong>
              <span>{user?.office || 'Regional Office South'}</span>
            </div>
          </div>
        </div>

        <nav className="side-links">
          <NavLink to="/dashboard">Home</NavLink>
          <button type="button" onClick={() => navigate('/apply')}>New Loan</button>
          <NavLink to="/customers">Customers</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
        </nav>

        <div className="side-footer">
          <button type="button">Help</button>
          <button type="button" onClick={signOut}>Logout</button>
        </div>
      </aside>
    );
  }

  return (
    <header className="topbar">
      <Link to="/dashboard" className="brand">Risotto</Link>
      <nav className="top-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/apply">Applications</NavLink>
        <button type="button" onClick={() => alert('Reports coming soon')}>Reports</button>
      </nav>
      <div className="top-actions">
        <button className="primary-pill" type="button" onClick={() => navigate('/apply')}>New Loan</button>
        <button className="ghost-pill" type="button" onClick={signOut}>Logout</button>
      </div>
    </header>
  );
}
