/* =========================================================
   NestMarket — js/admin-dashboard.js
   Listings, users, categories, reports, pickups, settings
   ========================================================= */

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const esc = window.nmEscapeHtml;

  const titles = {
    overview: 'Overview',
    listings: 'Listings',
    users: 'Users',
    categories: 'Categories',
    reports: 'Reports',
    enquiries: 'Enquiries',
    offers: 'Offers',
    pickups: 'Pickup Requests',
    settings: 'Settings'
  };

  const statusChip = (s) =>
    `<span class="chip ${nmStatusClass(s)}"><span class="status-dot ${nmStatusDot(s)}"></span>${esc(s)}</span>`;

  /* ---------------------------------------------------------
     Section navigation
     --------------------------------------------------------- */
  function showSection(name) {
    if (!titles[name]) name = 'overview';

    document.querySelectorAll('[data-panel]').forEach(p => {
      p.classList.toggle('hidden', p.getAttribute('data-panel') !== name);
    });
    document.querySelectorAll('.dash-nav-link[data-section]').forEach(btn => {
      const active = btn.getAttribute('data-section') === name;
      btn.classList.toggle('is-active', active);
      if (active) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    const title = $('#page-title');
    if (title) title.textContent = titles[name];
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-section]');
    if (!trigger || trigger.id === 'logout-btn') return;
    showSection(trigger.getAttribute('data-section'));
  });
  const logout = $('#logout-btn');
  if (logout) {
    logout.addEventListener('click', () => {
      window.nmToast('Signed out of the admin demo.', 'info');
      setTimeout(() => { window.location.href = '../login.html'; }, 800);
    });
  }

  /* ---------------------------------------------------------
     Mobile sidebar
     --------------------------------------------------------- */
  const sidebar = $('#dash-sidebar');
  const backdrop = $('#dash-backdrop');
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    setTimeout(() => {
      if (backdrop && !sidebar.classList.contains('is-open')) backdrop.hidden = true;
    }, 320);
  }

  function openSidebar() {
    if (!sidebar) return;
    if (backdrop) backdrop.hidden = false;
    void sidebar.offsetWidth;
    sidebar.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.classList.add('menu-open');
  }

  const openBtn = $('#dash-open');
  const closeBtn = $('#dash-close');
  if (openBtn) openBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('is-open')) closeSidebar();
  });
  window.addEventListener('resize', () => { if (window.innerWidth >= 1024) closeSidebar(); });
  /* ---------------------------------------------------------
     Stats + category bars
     --------------------------------------------------------- */
  function renderStats() {
    const total = NM_ADMIN_LISTINGS.length;
    const active = NM_ADMIN_LISTINGS.filter(l => l.status === 'Approved').length;
    const pendingReports = NM_REPORTS.filter(r => r.status === 'Open').length;

    const set = (id, v) => { const el = $(id); if (el) el.textContent = String(v); };
    set('#adm-stat-total', total);
    set('#adm-stat-active', active);
    set('#adm-stat-users', NM_ADMIN_USERS.length);
    set('#adm-stat-reports', pendingReports);
    const badge = $('#report-badge');
    if (badge) {
      badge.textContent = String(pendingReports);
      badge.classList.toggle('hidden', pendingReports === 0);
    }
  }

  function renderCategoryBars() {
    const host = $('#category-bars');
    if (!host) return;
    const max = Math.max.apply(null, NM_CATEGORIES.map(c => c.count));
    host.innerHTML = NM_CATEGORIES.map(c => `
      <div>
        <div class="flex items-center justify-between text-sm">
          <span class="font-medium text-charcoal">${esc(c.label)}</span>
          <span class="text-[#6B7683]">${c.count}</span>
        </div>
        <div class="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#F0E9DC]">
          <div class="h-full rounded-full bg-[#6B4F3A]" style="width:${Math.round((c.count / max) * 100)}%"></div>
        </div>
      </div>`).join('');
  }

  function renderAttention() {
    const host = $('#attention-list');
    if (!host) return;
    const open = NM_REPORTS.filter(r => r.status === 'Open').slice(0, 4);
    host.innerHTML = open.length
      ? open.map(r => `
        <li class="rounded-xl bg-[#FBF8F2] p-3.5">
          <p class="text-sm font-semibold text-charcoal">${esc(r.listing)}</p>
          <p class="mt-0.5 text-xs text-[#6B7683]">${esc(r.reason)} · reported ${esc(r.date)}</p>
        </li>`).join('')
      : '<li class="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">No open reports. Nice work!</li>';
  }

  /* ---------------------------------------------------------
     Listings
     --------------------------------------------------------- */
  function renderListings() {
    const body = $('#adm-listings-body');
    if (!body) return;

    const filter = $('#adm-listing-status') ? $('#adm-listing-status').value : '';
    const rows = NM_ADMIN_LISTINGS.filter(l => !filter || l.status === filter);
    body.innerHTML = rows.map(l => {
      const i = NM_ADMIN_LISTINGS.indexOf(l);
      return `
      <tr>
        <td data-label="Listing"><span class="font-semibold text-charcoal">${esc(l.listing)}</span></td>
        <td data-label="Seller">${esc(l.seller)}</td>
        <td data-label="Category"><span class="chip bg-[#F5EFE4] text-[#3D4A56]">${esc(l.category)}</span></td>
        <td data-label="Location">${esc(l.location)}</td>
        <td data-label="Price"><span class="font-semibold text-[#6B4F3A]">${nmFormatPrice(l.price)}</span></td>
        <td data-label="Status">${statusChip(l.status)}</td>
        <td data-label="Date" class="whitespace-nowrap text-sm text-[#6B7683]">${esc(l.date)}</td>
        <td data-label="Actions">
          <div class="flex flex-wrap justify-end gap-1.5">
            <button type="button" class="rounded-lg border border-[#DED3C0] px-2.5 py-1.5 text-xs font-semibold hover:border-walnut hover:text-walnut" data-adm-listing="view" data-i="${i}">View</button>
            <button type="button" class="rounded-lg bg-[#6B4F3A] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#56402E] disabled:opacity-40" data-adm-listing="approve" data-i="${i}" ${l.status === 'Approved' ? 'disabled' : ''}>Approve</button>
            <button type="button" class="rounded-lg border border-amber-200 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50" data-adm-listing="reject" data-i="${i}" ${l.status === 'Rejected' ? 'disabled' : ''}>Reject</button>
            <button type="button" class="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50" data-adm-listing="remove" data-i="${i}">Remove</button>
          </div>
        </td>
      </tr>`;
    }).join('');
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="8" class="py-8 text-center text-[#6B7683]">No listings match this filter.</td></tr>';
    }
  }

  const listingStatus = $('#adm-listing-status');
  if (listingStatus) listingStatus.addEventListener('change', renderListings);
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-adm-listing]');
    if (!btn) return;
    const i = Number(btn.getAttribute('data-i'));
    const listing = NM_ADMIN_LISTINGS[i];
    if (!listing) return;
    const action = btn.getAttribute('data-adm-listing');
    if (action === 'view') {
      window.nmToast('Opening “' + listing.listing + '” (demo view).', 'info');
      return;
    }
    if (action === 'approve') {
      listing.status = 'Approved';
      window.nmToast('“' + listing.listing + '” approved (demo).', 'success');
    }
    if (action === 'reject') {
      listing.status = 'Rejected';
      window.nmToast('“' + listing.listing + '” rejected (demo).', 'info');
    }
    if (action === 'remove') {
      NM_ADMIN_LISTINGS.splice(i, 1);
      window.nmToast('“' + listing.listing + '” removed from the demo dataset.', 'success');
    }
    renderListings();
    renderStats();
  });
  /* ---------------------------------------------------------
     Users
     --------------------------------------------------------- */
  function renderUsers() {
    const body = $('#adm-users-body');
    if (!body) return;
    body.innerHTML = NM_ADMIN_USERS.map((u, i) => `
      <tr>
        <td data-label="User">
          <div class="flex items-center gap-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8DCC8] text-xs font-bold text-[#6B4F3A]">${esc(u.user.split(' ').map(w => w[0]).join('').slice(0, 2))}</span>
            <span class="font-semibold text-charcoal">${esc(u.user)}</span>
          </div>
        </td>
        <td data-label="Email" class="text-[#4B5563]">${esc(u.email)}</td>
        <td data-label="Location">${esc(u.location)}</td>
        <td data-label="Listings">${u.listings}</td>
        <td data-label="Joined" class="whitespace-nowrap text-sm text-[#6B7683]">${esc(u.joined)}</td>
        <td data-label="Status">${statusChip(u.status)}</td>
        <td data-label="Actions">
          <div class="flex justify-end gap-1.5">
            <button type="button" data-adm-user="${i}" class="rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${u.status === 'Active' ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}">
              ${u.status === 'Active' ? 'Suspend' : 'Activate'}
            </button>
          </div>
        </td>
      </tr>`).join('');
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-adm-user]');
    if (!btn) return;
    const u = NM_ADMIN_USERS[Number(btn.getAttribute('data-adm-user'))];
    if (!u) return;
    u.status = u.status === 'Active' ? 'Suspended' : 'Active';
    renderUsers();
    window.nmToast(u.user + ' is now ' + u.status.toLowerCase() + ' (demo).', u.status === 'Active' ? 'success' : 'info');
  });
  /* ---------------------------------------------------------
     Categories
     --------------------------------------------------------- */
  function renderCategories() {
    const host = $('#adm-categories');
    if (!host) return;

    const cards = NM_ADMIN_CATEGORIES.map((c, i) => `
      <div class="rounded-2xl border border-[#EAE1D2] bg-[#FBF8F2] p-5" data-cat-card="${i}">
        <div class="flex items-start justify-between gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6B4F3A] font-display text-base font-bold text-white">${esc(c.name.charAt(0))}</span>
          ${statusChip(c.status)}
        </div>
        <p class="mt-4 font-display text-base font-bold text-charcoal">${esc(c.name)}</p>
        <p class="text-xs text-[#6B7683]">${c.listings} listings</p>
        <div class="mt-4 flex gap-2">
          <button type="button" data-cat-action="edit" data-i="${i}" class="flex-1 rounded-lg border border-[#DED3C0] bg-white px-3 py-2 text-xs font-semibold hover:border-walnut hover:text-walnut">Edit</button>
          <button type="button" data-cat-action="delete" data-i="${i}" class="flex-1 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
        </div>
      </div>`).join('');
    host.innerHTML = `
      <form id="add-category-form" class="rounded-2xl border-2 border-dashed border-[#D9C7A8] bg-white p-5">
        <label class="nm-label" for="new-category">New category</label>
        <div class="flex gap-2">
          <input id="new-category" class="nm-input" placeholder="e.g. Kids Furniture">
          <button type="submit" class="shrink-0 rounded-xl bg-[#6B4F3A] px-4 text-sm font-semibold text-white hover:bg-[#56402E]">Add</button>
        </div>
      </form>` + cards;

    const addForm = $('#add-category-form');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = $('#new-category');
        const name = input.value.trim();
        if (name.length < 2) {
          window.nmToast('Enter a category name with at least 2 characters.', 'error');
          input.focus();
          return;
        }
        NM_ADMIN_CATEGORIES.push({ name: name, listings: 0, status: 'Active' });
        renderCategories();
        window.nmToast('Category “' + name + '” added (demo).', 'success');
      });
    }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat-action]');
    if (!btn) return;
    const i = Number(btn.getAttribute('data-i'));
    const action = btn.getAttribute('data-cat-action');
    const cat = NM_ADMIN_CATEGORIES[i];
    if (!cat) return;

    if (action === 'delete') {
      NM_ADMIN_CATEGORIES.splice(i, 1);
      renderCategories();
      window.nmToast('Category “' + cat.name + '” deleted (demo).', 'success');
    }

    if (action === 'edit') {
      const card = document.querySelector('[data-cat-card="' + i + '"]');
      if (!card) return;
      const label = card.querySelector('p.font-display');
      if (!label) return;
      const input = document.createElement('input');
      input.className = 'nm-input mt-4';
      input.value = cat.name;
      input.setAttribute('aria-label', 'Category name');
      label.replaceWith(input);
      input.focus();
      input.select();
      const commit = () => {
        const val = input.value.trim();
        if (val.length >= 2) {
          cat.name = val;
          window.nmToast('Category renamed to “' + val + '” (demo).', 'success');
        }
        renderCategories();
      };
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') { ev.preventDefault(); commit(); }
        if (ev.key === 'Escape') renderCategories();
      });
      input.addEventListener('blur', commit);
    }
  });
  /* ---------------------------------------------------------
     Reports
     --------------------------------------------------------- */
  function renderReports() {
    const host = $('#adm-reports');
    if (!host) return;

    if (!NM_REPORTS.length) {
      host.innerHTML = '<div class="rounded-2xl border border-dashed border-[#D9C7A8] bg-[#FBF8F2] px-6 py-12 text-center text-[#4B5563]">No reports right now.</div>';
      return;
    }

    host.innerHTML = NM_REPORTS.map((r, i) => `
      <article class="flex flex-col gap-4 rounded-2xl border border-[#EAE1D2] bg-[#FBF8F2] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="font-display text-base font-bold text-charcoal">${esc(r.listing)}</h2>
            ${statusChip(r.status)}
          </div>
          <p class="mt-1.5 text-sm text-[#4B5563]"><span class="font-semibold">Reason:</span> ${esc(r.reason)}</p>
          <p class="mt-0.5 text-xs text-[#6B7683]">Reported by ${esc(r.reporter)} · ${esc(r.date)}</p>
        </div>
        <div class="flex shrink-0 flex-wrap gap-2">
          <button type="button" data-report-action="review" data-i="${i}" class="rounded-lg border border-[#DED3C0] bg-white px-3.5 py-2 text-xs font-semibold hover:border-walnut hover:text-walnut">Review</button>
          <button type="button" data-report-action="resolve" data-i="${i}" class="rounded-lg bg-[#6B4F3A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#56402E] disabled:opacity-40" ${r.status !== 'Open' ? 'disabled' : ''}>Resolve</button>
          <button type="button" data-report-action="remove" data-i="${i}" class="rounded-lg border border-rose-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50">Remove</button>
        </div>
      </article>`).join('');
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-report-action]');
    if (!btn) return;
    const i = Number(btn.getAttribute('data-i'));
    const report = NM_REPORTS[i];
    if (!report) return;
    const action = btn.getAttribute('data-report-action');
    if (action === 'review') {
      window.nmToast('Reviewing “' + report.listing + '” (demo).', 'info');
      return;
    }
    if (action === 'resolve') {
      report.status = 'Resolved';
      window.nmToast('Report resolved (demo).', 'success');
    }
    if (action === 'remove') {
      NM_REPORTS.splice(i, 1);
      window.nmToast('Report removed and listing taken down (demo).', 'success');
    }
    renderReports();
    renderStats();
    renderAttention();
  });
  /* ---------------------------------------------------------
     Enquiries / offers / pickups
     --------------------------------------------------------- */
  function renderEnquiries() {
    const body = $('#adm-enquiries-body');
    if (!body) return;
    body.innerHTML = NM_ENQUIRIES.map(en => `
      <tr>
        <td data-label="Buyer"><span class="font-semibold text-charcoal">${esc(en.buyer)}</span></td>
        <td data-label="Listing">${esc(en.listing)}</td>
        <td data-label="Message"><p class="max-w-md text-[#4B5563]">${esc(en.message)}</p></td>
        <td data-label="Date" class="whitespace-nowrap text-sm text-[#6B7683]">${esc(en.date)}</td>
        <td data-label="Status">${statusChip(en.status)}</td>
      </tr>`).join('');
  }

  function renderOffers() {
    const body = $('#adm-offers-body');
    if (!body) return;
    body.innerHTML = NM_OFFERS.map(o => `
      <tr>
        <td data-label="Listing"><span class="font-semibold text-charcoal">${esc(o.listing)}</span></td>
        <td data-label="Buyer">${esc(o.buyer)}</td>
        <td data-label="Offer"><span class="font-display font-bold text-[#C47A44]">${nmFormatPrice(o.offer)}</span></td>
        <td data-label="Asking" class="text-[#6B7683]">${nmFormatPrice(o.asking)}</td>
        <td data-label="Date" class="whitespace-nowrap text-sm text-[#6B7683]">${esc(o.date)}</td>
        <td data-label="Status">${statusChip(o.status)}</td>
      </tr>`).join('');
  }

  function renderPickups() {
    const body = $('#adm-pickups-body');
    if (!body) return;
    body.innerHTML = NM_ADMIN_PICKUPS.map(p => `
      <tr>
        <td data-label="Listing"><span class="font-semibold text-charcoal">${esc(p.listing)}</span></td>
        <td data-label="Buyer">${esc(p.buyer)}</td>
        <td data-label="Seller">${esc(p.seller)}</td>
        <td data-label="Type"><span class="chip ${p.type === 'Delivery' ? 'bg-sky-100 text-sky-800' : 'bg-stone-100 text-stone-700'}">${esc(p.type)}</span></td>
        <td data-label="Location">${esc(p.location)}</td>
        <td data-label="Date" class="whitespace-nowrap">${esc(p.date)}</td>
        <td data-label="Status">${statusChip(p.status)}</td>
      </tr>`).join('');
  }

  /* ---------------------------------------------------------
     Settings
     --------------------------------------------------------- */
  const settingsForm = $('#adm-settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.nmToast('Admin settings saved (demo only — no backend).', 'success');
    });
  }

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  renderStats();
  renderCategoryBars();
  renderAttention();
  renderListings();
  renderUsers();
  renderCategories();
  renderReports();
  renderEnquiries();
  renderOffers();
  renderPickups();
  const hash = window.location.hash.replace('#', '');
  if (titles[hash]) showSection(hash);

  /* ---------------------------------------------------------
     Theme & RTL Toggles (Admin Dashboard)
     --------------------------------------------------------- */
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
    });
  });

  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isRTL = document.documentElement.dir === 'rtl';
      document.documentElement.dir = isRTL ? 'ltr' : 'rtl';
    });
  });
})();
