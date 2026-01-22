// api wrapper for guardian backend
// keeps all the fetch stuff in one place

const API_BASE = 'http://localhost:3010/api';

// token storage - can use memory or localStorage based on remember me
let authToken = null;
let rememberMe = false;

const api = {
  setToken(token, remember = false) {
    authToken = token;
    rememberMe = remember;
    // Always save to localStorage for session persistence
    if (token) {
      localStorage.setItem('guardian_token', token);
      // Store token timestamp for expiration check (24 hours)
      localStorage.setItem('guardian_token_time', Date.now().toString());
    }
  },

  getToken() {
    // try memory first, then localStorage
    if (authToken) return authToken;
    const stored = localStorage.getItem('guardian_token');
    if (stored) {
      // Check if token is still valid (24 hours = 86400000 ms)
      const tokenTime = localStorage.getItem('guardian_token_time');
      if (tokenTime) {
        const elapsed = Date.now() - parseInt(tokenTime);
        if (elapsed > 86400000) { // 24 hours
          console.log('Token expired after 24 hours');
          this.clearToken();
          return null;
        }
      }
      authToken = stored;
      return stored;
    }
    return null;
  },

  clearToken() {
    authToken = null;
    rememberMe = false;
    localStorage.removeItem('guardian_token');
    localStorage.removeItem('guardian_user');
    localStorage.removeItem('guardian_token_time');
  },
  
  saveUser(user) {
    // Always save user to localStorage for session persistence
    if (user) {
      localStorage.setItem('guardian_user', JSON.stringify(user));
    }
  },
  
  getSavedUser() {
    const stored = localStorage.getItem('guardian_user');
    return stored ? JSON.parse(stored) : null;
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    const headers = {
      ...options.headers
    };

    // add auth header if we have a token
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // don't set content-type for FormData (browser handles it)
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors'
      });

      // handle 401 - token expired or invalid
      if (response.status === 401) {
        this.clearToken();
        // don't reload, let the app handle it
        throw new Error('Session expired. Please login again.');
      }

      // handle network errors
      if (!response.ok) {
        let errorMsg = 'Request failed';
        try {
          const data = await response.json();
          errorMsg = data.error || data.message || errorMsg;
        } catch (e) {
          // response wasn't json
          errorMsg = `Server error: ${response.status}`;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      // handle network errors specifically
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        console.error('Network error - is the backend running?');
        throw new Error('Cannot connect to server. Please check if the backend is running on port 3010.');
      }
      console.error('API error:', err);
      throw err;
    }
  },

  // auth endpoints
  async login(email, password, remember = false) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data && data.token) {
      this.setToken(data.token, remember);
      this.saveUser(data.user);
    }
    
    return data;
  },

  async register(email, password, firstName, lastName) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName, role: 'viewer' })
    });
    
    // auto-login after registration
    if (data && data.token) {
      this.setToken(data.token, false);
      this.saveUser(data.user);
    }
    
    return data;
  },

  async getMe() {
    return this.request('/auth/me');
  },

  // models endpoints
  async getModels(page = 1, limit = 20) {
    return this.request(`/models?page=${page}&limit=${limit}`);
  },

  async getModel(id) {
    return this.request(`/models/${id}`);
  },

  async uploadModel(formData) {
    return this.request('/models/upload', {
      method: 'POST',
      body: formData
    });
  },

  async deleteModel(id) {
    return this.request(`/models/${id}`, {
      method: 'DELETE'
    });
  },

  // audits endpoints
  async getAudits(page = 1, limit = 20, filters = {}) {
    let url = `/audits?page=${page}&limit=${limit}`;
    if (filters.status) url += `&status=${filters.status}`;
    if (filters.model_id) url += `&model_id=${filters.model_id}`;
    return this.request(url);
  },

  async getAudit(id) {
    return this.request(`/audits/${id}`);
  },

  async runAudit(modelId, auditType = 'full') {
    return this.request('/audits', {
      method: 'POST',
      body: JSON.stringify({ modelId: modelId, auditType: auditType })
    });
  },

  async getStats() {
    return this.request('/dashboard/stats');
  },

  // reports
  async getReportData(auditId) {
    return this.request(`/reports/${auditId}/data`);
  },

  getReportPdfUrl(auditId) {
    // this returns the url, not the actual pdf
    // need to handle auth differently for downloads
    return `${API_BASE}/reports/${auditId}/pdf`;
  }
};

// expose globally
window.api = api;
