/* =========================================================
   NestMarket — js/sell-furniture.js
   Multi-step listing form, validation, previews, demo publish
   ========================================================= */

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  const form = $('#sell-form');
  if (!form) return;

  const panels = Array.prototype.slice.call(form.querySelectorAll('.step-panel'));
  const total = panels.length;
  let step = 1;

  const nextBtn = $('#next-step');
  const prevBtn = $('#prev-step');
  const publishBtn = $('#publish-btn');
  const progressBar = $('#progress-bar');
  const stepCurrent = $('#step-current');
  const stepLabel = $('#step-label');
  const stepDots = $('#step-dots');
  const progressbar = form.previousElementSibling && form.previousElementSibling.querySelector('[role="progressbar"]');
  const successPanel = $('#success-panel');

  const state = {
    category: '',
    condition: '',
    photos: []
  };

  /* ---------------------------------------------------------
     Option cards
     --------------------------------------------------------- */
  const catHost = $('#cat-options');
  if (catHost) {
    catHost.innerHTML = NM_CATEGORIES.map(c => `
      <label class="option-card group flex cursor-pointer flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center hover:-translate-y-0.5 hover:border-walnut">
        <input type="radio" name="listing-category" value="${c.key}" class="sr-only">
        <span class="option-mark flex h-10 w-10 items-center justify-center rounded-xl bg-sand font-display text-sm font-bold text-walnut transition-colors">${c.label.charAt(0)}</span>
        <span class="text-xs font-semibold leading-tight text-charcoal">${c.label}</span>
      </label>`).join('');
  }

  const condHost = $('#condition-options');
  if (condHost) {
    condHost.innerHTML = NM_CONDITIONS.map(c => `
      <label class="option-card flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-4 hover:border-walnut">
        <input type="radio" name="listing-condition" value="${c}" class="sr-only">
        <span class="option-dot flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#C9B79A] transition-colors">
          <span class="h-2 w-2 rounded-full bg-white opacity-0 transition-opacity"></span>
        </span>
        <span class="text-sm font-semibold text-charcoal">${c}</span>
      </label>`).join('');
  }

  /* keep .option-card visual state in sync with its control */
  document.addEventListener('change', (e) => {
    const control = e.target;
    if (!control.matches || !control.matches('.option-card input')) return;
    const name = control.getAttribute('name');
    if (control.type === 'radio' && name) {
      document.querySelectorAll('input[name="' + name + '"]').forEach(i => {
        const label = i.closest('.option-card');
        if (label) label.classList.toggle('is-selected', i.checked);
      });
    } else {
      const label = control.closest('.option-card');
      if (label) label.classList.toggle('is-selected', control.checked);
    }
  });

  /* ---------------------------------------------------------
     Step navigation
     --------------------------------------------------------- */
  function renderStepDots() {
    if (!stepDots) return;
    stepDots.innerHTML = panels.map((p, i) => {
      const n = i + 1;
      const active = n === step;
      const done = n < step;
      return `<li class="flex items-center gap-1.5">
        <span class="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-colors
          ${done ? 'bg-emerald-500 text-white' : active ? 'bg-walnut text-white' : 'bg-sand text-[#6B7683]'}">${done ? '✓' : n}</span>
        <span class="hidden text-xs font-medium sm:inline ${active ? 'text-walnut' : 'text-[#6B7683]'}">${p.dataset.label}</span>
      </li>`;
    }).join('');
  }

  function goTo(n) {
    step = Math.min(Math.max(n, 1), total);
    panels.forEach(p => p.classList.toggle('is-active', Number(p.dataset.step) === step));

    if (stepCurrent) stepCurrent.textContent = String(step);
    if (stepLabel) stepLabel.textContent = panels[step - 1].dataset.label;
    if (progressBar) progressBar.style.width = (step / total) * 100 + '%';
    if (progressbar) progressbar.setAttribute('aria-valuenow', String(step));

    if (prevBtn) prevBtn.disabled = step === 1;
    if (nextBtn) nextBtn.classList.toggle('hidden', step === total);
    if (publishBtn) {
      publishBtn.classList.toggle('hidden', step !== total);
      publishBtn.classList.toggle('inline-flex', step === total);
    }
    renderStepDots();

    const activePanel = panels[step - 1];
    const heading = activePanel && activePanel.querySelector('legend');
    if (heading) heading.setAttribute('tabindex', '-1');
    if (heading) heading.focus({ preventScroll: true });
    window.nmScrollTo(form, 'start');
  }

  function markInvalid(el, invalid) {
    if (!el) return;
    el.classList.toggle('is-invalid', invalid);
    const wrap = el.closest('div') || el.parentElement;
    const err = wrap ? wrap.querySelector('.field-error') : null;
    if (err) err.classList.toggle('is-visible', invalid);
  }

  function panelError(panel, show) {
    const err = panel.querySelector('[data-error-for], #handover-error, #agree-error');
    if (err && err.classList.contains('field-error')) err.classList.toggle('is-visible', show);
  }

  function validate(n) {
    const panel = panels[n - 1];
    let ok = true;
    let firstBad = null;

    if (n === 1) {
      const selected = form.querySelector('input[name="listing-category"]:checked');
      ok = !!selected;
      state.category = selected ? selected.value : '';
      panelError(panel, !ok);
      if (!ok) firstBad = form.querySelector('input[name="listing-category"]');
    }

    if (n === 2) {
      const title = $('#f-title');
      const desc = $('#f-description');
      const titleOk = title.value.trim().length >= 4;
      const descOk = desc.value.trim().length >= 15;
      markInvalid(title, !titleOk);
      markInvalid(desc, !descOk);
      ok = titleOk && descOk;
      firstBad = !titleOk ? title : (!descOk ? desc : null);
    }

    if (n === 3) {
      const selected = form.querySelector('input[name="listing-condition"]:checked');
      ok = !!selected;
      state.condition = selected ? selected.value : '';
      panelError(panel, !ok);
      if (!ok) firstBad = form.querySelector('input[name="listing-condition"]');
    }

    if (n === 4) {
      const price = $('#f-price');
      const val = Number(price.value);
      const priceOk = !isNaN(val) && val > 0;
      markInvalid(price, !priceOk);
      ok = priceOk;
      if (!priceOk) firstBad = price;
    }

    if (n === 5) {
      const city = $('#f-city');
      const area = $('#f-area');
      const pin = $('#f-pincode');
      const cityOk = !!city.value;
      const areaOk = area.value.trim().length > 1;
      const pinOk = /^\d{6}$/.test(pin.value.trim());
      markInvalid(city, !cityOk);
      markInvalid(area, !areaOk);
      markInvalid(pin, !pinOk);
      ok = cityOk && areaOk && pinOk;
      firstBad = !cityOk ? city : (!areaOk ? area : (!pinOk ? pin : null));
    }

    if (n === 7) {
      const pickup = $('#f-pickup').checked;
      const delivery = $('#f-delivery').checked;
      ok = pickup || delivery;
      const err = $('#handover-error');
      if (err) err.classList.toggle('is-visible', !ok);
      if (!ok) firstBad = $('#f-pickup');
    }

    if (n === 8) {
      const name = $('#f-name');
      const email = $('#f-email');
      const phone = $('#f-phone');
      const agree = $('#f-agree');
      const nameOk = name.value.trim().length > 0;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
      const phoneOk = /^\d{10}$/.test(phone.value.replace(/\D/g, ''));
      const agreeOk = agree.checked;
      markInvalid(name, !nameOk);
      markInvalid(email, !emailOk);
      markInvalid(phone, !phoneOk);
      const agreeErr = $('#agree-error');
      if (agreeErr) agreeErr.classList.toggle('is-visible', !agreeOk);
      ok = nameOk && emailOk && phoneOk && agreeOk;
      firstBad = !nameOk ? name : (!emailOk ? email : (!phoneOk ? phone : (!agreeOk ? agree : null)));
    }

    if (!ok) {
      if (firstBad) firstBad.focus();
      window.nmToast('Please complete the highlighted fields before continuing.', 'error');
    }
    return ok;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validate(step)) goTo(step + 1);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goTo(step - 1));
  }

  /* ---------------------------------------------------------
     Live preview
     --------------------------------------------------------- */
  function updatePreview() {
    const title = $('#f-title');
    const price = $('#f-price');
    const city = $('#f-city');
    const area = $('#f-area');
    const pickup = $('#f-pickup');
    const delivery = $('#f-delivery');

    const t = $('#preview-title-text');
    if (t) t.textContent = title && title.value.trim() ? title.value.trim() : 'Your listing title';

    const p = $('#preview-price');
    if (p) {
      const val = Number(price && price.value);
      p.textContent = val > 0 ? nmFormatPrice(val) : '₹0';
    }

    const cat = $('#preview-category');
    if (cat) cat.textContent = state.category || 'Category';

    const cond = $('#preview-condition');
    if (cond) {
      cond.textContent = state.condition || 'Condition';
      cond.className = 'chip absolute left-3 top-3 bg-white/95 ' + (state.condition ? nmConditionClass(state.condition) : 'text-[#3D4A56]');
    }

    const loc = $('#preview-location');
    if (loc) {
      const parts = [];
      if (area && area.value.trim()) parts.push(area.value.trim());
      if (city && city.value) parts.push(city.value);
      loc.textContent = parts.length ? parts.join(', ') : 'Location not set';
    }

    const handover = $('#preview-handover');
    if (handover) {
      const opts = [];
      if (pickup && pickup.checked) opts.push('Pickup available');
      if (delivery && delivery.checked) opts.push('Delivery available');
      handover.textContent = opts.length ? opts.join(' · ') : 'No handover option selected';
    }

    const img = $('#preview-image');
    if (img && state.photos.length) {
      img.src = state.photos[0].url;
      img.alt = 'Uploaded preview: ' + (title ? title.value || 'listing photo' : 'listing photo');
    }
  }

  form.addEventListener('input', updatePreview);
  form.addEventListener('change', (e) => {
    if (e.target.name === 'listing-category') state.category = e.target.value;
    if (e.target.name === 'listing-condition') state.condition = e.target.value;
    if (e.target.id === 'f-delivery') {
      const wrap = $('#delivery-charges-wrap');
      if (wrap) wrap.classList.toggle('hidden', !e.target.checked);
    }
    if (e.target.classList.contains('is-invalid')) markInvalid(e.target, false);
    updatePreview();
  });

  /* ---------------------------------------------------------
     Photo previews
     --------------------------------------------------------- */
  const photoInput = $('#f-photos');
  const previewHost = $('#photo-previews');
  const photoHint = $('#photo-hint');

  function renderPhotos() {
    if (!previewHost) return;
    previewHost.innerHTML = state.photos.map((p, i) => `
      <div class="group relative aspect-square overflow-hidden rounded-xl border border-[#EAE1D2] bg-sand">
        <img src="${p.url}" alt="Photo preview ${i + 1}" class="h-full w-full object-cover">
        <button type="button" data-remove-photo="${i}" aria-label="Remove photo ${i + 1}"
          class="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-charcoal opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>`).join('');

    if (photoHint) {
      photoHint.textContent = state.photos.length
        ? state.photos.length + ' photo(s) selected — local preview only, nothing is uploaded.'
        : 'No photos added yet — you can continue without them in this demo.';
    }
  }

  if (photoInput) {
    photoInput.addEventListener('change', () => {
      const files = Array.prototype.slice.call(photoInput.files || []);
      files.forEach(file => {
        if (state.photos.length >= 8) return;
        if (!/^image\//.test(file.type)) return;
        state.photos.push({ name: file.name, url: URL.createObjectURL(file) });
      });
      photoInput.value = '';
      renderPhotos();
      updatePreview();
      if (files.length) window.nmToast('Photos added to the preview (local only).', 'success');
    });
  }

  if (previewHost) {
    previewHost.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove-photo]');
      if (!btn) return;
      const idx = Number(btn.getAttribute('data-remove-photo'));
      const removed = state.photos.splice(idx, 1)[0];
      if (removed) URL.revokeObjectURL(removed.url);
      renderPhotos();
      updatePreview();
      if (!state.photos.length) {
        const img = $('#preview-image');
        if (img) img.src = './images/photo-1577140917170-285929fb55b7.jpg';
      }
    });
  }

  /* ---------------------------------------------------------
     Publish (demo)
     --------------------------------------------------------- */
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(8)) return;

      form.classList.add('hidden');
      const progressCard = form.previousElementSibling;
      if (progressCard) progressCard.classList.add('hidden');
      if (successPanel) {
        successPanel.classList.remove('hidden');
        window.nmScrollTo(successPanel, 'center');
      }
      window.nmToast('Listing prepared successfully (demo — not published anywhere).', 'success');
    });
  }

  const restart = $('#restart-form');
  if (restart) {
    restart.addEventListener('click', () => {
      form.reset();
      state.category = '';
      state.condition = '';
      state.photos.forEach(p => URL.revokeObjectURL(p.url));
      state.photos = [];
      renderPhotos();
      form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      form.querySelectorAll('.field-error.is-visible').forEach(el => el.classList.remove('is-visible'));
      if (successPanel) successPanel.classList.add('hidden');
      form.classList.remove('hidden');
      const progressCard = form.previousElementSibling;
      if (progressCard) progressCard.classList.remove('hidden');
      goTo(1);
      updatePreview();
    });
  }

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  goTo(1);
  renderPhotos();
  updatePreview();
})();

