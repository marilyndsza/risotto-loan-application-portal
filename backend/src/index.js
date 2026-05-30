require('dotenv').config();

const cors = require('cors');
const express = require('express');
const applicationsRouter = require('./routes/applications');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', authRouter);
app.use('/api', applicationsRouter);

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'risotto-loan-portal-api' });
});

app.listen(PORT, () => {
  console.log(`API running on ${PORT}`);
});
