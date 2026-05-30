import { useEffect } from 'react';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export default function LoanGrantedAnimation({ amount, isVisible, onDismiss }) {
  useEffect(() => {
    if (!isVisible) return undefined;
    const timer = window.setTimeout(onDismiss, 1800);
    return () => window.clearTimeout(timer);
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <button className="grant-overlay" type="button" onClick={onDismiss} aria-label="Dismiss approval animation">
      <div className="grant-card">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="52" />
          <path d="M36 62 52 78 86 42" />
        </svg>
        <h2>Loan Granted!</h2>
        <p>{currency.format(Number(amount) || 0)}</p>
      </div>
    </button>
  );
}
