const crypto = require('crypto');
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  const applications = [];

  function latestFirst(rows) {
    return rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  function createApplication([name, mobile, amount, purpose, language]) {
    const application = {
      id: crypto.randomUUID(),
      name,
      mobile,
      amount,
      purpose,
      language,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    applications.unshift(application);
    return { rows: [application], rowCount: 1 };
  }

  function listApplications(params) {
    const rows = params?.length
      ? applications.filter((application) => application.status === params[0])
      : [...applications];

    return { rows: latestFirst(rows), rowCount: rows.length };
  }

  function updateStatus([status, id]) {
    const application = applications.find((item) => item.id === id);
    if (!application) return { rows: [], rowCount: 0 };

    application.status = status;
    return { rows: [application], rowCount: 1 };
  }

  function summary() {
    return {
      rows: [{
        total: applications.length,
        totalAmount: applications.reduce((sum, application) => sum + Number(application.amount), 0),
        pending: applications.filter((application) => application.status === 'pending').length,
        approved: applications.filter((application) => application.status === 'approved').length,
        rejected: applications.filter((application) => application.status === 'rejected').length
      }],
      rowCount: 1
    };
  }

  console.warn('DATABASE_URL is not set. Using in-memory development store.');

  module.exports = {
    async query(sql, params = []) {
      const normalized = sql.trim().toLowerCase().replace(/\s+/g, ' ');

      if (normalized.startsWith('insert into applications')) return createApplication(params);
      if (normalized.startsWith('select * from applications')) return listApplications(params);
      if (normalized.startsWith('update applications set status')) return updateStatus(params);
      if (normalized.startsWith('select count(*)')) return summary();

      throw new Error(`Unsupported in-memory query: ${sql}`);
    }
  };
  return;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
