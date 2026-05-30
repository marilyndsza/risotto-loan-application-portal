import LanguageBadge from './LanguageBadge.jsx';
import StatusBadge from './StatusBadge.jsx';

const avatarColors = ['#ffd9de', '#e6f1fb', '#e1f5ee', '#faeeda', '#eeedfe'];

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function avatarColor(name) {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(amount));
}

export default function ApplicationsTable({ applications, onStatusChange, isUpdating }) {
  return (
    <div className="table-card">
      <div className="table-head">
        <h2>Recent Loan Applications</h2>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Borrower</th>
              <th>Amount</th>
              <th>Language</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td>
                  <div className="borrower">
                    <span style={{ background: avatarColor(application.name) }}>{initials(application.name)}</span>
                    <div>
                      <strong>{application.name}</strong>
                      <small>VT-{application.id.slice(0, 8).toUpperCase()}</small>
                    </div>
                  </div>
                </td>
                <td>{formatAmount(application.amount)}</td>
                <td><LanguageBadge language={application.language} /></td>
                <td><StatusBadge status={application.status} /></td>
                <td>
                  {application.status === 'pending' ? (
                    <div className="action-group">
                      <button
                        className="approve-btn"
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onStatusChange(application, 'approved')}
                        title="Approve"
                      >
                        ✓
                      </button>
                      <button
                        className="reject-btn"
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onStatusChange(application, 'rejected')}
                        title="Reject"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span className="muted-action">•••</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {applications.length === 0 && <p className="empty-state">No applications found.</p>}
    </div>
  );
}
