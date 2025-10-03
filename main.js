// Main JS for Krushi Mitra (Vanilla JS, React-ready structure)
// Notes: Replace dummy data and handlers with real API calls later (JWT, Weather, Market, Q&A)

(function(){
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Year in footer
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  if (navToggle && navLinks){
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // Modal helpers
  function openModal(id){
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.setAttribute('open','');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal){
    modal.removeAttribute('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  // Open/Close modal bindings
  $$('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.getAttribute('data-open-modal'));
    });
  });
  $$('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
  });
  $$('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', () => closeModal(backdrop.closest('.modal')));
  });
  $$('[data-switch-modal]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const current = link.closest('.modal');
      const target = link.getAttribute('data-switch-modal');
      closeModal(current);
      openModal(target);
    });
  });

  // Simple validators
  function setError(input, msg){
    const err = document.querySelector(`[data-error-for="${input.id}"]`);
    if (err) err.textContent = msg || '';
  }
  function required(input){
    if (!input.value.trim()) { setError(input, 'This field is required'); return false; }
    setError(input, ''); return true;
  }
  function minLen(input, n){
    if (input.value.trim().length < n){ setError(input, `Minimum ${n} characters`); return false; }
    setError(input, ''); return true;
  }
  function emailLike(input){
    const ok = /.+@.+\..+/.test(input.value);
    if (!ok){ setError(input, 'Enter a valid email'); return false; }
    setError(input, ''); return true;
  }

  // Login form (placeholder for JWT integration)
  const loginForm = $('#loginForm');
  if (loginForm){
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const roleSel = $('#loginRole'); // Optional. If absent or empty, default to VISITOR
      const email = $('#loginEmail');
      const pass = $('#loginPassword');
      const ok = [required(email) && emailLike(email), required(pass) && minLen(pass, 6)].every(Boolean);
      if (!ok) return;

      // TODO: Replace with real API: POST /auth/login => receive JWT, store in localStorage
      const role = (roleSel && roleSel.value) ? roleSel.value : 'VISITOR';
      localStorage.setItem('km_user', JSON.stringify({ email: email.value, role, token: 'dummy-jwt' }));
      closeModal($('#loginModal'));
      routeToRole(role);
    });
  }

  // Register form (placeholder for registration API)
  const regForm = $('#registerForm');
  if (regForm){
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#regName');
      const email = $('#regEmail');
      const pass = $('#regPassword');
      const ok = [required(name), required(email) && emailLike(email), required(pass) && minLen(pass, 6)].every(Boolean);
      if (!ok) return;

      // TODO: Replace with real API: POST /auth/register
      const role = 'VISITOR'; // Default role when not selected
      localStorage.setItem('km_user', JSON.stringify({ name: name.value, email: email.value, role, token: 'dummy-jwt' }));
      closeModal($('#registerModal'));
      routeToRole(role);
    });
  }

  // Admin login
  const adminLoginForm = $('#adminLoginForm');
  if (adminLoginForm){
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#adminEmail');
      const pass = $('#adminPassword');
      const ok = [required(email) && emailLike(email), required(pass) && minLen(pass, 6)].every(Boolean);
      if (!ok) return;
      // TODO: POST /auth/admin/login
      localStorage.setItem('km_user', JSON.stringify({ email: email.value, role: 'admin', token: 'dummy-jwt' }));
      closeModal($('#adminLoginModal'));
      window.location.href = './pages/admin.html';
    });
  }

  // Route helper
  function routeToRole(role){
    if (role === 'FARMER') window.location.href = './pages/farmer-dashboard.html';
    else if (role === 'EXPERT') window.location.href = './pages/expert-dashboard.html';
    else if (role === 'VISITOR') window.location.href = './pages/visitor.html';
    else window.location.href = './index.html';
  }

  // Page-specific bootstraps using data-page attribute
  const page = document.body.getAttribute('data-page');
  if (page === 'dashboard') initDashboard();
  if (page === 'qa') initQA();
  if (page === 'market') initMarket();
  if (page === 'schemes') initSchemes();
  if (page === 'admin') initAdmin();

  // Dummy data (replace with fetch calls)
  const DUMMY = {
    questions: [
      { id: 1, author: 'Farmer A', text: 'What is the best time to sow wheat in Kharif season?' },
      { id: 2, author: 'Farmer B', text: 'How to treat leaf rust in wheat?' }
    ],
    recommendations: [
      { title: 'Wheat (HD-2967)', desc: 'High yield; sow in Nov-Dec; spacing 20 cm.' },
      { title: 'Paddy (IR-64)', desc: 'Suitable for irrigated areas; transplant after 25-30 days.' }
    ],
    schemes: [
      { name: 'PM-KISAN', dept: 'GoI', benefit: '₹6,000/year', status: 'Open' },
      { name: 'Soil Health Card', dept: 'GoI', benefit: 'Free soil testing', status: 'Open' }
    ],
    market: [
      { commodity: 'Wheat', price: '₹2,250/qtl', mandi: 'Nagpur' },
      { commodity: 'Soybean', price: '₹4,450/qtl', mandi: 'Akola' }
    ],
    weather: { location: 'Nagpur, MH', tempC: 30, condition: 'Partly Cloudy' },
    products: [
      { name: 'Bio-fertilizer A', price: '₹499', summary: 'Improves soil health, eco-friendly.' },
      { name: 'Organic Pesticide B', price: '₹299', summary: 'Targets common pests safely.' },
      { name: 'Seed Kit C', price: '₹199', summary: 'High-germination seasonal seeds.' }
    ]
  };

  function initDashboard(){
    // Question form
    const form = $('#askForm');
    const list = $('#recentQuestions');
    const recGrid = $('#recGrid');
    const schemeList = $('#schemeList');

    if (form){
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const ta = $('#questionText');
        if (!ta.value.trim()) return;
        // TODO: POST /questions
        DUMMY.questions.unshift({ id: Date.now(), author: 'You', text: ta.value.trim() });
        ta.value = '';
        renderQuestions(list, DUMMY.questions.slice(0,5));
      });
    }
    if (list) renderQuestions(list, DUMMY.questions.slice(0,5));
    if (recGrid) renderRecommendations(recGrid, DUMMY.recommendations);
    if (schemeList) renderSchemes(schemeList, DUMMY.schemes);
  }

  function renderQuestions(container, items){
    container.innerHTML = items.map(q => `
      <div class="card">
        <strong>${q.author}</strong>
        <p class="muted">${q.text}</p>
      </div>
    `).join('');
  }
  function renderRecommendations(container, items){
    container.innerHTML = items.map(r => `
      <div class="card">
        <h4>${r.title}</h4>
        <p class="muted">${r.desc}</p>
        <button class="btn btn-secondary">View Details</button>
      </div>
    `).join('');
  }
  function renderSchemes(container, items){
    container.innerHTML = items.map(s => `
      <tr>
        <td>${s.name}</td>
        <td>${s.dept}</td>
        <td>${s.benefit}</td>
        <td>${s.status}</td>
      </tr>
    `).join('');
  }

  function initQA(){
    const qList = $('#qaList');
    if (!qList) return;
    qList.innerHTML = DUMMY.questions.map(q => `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
          <div>
            <strong>${q.author}</strong>
            <p class="muted" style="margin:4px 0 0">${q.text}</p>
          </div>
          <button class="btn btn-primary" data-reply="${q.id}">Reply</button>
        </div>
        <div class="hide" id="replyBox-${q.id}">
          <div class="form-field" style="margin-top:10px">
            <label for="reply-${q.id}">Your Answer</label>
            <textarea id="reply-${q.id}" placeholder="Type your expert advice..."></textarea>
          </div>
          <div class="form-actions">
            <button class="btn btn-secondary" data-cancel="${q.id}">Cancel</button>
            <button class="btn btn-primary" data-submit="${q.id}">Submit</button>
          </div>
        </div>
      </div>
    `).join('');

    qList.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.getAttribute('data-reply')||btn.getAttribute('data-cancel')||btn.getAttribute('data-submit');
      if (btn.hasAttribute('data-reply')){
        $(`#replyBox-${id}`).classList.remove('hide');
      } else if (btn.hasAttribute('data-cancel')){
        $(`#replyBox-${id}`).classList.add('hide');
      } else if (btn.hasAttribute('data-submit')){
        const ta = $(`#reply-${id}`);
        if (!ta.value.trim()) return;
        // TODO: POST /answers
        alert('Answer submitted (placeholder).');
        ta.value = '';
        $(`#replyBox-${id}`).classList.add('hide');
      }
    });
  }

  function initMarket(){
    const weatherCard = $('#weatherCard');
    const priceBody = $('#priceBody');

    // TODO: Integrate weather API: GET /weather?location=... and render
    if (weatherCard){
      weatherCard.innerHTML = `
        <div class="card" style="display:flex;gap:12px;align-items:center">
          <i class="fa-solid fa-cloud-sun" style="font-size:28px;color:var(--primary)"></i>
          <div>
            <div><strong>${DUMMY.weather.location}</strong></div>
            <div class="muted">${DUMMY.weather.condition} • ${DUMMY.weather.tempC}°C</div>
          </div>
        </div>
      `;
    }

    // Market prices (placeholder)
    if (priceBody){
      priceBody.innerHTML = DUMMY.market.map(m => `
        <tr>
          <td>${m.commodity}</td>
          <td>${m.price}</td>
          <td>${m.mandi}</td>
        </tr>
      `).join('');
    }
  }

  function initSchemes(){
    const list = $('#schemesBody');
    if (list) renderSchemes(list, DUMMY.schemes);
    const productsGrid = $('#productsGrid');
    if (productsGrid) renderProducts(productsGrid, DUMMY.products);
  }

  function initAdmin(){
    const pendingQ = $('#pendingQuestions');
    const pendingA = $('#pendingAnswers');
    if (pendingQ){
      pendingQ.innerHTML = DUMMY.questions.map(q => `<li>Q#${q.id}: ${q.text.slice(0,60)}...</li>`).join('');
    }
    if (pendingA){
      pendingA.innerHTML = [
        'Answer review: Wheat sowing guide (Farmer A)',
        'Answer review: Leaf rust treatment (Farmer B)'
      ].map(t => `<li>${t}</li>`).join('');
    }
  }

  function renderProducts(container, items){
    container.innerHTML = items.map(p => `
      <div class="card">
        <h4>${p.name}</h4>
        <p class="muted">${p.summary}</p>
        <div class="form-actions"><span><strong>${p.price}</strong></span><button class="btn btn-secondary">View</button></div>
      </div>
    `).join('');
  }
})();


