// api.js
// Every call to the backend lives here. Components never call fetch directly,
// so if the API URL ever changes we only edit one file.

// Where the backend lives.
// Locally this variable is not set, so we fall back to localhost:5000.
// On the deployed site, the host injects VITE_API_URL at build time.
const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BASE_URL = `${API_ROOT}/api/tasks`;

// Small helper: turn a fetch Response into data, or throw a readable error.
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // The backend sends { message: '...' } when something goes wrong.
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// GET /api/tasks?status=...&search=...
export const fetchTasks = async ({ status = 'all', search = '' } = {}) => {
  // URLSearchParams builds "?status=pending&search=milk" safely for us.
  const params = new URLSearchParams();
  if (status !== 'all') params.append('status', status);
  if (search.trim()) params.append('search', search.trim());

  const query = params.toString();
  const response = await fetch(query ? `${BASE_URL}?${query}` : BASE_URL);

  return handleResponse(response);
};

// POST /api/tasks
export const createTask = async (task) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task), // objects must be turned into a JSON string
  });

  return handleResponse(response);
};

// PUT /api/tasks/:id
export const updateTask = async (id, updates) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  return handleResponse(response);
};

// PATCH /api/tasks/:id/toggle
export const toggleTask = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/toggle`, { method: 'PATCH' });

  return handleResponse(response);
};

// DELETE /api/tasks/:id
export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });

  return handleResponse(response);
};
