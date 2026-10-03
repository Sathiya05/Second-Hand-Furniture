/* =========================================================
   NestMarket — js/main.js
   Shared interactions: menu helpers, dropdowns, accordion,
   modals, toasts, favourites, search, smooth scrolling.
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     Broken-image fallback (keeps layout intact offline)
     --------------------------------------------------------- */
  const FALLBACK_IMG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <rect width="800" height="600" fill="#E8DCC8"/>
        <g fill="none" stroke="#6B4F3A" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">
          <path d="M240 250 400 120l160 130"/>
          <path d="M280 235v215h240V235"/>
          <path d="M350 450v-90h100v90"/>
          <path d="M350 360v-60a30 30 0 0 1 30-30h40a30 30 0 0 1 30 30v60"/>
        </g>
      </svg>`
    );

  document.addEventListener('error', function (e) {
    const el = e.target;
    if (el && el.tagName === 'IMG' && !el.dataset.nmFallback) {
      el.dataset.nmFallback = '1';
      el.src = FALLBACK_IMG;
    }
  }, true);

  /* ---------------------------------------------------------
     Toasts
     --------------------------------------------------------- */
  let toastHost = null;
  function ensureToastHost() {
    if (toastHost && document.body.contains(toastHost)) return toastHost;
    toastHost = document.createElement('div');
    toastHost.id = 'nm-toasts';
    toastHost.className = 'pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6';
    toastHost.setAttribute('role', 'status');
    toastHost.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastHost);
    return toastHost;
  }

  window.nmToast = function (message, type) {
    const host = ensureToastHost();
    const tone = {
      success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      error:   'border-rose-200 bg-rose-50 text-rose-900',
      info:    'border-[#E8DCC8] bg-white text-[#1F2933]'
    }[type || 'info'];
    const icon = {
      success: '<path d="m5 13 4 4L19 7"/>',
      error:   'M18 6 6 18M6 6l12 12',
      info:    'M12 16v-5M12 8h.01'
    }[type || 'info'];

    const el = document.createElement('div');
    el.className = `nm-toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-xl ${tone}`;
    el.innerHTML =
      `<svg class="mt-0.5 h-4.5 w-4.5 shrink-0" style="width:18px;height:18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="${icon}"/></svg>
       <span class="flex-1">${message}</span>
       <button type="button" class="shrink-0 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100" aria-label="Dismiss notification">
         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
       </button>`;
    host.appendChild(el);

    const remove = () => { if (el.parentNode) el.parentNode.removeChild(el); };
    el.querySelector('button').addEventListener('click', remove);
    setTimeout(remove, 4200);
    return el;
  };

  /* ---------------------------------------------------------
     [data-toast="message"] demo triggers
     --------------------------------------------------------- */
  function initToastTriggers() {
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-toast]');
      if (!el) return;
      window.nmToast(el.getAttribute('data-toast'), el.getAttribute('data-toast-type') || 'info');
    });
  }

  /* ---------------------------------------------------------
     Generic page dropdowns (non-navbar): [data-nm-dropdown]
     --------------------------------------------------------- */
  function initPageDropdowns() {
    document.querySelectorAll('[data-nm-dropdown]').forEach(wrap => {
      const btn = wrap.querySelector('[data-nm-dropdown-toggle]');
      const panel = wrap.querySelector('[data-nm-dropdown-panel]');
      if (!btn || !panel) return;
      const close = () => { wrap.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = wrap.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    });
  }

  /* ---------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------- */
  function initAccordions() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const answer = item.querySelector('.faq-answer');
      if (!trigger || !answer) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        /* close siblings for a classic accordion feel */
        const group = item.closest('[data-accordion="single"]');
        if (group && !isOpen) {
          group.querySelectorAll('.faq-item.is-open').forEach(other => {
            other.classList.remove('is-open');
            const t = other.querySelector('.faq-trigger');
            const a = other.querySelector('.faq-answer');
            if (t) t.setAttribute('aria-expanded', 'false');
            if (a) a.style.maxHeight = '0px';
          });
        }

        item.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
        answer.style.maxHeight = isOpen ? '0px' : answer.scrollHeight + 'px';
      });
    });

    window.addEventListener('resize', () => {
      document.querySelectorAll('.faq-item.is-open .faq-answer').forEach(a => {
        a.style.maxHeight = a.scrollHeight + 'px';
      });
    });
  }

  /* ---------------------------------------------------------
     Modals (accessible: focus trap, escape, backdrop)
     --------------------------------------------------------- */
  let activeModal = null;
  let lastFocused = null;

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('open', '');
    document.body.classList.add('menu-open');
    activeModal = modal;
    const focusable = modal.querySelector('[data-autofocus], input, textarea, select, button');
    if (focusable) setTimeout(() => focusable.focus(), 60);
  }

  function closeModal(target) {
    let m = target;
    if (typeof m === 'string') m = document.getElementById(m);
    m = m || activeModal;
    if (!m) return;
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    m.removeAttribute('open');
    document.body.classList.remove('menu-open');
    activeModal = null;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  window.nmOpenModal = openModal;
  window.nmCloseModal = closeModal;

  /* smooth scroll helper (safe everywhere) */
  window.nmScrollTo = function (el, block) {
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: block || 'start' });
    }
  };

  function initModals() {
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.getAttribute('data-modal-open')));
    });
    document.querySelectorAll('.nm-modal').forEach(modal => {
      modal.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(modal));
      });
      modal.addEventListener('mousedown', (e) => {
        if (e.target === modal) closeModal(modal);
      });
      /* simple focus trap */
      modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        const items = Array.prototype.slice.call(
          modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])')
        ).filter(el => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeModal) closeModal(activeModal);
    });
  }

  /* ---------------------------------------------------------
     Favourites (localStorage)
     --------------------------------------------------------- */
  const FAV_KEY = 'nm_favourites';

  function getFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
    catch (err) { return []; }
  }

  function saveFavs(list) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch (err) { /* ignore */ }
  }

  window.nmToggleFav = function (id) {
    id = Number(id);
    const favs = getFavs();
    const idx = favs.indexOf(id);
    let added;
    if (idx === -1) { favs.push(id); added = true; } else { favs.splice(idx, 1); added = false; }
    saveFavs(favs);
    document.querySelectorAll('[data-fav-id="' + id + '"]').forEach(b => {
      b.classList.toggle('is-active', added);
      b.setAttribute('aria-pressed', String(added));
      b.setAttribute('aria-label', (added ? 'Remove from saved: ' : 'Save: ') + (b.dataset.favTitle || 'listing'));
    });
    window.nmToast(added ? 'Saved to your list.' : 'Removed from your saved items.', added ? 'success' : 'info');
    return added;
  };

  window.nmGetFavs = getFavs;

  function initFavButtons() {
    const favs = getFavs();
    document.querySelectorAll('[data-fav-id]').forEach(btn => {
      const id = Number(btn.dataset.favId);
      if (favs.indexOf(id) !== -1) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
      }
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.nmToggleFav(id);
      });
    });
  }

  /* ---------------------------------------------------------
     Tabs  —  [data-tab-group] > [data-tab] / [data-tab-panel]
     --------------------------------------------------------- */
  function initTabs() {
    document.querySelectorAll('[data-tab-group]').forEach(group => {
      const tabs = Array.prototype.slice.call(group.querySelectorAll('[data-tab]'));
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.getAttribute('data-tab');
          tabs.forEach(t => {
            const on = t === tab;
            t.classList.toggle('is-active', on);
            t.setAttribute('aria-selected', String(on));
            t.setAttribute('tabindex', on ? '0' : '-1');
          });
          group.querySelectorAll('[data-tab-panel]').forEach(p => {
            const on = p.getAttribute('data-tab-panel') === target;
            p.classList.toggle('is-active', on);
            if (on) p.removeAttribute('hidden');
            else p.setAttribute('hidden', '');
          });
        });
        tab.addEventListener('keydown', (e) => {
          const i = tabs.indexOf(tab);
          if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(i + 1) % tabs.length].focus(); tabs[(i + 1) % tabs.length].click(); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(i - 1 + tabs.length) % tabs.length].focus(); tabs[(i - 1 + tabs.length) % tabs.length].click(); }
        });
      });
    });
  }

  /* ---------------------------------------------------------
     Smooth scrolling for in-page anchors
     --------------------------------------------------------- */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href*="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      const hash = href.indexOf('#') !== -1 ? href.slice(href.indexOf('#') + 1) : '';
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target) return;
      e.preventDefault();
      window.nmScrollTo(target, 'start');
      if (target.tabIndex === -1 || target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
      history.replaceState(null, '', '#' + hash);
    });
  }

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------
     Shared listing card renderer (used by home + browse)
     --------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  window.nmEscapeHtml = escapeHtml;

  window.nmCardHTML = function (l, opts) {
    opts = opts || {};
    const detailHref = `listing-details.html?id=${l.id}`;
    const showDistance = opts.showDistance !== false;
    return `
    <article class="group card-hover flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAE1D2] bg-white shadow-sm">
      <a href="${detailHref}" class="img-zoom relative block aspect-[4/3] bg-[#E8DCC8]" aria-label="View details for ${escapeHtml(l.title)}">
        <img src="${l.image}" alt="${escapeHtml(l.title)} — second-hand ${escapeHtml(l.category.toLowerCase())} in ${escapeHtml(l.location)}" class="h-full w-full object-cover" loading="lazy" width="800" height="600">
        <span class="chip absolute left-3 top-3 border border-white/60 bg-white/95 ${nmConditionClass(l.condition)}">${l.condition}</span>
        ${l.featured ? '<span class="chip absolute right-3 top-3 bg-[#C47A44] text-white">Featured</span>' : ''}
        <span class="absolute bottom-3 left-3 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">${escapeHtml(l.category)}</span>
      </a>

      <div class="flex flex-1 flex-col p-4 sm:p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <a href="${detailHref}" class="line-clamp-2 font-display text-[15px] font-bold leading-snug text-[#1F2933] transition-colors hover:text-[#6B4F3A]">${escapeHtml(l.title)}</a>
            <p class="mt-1.5 flex items-center gap-1 text-xs text-[#6B7683]">
              <svg class="h-3.5 w-3.5 text-[#C47A44]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              ${escapeHtml(l.location)}${showDistance ? ` &middot; ${l.distance} km` : ''}
            </p>
          </div>
          <button type="button" class="fav-btn shrink-0 rounded-full border border-[#EAE1D2] p-2 text-[#6B7683] transition-all hover:border-[#C47A44] hover:text-[#C47A44]"
                  data-fav-id="${l.id}" data-fav-title="${escapeHtml(l.title)}" aria-pressed="false" aria-label="Save ${escapeHtml(l.title)}">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 5.6a5.1 5.1 0 0 0-7.2 0L12 7.2l-1.6-1.6a5.1 5.1 0 1 0-7.2 7.2l8.8 8.8 8.8-8.8a5.1 5.1 0 0 0 0-7.2Z"/></svg>
          </button>
        </div>

        <div class="mt-3 flex items-baseline gap-2">
          <p class="font-display text-lg font-bold text-[#6B4F3A]">${nmFormatPrice(l.price)}</p>
          ${l.negotiable ? '<span class="chip bg-[#C47A44]/12 text-[#A9622F]">Negotiable</span>' : ''}
        </div>

        <p class="mt-1 text-xs text-[#6B7683]">Posted ${escapeHtml(l.posted)} &middot; ${escapeHtml(l.seller)}</p>

        <div class="mt-4 flex gap-2 pt-1">
          <a href="${detailHref}" class="flex-1 rounded-xl bg-[#6B4F3A] px-3 py-2.5 text-center text-[13px] font-semibold text-white transition-colors hover:bg-[#56402E]">View Details</a>
          <a href="${detailHref}&offer=1" class="flex-1 rounded-xl border border-[#6B4F3A] px-3 py-2.5 text-center text-[13px] font-semibold text-[#6B4F3A] transition-colors hover:bg-[#6B4F3A] hover:text-white">Make Offer</a>
        </div>
      </div>
    </article>`;
  };

  /* ---------------------------------------------------------
     Generic form helpers used by several pages
     --------------------------------------------------------- */
  window.nmValidateField = function (el, message) {
    const ok = el.value && String(el.value).trim().length > 0;
    el.classList.toggle('is-invalid', !ok);
    const err = el.parentElement ? el.parentElement.querySelector('.field-error') : null;
    if (err) {
      if (message) err.textContent = message;
      err.classList.toggle('is-visible', !ok);
    }
    return ok;
  };

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  function boot() {
    initToastTriggers();
    initPageDropdowns();
    initAccordions();
    initModals();
    initTabs();
    initSmoothScroll();
    initReveal();
    initFavButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* expose for scripts that inject cards after load */
  window.nmInitFavButtons = initFavButtons;
})();
