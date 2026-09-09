import { supabase } from './supabaseClient.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ApiRequestError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, isFormData = false, auth = false } = {}) {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';

  if (auth) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (res.status === 204) return null;

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    throw new ApiRequestError(payload?.error || `Request failed (${res.status})`, res.status);
  }
  return payload;
}

// ── Public reads ──
export const publicApi = {
  services: () => request('/services'),
  skills: () => request('/skills'),
  experiences: () => request('/resume/experiences'),
  education: () => request('/resume/education'),
  projects: (params = '') => request(`/projects${params}`),
  project: (slug) => request(`/projects/${slug}`),
  upcomingProjects: () => request('/upcoming-projects'),
  reviews: () => request('/reviews'),
  submitReview: (data) => request('/reviews', { method: 'POST', body: data }),
  siteContent: () => request('/site-content'),
  submitEnquiry: (data) => request('/enquiries', { method: 'POST', body: data }),
};

// ── Admin (authenticated) reads/writes ──
export const adminApi = {
  me: () => request('/admin/me', { auth: true }),
  dashboard: () => request('/admin/dashboard', { auth: true }),

  services: {
    list: () => request('/admin/services', { auth: true }),
    create: (data) => request('/admin/services', { method: 'POST', body: data, auth: true }),
    update: (id, data) => request(`/admin/services/${id}`, { method: 'PUT', body: data, auth: true }),
    remove: (id) => request(`/admin/services/${id}`, { method: 'DELETE', auth: true }),
  },
  skills: {
    list: () => request('/admin/skills', { auth: true }),
    create: (data) => request('/admin/skills', { method: 'POST', body: data, auth: true }),
    update: (id, data) => request(`/admin/skills/${id}`, { method: 'PUT', body: data, auth: true }),
    remove: (id) => request(`/admin/skills/${id}`, { method: 'DELETE', auth: true }),
  },
  experiences: {
    list: () => request('/admin/resume/experiences', { auth: true }),
    create: (data) => request('/admin/resume/experiences', { method: 'POST', body: data, auth: true }),
    update: (id, data) => request(`/admin/resume/experiences/${id}`, { method: 'PUT', body: data, auth: true }),
    remove: (id) => request(`/admin/resume/experiences/${id}`, { method: 'DELETE', auth: true }),
  },
  education: {
    list: () => request('/admin/resume/education', { auth: true }),
    create: (data) => request('/admin/resume/education', { method: 'POST', body: data, auth: true }),
    update: (id, data) => request(`/admin/resume/education/${id}`, { method: 'PUT', body: data, auth: true }),
    remove: (id) => request(`/admin/resume/education/${id}`, { method: 'DELETE', auth: true }),
  },
  projects: {
    list: () => request('/admin/projects', { auth: true }),
    get: (id) => request(`/admin/projects/${id}`, { auth: true }),
    create: (data) => request('/admin/projects', { method: 'POST', body: data, auth: true }),
    update: (id, data) => request(`/admin/projects/${id}`, { method: 'PUT', body: data, auth: true }),
    remove: (id) => request(`/admin/projects/${id}`, { method: 'DELETE', auth: true }),
    addImage: (id, data) => request(`/admin/projects/${id}/images`, { method: 'POST', body: data, auth: true }),
    removeImage: (id, imageId) =>
      request(`/admin/projects/${id}/images/${imageId}`, { method: 'DELETE', auth: true }),
  },
  upcomingProjects: {
    list: () => request('/admin/upcoming-projects', { auth: true }),
    create: (data) => request('/admin/upcoming-projects', { method: 'POST', body: data, auth: true }),
    update: (id, data) => request(`/admin/upcoming-projects/${id}`, { method: 'PUT', body: data, auth: true }),
    remove: (id) => request(`/admin/upcoming-projects/${id}`, { method: 'DELETE', auth: true }),
  },
  reviews: {
    list: () => request('/admin/reviews', { auth: true }),
    approve: (id) => request(`/admin/reviews/${id}/approve`, { method: 'PATCH', auth: true }),
    remove: (id) => request(`/admin/reviews/${id}`, { method: 'DELETE', auth: true }),
  },
  enquiries: {
    list: (status) => request(`/admin/enquiries${status ? `?status=${status}` : ''}`, { auth: true }),
    updateStatus: (id, status) =>
      request(`/admin/enquiries/${id}`, { method: 'PATCH', body: { status }, auth: true }),
    remove: (id) => request(`/admin/enquiries/${id}`, { method: 'DELETE', auth: true }),
  },
  siteContent: {
    get: () => request('/admin/site-content', { auth: true }),
    update: (data) => request('/admin/site-content', { method: 'PUT', body: data, auth: true }),
  },
  socialLinks: {
    list: () => request('/admin/site-content/social-links', { auth: true }),
    create: (data) => request('/admin/site-content/social-links', { method: 'POST', body: data, auth: true }),
    update: (id, data) =>
      request(`/admin/site-content/social-links/${id}`, { method: 'PUT', body: data, auth: true }),
    remove: (id) => request(`/admin/site-content/social-links/${id}`, { method: 'DELETE', auth: true }),
  },
  upload: (bucket, file) => {
    const form = new FormData();
    form.append('file', file);
    return request(`/admin/upload/${bucket}`, { method: 'POST', body: form, isFormData: true, auth: true });
  },
};
