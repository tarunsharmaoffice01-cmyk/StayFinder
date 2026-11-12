const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
).replace(/\/+$/, '');
const AUTH_TOKEN_KEY = 'stayfinder_auth_token_v1';

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

const request = async (method, endpoint, body) => {
  const headers = {};
  const token = getAuthToken();
  if (token) headers.Authorization = ['Bearer', token].join(' ');
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(
      result?.message || `API request failed with status ${response.status}`
    );
    error.status = response.status;
    throw error;
  }

  return result;
};

export const apiClient = {
  get: (endpoint) => request('GET', endpoint),
  post: (endpoint, payload) => request('POST', endpoint, payload),
  put: (endpoint, payload) => request('PUT', endpoint, payload),
  patch: (endpoint, payload) => request('PATCH', endpoint, payload),
  delete: (endpoint) => request('DELETE', endpoint)
};

export default apiClient;
