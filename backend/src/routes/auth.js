const express = require('express');

const router = express.Router();

const DEMO_USER = {
  agentId: '8821',
  name: 'Risotto Agent',
  office: 'Regional Office South',
  email: 'agent@risotto.local',
  password: 'risotto123'
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  return res.json({
    token: `demo-${DEMO_USER.agentId}`,
    user: {
      agentId: DEMO_USER.agentId,
      name: DEMO_USER.name,
      office: DEMO_USER.office,
      email: DEMO_USER.email
    }
  });
});

module.exports = router;
