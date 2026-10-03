/* =========================================================
   NestMarket — js/user-dashboard.js
   Section navigation, stats, listings, offers, pickups…
   ========================================================= */

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const esc = window.nmEscapeHtml;

  const titles = {
    overview: 'Overview',
    listings: 'My Listings',
    saved: 'Saved Items',
    enquiries: 'Enquiries',
    offers: 'Offers',
    messages: 'Messages',
    pickups: 'Pickup & Delivery',
    profile: 'Profile',
    settings: 'Settings'
  };

  /* ---------------------------------------------------------
     Section switching
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
    if (!trigger) return;
    if (trigger.id === 'logout-btn') return;
    showSection(trigger.getAttribute('data-section'));
  });

  /* logout */
  const logout = $('#logout-btn');
  if (logout) {
    logout.addEventListener('click', () => {
      window.nmToast('Logged out of the demo account.', 'info');
      setTimeout(() => { window.location.href = '../login.html'; }, 800);
    });
  }

  /* ---------------------------------------------------------
     Mobile sidebar
     --------------------------------------------------------- */
  const sidebar = $('#dash-sidebar');
  const backdrop = $('#dash-backdrop');
  const openBtn = $('#dash-open');
  const closeBtn = $('#dash-close');

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
    const first = sidebar.querySelector('button');
    if (first) first.focus();
  }

  if (openBtn) openBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('is-open')) closeSidebar();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeSidebar();
  });

  /* ---------------------------------------------------------
     Stats
     --------------------------------------------------------- */
  function renderStats() {
    const active = NM_MY_LISTINGS.filter(l => l.status === 'Active').length;
    const pendingEnq = NM_ENQUIRIES.filter(e => e.status === 'New').length;
    const pendingOffers = NM_OFFERS.filter(o => o.status === 'Pending' || o.status === 'Countered').length;
    const saved = NM_SAVED_ITEMS.length;

    const set = (id, val) => { const el = $(id); if (el) el.textContent = String(val); };
    set('#stat-active', active);
    set('#stat-saved', saved);
    set('#stat-enquiries', pendingEnq);
    set('#stat-offers', pendingOffers);
  }

  /* ---------------------------------------------------------
     My listings
     --------------------------------------------------------- */
  function statusChip(status) {
    return `<span class="chip ${nmStatusClass(status)}"><span class="status-dot ${nmStatusDot(status)}"></span>${status}</span>`;
  }

  function renderListings() {
    const body = $('#listings-body');
    if (!body) return;

    body.innerHTML = NM_MY_LISTINGS.map(l => `
      <tr data-listing="${l.id}">
        <td data-label="Item">
          <div>
            <p class="font-semibold text-charcoal">${esc(l.item)}</p>
            <p class="text-xs text-[#6B7683]">${esc(l.posted)}</p>
          </div>
        </td>
        <td data-label="Price"><span class="font-semibold text-[#6B4F3A]">${nmFormatPrice(l.price)}</span></td>
        <td data-label="Views">${l.views}</td>
        <td data-label="Enquiries">${l.enquiries}</td>
        <td data-label="Offers">${l.offers}</td>
        <td data-label="Status" data-status-cell>${statusChip(l.status)}</td>
        <td data-label="Actions">
          <div class="flex flex-wrap justify-end gap-1.5">
            <button type="button" class="rounded-lg border border-[#DED3C0] px-2.5 py-1.5 text-xs font-semibold text-charcoal transition-colors hover:border-walnut hover:text-walnut" data-action="edit" data-id="${l.id}">Edit</button>
            <a href="../listing-details.html?id=${(l.id % 14) + 1}" class="rounded-lg border border-[#DED3C0] px-2.5 py-1.5 text-xs font-semibold text-charcoal transition-colors hover:border-walnut hover:text-walnut">View</a>
            <button type="button" class="rounded-lg border border-[#DED3C0] px-2.5 py-1.5 text-xs font-semibold text-charcoal transition-colors hover:border-walnut hover:text-walnut" data-action="pause" data-id="${l.id}">${l.status === 'Active' ? 'Pause' : 'Resume'}</button>
            <button type="button" class="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50" data-action="delete" data-id="${l.id}">Delete</button>
          </div>
        </td>
      </tr>`).join('');
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn || !btn.closest('#listings-body')) return;
    const id = Number(btn.getAttribute('data-id'));
    const row = document.querySelector('tr[data-listing="' + id + '"]');
    const record = NM_MY_LISTINGS.find(l => l.id === id);
    const action = btn.getAttribute('data-action');

    if (action === 'edit') {
      window.nmToast('Edit flow is simulated — opening the listing form demo.', 'info');
      setTimeout(() => { window.location.href = '../sell-furniture.html'; }, 700);
    }

    if (action === 'pause' && record && row) {
      record.status = record.status === 'Active' ? 'Pending' : 'Active';
      const cell = row.querySelector('[data-status-cell]');
      if (cell) cell.innerHTML = statusChip(record.status);
      btn.textContent = record.status === 'Active' ? 'Pause' : 'Resume';
      window.nmToast(record.status === 'Active' ? 'Listing resumed (demo).' : 'Listing paused (demo).', 'info');
      renderStats();
    }

    if (action === 'delete' && record && row) {
      if (row.parentElement) row.parentElement.removeChild(row);
      const idx = NM_MY_LISTINGS.indexOf(record);
      if (idx !== -1) NM_MY_LISTINGS.splice(idx, 1);
      window.nmToast('“' + record.item + '” removed from the demo list.', 'success');
      renderStats();
    }
  });

  /* ---------------------------------------------------------
     Saved items
     --------------------------------------------------------- */
  function renderSaved() {
    const host = $('#saved-grid');
    const empty = $('#saved-empty');
    if (!host) return;

    host.innerHTML = NM_SAVED_ITEMS.map(s => `
      <article class="card-hover overflow-hidden rounded-2xl border border-[#EAE1D2] bg-white">
        <a href="../listing-details.html?id=${s.id}" class="img-zoom block aspect-[4/3] bg-[#E8DCC8]">
          <img src="${s.image}" alt="${esc(s.title)}" class="h-full w-full object-cover" loading="lazy">
        </a>
        <div class="p-4">
          <div class="flex items-start justify-between gap-3">
            <a href="../listing-details.html?id=${s.id}" class="line-clamp-2 font-display text-[15px] font-bold text-charcoal hover:text-[#6B4F3A]">${esc(s.title)}</a>
            <span class="chip shrink-0 ${nmConditionClass(s.condition)}">${esc(s.condition)}</span>
          </div>
          <p class="mt-2 font-display text-lg font-bold text-[#6B4F3A]">${nmFormatPrice(s.price)}</p>
          <p class="mt-1 flex items-center gap-1.5 text-xs text-[#6B7683]">
            <svg class="h-3.5 w-3.5 text-[#C47A44]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${esc(s.location)}
          </p>
          <div class="mt-4 flex gap-2">
            <a href="../listing-details.html?id=${s.id}" class="flex-1 rounded-xl bg-[#6B4F3A] px-3 py-2.5 text-center text-[13px] font-semibold text-white hover:bg-[#56402E]">View</a>
            <button type="button" data-remove-saved="${s.id}" class="flex-1 rounded-xl border border-[#DED3C0] px-3 py-2.5 text-[13px] font-semibold text-charcoal transition-colors hover:border-rose-300 hover:text-rose-600">Remove</button>
          </div>
        </div>
      </article>`).join('');

    if (empty) empty.classList.toggle('hidden', NM_SAVED_ITEMS.length !== 0);
    host.classList.toggle('hidden', NM_SAVED_ITEMS.length === 0);
    renderStats();
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-saved]');
    if (!btn) return;
    const id = Number(btn.getAttribute('data-remove-saved'));
    const idx = NM_SAVED_ITEMS.findIndex(s => s.id === id);
    if (idx !== -1) {
      const item = NM_SAVED_ITEMS[idx];
      NM_SAVED_ITEMS.splice(idx, 1);
      renderSaved();
      window.nmToast('Removed “' + item.title + '” from saved items.', 'success');
    }
  });

  /* ---------------------------------------------------------
     Enquiries
     --------------------------------------------------------- */
  function renderEnquiries() {
    const body = $('#enquiries-body');
    if (!body) return;
    body.innerHTML = NM_ENQUIRIES.map(en => `
      <tr>
        <td data-label="Buyer"><span class="font-semibold text-charcoal">${esc(en.buyer)}</span></td>
        <td data-label="Listing">${esc(en.listing)}</td>
        <td data-label="Message"><p class="max-w-md text-[#4B5563]">${esc(en.message)}</p></td>
        <td data-label="Date"><span class="whitespace-nowrap text-sm text-[#6B7683]">${esc(en.date)}</span></td>
        <td data-label="Status">${statusChip(en.status)}</td>
      </tr>`).join('');

    const host = $('#overview-enquiries');
    if (host) {
      host.innerHTML = NM_ENQUIRIES.slice(0, 3).map(en => `
        <li class="flex items-start justify-between gap-3 rounded-xl bg-[#FBF8F2] p-3.5">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-charcoal">${esc(en.buyer)}</p>
            <p class="mt-0.5 truncate text-xs text-[#6B7683]">${esc(en.listing)}</p>
          </div>
          ${statusChip(en.status)}
        </li>`).join('');
    }
  }

  /* ---------------------------------------------------------
     Offers
     --------------------------------------------------------- */
  function renderOffers() {
    const body = $('#offers-body');
    if (body) {
      body.innerHTML = NM_OFFERS.map((o, i) => `
        <tr>
          <td data-label="Listing"><span class="font-semibold text-charcoal">${esc(o.listing)}</span></td>
          <td data-label="Buyer">${esc(o.buyer)}</td>
          <td data-label="Offer"><span class="font-display font-bold text-[#C47A44]">${nmFormatPrice(o.offer)}</span></td>
          <td data-label="Asking"><span class="text-[#6B7683]">${nmFormatPrice(o.asking)}</span></td>
          <td data-label="Date" class="whitespace-nowrap text-sm text-[#6B7683]">${esc(o.date)}</td>
          <td data-label="Status" data-offer-status="${i}">${statusChip(o.status)}</td>
          <td data-label="Actions">
            <div class="flex flex-wrap justify-end gap-1.5">
              <button type="button" data-offer-action="accept" data-offer-index="${i}" class="rounded-lg bg-[#6B4F3A] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#56402E] disabled:opacity-40" ${o.status === 'Accepted' || o.status === 'Declined' ? 'disabled' : ''}>Accept</button>
              <button type="button" data-offer-action="decline" data-offer-index="${i}" class="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50" ${o.status === 'Accepted' || o.status === 'Declined' ? 'disabled' : ''}>Decline</button>
              <button type="button" data-offer-action="counter" data-offer-index="${i}" class="rounded-lg border border-[#DED3C0] px-2.5 py-1.5 text-xs font-semibold text-charcoal hover:border-walnut hover:text-walnut" ${o.status === 'Accepted' || o.status === 'Declined' ? 'disabled' : ''}>Counter</button>
            </div>
          </td>
        </tr>`).join('');
    }

    const host = $('#overview-offers');
    if (host) {
      host.innerHTML = NM_OFFERS.slice(0, 3).map(o => `
        <li class="flex items-center justify-between gap-3 rounded-xl bg-[#FBF8F2] p-3.5">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-charcoal">${esc(o.listing)}</p>
            <p class="mt-0.5 text-xs text-[#6B7683]">${esc(o.buyer)} offered <span class="font-semibold text-[#C47A44]">${nmFormatPrice(o.offer)}</span></p>
          </div>
          ${statusChip(o.status)}
        </li>`).join('');
    }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-offer-action]');
    if (!btn) return;
    const idx = Number(btn.getAttribute('data-offer-index'));
    const offer = NM_OFFERS[idx];
    if (!offer) return;
    const action = btn.getAttribute('data-offer-action');

    if (action === 'accept') {
      offer.status = 'Accepted';
      window.nmToast('Offer accepted for “' + offer.listing + '” (demo).', 'success');
    } else if (action === 'decline') {
      offer.status = 'Declined';
      window.nmToast('Offer declined (demo).', 'info');
    } else if (action === 'counter') {
      offer.status = 'Countered';
      window.nmToast('Counter offer sent at ' + nmFormatPrice(Math.round((offer.offer + offer.asking) / 2 / 100) * 100) + ' (demo).', 'info');
    }

    const cell = document.querySelector('[data-offer-status="' + idx + '"]');
    if (cell) cell.innerHTML = statusChip(offer.status);

    document.querySelectorAll('[data-offer-index="' + idx + '"]').forEach(b => {
      b.disabled = offer.status === 'Accepted' || offer.status === 'Declined';
    });

    renderStats();
    const host = $('#overview-offers');
    if (host) renderOffersOverviewOnly();
  });

  function renderOffersOverviewOnly() {
    const host = $('#overview-offers');
    if (!host) return;
    host.innerHTML = NM_OFFERS.slice(0, 3).map(o => `
      <li class="flex items-center justify-between gap-3 rounded-xl bg-[#FBF8F2] p-3.5">
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-charcoal">${esc(o.listing)}</p>
          <p class="mt-0.5 text-xs text-[#6B7683]">${esc(o.buyer)} offered <span class="font-semibold text-[#C47A44]">${nmFormatPrice(o.offer)}</span></p>
        </div>
        ${statusChip(o.status)}
      </li>`).join('');
  }

  /* ---------------------------------------------------------
     Messages
     --------------------------------------------------------- */
  function renderMessages() {
    const host = $('#messages-list');
    if (!host) return;
    host.innerHTML = NM_MESSAGES.map(m => `
      <li class="flex items-start gap-4 py-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8DCC8] font-display text-sm font-bold text-[#6B4F3A]">${esc(m.from.split(' ').map(w => w[0]).join(''))}</span>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="flex items-center gap-2 text-sm font-semibold text-charcoal">
              ${esc(m.from)}
              ${m.unread ? '<span class="chip bg-[#C47A44] text-white">New</span>' : ''}
            </p>
            <span class="text-xs text-[#6B7683]">${esc(m.time)}</span>
          </div>
          <p class="mt-0.5 text-xs font-medium text-[#6B4F3A]">${esc(m.listing)}</p>
          <p class="mt-1 line-clamp-2 text-sm text-[#4B5563]">${esc(m.preview)}</p>
        </div>
        <button type="button" class="shrink-0 rounded-lg border border-[#DED3C0] px-3 py-1.5 text-xs font-semibold text-charcoal transition-colors hover:border-walnut hover:text-walnut" data-toast="Replying is simulated in this frontend demo.">Reply</button>
      </li>`).join('');
  }

  /* ---------------------------------------------------------
     Pickup & delivery
     --------------------------------------------------------- */
  let activePickupIndex = null;

  function renderPickups() {
    const body = $('#pickups-body');
    if (!body) return;
    body.innerHTML = NM_PICKUPS.map((p, i) => `
      <tr>
        <td data-label="Listing"><span class="font-semibold text-charcoal">${esc(p.listing)}</span></td>
        <td data-label="Buyer/Seller">${esc(p.party)}</td>
        <td data-label="Location">${esc(p.location)}</td>
        <td data-label="Preferred Date" class="whitespace-nowrap">${esc(p.date)}</td>
        <td data-label="Preferred Time" class="whitespace-nowrap">${esc(p.time)}</td>
        <td data-label="Delivery">
          <span class="chip ${p.type === 'Delivery' ? 'bg-sky-100 text-sky-800' : 'bg-stone-100 text-stone-700'}">${esc(p.type)}</span>
        </td>
        <td data-label="Status">${statusChip(p.status)}</td>
        <td data-label="Actions">
          <div class="flex justify-end gap-1.5">
            <button type="button" data-coordinate="${i}" class="rounded-lg bg-[#6B4F3A] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#56402E]">Coordinate</button>
            ${p.status === 'Scheduled' ? `<button type="button" data-complete="${i}" class="rounded-lg border border-[#DED3C0] px-2.5 py-1.5 text-xs font-semibold text-charcoal hover:border-walnut hover:text-walnut">Mark Done</button>` : ''}
          </div>
        </td>
      </tr>`).join('');
  }

  document.addEventListener('click', (e) => {
    const coordBtn = e.target.closest('[data-coordinate]');
    if (coordBtn) {
      activePickupIndex = Number(coordBtn.getAttribute('data-coordinate'));
      const p = NM_PICKUPS[activePickupIndex];
      const sub = $('#coord-sub');
      if (sub) sub.textContent = p.listing + ' · ' + p.party;
      const loc = $('#coord-location');
      if (loc) loc.value = p.location;
      const date = $('#coord-date');
      if (date) date.value = '';
      const time = $('#coord-time');
      if (time) time.value = '';
      const del = $('#coord-delivery');
      if (del) del.checked = p.type === 'Delivery';
      const err = $('#coord-error');
      if (err) err.classList.remove('is-visible');
      window.nmOpenModal('coord-modal');
      return;
    }

    const doneBtn = e.target.closest('[data-complete]');
    if (doneBtn) {
      const i = Number(doneBtn.getAttribute('data-complete'));
      NM_PICKUPS[i].status = 'Completed';
      renderPickups();
      window.nmToast('Pickup marked as completed (demo).', 'success');
    }
  });

  const coordForm = $('#coord-form');
  if (coordForm) {
    coordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = $('#coord-date');
      const time = $('#coord-time');
      const ok = !!date.value && !!time.value;
      const err = $('#coord-error');
      if (err) err.classList.toggle('is-visible', !ok);
      if (!ok) return;

      const p = NM_PICKUPS[activePickupIndex];
      if (p) {
        const d = new Date(date.value + 'T00:00:00');
        p.date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        p.time = time.value;
        p.type = $('#coord-delivery').checked ? 'Delivery' : 'Pickup';
        p.status = 'Scheduled';
      }
      window.nmCloseModal('coord-modal');
      renderPickups();
      window.nmToast('Coordination saved: ' + p.date + ' at ' + p.time + ' (demo).', 'success');
    });
  }

  /* ---------------------------------------------------------
     Forms
     --------------------------------------------------------- */
  const profileForm = $('#profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.nmToast('Profile saved (demo only — nothing was stored).', 'success');
    });
  }

  const settingsForm = $('#settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.nmToast('Settings saved (demo only).', 'success');
    });
  }

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  renderStats();
  renderListings();
  renderSaved();
  renderEnquiries();
  renderOffers();
  renderMessages();
  renderPickups();

  /* deep link: #listings etc. */
  const hash = window.location.hash.replace('#', '');
  if (titles[hash]) showSection(hash);
  /* ---------------------------------------------------------
     Theme & RTL Toggles (Dashboard)
     --------------------------------------------------------- */
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
    });
  });

  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRTL = document.documentElement.dir === 'rtl';
      document.documentElement.dir = isRTL ? 'ltr' : 'rtl';
    });
  });

})();
