const express = require('express');
const pool = require('../db');

const router = express.Router();
const LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'];
const STATUSES = ['pending', 'approved', 'rejected'];

function validateApplication(body) {
  const { name, mobile, amount, purpose, language } = body;

  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (!/^[6-9]\d{9}$/.test(String(mobile || ''))) {
    return 'Invalid mobile number';
  }

  if (amount === undefined || amount === null || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
    return 'Amount must be greater than 0';
  }

  if (!purpose || purpose.trim().length < 5) {
    return 'Purpose must be at least 5 characters';
  }

  if (!LANGUAGES.includes(language)) {
    return 'Invalid language';
  }

  return null;
}

router.post('/applications', async (req, res) => {
  const error = validateApplication(req.body);
  if (error) return res.status(400).json({ error });

  const { name, mobile, amount, purpose, language } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO applications (name, mobile, amount, purpose, language)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name.trim(), String(mobile), Number(amount), purpose.trim(), language]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/applications', async (req, res) => {
  const { status } = req.query;

  if (status && !STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status filter' });
  }

  try {
    const result = status
      ? await pool.query('SELECT * FROM applications WHERE status = $1 ORDER BY created_at DESC', [status])
      : await pool.query('SELECT * FROM applications ORDER BY created_at DESC');

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved or rejected' });
  }

  try {
    const result = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/summary', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COALESCE(SUM(amount), 0)::float AS "totalAmount",
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
        COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected
      FROM applications
    `);

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
