// guardian frontend app
// vanilla js, no frameworks - keeping it simple

(function() {
  'use strict';

  // dom elements - pages
  const loginPage = document.getElementById('login-page');
  const registerPage = document.getElementById('register-page');
  const dashboardPage = document.getElementById('dashboard-page');
  const loginFormContainer = document.getElementById('login-form-container');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');
  const logoutBtn = document.getElementById('logout-btn');
  const userEmailSpan = document.getElementById('user-email');
  const langSelect = document.getElementById('language-select');

  // sections
  const overviewSection = document.getElementById('overview-section');
  const modelsSection = document.getElementById('models-section');
  const auditsSection = document.getElementById('audits-section');

  // modals
  const uploadModal = document.getElementById('upload-modal');
  const auditModal = document.getElementById('audit-modal');

  // charts
  let complianceChart = null;
  let auditsChart = null;

  // current user
  let currentUser = null;

  // Helper function for translations (fallback if i18n not loaded)
  function t(key) {
    if (typeof i18n !== 'undefined' && i18n.t) {
      return i18n.t(key);
    }
    // Fallback translations
    const fallbacks = {
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      registerSuccess: 'Account created successfully',
      registerFailed: 'Registration failed',
      passwordsNoMatch: 'Passwords do not match',
      passwordMinLength: 'Password must be at least 8 characters',
      logoutSuccess: 'Logged out successfully',
      selectFile: 'Please select a file',
      modelUploaded: 'Model uploaded successfully',
      uploadFailed: 'Upload failed',
      confirmAudit: 'Start a new audit for this model?',
      auditStarted: 'Audit started',
      auditFailed: 'Failed to start audit',
      confirmDelete: 'Are you sure you want to delete this?',
      modelDeleted: 'Model deleted',
      deleteFailed: 'Delete failed',
      loadFailed: 'Failed to load data',
      downloadFailed: 'Download failed',
      success: 'Success'
    };
    return fallbacks[key] || key;
  }

  // init
  function init() {
    // init i18n if available
    if (typeof i18n !== 'undefined') {
      i18n.init();
      // sync all language selectors
      syncLanguageSelectors();
      i18n.updatePage();
    }
    
    setupEventListeners();
    checkAuth();
  }
  
  // Change language and update all selectors
  function changeLanguage(lang) {
    if (typeof i18n !== 'undefined') {
      i18n.setLanguage(lang);
      syncLanguageSelectors();
      showToast(t('success'), 'success');
    }
  }
  
  // Sync all language selectors to current language
  function syncLanguageSelectors() {
    const currentLang = i18n.currentLang;
    
    // Dashboard language selector
    if (langSelect) {
      langSelect.value = currentLang;
    }
    
    // Landing page language selector
    const landingLangSelect = document.getElementById('landing-language-select');
    if (landingLangSelect) {
      landingLangSelect.value = currentLang;
    }
  }

  function setupEventListeners() {
    // login form
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
    
    // register form
    if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
    }
    
    // Landing page buttons - show login form
    const heroSignin = document.getElementById('hero-signin');
    const navSignin = document.getElementById('nav-signin');
    const navGetstarted = document.getElementById('nav-getstarted');
    const backToLanding = document.getElementById('back-to-landing');
    
    if (heroSignin) {
      heroSignin.addEventListener('click', () => showLoginForm());
    }
    if (navSignin) {
      navSignin.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
      });
    }
    if (navGetstarted) {
      navGetstarted.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterPage();
      });
    }
    if (backToLanding) {
      backToLanding.addEventListener('click', (e) => {
        e.preventDefault();
        hideLoginForm();
      });
    }
    
    // toggle between login and register
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    
    if (showRegisterBtn) {
      showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterPage();
      });
    }
    if (showLoginBtn) {
      showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginPage();
      });
    }
    
    // logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Quick audit button
    const quickAuditBtn = document.getElementById('quick-audit-btn');
    if (quickAuditBtn) {
      quickAuditBtn.addEventListener('click', () => navigateTo('models'));
    }
    
    // language selector (dashboard)
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
      });
    }
    
    // language selector (landing page)
    const landingLangSelect = document.getElementById('landing-language-select');
    if (landingLangSelect) {
      landingLangSelect.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
      });
    }
    
    // nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        navigateTo(page);
      });
    });

    // theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    // upload modal
    const uploadBtn = document.getElementById('upload-model-btn');
    console.log('[DEBUG] Upload button:', uploadBtn);
    console.log('[DEBUG] Upload modal:', uploadModal);
    
    if (uploadBtn) {
      uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('[DEBUG] Upload button clicked!');
        if (uploadModal) {
          console.log('[DEBUG] Opening modal...');
          uploadModal.classList.add('show');
        } else {
          console.error('[DEBUG] Upload modal not found!');
        }
      });
    } else {
      console.error('[DEBUG] Upload button not found!');
    }
    
    const closeUploadModal = document.getElementById('close-upload-modal');
    const cancelUpload = document.getElementById('cancel-upload');
    const closeAuditModal = document.getElementById('close-audit-modal');
    
    if (closeUploadModal) {
      closeUploadModal.addEventListener('click', () => {
        if (uploadModal) uploadModal.classList.remove('show');
      });
    }
    
    if (cancelUpload) {
      cancelUpload.addEventListener('click', () => {
        if (uploadModal) uploadModal.classList.remove('show');
      });
    }

    // close audit modal
    if (closeAuditModal) {
      closeAuditModal.addEventListener('click', () => {
        if (auditModal) auditModal.classList.remove('show');
      });
    }

    // file dropzone
    setupFileDropzone();

    // upload form
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
      uploadForm.addEventListener('submit', handleUpload);
    }

    // audit filter
    const auditStatusFilter = document.getElementById('audit-status-filter');
    if (auditStatusFilter) {
      auditStatusFilter.addEventListener('change', (e) => {
        loadAudits({ status: e.target.value });
      });
    }

    // close modals on outside click
    if (uploadModal) {
      uploadModal.addEventListener('click', (e) => {
        if (e.target === uploadModal) {
          uploadModal.classList.remove('show');
        }
      });
    }
    if (auditModal) {
      auditModal.addEventListener('click', (e) => {
        if (e.target === auditModal) {
          auditModal.classList.remove('show');
        }
      });
    }
  }

  // toast notification system
  function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      hideToast(toast);
    });
    
    // auto hide
    setTimeout(() => hideToast(toast), duration);
  }
  
  function hideToast(toast) {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }

  function setupFileDropzone() {
    const dropzone = document.getElementById('file-dropzone');
    const fileInput = document.getElementById('model-file');
    const fileName = document.getElementById('selected-file-name');

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        fileName.textContent = e.dataTransfer.files[0].name;
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        fileName.textContent = fileInput.files[0].name;
      }
    });
  }

  // auth stuff
  async function checkAuth() {
    const token = api.getToken();
    if (!token) {
      showLoginPage();
      return;
    }

    try {
      const data = await api.getMe();
      if (data && data.user) {
        currentUser = data.user;
        showDashboard();
      } else {
        showLoginPage();
      }
    } catch (err) {
      // token invalid or expired
      api.clearToken();
      showLoginPage();
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    loginError.textContent = '';
    
    const btn = document.getElementById('login-btn');
    btn.classList.add('loading');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('remember-me').checked;

    try {
      const data = await api.login(email, password, remember);
      if (data && data.user) {
        currentUser = data.user;
        showToast(t('loginSuccess'), 'success');
        showDashboard();
      }
    } catch (err) {
      loginError.textContent = err.message || t('loginFailed');
      showToast(err.message || t('loginFailed'), 'error');
    } finally {
      btn.classList.remove('loading');
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    registerError.textContent = '';
    
    const btn = document.getElementById('register-btn');
    btn.classList.add('loading');

    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    // validate names
    if (!firstName || !lastName) {
      registerError.textContent = 'First name and last name are required';
      btn.classList.remove('loading');
      return;
    }

    // validate passwords match
    if (password !== confirm) {
      registerError.textContent = t('passwordsNoMatch');
      btn.classList.remove('loading');
      return;
    }

    // validate password length
    if (password.length < 8) {
      registerError.textContent = t('passwordMinLength');
      btn.classList.remove('loading');
      return;
    }

    try {
      const data = await api.register(email, password, firstName, lastName);
      if (data && data.user) {
        currentUser = data.user;
        showToast(t('registerSuccess'), 'success');
        showDashboard();
      }
    } catch (err) {
      registerError.textContent = err.message || t('registerFailed');
      showToast(err.message || t('registerFailed'), 'error');
    } finally {
      btn.classList.remove('loading');
    }
  }

  function handleLogout() {
    api.clearToken();
    currentUser = null;
    showToast('Logged out successfully', 'success');
    showLandingPage();
  }

  // Show the login form overlay on landing page
  function showLoginForm() {
    loginPage.classList.add('show-login-form');
    if (loginFormContainer) {
      loginFormContainer.classList.remove('hidden');
    }
    loginForm.reset();
    loginError.textContent = '';
  }

  // Hide login form and show landing page
  function hideLoginForm() {
    loginPage.classList.remove('show-login-form');
    if (loginFormContainer) {
      loginFormContainer.classList.add('hidden');
    }
  }

  // Show landing page (with hero)
  function showLandingPage() {
    loginPage.classList.remove('hidden');
    loginPage.classList.remove('show-login-form');
    if (loginFormContainer) {
      loginFormContainer.classList.add('hidden');
    }
    registerPage.classList.add('hidden');
    dashboardPage.classList.add('hidden');
  }

  function showLoginPage() {
    loginPage.classList.remove('hidden');
    registerPage.classList.add('hidden');
    dashboardPage.classList.add('hidden');
    showLoginForm();
  }

  function showRegisterPage() {
    loginPage.classList.add('hidden');
    registerPage.classList.remove('hidden');
    dashboardPage.classList.add('hidden');
    // clear form
    registerForm.reset();
    registerError.textContent = '';
  }

  // Welcome message translations
  const welcomeTranslations = {
    en: { welcome: 'Welcome back' },
    de: { welcome: 'Willkommen zuruck' },
    fr: { welcome: 'Bon retour' },
    it: { welcome: 'Bentornato' }
  };

  // Time-based witty greetings for Data Scientists
  function getQuirkyGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Morning! First coffee, then bias detection.";
    } else if (hour >= 12 && hour < 18) {
      return "Afternoon! Models are running, hope your weights are converging.";
    } else if (hour >= 18 && hour < 22) {
      return "Evening! Still auditing? Don't forget to 'overfit' your sleep tonight.";
    } else {
      return "Night shift? Remember: even the best models need a rest.";
    }
  }

  // ML Insights - Daily tips for data scientists
  const mlInsights = [
    "Tip: Disparate Impact helps identify if one group is unfairly favored.",
    "Reminder: A model with 99% accuracy can still be 100% biased.",
    "Pro Tip: SHAP values reveal the 'black box' behind your model's decisions.",
    "Insight: Demographic parity doesn't guarantee individual fairness.",
    "Fun fact: The 80% rule comes from US employment discrimination law.",
    "Remember: Fairness metrics can conflict - choose wisely for your use case.",
    "Tip: Always check for proxy variables that might encode protected attributes.",
    "Insight: Equalized odds balances both false positives and false negatives."
  ];

  function getRandomInsight() {
    return mlInsights[Math.floor(Math.random() * mlInsights.length)];
  }

  function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function showDashboard() {
    loginPage.classList.add('hidden');
    registerPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
    userEmailSpan.textContent = currentUser?.email || '';
    
    // Update quirky greeting based on time
    const greetingQuirky = document.getElementById('greeting-quirky');
    if (greetingQuirky) {
      greetingQuirky.textContent = getQuirkyGreeting();
    }
    
    // Update welcome message with username and translation
    const welcomeMsg = document.getElementById('welcome-message');
    const lang = localStorage.getItem('guardian_lang') || 'en';
    const trans = welcomeTranslations[lang] || welcomeTranslations.en;
    
    if (welcomeMsg) {
      // Use firstName if available, otherwise parse from email
      const firstName = currentUser?.firstName;
      const rawName = firstName || currentUser?.email?.split('@')[0] || 'User';
      const username = capitalizeFirstLetter(rawName);
      welcomeMsg.textContent = `${trans.welcome}, ${username}`;
    }
    
    // Display random ML insight
    const mlInsightEl = document.getElementById('ml-insight');
    if (mlInsightEl) {
      mlInsightEl.textContent = getRandomInsight();
    }
    
    // set language selector
    if (langSelect && typeof i18n !== 'undefined') {
      langSelect.value = i18n.currentLang;
    }
    
    // load initial data
    loadOverview();
  }

  // navigation
  function navigateTo(page) {
    // update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });

    // show/hide sections
    overviewSection.classList.toggle('hidden', page !== 'overview');
    modelsSection.classList.toggle('hidden', page !== 'models');
    auditsSection.classList.toggle('hidden', page !== 'audits');

    // load data for the page
    if (page === 'overview') loadOverview();
    if (page === 'models') loadModels();
    if (page === 'audits') loadAudits();
  }

  // data loading
  async function loadOverview() {
    try {
      // load stats
      const statsData = await api.getStats();
      if (statsData) {
        // Backend returns: { totalModels, totalAudits, avgCompliance, runningAudits }
        const statModels = document.getElementById('stat-models');
        const statAudits = document.getElementById('stat-audits');
        const statCompliance = document.getElementById('stat-compliance');
        const statRunning = document.getElementById('stat-running');
        
        if (statModels) statModels.textContent = statsData.totalModels || 0;
        if (statAudits) statAudits.textContent = statsData.totalAudits || 0;
        if (statCompliance) statCompliance.textContent = statsData.avgCompliance ? `${statsData.avgCompliance}%` : 'N/A';
        if (statRunning) statRunning.textContent = statsData.runningAudits || 0;
      }

      // load recent audits
      const auditsData = await api.getAudits(1, 5);
      if (auditsData && auditsData.audits) {
        renderRecentAudits(auditsData.audits);
        renderCharts(auditsData.audits);
      }
    } catch (err) {
      console.error('Failed to load overview:', err);
    }
  }

  async function loadModels() {
    try {
      const data = await api.getModels();
      if (data && data.models) {
        renderModels(data.models);
      }
    } catch (err) {
      console.error('Failed to load models:', err);
    }
  }

  async function loadAudits(filters = {}) {
    try {
      const data = await api.getAudits(1, 50, filters);
      if (data && data.audits) {
        renderAuditsTable(data.audits);
      }
    } catch (err) {
      console.error('Failed to load audits:', err);
    }
  }

  // rendering
  function renderRecentAudits(audits) {
    const tbody = document.getElementById('recent-audits-table');
    
    if (!tbody) return;
    
    if (!audits.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No audits yet</td></tr>';
      return;
    }

    tbody.innerHTML = audits.map(audit => `
      <tr>
        <td>${audit.modelName || audit.model_name || 'Unknown'}</td>
        <td>${audit.auditType || audit.audit_type || 'full'}</td>
        <td><span class="status-badge status-${audit.status}">${audit.status}</span></td>
        <td>${audit.complianceScore ? `${Math.round(audit.complianceScore)}%` : (audit.cern_compliance ? `${(audit.cern_compliance * 100).toFixed(0)}%` : '-')}</td>
        <td>${formatDate(audit.createdAt || audit.created_at)}</td>
        <td>
          ${audit.status === 'completed' ? 
            `<button class="btn btn-secondary" onclick="app.viewAudit('${audit.id}')">View</button>` : 
            ''}
        </td>
      </tr>
    `).join('');
  }

  function renderModels(models) {
    const grid = document.getElementById('models-grid');

    if (!grid) return;

    if (!models.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <p>No models uploaded yet</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = models.map(model => `
      <div class="model-card">
        <h4>${model.name}</h4>
        <p><strong>Framework:</strong> ${model.framework}</p>
        <p><strong>Uploaded:</strong> ${formatDate(model.uploadedAt || model.uploaded_at)}</p>
        <p><strong>By:</strong> ${model.uploadedBy || model.uploaded_by_email || 'Unknown'}</p>
        <div class="model-actions">
          <button class="btn btn-primary" onclick="app.runAudit('${model.id}')">Run Audit</button>
          <button class="btn btn-secondary" onclick="app.deleteModel('${model.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }

  function renderAuditsTable(audits) {
    const tbody = document.getElementById('audits-table');

    if (!tbody) return;

    if (!audits.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No audits found</td></tr>';
      return;
    }

    tbody.innerHTML = audits.map(audit => `
      <tr>
        <td title="${audit.id}">${audit.id.substring(0, 8)}...</td>
        <td>${audit.modelName || audit.model_name || 'Unknown'}</td>
        <td>${audit.auditType || audit.audit_type || 'full'}</td>
        <td><span class="status-badge status-${audit.status}">${audit.status}</span></td>
        <td>${formatScore(audit.biasScore || audit.bias_score)}</td>
        <td>${formatScore(audit.fairnessScore || audit.fairness_score)}</td>
        <td>${formatScore(audit.complianceScore || audit.cern_compliance)}</td>
        <td>${formatDate(audit.createdAt || audit.created_at)}</td>
        <td>
          ${audit.status === 'completed' ? `
            <button class="btn btn-secondary" onclick="app.viewAudit('${audit.id}')">View</button>
            <button class="btn btn-secondary" onclick="app.downloadReport('${audit.id}')">PDF</button>
          ` : ''}
        </td>
      </tr>
    `).join('');
  }

  function renderCharts(audits) {
    const completedAudits = audits.filter(a => a.status === 'completed');
    
    // compliance chart
    const complianceCanvas = document.getElementById('compliance-chart');
    if (!complianceCanvas) return;
    
    const complianceCtx = complianceCanvas.getContext('2d');
    
    if (complianceChart) complianceChart.destroy();
    
    // If no completed audits, show empty state
    if (completedAudits.length === 0) {
      complianceChart = new Chart(complianceCtx, {
        type: 'doughnut',
        data: {
          labels: ['No audits yet'],
          datasets: [{
            data: [1],
            backgroundColor: ['#E5E7EB']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { enabled: false }
          }
        }
      });
      
      // audits bar chart - empty state
      const auditsCanvas = document.getElementById('audits-chart');
      if (auditsCanvas) {
        const auditsCtx = auditsCanvas.getContext('2d');
        if (auditsChart) auditsChart.destroy();
        
        auditsChart = new Chart(auditsCtx, {
          type: 'bar',
          data: {
            labels: ['Upload a model to see metrics'],
            datasets: [{
              label: 'No data',
              data: [0],
              backgroundColor: '#E5E7EB'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: { beginAtZero: true, max: 100 }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
      }
      return;
    }
    
    // Helper to get compliance score (supports both formats)
    const getCompliance = (a) => {
      const score = a.complianceScore || a.cern_compliance || 0;
      return score > 1 ? score / 100 : score; // Normalize to 0-1
    };
    
    const getBias = (a) => {
      const score = a.biasScore || a.bias_score || 0;
      return score > 1 ? score : score * 100; // Normalize to 0-100
    };
    
    const getFairness = (a) => {
      const score = a.fairnessScore || a.fairness_score || 0;
      return score > 1 ? score : score * 100; // Normalize to 0-100
    };
    
    const getCompliancePercent = (a) => {
      const score = a.complianceScore || a.cern_compliance || 0;
      return score > 1 ? score : score * 100; // Normalize to 0-100
    };
    
    // Count audits by compliance level
    const compliant = completedAudits.filter(a => getCompliance(a) >= 0.8).length;
    const warning = completedAudits.filter(a => getCompliance(a) >= 0.6 && getCompliance(a) < 0.8).length;
    const nonCompliant = completedAudits.filter(a => getCompliance(a) < 0.6).length;
    
    complianceChart = new Chart(complianceCtx, {
      type: 'doughnut',
      data: {
        labels: ['Compliant (>80%)', 'Warning (60-80%)', 'Non-compliant (<60%)'],
        datasets: [{
          data: [compliant || 0, warning || 0, nonCompliant || 0],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

    // audits bar chart
    const auditsCanvas = document.getElementById('audits-chart');
    if (!auditsCanvas) return;
    
    const auditsCtx = auditsCanvas.getContext('2d');
    
    if (auditsChart) auditsChart.destroy();

    const recentAudits = completedAudits.slice(0, 5);
    const recentLabels = recentAudits.map(a => (a.modelName || a.model_name || 'Model').substring(0, 12));
    
    auditsChart = new Chart(auditsCtx, {
      type: 'bar',
      data: {
        labels: recentLabels,
        datasets: [
          {
            label: 'Bias Score',
            data: recentAudits.map(a => getBias(a)),
            backgroundColor: '#3b82f6'
          },
          {
            label: 'Fairness Score',
            data: recentAudits.map(a => getFairness(a)),
            backgroundColor: '#10b981'
          },
          {
            label: 'Compliance',
            data: recentAudits.map(a => getCompliancePercent(a)),
            backgroundColor: '#8b5cf6'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: { beginAtZero: true, max: 100 }
        },
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // actions
  async function handleUpload(e) {
    e.preventDefault();

    const name = document.getElementById('model-name').value;
    const framework = document.getElementById('model-framework').value;
    const fileInput = document.getElementById('model-file');

    if (!fileInput.files.length) {
      showToast(t('selectFile'), 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('framework', framework);
    formData.append('model', fileInput.files[0]);

    try {
      await api.uploadModel(formData);
      uploadModal.classList.remove('show');
      document.getElementById('upload-form').reset();
      document.getElementById('selected-file-name').textContent = '';
      loadModels();
      showToast(t('modelUploaded'), 'success');
    } catch (err) {
      showToast(t('uploadFailed') + ': ' + err.message, 'error');
    }
  }

  async function runAudit(modelId) {
    if (!confirm(t('confirmAudit'))) return;

    try {
      await api.runAudit(modelId);
      showToast(t('auditStarted'), 'success');
      navigateTo('audits');
    } catch (err) {
      showToast(t('auditFailed') + ': ' + err.message, 'error');
    }
  }

  async function deleteModel(modelId) {
    if (!confirm(t('confirmDelete'))) return;

    try {
      await api.deleteModel(modelId);
      loadModels();
      showToast(t('modelDeleted'), 'success');
    } catch (err) {
      showToast(t('deleteFailed') + ': ' + err.message, 'error');
    }
  }

  async function viewAudit(auditId) {
    try {
      // Use getAudit instead of getReportData - reports endpoint doesn't exist yet
      const data = await api.getAudit(auditId);
      if (data && data.audit) {
        renderAuditDetail({ audit: data.audit });
        if (auditModal) auditModal.classList.add('show');
      }
    } catch (err) {
      console.error('Failed to load audit:', err);
      showToast(t('loadFailed'), 'error');
    }
  }

  function renderAuditDetail(data) {
    const { audit } = data;
    const content = document.getElementById('audit-detail-content');
    
    if (!content || !audit) return;

    // Get scores - support both camelCase and snake_case
    const complianceScore = audit.complianceScore || audit.cern_compliance || 0;
    const biasScore = audit.biasScore || audit.bias_score || 0;
    const fairnessScore = audit.fairnessScore || audit.fairness_score || 0;
    const results = audit.results || {};
    const metrics = results.metrics || {};

    const getScoreClass = (score) => {
      // Handle both 0-1 and 0-100 ranges
      const normalizedScore = score > 1 ? score / 100 : score;
      if (normalizedScore >= 0.8) return 'good';
      if (normalizedScore >= 0.6) return 'warning';
      return 'bad';
    };

    content.innerHTML = `
      <div class="audit-detail">
        <div class="audit-info">
          <p><strong>Model:</strong> ${audit.modelName || audit.model_name || 'Unknown'}</p>
          <p><strong>Status:</strong> <span class="status-badge status-${audit.status}">${audit.status}</span></p>
          <p><strong>Created:</strong> ${formatDate(audit.createdAt || audit.created_at)}</p>
          ${audit.completedAt || audit.completed_at ? `<p><strong>Completed:</strong> ${formatDate(audit.completedAt || audit.completed_at)}</p>` : ''}
        </div>
        
        <div class="audit-scores">
          <div class="score-card">
            <div class="score-value ${getScoreClass(complianceScore)}">
              ${formatScore(complianceScore)}
            </div>
            <div class="score-label">Compliance Score</div>
          </div>
          <div class="score-card">
            <div class="score-value ${getScoreClass(1 - biasScore)}">
              ${formatScore(biasScore)}
            </div>
            <div class="score-label">Bias Score</div>
          </div>
          <div class="score-card">
            <div class="score-value ${getScoreClass(fairnessScore)}">
              ${formatScore(fairnessScore)}
            </div>
            <div class="score-label">Fairness Score</div>
          </div>
        </div>

        ${Object.keys(metrics).length ? `
          <div class="audit-section">
            <h4>Detailed Metrics</h4>
            ${Object.entries(metrics).map(([key, value]) => `
              <div class="metric-row">
                <span>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                <span>${typeof value === 'number' ? value.toFixed(4) : value}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${results.warnings && results.warnings.length ? `
          <div class="audit-section">
            <h4>⚠️ Warnings</h4>
            <ul class="warning-list">
              ${results.warnings.map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${results.recommendations && results.recommendations.length ? `
          <div class="audit-section">
            <h4>💡 Recommendations</h4>
            <ul class="recommendation-list">
              ${results.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="form-actions">
          <button class="btn btn-primary" onclick="app.downloadReport('${audit.id}')">
            Download PDF Report
          </button>
        </div>
      </div>
    `;
  }

  async function downloadReport(auditId) {
    try {
      const url = api.getReportPdfUrl(auditId);
      const token = api.getToken();
      
      if (!token) {
        showToast('Please login first', 'error');
        return;
      }
      
      console.log('[DEBUG] Downloading PDF for audit:', auditId);
      console.log('[DEBUG] URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[DEBUG] Download error:', response.status, errorText);
        throw new Error(`Download failed: ${response.status} - ${errorText}`);
      }
      
      const blob = await response.blob();
      console.log('[DEBUG] Blob size:', blob.size);
      
      if (blob.size === 0) {
        throw new Error('Empty PDF received');
      }
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `guardian-audit-${auditId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      showToast('Report downloaded successfully', 'success');
    } catch (err) {
      console.error('Download failed:', err.message || err);
      showToast('Download failed: ' + (err.message || 'Unknown error'), 'error');
    }
  }

  // theme
  function loadTheme() {
    const saved = localStorage.getItem('guardian_theme');
    const theme = saved || 'light';
    document.body.dataset.theme = theme;
    updateThemeIcon(theme);
  }

  function toggleTheme() {
    const current = document.body.dataset.theme || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = next;
    localStorage.setItem('guardian_theme', next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  // utils
  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatScore(score) {
    if (score === null || score === undefined) return '-';
    // Handle both 0-1 and 0-100 ranges
    if (score <= 1) {
      return `${(score * 100).toFixed(0)}%`;
    }
    return `${Math.round(score)}%`;
  }

  // expose public methods
  window.app = {
    viewAudit,
    runAudit,
    deleteModel,
    downloadReport
  };

  // start the app
  init();
})();
