import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createApplication } from '../api.js';
import Navbar from '../components/Navbar.jsx';

const initialValues = {
  name: '',
  mobile: '',
  amount: '',
  language: '',
  purpose: ''
};

const languages = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'];

function validateField(name, value) {
  if (name === 'name' && value.trim().length < 2) return 'Enter at least 2 characters.';
  if (name === 'mobile' && !/^[6-9]\d{9}$/.test(value)) return 'Enter a valid 10-digit Indian mobile number.';
  if (name === 'amount' && (!value || Number(value) <= 0)) return 'Enter an amount greater than 0.';
  if (name === 'language' && !languages.includes(value)) return 'Choose a preferred language.';
  if (name === 'purpose' && value.trim().length < 5) return 'Enter at least 5 characters.';
  return '';
}

export default function ApplyPage() {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const errors = useMemo(() => {
    return Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, validateField(key, value)])
    );
  }, [values]);

  const isValid = Object.values(errors).every((error) => !error);

  function updateValue(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function blurField(event) {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setTouched({ name: true, mobile: true, amount: true, language: true, purpose: true });
    setSubmitError('');

    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const application = await createApplication({
        ...values,
        amount: Number(values.amount)
      });
      setCreated(application);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="apply-main">
        <section className="apply-card">
          {created ? (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h1>Application Submitted</h1>
              <p>The borrower application is ready for field agent review.</p>
              <div className="reference-box">VT-{created.id.slice(0, 8).toUpperCase()}</div>
              <Link className="primary-button" to="/dashboard">View Dashboard</Link>
            </div>
          ) : (
            <>
              <div className="form-intro">
                <h1>New Loan Application</h1>
                <p>Complete the details below to initiate borrower verification.</p>
              </div>

              <form className="loan-form" onSubmit={submitForm} noValidate>
                <Field label="Full Name" name="name" error={touched.name && errors.name}>
                  <input
                    id="name"
                    name="name"
                    value={values.name}
                    onBlur={blurField}
                    onChange={updateValue}
                    placeholder="Enter borrower's full name"
                  />
                </Field>

                <Field label="Phone Number" name="mobile" error={touched.mobile && errors.mobile}>
                  <div className="prefix-field">
                    <span>+91</span>
                    <input
                      id="mobile"
                      name="mobile"
                      value={values.mobile}
                      onBlur={blurField}
                      onChange={updateValue}
                      placeholder="9876543210"
                      inputMode="numeric"
                    />
                  </div>
                </Field>

                <Field label="Loan Amount (INR)" name="amount" error={touched.amount && errors.amount}>
                  <div className="prefix-field">
                    <span>₹</span>
                    <input
                      id="amount"
                      name="amount"
                      value={values.amount}
                      onBlur={blurField}
                      onChange={updateValue}
                      placeholder="0"
                      inputMode="decimal"
                      type="number"
                    />
                  </div>
                </Field>

                <Field label="Preferred Language" name="language" error={touched.language && errors.language}>
                  <select
                    id="language"
                    name="language"
                    value={values.language}
                    onBlur={blurField}
                    onChange={updateValue}
                  >
                    <option value="">Select language</option>
                    {languages.map((language) => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </Field>

                <div className="form-full">
                  <Field label="Purpose of Loan" name="purpose" error={touched.purpose && errors.purpose}>
                    <textarea
                      id="purpose"
                      name="purpose"
                      value={values.purpose}
                      onBlur={blurField}
                      onChange={updateValue}
                      placeholder="Describe the reason for the loan request..."
                    />
                  </Field>
                </div>

                {submitError && <p className="form-error form-full">{submitError}</p>}

                <button className="primary-button form-full" type="submit" disabled={!isValid || isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function Field({ label, name, error, children }) {
  return (
    <label className={`field ${error ? 'field-error' : ''}`} htmlFor={name}>
      <span>{label}</span>
      {children}
      {error && <small>{error}</small>}
    </label>
  );
}
