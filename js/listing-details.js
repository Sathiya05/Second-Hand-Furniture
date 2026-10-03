/* =========================================================
   NestMarket — js/listing-details.js
   Gallery, favourites, offer modal, message modal, similar
   ========================================================= */

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  const params = new URLSearchParams(window.location.search);
  const listing = nmGetListingById(params.get('id') || 1);

  /* ---------------------------------------------------------
     Basic info
     --------------------------------------------------------- */
  document.title = listing.title + ' | ' + nmFormatPrice(listing.price) + ' — NestMarket';

  const crumb = $('#crumb-category');
  if (crumb) crumb.textContent = listing.title;

  const title = $('#listing-title');
  if (title) title.textContent = listing.title;

  const priceEl = $('#listing-price');
  if (priceEl) priceEl.textContent = nmFormatPrice(listing.price);

  const catEl = $('#listing-category');
  if (catEl) catEl.textContent = listing.category;

  const negEl = $('#listing-negotiable');
  if (negEl) {
    negEl.textContent = listing.negotiable ? 'Negotiable' : 'Fixed price';
    negEl.classList.toggle('hidden', !listing.negotiable);
  }

  const condEl = $('#listing-condition');
  if (condEl) condEl.textContent = listing.condition;

  const condBadge = $('#gallery-condition');
  if (condBadge) {
    condBadge.textContent = listing.condition;
    condBadge.className = 'chip absolute left-4 top-4 border border-white/60 bg-white/95 ' + nmConditionClass(listing.condition);
  }

  const postedEl = $('#listing-posted');
  if (postedEl) postedEl.textContent = listing.posted;

  const locEl = $('#listing-location');
  if (locEl) locEl.textContent = listing.location + (listing.area ? ', ' + listing.area : '');

  const distEl = $('#listing-distance');
  if (distEl) distEl.textContent = listing.distance + ' km away';

  const descEl = $('#listing-description');
  if (descEl) descEl.textContent = listing.description;

  const sellerEl = $('#listing-seller');
  if (sellerEl) sellerEl.textContent = listing.seller;

  const sellerMeta = $('#listing-seller-meta');
  if (sellerMeta) sellerMeta.textContent = listing.sellerType + ' · ' + listing.sellerSince;

  const sellerResp = $('#listing-seller-response');
  if (sellerResp) sellerResp.textContent = listing.sellerResponse;

  const avatar = $('#seller-avatar');
  if (avatar) {
    avatar.textContent = listing.seller.split(' ').map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase();
  }

  const pickupLine = $('#pickup-line');
  if (pickupLine) {
    pickupLine.innerHTML = listing.pickup
      ? '<span class="status-dot bg-emerald-500"></span> Pickup available in ' + listing.location
      : '<span class="status-dot bg-rose-500"></span> Pickup not available';
  }
  const deliveryLine = $('#delivery-line');
  if (deliveryLine) {
    deliveryLine.innerHTML = listing.delivery
      ? '<span class="status-dot bg-sky-500"></span> Delivery: ' + (listing.details.Delivery || 'discuss with seller')
      : '<span class="status-dot bg-stone-400"></span> Delivery: not available';
  }

  /* details table */
  const tableHost = $('#listing-details-table');
  if (tableHost) {
    tableHost.innerHTML = Object.keys(listing.details).map(key => {
      const value = listing.details[key];
      if (value === '—') return '';
      return '<div class="flex items-center justify-between gap-4 bg-white px-4 py-3.5">' +
        '<dt class="text-sm font-medium text-[#6B7683]">' + window.nmEscapeHtml(key) + '</dt>' +
        '<dd class="text-sm font-semibold text-charcoal">' + window.nmEscapeHtml(value) + '</dd>' +
        '</div>';
    }).join('');
  }

  /* ---------------------------------------------------------
     Gallery
     --------------------------------------------------------- */
  const gallery = listing.gallery && listing.gallery.length ? listing.gallery : [listing.image];
  let current = 0;

  const mainImg = $('#gallery-main');
  const thumbsHost = $('#gallery-thumbs');
  const counter = $('#gallery-counter');

  function showImage(i) {
    current = (i + gallery.length) % gallery.length;
    if (mainImg) {
      mainImg.src = gallery[current];
      mainImg.alt = listing.title + ' — photo ' + (current + 1) + ' of ' + gallery.length;
    }
    if (counter) counter.textContent = (current + 1) + ' / ' + gallery.length;
    if (thumbsHost) {
      thumbsHost.querySelectorAll('button').forEach((b, idx) => {
        const active = idx === current;
        b.setAttribute('aria-current', active ? 'true' : 'false');
        b.classList.toggle('ring-2', active);
        b.classList.toggle('ring-[#C47A44]', active);
        b.classList.toggle('opacity-60', !active);
      });
    }
  }

  if (thumbsHost) {
    thumbsHost.innerHTML = gallery.map((src, i) =>
      '<button type="button" role="listitem" data-index="' + i + '" class="h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-[#EAE1D2] bg-sand transition-transform hover:-translate-y-0.5" aria-label="Show photo ' + (i + 1) + '">' +
      '<img src="' + src + '" alt="" class="h-full w-full object-cover" loading="lazy"></button>'
    ).join('');

    thumbsHost.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-index]');
      if (btn) showImage(Number(btn.getAttribute('data-index')));
    });
  }

  const prev = $('#gallery-prev');
  const next = $('#gallery-next');
  if (prev) prev.addEventListener('click', () => showImage(current - 1));
  if (next) next.addEventListener('click', () => showImage(current + 1));

  document.addEventListener('keydown', (e) => {
    if (document.querySelector('.nm-modal.is-open')) return;
    const galleryArea = document.querySelector('#main section');
    if (!galleryArea || !galleryArea.contains(document.activeElement)) return;
    if (e.key === 'ArrowLeft') showImage(current - 1);
    if (e.key === 'ArrowRight') showImage(current + 1);
  });

  showImage(0);

  /* ---------------------------------------------------------
     Favourite (save listing)
     --------------------------------------------------------- */
  const saveBtn = $('#save-btn');
  const saveLabel = $('#save-label');

  function syncSaveState() {
    if (!saveBtn) return;
    const favs = window.nmGetFavs();
    const saved = favs.indexOf(listing.id) !== -1;
    saveBtn.classList.toggle('is-active', saved);
    saveBtn.setAttribute('aria-pressed', String(saved));
    if (saveLabel) saveLabel.textContent = saved ? 'Saved' : 'Save Listing';
  }

  if (saveBtn) {
    saveBtn.setAttribute('data-fav-id', String(listing.id));
    saveBtn.setAttribute('data-fav-title', listing.title);
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.nmToggleFav(listing.id);
      syncSaveState();
    });
    syncSaveState();
  }

  /* ---------------------------------------------------------
     Similar listings
     --------------------------------------------------------- */
  const similarHost = $('#similar-grid');
  if (similarHost) {
    const similar = NM_LISTINGS
      .filter(l => l.id !== listing.id && l.category === listing.category)
      .concat(NM_LISTINGS.filter(l => l.id !== listing.id && l.location === listing.location))
      .filter((l, i, arr) => arr.findIndex(x => x.id === l.id) === i)
      .slice(0, 3);

    const fallback = NM_LISTINGS.filter(l => l.id !== listing.id).slice(0, 3);
    const list = similar.length ? similar : fallback;

    similarHost.innerHTML = list.map(l => window.nmCardHTML(l)).join('');
    if (window.nmInitFavButtons) window.nmInitFavButtons();
  }

  /* ---------------------------------------------------------
     Offer modal
     --------------------------------------------------------- */
  const offerBtn = $('#offer-btn');
  const offerForm = $('#offer-form');
  const offerAmount = $('#offer-amount');
  const offerMessage = $('#offer-message');
  const amountError = $('#offer-amount-error');
  const messageError = $('#offer-message-error');
  const askingEl = $('#offer-asking');
  const offerSub = $('#offer-modal-sub');

  function prepareOfferModal() {
    if (askingEl) askingEl.textContent = nmFormatPrice(listing.price);
    if (offerSub) offerSub.textContent = listing.title + ' · asking ' + nmFormatPrice(listing.price);
    if (offerAmount) {
      offerAmount.classList.remove('is-invalid');
      offerAmount.value = '';
      offerAmount.max = String(listing.price);
    }
    if (offerMessage) {
      offerMessage.classList.remove('is-invalid');
      offerMessage.value = '';
    }
    if (amountError) amountError.classList.remove('is-visible');
    if (messageError) messageError.classList.remove('is-visible');
  }

  if (offerBtn) {
    offerBtn.addEventListener('click', () => {
      prepareOfferModal();
      if (!listing.negotiable) {
        window.nmToast('This listing is marked as a fixed price, but you can still send an offer.', 'info');
      }
      window.nmOpenModal('offer-modal');
    });
  }

  if (offerForm) {
    offerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;

      const amount = Number(offerAmount.value);
      const amountOk = !isNaN(amount) && amount > 0;
      offerAmount.classList.toggle('is-invalid', !amountOk);
      if (amountError) amountError.classList.toggle('is-visible', !amountOk);
      if (!amountOk) ok = false;

      const msg = offerMessage.value.trim();
      const msgOk = msg.length >= 5;
      offerMessage.classList.toggle('is-invalid', !msgOk);
      if (messageError) messageError.classList.toggle('is-visible', !msgOk);
      if (!msgOk) ok = false;

      if (!ok) {
        window.nmToast('Please check the highlighted fields.', 'error');
        return;
      }

      window.nmCloseModal('offer-modal');

      const status = $('#offer-status');
      const amountOut = $('#offer-status-amount');
      if (amountOut) amountOut.textContent = nmFormatPrice(amount);
      if (status) status.classList.remove('hidden');

      window.nmToast('Offer of ' + nmFormatPrice(amount) + ' recorded (demo status: Pending).', 'success');

      status && window.nmScrollTo(status, 'center');
    });
  }

  /* ---------------------------------------------------------
     Message seller modal
     --------------------------------------------------------- */
  const messageBtn = $('#message-btn');
  const messageForm = $('#message-form');
  const msgName = $('#msg-name');
  const msgBody = $('#msg-body');
  const nameError = $('#msg-name-error');
  const bodyError = $('#msg-body-error');

  if (messageBtn) {
    messageBtn.addEventListener('click', () => {
      const sub = $('#message-modal-sub');
      if (sub) sub.textContent = 'To: ' + listing.seller + ' · ' + listing.title;
      if (msgName) { msgName.value = ''; msgName.classList.remove('is-invalid'); }
      if (msgBody) { msgBody.value = ''; msgBody.classList.remove('is-invalid'); }
      if (nameError) nameError.classList.remove('is-visible');
      if (bodyError) bodyError.classList.remove('is-visible');
      window.nmOpenModal('message-modal');
    });
  }

  if (messageForm) {
    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;

      const nameOk = msgName.value.trim().length > 0;
      msgName.classList.toggle('is-invalid', !nameOk);
      if (nameError) nameError.classList.toggle('is-visible', !nameOk);
      if (!nameOk) ok = false;

      const bodyOk = msgBody.value.trim().length >= 10;
      msgBody.classList.toggle('is-invalid', !bodyOk);
      if (bodyError) bodyError.classList.toggle('is-visible', !bodyOk);
      if (!bodyOk) ok = false;

      if (!ok) {
        window.nmToast('Please complete the message form.', 'error');
        return;
      }

      window.nmCloseModal('message-modal');
      window.nmToast('Message to ' + listing.seller + ' sent (demo only — nothing was stored).', 'success');
    });
  }

  /* ---------------------------------------------------------
     Deep links
     --------------------------------------------------------- */
  if (params.get('offer') === '1' && offerBtn) {
    setTimeout(() => offerBtn.click(), 500);
  }
})();
