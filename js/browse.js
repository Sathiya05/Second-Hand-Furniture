/* =========================================================
   NestMarket — js/browse.js
   Filtering, sorting, search and listing rendering
   ========================================================= */

(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);

  const grid = $('#listing-grid');
  if (!grid) return;

  const emptyState = $('#empty-state');
  const resultsCount = $('#results-count');
  const chipsHost = $('#active-chips');
  const sortSelect = $('#sort-by');
  const searchQ = $('#search-q');
  const searchLoc = $('#search-loc');
  const searchCat = $('#search-cat');
  const pillsHost = $('#cat-pills');
  const filterCount = $('#filter-count');

  /* ---------------------------------------------------------
     Build filter controls
     --------------------------------------------------------- */
  const checkRow = (type, name, value, label, extra) => `
    <label class="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-[#3D4A56] transition-colors hover:bg-[#F5EFE4]">
      <input type="${type}" name="${name}" value="${window.nmEscapeHtml(value)}" ${extra || ''}>
      <span>${label}</span>
    </label>`;

  $('#filter-categories').innerHTML = NM_CATEGORIES
    .map(c => checkRow('checkbox', 'f-cat', c.key, c.label))
    .join('');

  $('#filter-locations').innerHTML = NM_LOCATIONS
    .map(l => checkRow('checkbox', 'f-loc', l, l))
    .join('');

  $('#filter-price').innerHTML =
    checkRow('radio', 'f-price', 'any', 'Any price', 'checked') +
    NM_PRICE_BANDS.map(b => checkRow('radio', 'f-price', b.key, b.label)).join('');

  $('#filter-condition').innerHTML = NM_CONDITIONS
    .map(c => checkRow('checkbox', 'f-cond', c, c))
    .join('');

  $('#filter-distance').innerHTML = NM_DISTANCE_BANDS
    .map((d, i) => checkRow('radio', 'f-dist', d.key, d.label, i === 3 ? 'checked' : ''))
    .join('');

  $('#filter-seller').innerHTML =
    checkRow('radio', 'f-seller', 'All', 'All sellers', 'checked') +
    NM_SELLER_TYPES.map(t => checkRow('radio', 'f-seller', t, t)).join('');

  /* top category select */
  if (searchCat) {
    searchCat.innerHTML = '<option value="">All categories</option>' +
      NM_CATEGORIES.map(c => `<option value="${c.key}">${c.label}</option>`).join('');
  }

  /* top location select */
  if (searchLoc) {
    searchLoc.innerHTML = '<option value="">All locations</option>' +
      NM_LOCATIONS.map(l => `<option value="${l}">${l}</option>`).join('');
  }

  /* category pills */
  function renderPills() {
    if (!pillsHost) return;
    const selected = getSelectedValues('f-cat');
    const pills = [{ key: '', label: 'All' }].concat(NM_CATEGORIES.map(c => ({ key: c.key, label: c.label })));
    pillsHost.innerHTML = pills.map(p => {
      const active = p.key === '' ? selected.length === 0 : selected.indexOf(p.key) !== -1;
      return `<button type="button" data-pill="${window.nmEscapeHtml(p.key)}" aria-pressed="${active}"
        class="shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all
        ${active ? 'border-walnut bg-walnut text-white shadow-sm' : 'border-[#DED3C0] bg-white text-[#3D4A56] hover:border-walnut hover:text-walnut'}">
        ${p.label}</button>`;
    }).join('');
  }

  /* ---------------------------------------------------------
     State helpers
     --------------------------------------------------------- */
  function getSelectedValues(name) {
    return Array.prototype.slice
      .call(document.querySelectorAll('input[name="' + name + '"]:checked'))
      .map(i => i.value);
  }

  function setChecked(name, values) {
    document.querySelectorAll('input[name="' + name + '"]').forEach(i => {
      i.checked = values.indexOf(i.value) !== -1;
    });
  }

  function activeGroupCount() {
    let n = 0;
    if (getSelectedValues('f-cat').length) n++;
    if (getSelectedValues('f-loc').length) n++;
    if (getSelectedValues('f-price')[0] !== 'any') n++;
    if (getSelectedValues('f-cond').length) n++;
    if (getSelectedValues('f-dist')[0] !== 'any') n++;
    if (getSelectedValues('f-seller')[0] !== 'All') n++;
    if (searchQ && searchQ.value.trim()) n++;
    if (searchLoc && searchLoc.value) n++;
    return n;
  }

  /* ---------------------------------------------------------
     Filtering + sorting
     --------------------------------------------------------- */
  function matchesSearch(l, q) {
    if (!q) return true;
    const hay = [l.title, l.category, l.location, l.seller, l.area || '', l.description || '']
      .join(' ').toLowerCase();
    return q.toLowerCase().split(/\s+/).every(word => hay.indexOf(word) !== -1);
  }

  function collectAndApply() {
    const q = searchQ ? searchQ.value.trim() : '';
    const topLoc = searchLoc ? searchLoc.value : '';
    const cats = getSelectedValues('f-cat');
    const locs = getSelectedValues('f-loc');
    if (topLoc && locs.indexOf(topLoc) === -1) locs.push(topLoc);

    const priceKey = getSelectedValues('f-price')[0] || 'any';
    const priceBand = NM_PRICE_BANDS.find(b => b.key === priceKey);
    const conds = getSelectedValues('f-cond');
    const distKey = getSelectedValues('f-dist')[0] || 'any';
    const distBand = NM_DISTANCE_BANDS.find(d => d.key === distKey);
    const seller = getSelectedValues('f-seller')[0] || 'All';

    let list = NM_LISTINGS.filter(l => {
      if (!matchesSearch(l, q)) return false;
      if (cats.length && cats.indexOf(l.category) === -1) return false;
      if (locs.length && locs.indexOf(l.location) === -1) return false;
      if (priceBand && (l.price < priceBand.min || l.price > priceBand.max)) return false;
      if (conds.length && conds.indexOf(l.condition) === -1) return false;
      if (distBand && l.distance > distBand.max) return false;
      if (seller !== 'All' && l.sellerType !== seller) return false;
      return true;
    });

    const sort = sortSelect ? sortSelect.value : 'recommended';
    list = list.slice().sort((a, b) => {
      if (sort === 'newest') return a.postedDays - b.postedDays;
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'nearest') return a.distance - b.distance;
      /* recommended: featured first, then nearest */
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.distance - b.distance;
    });

    render(list);
    renderChips({ q, locs, cats, priceBand, priceKey, conds, distBand, distKey, seller });
    renderPills();

    const n = activeGroupCount();
    if (filterCount) {
      filterCount.textContent = String(n);
      filterCount.classList.toggle('hidden', n === 0);
    }
  }

  /* ---------------------------------------------------------
     Rendering
     --------------------------------------------------------- */
  function render(list) {
    grid.innerHTML = list.map(l => window.nmCardHTML(l)).join('');
    grid.classList.toggle('hidden', list.length === 0);
    if (emptyState) emptyState.classList.toggle('hidden', list.length !== 0);

    if (resultsCount) {
      resultsCount.textContent = list.length === 0
        ? 'No results'
        : `${list.length} listing${list.length === 1 ? '' : 's'} found`;
    }
    if (window.nmInitFavButtons) window.nmInitFavButtons();
  }

  function chip(label, action, value) {
    return `<span class="chip gap-1.5 border border-[#E8DCC8] bg-[#F5EFE4] py-1.5 pl-3 pr-2 text-[#3D4A56]">
      ${window.nmEscapeHtml(label)}
      <button type="button" data-chip-action="${action}" data-chip-value="${window.nmEscapeHtml(value || '')}"
        class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#6B7683] transition-colors hover:bg-terracotta hover:text-white"
        aria-label="Remove filter ${window.nmEscapeHtml(label)}">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button></span>`;
  }

  function renderChips(s) {
    if (!chipsHost) return;
    const items = [];
    if (s.q) items.push(chip('“' + s.q + '”', 'q'));
    s.locs.forEach(l => items.push(chip(l, 'loc', l)));
    s.cats.forEach(c => items.push(chip(c, 'cat', c)));
    if (s.priceKey !== 'any') items.push(chip(s.priceBand.label, 'price'));
    s.conds.forEach(c => items.push(chip(c, 'cond', c)));
    if (s.distKey !== 'any') items.push(chip(s.distBand.label, 'dist'));
    if (s.seller !== 'All') items.push(chip(s.seller, 'seller'));

    chipsHost.innerHTML = items.length
      ? items.join('') + `<button type="button" id="chip-clear" class="px-2 text-xs font-semibold text-terracotta underline underline-offset-4">Clear all</button>`
      : '';
  }

  /* ---------------------------------------------------------
     Events
     --------------------------------------------------------- */
  document.addEventListener('change', (e) => {
    if (e.target.closest('#filters-form') || e.target === sortSelect || e.target === searchLoc) {
      if (e.target === searchCat) {
        setChecked('f-cat', searchCat.value ? [searchCat.value] : []);
      }
      if (e.target === searchLoc) {
        setChecked('f-loc', searchLoc.value ? [searchLoc.value] : []);
      }
      if (e.target.name === 'f-cat' && searchCat) {
        const sel = getSelectedValues('f-cat');
        searchCat.value = sel.length === 1 ? sel[0] : '';
      }
      if (e.target.name === 'f-loc' && searchLoc) {
        const sel = getSelectedValues('f-loc');
        searchLoc.value = sel.length === 1 ? sel[0] : '';
      }
      collectAndApply();
    }
  });

  const searchForm = $('#browse-search');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (searchLoc && searchLoc.value) setChecked('f-loc', [searchLoc.value]);
      if (searchCat && searchCat.value) setChecked('f-cat', [searchCat.value]);
      collectAndApply();
      const resultsHeading = document.getElementById('results-heading');
      if (resultsHeading) window.nmScrollTo(resultsHeading, 'start');
    });
  }

  if (pillsHost) {
    pillsHost.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-pill]');
      if (!btn) return;
      const key = btn.getAttribute('data-pill');
      if (!key) {
        setChecked('f-cat', []);
      } else {
        const sel = getSelectedValues('f-cat');
        const idx = sel.indexOf(key);
        if (idx === -1) sel.push(key); else sel.splice(idx, 1);
        setChecked('f-cat', sel);
      }
      if (searchCat) {
        const sel = getSelectedValues('f-cat');
        searchCat.value = sel.length === 1 ? sel[0] : '';
      }
      collectAndApply();
    });
  }

  document.addEventListener('click', (e) => {
    const chipBtn = e.target.closest('[data-chip-action]');
    if (chipBtn) {
      const action = chipBtn.getAttribute('data-chip-action');
      const value = chipBtn.getAttribute('data-chip-value');
      if (action === 'q' && searchQ) searchQ.value = '';
      if (action === 'loc') setChecked('f-loc', getSelectedValues('f-loc').filter(v => v !== value));
      if (action === 'cat') setChecked('f-cat', getSelectedValues('f-cat').filter(v => v !== value));
      if (action === 'price') setChecked('f-price', ['any']);
      if (action === 'cond') setChecked('f-cond', getSelectedValues('f-cond').filter(v => v !== value));
      if (action === 'dist') setChecked('f-dist', ['any']);
      if (action === 'seller') setChecked('f-seller', ['All']);
      if (searchLoc) searchLoc.value = '';
      if (searchCat) searchCat.value = '';
      collectAndApply();
      return;
    }
    if (e.target.id === 'chip-clear' || e.target.id === 'clear-filters' || e.target.id === 'empty-clear') {
      clearAll();
    }
  });

  function clearAll() {
    if (searchQ) searchQ.value = '';
    if (searchLoc) searchLoc.value = '';
    if (searchCat) searchCat.value = '';
    setChecked('f-cat', []);
    setChecked('f-loc', []);
    setChecked('f-price', ['any']);
    setChecked('f-cond', []);
    setChecked('f-dist', ['any']);
    setChecked('f-seller', ['All']);
    collectAndApply();
  }

  /* ---------------------------------------------------------
     Mobile filter drawer
     --------------------------------------------------------- */
  const drawer = $('#filter-drawer');
  const backdrop = $('#filter-backdrop');
  const openBtn = $('#filter-open');
  const closeBtn = $('#filter-close');

  function setDrawer(open) {
    if (!drawer) return;
    backdrop.hidden = false;
    void drawer.offsetWidth;
    drawer.classList.toggle('is-open', open);
    if (backdrop) backdrop.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (!open) {
      setTimeout(() => {
        if (!drawer.classList.contains('is-open') && backdrop) backdrop.hidden = true;
      }, 340);
    } else {
      const first = drawer.querySelector('input, button');
      if (first) first.focus();
    }
  }

  if (openBtn) openBtn.addEventListener('click', () => setDrawer(true));
  if (closeBtn) closeBtn.addEventListener('click', () => setDrawer(false));
  if (backdrop) backdrop.addEventListener('click', () => setDrawer(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) setDrawer(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && drawer && drawer.classList.contains('is-open')) setDrawer(false);
  });

  /* ---------------------------------------------------------
     Init from URL params
     --------------------------------------------------------- */
  const params = new URLSearchParams(window.location.search);
  if (searchQ && params.get('q')) searchQ.value = params.get('q');
  if (searchLoc && params.get('loc')) searchLoc.value = params.get('loc');
  if (params.get('cat')) {
    setChecked('f-cat', [params.get('cat')]);
    if (searchCat) searchCat.value = params.get('cat');
  }
  if (params.get('loc')) setChecked('f-loc', [params.get('loc')]);
  if (params.get('sort') && sortSelect) sortSelect.value = params.get('sort');

  collectAndApply();
})();
