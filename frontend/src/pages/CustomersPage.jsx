import { useEffect, useMemo, useState } from 'react';
import { getApplications } from '../api.js';
import AgentShell from '../components/AgentShell.jsx';
import LanguageBadge from '../components/LanguageBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export default function CustomersPage() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getApplications();
        setApplications(data);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }

    loadCustomers();
  }, []);

  const customers = useMemo(() => {
    return applications.map((application) => ({
      id: application.id,
      name: application.name,
      mobile: application.mobile,
      language: application.language,
      status: application.status,
      amount: Number(application.amount)
    }));
  }, [applications]);

  const totalRequested = customers.reduce((sum, customer) => sum + customer.amount, 0);
  const approvedCustomers = customers.filter((customer) => customer.status === 'approved').length;

  return (
    <AgentShell>
      <main className="dashboard-main">
        <div className="dashboard-actions">
          <div>
            <h1>Customers</h1>
            <p>Borrower profiles collected from submitted loan applications.</p>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <section className="mini-stats">
          <article>
            <span>Total Customers</span>
            <strong>{customers.length}</strong>
          </article>
          <article>
            <span>Approved Borrowers</span>
            <strong>{approvedCustomers}</strong>
          </article>
          <article>
            <span>Requested Value</span>
            <strong>{currency.format(totalRequested)}</strong>
          </article>
        </section>

        <section className="table-card">
          <div className="table-head">
            <h2>Customer Directory</h2>
          </div>
          <div className="customer-list">
            {customers.map((customer) => (
              <article className="customer-row" key={customer.id}>
                <div>
                  <strong>{customer.name}</strong>
                  <small>+91 {customer.mobile} · VT-{customer.id.slice(0, 8).toUpperCase()}</small>
                </div>
                <LanguageBadge language={customer.language} />
                <StatusBadge status={customer.status} />
                <b>{currency.format(customer.amount)}</b>
              </article>
            ))}
            {customers.length === 0 && <p className="empty-state">No customers yet.</p>}
          </div>
        </section>
      </main>
    </AgentShell>
  );
}
