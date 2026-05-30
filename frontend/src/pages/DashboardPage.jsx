import { useEffect, useState } from 'react';
import { getApplications, getSummary, updateApplicationStatus } from '../api.js';
import AgentShell from '../components/AgentShell.jsx';
import ApplicationsTable from '../components/ApplicationsTable.jsx';
import LoanGrantedAnimation from '../components/LoanGrantedAnimation.jsx';
import StatsBar from '../components/StatsBar.jsx';

export default function DashboardPage() {
  const [summary, setSummary] = useState({});
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [grantAmount, setGrantAmount] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setError('');
        const [summaryData, applicationsData] = await Promise.all([
          getSummary(),
          getApplications(filter)
        ]);
        setSummary(summaryData);
        setApplications(applicationsData);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }

    load();
  }, [filter]);

  async function changeStatus(application, status) {
    setIsUpdating(true);
    setError('');

    try {
      const updated = await updateApplicationStatus(application.id, status);

      if (status === 'approved') {
        setGrantAmount(application.amount);
      }

      setApplications((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setSummary(await getSummary());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  }

  function updateFilter(event) {
    setFilter(event.target.value);
  }

  return (
    <AgentShell>
      <main className="dashboard-main">
        <div className="dashboard-actions">
          <div>
            <h1>Agent Dashboard</h1>
            <p>Review borrower applications and manage loan decisions.</p>
          </div>
          <label>
            <span>Status</span>
            <select value={filter} onChange={updateFilter}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <StatsBar summary={summary} />
        <ApplicationsTable applications={applications} onStatusChange={changeStatus} isUpdating={isUpdating} />
      </main>

      <LoanGrantedAnimation
        amount={grantAmount}
        isVisible={grantAmount !== null}
        onDismiss={() => setGrantAmount(null)}
      />
    </AgentShell>
  );
}
