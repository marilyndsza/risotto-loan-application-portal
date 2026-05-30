const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export default function StatsBar({ summary }) {
  const stats = [
    ['Total Applications', summary.total ?? 0, 'All borrower requests'],
    ['Pending Review', summary.pending ?? 0, 'Requires action'],
    ['Approved', summary.approved ?? 0, 'Verification complete'],
    ['Total Disbursed', currency.format(summary.totalAmount ?? 0), 'Lifetime value']
  ];

  return (
    <section className="stats-grid">
      {stats.map(([label, value, helper]) => (
        <article className="stat-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          <small>{helper}</small>
        </article>
      ))}
    </section>
  );
}
