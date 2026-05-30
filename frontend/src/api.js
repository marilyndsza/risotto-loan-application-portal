const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API}/api${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
  } catch (_err) {
    throw new Error('Unable to reach the server. It may be waking up; retry in a moment.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data;
}

export function createApplication(payload) {
  return request('/applications', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function loginAgent(payload) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getApplications(status) {
  const suffix = status && status !== 'all' ? `?status=${status}` : '';
  return request(`/applications${suffix}`);
}

export function updateApplicationStatus(id, status) {
  return request(`/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export function getSummary() {
  return request('/summary');
}
