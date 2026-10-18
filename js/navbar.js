/* =========================================================
   NestMarket — js/navbar.js
   Dynamically renders the global navbar into #navbar
   ========================================================= */

(function () {
  'use strict';

  const mount = document.getElementById('navbar');
  if (!mount) return;
  mount.classList.add('sticky', 'top-0', 'z-50');

  /* Resolve site root from this script's own src so pages in
     /dashboard can link back correctly. */
  const scriptEl = document.currentScript ||
    Array.prototype.slice.call(document.scripts).find(s => /js\/navbar\.js/.test(s.src));
  const BASE = scriptEl ? scriptEl.src.replace(/js\/navbar\.js.*$/, '') : './';

  const url = (p) => BASE + p;

  const currentPage = (function () {
    let path = window.location.pathname.split('/').pop();
    if (!path || path === '') path = 'index.html';
    return path;
  })();

  const isHome = currentPage === 'index.html' || currentPage === 'home2.html';
    const isAbout = currentPage === 'about.html';

  const isBrowse = currentPage === 'browse.html' || currentPage === 'listing-details.html';
  const isSell = currentPage === 'sell-furniture.html';
  const isHow = currentPage === 'how-it-works.html';
  const isContact = currentPage === 'contact.html';
  const isLogin = currentPage === 'login.html';
  const isUserDash = currentPage === 'user-dashboard.html';
  const isAdminDash = currentPage === 'admin-dashboard.html';
  const isDash = isUserDash || isAdminDash;

  /* Both branches carry their own font-weight: a base `font-medium` next to
     `font-semibold` in one class attribute resolves by stylesheet order,
     which made the highlight weight flip between pages. */
  const activeCls = 'font-semibold text-[#6B4F3A] bg-[#E8DCC8]/60';
  const idleTopCls = 'font-medium text-[#1F2933] hover:text-[#6B4F3A] hover:bg-[#F5EFE4]';

  /* Sub-links (dropdown items + mobile drawer children) get ONE class string
     built per state. Two competing arbitrary text-colors in the same class
     attribute resolve by stylesheet order, which silently dropped the
     highlight on the desktop menu. */
  const subActiveCls = 'bg-[#E8DCC8]/70 font-semibold text-[#6B4F3A]';
  const subIdleCls = 'font-normal text-[#3D4A56] hover:bg-[#F5EFE4] hover:text-[#6B4F3A]';

  const subCls = (isCurrent, base) =>
    base + ' transition-colors ' + (isCurrent ? subActiveCls : subIdleCls);

  const ariaCurrent = (isCurrent) => (isCurrent ? ' aria-current="page"' : '');

  /* Top-level mobile drawer rows */
  const mRowActive = 'bg-[#E8DCC8]/70 font-semibold text-[#6B4F3A]';
  const mRowIdle = 'font-medium text-[#1F2933] hover:bg-[#F5EFE4]';

  function chevron() {
    return '<svg class="chev ml-1 h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  }

  function logoMark(size) {
    const s = size || 38;
    return `<span class="relative inline-flex items-center justify-center rounded-xl bg-[#6B4F3A] shadow-sm" style="width:${s}px;height:${s}px" aria-hidden="true">
      <svg width="${Math.round(s * 0.66)}" height="${Math.round(s * 0.66)}" viewBox="0 0 32 32" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 14.5 16 4l12 10.5"/>
        <path d="M7 13v14h18V13"/>
        <path d="M12 27v-6h8v6"/>
        <path d="M12 21v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/>
      </svg>
    </span>`;
  }

  /* ---------------- Desktop markup ---------------- */

  function desktopNav() {
    return `
    <ul class="hidden 2xl:flex items-center gap-1" role="menubar" aria-label="Primary">
      <li role="none">
        <div class="dropdown relative" data-dropdown>
          <button type="button" role="menuitem" class="dropdown-toggle flex h-9 items-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm leading-none transition-colors ${isHome ? activeCls : idleTopCls}" aria-haspopup="true" aria-expanded="false" aria-controls="home-menu"${ariaCurrent(isHome)}>
            Home ${chevron()}
          </button>
          <div class="dropdown-menu absolute left-0 top-full z-50 pt-3" id="home-menu" role="menu" aria-label="Home pages">
            <div class="w-44 overflow-hidden rounded-xl border border-[#EAE1D2] bg-white py-1.5 shadow-xl shadow-black/10">
              <a role="menuitem" href="${url('index.html')}" class="${subCls(currentPage === 'index.html', 'block px-4 py-2.5 text-sm')}"${ariaCurrent(currentPage === 'index.html')}>Home 1</a>
              <a role="menuitem" href="${url('home2.html')}" class="${subCls(currentPage === 'home2.html', 'block px-4 py-2.5 text-sm')}"${ariaCurrent(currentPage === 'home2.html')}>Home 2</a>
            </div>
          </div>
        </div>
      </li>
          <li role="none">
        <a role="menuitem" href="${url('about.html')}" class="flex h-9 items-center whitespace-nowrap rounded-lg px-3 text-sm leading-none transition-colors ${isAbout ? activeCls : 'text-[#1F2933] hover:text-[#6B4F3A] hover:bg-[#F5EFE4]'}" ${isAbout ? 'aria-current="page"' : ''}>About</a>
      </li>
      <li role="none">
        <a role="menuitem" href="${url('browse.html')}" class="flex h-9 items-center whitespace-nowrap rounded-lg px-3 text-sm leading-none transition-colors ${isBrowse ? activeCls : 'text-[#1F2933] hover:text-[#6B4F3A] hover:bg-[#F5EFE4]'}" ${isBrowse ? 'aria-current="page"' : ''}>Browse</a>
      </li>
    
      <li role="none">
        <a role="menuitem" href="${url('sell-furniture.html')}" class="flex h-9 items-center whitespace-nowrap rounded-lg px-3 text-sm leading-none transition-colors ${isSell ? activeCls : 'text-[#1F2933] hover:text-[#6B4F3A] hover:bg-[#F5EFE4]'}" ${isSell ? 'aria-current="page"' : ''}>Sell-Furniture</a>
      </li>
      <li role="none">
        <a role="menuitem" href="${url('how-it-works.html')}" class="flex h-9 items-center whitespace-nowrap rounded-lg px-3 text-sm leading-none transition-colors ${isHow ? activeCls : 'text-[#1F2933] hover:text-[#6B4F3A] hover:bg-[#F5EFE4]'}" ${isHow ? 'aria-current="page"' : ''}>How It Works</a>
      </li>
    
      <li role="none">
        <a role="menuitem" href="${url('contact.html')}" class="flex h-9 items-center whitespace-nowrap rounded-lg px-3 text-sm leading-none transition-colors ${isContact ? activeCls : 'text-[#1F2933] hover:text-[#6B4F3A] hover:bg-[#F5EFE4]'}" ${isContact ? 'aria-current="page"' : ''}>Contact</a>
      </li>
      <li role="none">
        <div class="dropdown relative" data-dropdown>
          <button type="button" role="menuitem" class="dropdown-toggle flex h-9 items-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm leading-none transition-colors ${isDash ? activeCls : idleTopCls}" aria-haspopup="true" aria-expanded="false" aria-controls="dash-menu"${ariaCurrent(isDash)}>
            Dashboard ${chevron()}
          </button>
          <div class="dropdown-menu absolute left-0 top-full z-50 pt-3" id="dash-menu" role="menu" aria-label="Dashboards">
            <div class="w-52 overflow-hidden rounded-xl border border-[#EAE1D2] bg-white py-1.5 shadow-xl shadow-black/10">
              <a role="menuitem" href="${url('dashboard/user-dashboard.html')}" class="${subCls(isUserDash, 'block px-4 py-2.5 text-sm')}"${ariaCurrent(isUserDash)}>User Dashboard</a>
              <a role="menuitem" href="${url('dashboard/admin-dashboard.html')}" class="${subCls(isAdminDash, 'block px-4 py-2.5 text-sm')}"${ariaCurrent(isAdminDash)}>Admin Dashboard</a>
            </div>
          </div>
        </div>
      </li>
    </ul>`;
  }

  /* ---------------- Mobile markup ---------------- */

  function mobileMenu() {
    return `
    <div id="mobile-menu-backdrop" class="fixed inset-0 z-[60] bg-black/45 2xl:hidden" hidden></div>
    <div id="mobile-menu" class="fixed inset-y-0 right-0 z-[70] flex w-full max-w-full flex-col bg-white 2xl:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation" hidden>
      <div class="flex h-16 shrink-0 items-center justify-between border-b border-[#EAE1D2] px-4">
        <a href="${url('index.html')}" class="flex items-center gap-2.5">
          ${logoMark(34)}
          <span class="font-display text-lg font-bold text-[#1F2933]">NestMarket</span>
        </a>
        <button type="button" id="mobile-menu-close" class="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#1F2933] transition-colors hover:bg-[#F5EFE4]" aria-label="Close menu">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile primary">
        <ul class="space-y-1">
          <li>
            <button type="button" class="mobile-sub-trigger flex min-h-[52px] w-full items-center justify-between rounded-xl px-4 text-base transition-colors ${isHome ? mRowActive : mRowIdle}" aria-expanded="${isHome}" aria-controls="m-home"${ariaCurrent(isHome)}>
              Home
              <svg class="mobile-chevron h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <ul id="m-home" class="mobile-sub ml-3 border-l-2 border-[#E8DCC8] pl-3${isHome ? ' is-open' : ''}">
              <li><a href="${url('index.html')}" class="${subCls(currentPage === 'index.html', 'flex min-h-[48px] items-center rounded-lg px-3 text-[15px]')}"${ariaCurrent(currentPage === 'index.html')}>Home 1</a></li>
              <li><a href="${url('home2.html')}" class="${subCls(currentPage === 'home2.html', 'flex min-h-[48px] items-center rounded-lg px-3 text-[15px]')}"${ariaCurrent(currentPage === 'home2.html')}>Home 2</a></li>
            </ul>
          </li>
                    <li><a href="${url('about.html')}" class="flex min-h-[52px] items-center rounded-xl px-4 text-base transition-colors ${isAbout ? mRowActive : mRowIdle}"${ariaCurrent(isAbout)}>About</a></li>

          <li><a href="${url('browse.html')}" class="flex min-h-[52px] items-center rounded-xl px-4 text-base transition-colors ${isBrowse ? mRowActive : mRowIdle}"${ariaCurrent(isBrowse)}>Browse</a></li>
          <li><a href="${url('sell-furniture.html')}" class="flex min-h-[52px] items-center rounded-xl px-4 text-base transition-colors ${isSell ? mRowActive : mRowIdle}"${ariaCurrent(isSell)}>Sell Your Furniture</a></li>
          <li><a href="${url('how-it-works.html')}" class="flex min-h-[52px] items-center rounded-xl px-4 text-base transition-colors ${isHow ? mRowActive : mRowIdle}"${ariaCurrent(isHow)}>How It Works</a></li>
          <li><a href="${url('contact.html')}" class="flex min-h-[52px] items-center rounded-xl px-4 text-base transition-colors ${isContact ? mRowActive : mRowIdle}"${ariaCurrent(isContact)}>Contact Us</a></li>
          <li>
            <button type="button" class="mobile-sub-trigger flex min-h-[52px] w-full items-center justify-between rounded-xl px-4 text-base transition-colors ${isDash ? mRowActive : mRowIdle}" aria-expanded="${isDash}" aria-controls="m-dash"${ariaCurrent(isDash)}>
              Dashboard
              <svg class="mobile-chevron h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <ul id="m-dash" class="mobile-sub ml-3 border-l-2 border-[#E8DCC8] pl-3${isDash ? ' is-open' : ''}">
              <li><a href="${url('dashboard/user-dashboard.html')}" class="${subCls(isUserDash, 'flex min-h-[48px] items-center rounded-lg px-3 text-[15px]')}"${ariaCurrent(isUserDash)}>User Dashboard</a></li>
              <li><a href="${url('dashboard/admin-dashboard.html')}" class="${subCls(isAdminDash, 'flex min-h-[48px] items-center rounded-lg px-3 text-[15px]')}"${ariaCurrent(isAdminDash)}>Admin Dashboard</a></li>
            </ul>
          </li>
          <li class="flex justify-center gap-3 px-3 py-2">
            <button type="button" id="m-theme-toggle" class="flex h-11 w-11 items-center justify-center rounded-xl border border-[#EAE1D2] text-[#1F2933] transition-colors hover:bg-[#F5EFE4] hover:text-[#6B4F3A]" aria-label="Toggle Theme">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
            </button>
            <button type="button" id="m-rtl-toggle" class="flex h-11 w-11 items-center justify-center rounded-xl border border-[#EAE1D2] text-[#1F2933] transition-colors hover:bg-[#F5EFE4] hover:text-[#6B4F3A]" aria-label="Toggle RTL">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
            </button>
          </li>
        </ul>

        <div class="mt-6 space-y-3 border-t border-[#EAE1D2] pt-5">
          <a href="${url('login.html')}" class="mx-auto flex min-h-[52px] w-full max-w-xs items-center justify-center rounded-xl border border-[#DED3C0] px-5 text-base font-semibold text-[#1F2933] transition-colors hover:bg-[#F5EFE4] ${isLogin ? 'bg-[#F5EFE4]' : ''}"${ariaCurrent(isLogin)}>Login</a>
          <a href="${url('sell-furniture.html')}" class="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#6B4F3A] px-4 text-base font-semibold text-white shadow-lg shadow-[#6B4F3A]/25 transition-colors hover:bg-[#56402E]">Post a Listing</a>
        </div>
      </nav>
    </div>`;
  }

  /* ---------------- Render ---------------- */

  mount.innerHTML = `
  <header class="sticky top-0 z-50">

    <nav class="border-b border-[#EAE1D2] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85" aria-label="Main navigation">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <a href="${url('index.html')}" class="flex shrink-0 items-center gap-2.5" aria-label="NestMarket home">
          ${logoMark(38)}
          <span class="flex flex-col leading-none">
            <span class="font-display text-[19px] font-bold tracking-tight text-[#1F2933]">NestMarket</span>
            <span class="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6B4F3A]/75 sm:block">Good Furniture. New Homes.</span>
          </span>
        </a>

        <div class="hidden 2xl:flex items-center gap-2">
          ${desktopNav()}

          <div class="ml-2 flex items-center gap-2.5 border-l border-[#EAE1D2] pl-5">
            <div class="flex items-center gap-1.5">
              <button type="button" id="theme-toggle" class="flex h-10 w-10 items-center justify-center rounded-xl text-[#1F2933] transition-colors hover:text-[#6B4F3A] hover:bg-[#F5EFE4]" aria-label="Toggle Theme">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
              </button>
              <button type="button" id="rtl-toggle" class="flex h-10 w-10 items-center justify-center rounded-xl text-[#1F2933] transition-colors hover:text-[#6B4F3A] hover:bg-[#F5EFE4]" aria-label="Toggle RTL">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
              </button>
            </div>
            <a href="${url('login.html')}" class="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#DED3C0] px-4 text-sm font-semibold text-[#1F2933] transition-colors hover:bg-[#F5EFE4] ${isLogin ? 'bg-[#F5EFE4]' : ''}">Login</a>
            <a href="${url('sell-furniture.html')}" class="inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-[#6B4F3A] px-4 text-sm font-semibold text-white shadow-lg shadow-[#6B4F3A]/25 transition-all hover:-translate-y-0.5 hover:bg-[#56402E] focus-visible:outline-offset-2">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
              Post a Listing
            </a>
          </div>
        </div>

        <button type="button" id="mobile-menu-open" class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#EAE1D2] text-[#1F2933] transition-colors hover:bg-[#F5EFE4] 2xl:hidden" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
    </nav>
    ${mobileMenu()}
  </header>`;

  /* ---------------- Desktop dropdown behaviour ---------------- */

  const dropdowns = Array.prototype.slice.call(mount.querySelectorAll('[data-dropdown]'));

  function closeAll(except) {
    dropdowns.forEach(d => {
      if (d === except) return;
      d.classList.remove('is-open');
      const t = d.querySelector('.dropdown-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach(dd => {
    const toggle = dd.querySelector('.dropdown-toggle');
    const menu = dd.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    const open = () => { closeAll(dd); dd.classList.add('is-open'); toggle.setAttribute('aria-expanded', 'true'); };
    const close = () => { dd.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
    const isOpen = () => dd.classList.contains('is-open');

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen() ? close() : open();
    });

    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
        const first = menu.querySelector('a');
        if (first) first.focus();
      } else if (e.key === 'Escape') {
        close();
        toggle.focus();
      }
    });

    menu.addEventListener('keydown', (e) => {
      const items = Array.prototype.slice.call(menu.querySelectorAll('a'));
      const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
      if (e.key === 'Escape') { e.preventDefault(); close(); toggle.focus(); }
      if (e.key === 'Tab') { close(); }
    });

    /* hover support on pointer devices */
    const canHover = typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover) and (min-width: 1536px)').matches;
    if (canHover) {
      let t;
      dd.addEventListener('mouseenter', () => { clearTimeout(t); open(); });
      dd.addEventListener('mouseleave', () => { t = setTimeout(close, 180); });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-dropdown]')) closeAll(null);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll(null);
  });

  /* ---------------- Mobile menu behaviour ---------------- */

  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const mobileMenuEl = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  function setMenu(open) {
    if (!mobileMenuEl) return;
    mobileMenuEl.hidden = false;
    if (backdrop) backdrop.hidden = false;
    /* force reflow so the transition runs */
    void mobileMenuEl.offsetWidth;
    mobileMenuEl.classList.toggle('is-open', open);
    if (backdrop) backdrop.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      const first = mobileMenuEl.querySelector('button, a');
      if (first) first.focus();
    } else {
      if (openBtn) openBtn.focus();
      setTimeout(() => {
        if (!mobileMenuEl.classList.contains('is-open')) {
          mobileMenuEl.hidden = true;
          if (backdrop) backdrop.hidden = true;
        }
      }, 340);
    }
  }

  if (openBtn) openBtn.addEventListener('click', () => setMenu(true));
  if (closeBtn) closeBtn.addEventListener('click', () => setMenu(false));
  if (backdrop) backdrop.addEventListener('click', () => setMenu(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuEl && mobileMenuEl.classList.contains('is-open')) setMenu(false);
  });

  /* close after choosing a page */
  if (mobileMenuEl) {
    mobileMenuEl.querySelectorAll('a[href]').forEach(a => {
      a.addEventListener('click', () => setMenu(false));
    });
  }

  /* expandable mobile sub-lists */
  mount.querySelectorAll('.mobile-sub-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.classList.toggle('is-open', !expanded);
    });
  });

  /* keep desktop and mobile states sane on resize */
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1536 && mobileMenuEl && mobileMenuEl.classList.contains('is-open')) {
      setMenu(false);
    }
    closeAll(null);
  });

  /* ---------------- Theme & RTL Toggles ---------------- */
  const themeToggles = document.querySelectorAll('#theme-toggle, #m-theme-toggle');
  const rtlToggles = document.querySelectorAll('#rtl-toggle, #m-rtl-toggle');

  themeToggles.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
      });
    }
  });

  rtlToggles.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        const isRTL = document.documentElement.dir === 'rtl';
        document.documentElement.dir = isRTL ? 'ltr' : 'rtl';
      });
    }
  });
})();


