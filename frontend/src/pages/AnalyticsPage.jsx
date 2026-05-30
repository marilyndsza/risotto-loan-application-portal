import { useEffect, useMemo, useState } from 'react';
import { getApplications, getSummary } from '../api.js';
import AgentShell from '../components/AgentShell.jsx';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const languages = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'];

export default function AnalyticsPage() {
  const [summary, setSummary] = useState({});
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [summaryData, applicationsData] = await Promise.all([
          getSummary(),
          getApplications()
        ]);
        setSummary(summaryData);
        setApplications(applicationsData);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }

    loadAnalytics();
  }, []);

  const languageRows = useMemo(() => {
    const total = applications.length || 1;
    return languages.map((language) => {
      const count = applications.filter((application) => application.language === language).length;
      return { language, count, percentage: Math.round((count / total) * 100) };
    });
  }, [applications]);

  const approvalRate = summary.total ? Math.round((summary.approved / summary.total) * 100) : 0;

  return (
    <AgentShell>
      <main className="dashboard-main">
        <div className="dashboard-actions">
          <div>
            <h1>Analytics</h1>
            <p>Simple operating signals for loan application review.</p>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <section className="analytics-grid">
          <article className="analysis-card">
            <span>Approval Rate</span>
            <strong>{approvalRate}%</strong>
            <p>{summary.approved || 0} approved out of {summary.total || 0} total applications.</p>
          </article>
          <article className="analysis-card">
            <span>Pending Queue</span>
            <strong>{summary.pending || 0}</strong>
            <p>Applications still waiting for agent review.</p>
          </article>
          <article className="analysis-card">
            <span>Total Requested</span>
            <strong>{currency.format(summary.totalAmount || 0)}</strong>
            <p>Combined value of all submitted requests.</p>
          </article>
        </section>

        <section className="table-card">
          <div className="table-head">
            <h2>Language Mix</h2>
          </div>
          <div className="bar-list">
            {languageRows.map((row) => (
              <div className="bar-row" key={row.language}>
                <div>
                  <strong>{row.language}</strong>
                  <span>{row.count} applications</span>
                </div>
                <div className="bar-track">
                  <span style={{ width: `${row.percentage}%` }} />
                </div>
                <b>{row.percentage}%</b>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AgentShell>
  );
}
