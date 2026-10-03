/* =========================================================
   NestMarket — js/footer.js
   Dynamically renders the global footer into #footer
   ========================================================= */

(function () {
  'use strict';

  const mount = document.getElementById('footer');
  if (!mount) return;

  const scriptEl = document.currentScript ||
    Array.prototype.slice.call(document.scripts).find(s => /js\/footer\.js/.test(s.src));
  const BASE = scriptEl ? scriptEl.src.replace(/js\/footer\.js.*$/, '') : './';
  const url = (p) => BASE + p;

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

  function col(title, links) {
    return `
    <div>
      <h2 class="font-display text-sm font-bold uppercase tracking-[0.14em] text-charcoal">${title}</h2>
      <ul class="mt-4 space-y-2.5">
        ${links.map(l => `<li><a href="${l.href}" class="text-sm text-[#4B5563] transition-colors hover:text-walnut hover:underline underline-offset-4">${l.label}</a></li>`).join('')}
      </ul>
    </div>`;
  }

  const marketplace = [
    { label: 'Browse', href: url('browse.html') },
    { label: 'Featured Listings', href: url('browse.html?sort=newest') },
    { label: 'Categories', href: url('browse.html#categories') },
    { label: 'Post a Listing', href: url('sell-furniture.html') }
  ];

  const how = [
    { label: 'Buying', href: url('how-it-works.html') + '#buying' },
    { label: 'Selling', href: url('how-it-works.html') + '#selling' },
    { label: 'Offers', href: url('how-it-works.html') + '#buying' },
    { label: 'Pickup & Delivery', href: url('how-it-works.html') + '#buying' },
    { label: 'Safety Tips', href: url('how-it-works.html') + '#safety' }
  ];

  const support = [
    { label: 'Contact', href: url('how-it-works.html') + '#contact' },
    { label: 'FAQs', href: url('index.html') + '#faq' },
    { label: 'Help Center', href: url('how-it-works.html') + '#safety' },
    { label: 'Terms', href: url('how-it-works.html') + '#safety' },
    { label: 'Privacy', href: url('how-it-works.html') + '#safety' }
  ];

  const socials = [
    {
      label: 'Facebook',
      icon: '<path fill="currentColor" stroke="none" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z"/>'
    },
    {
      label: 'Instagram',
      icon: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/>'
    },
    {
      label: 'X',
      icon: '<path fill="currentColor" stroke="none" d="M17.53 3h3.02l-6.6 7.54L21.75 21h-5.9l-4.62-6.04L5.94 21H2.92l7.06-8.07L2.5 3h6.05l4.18 5.52L17.53 3Zm-1.04 16.2h1.67L7.6 4.7H5.8l10.69 14.5Z"/>'
    },
    {
      label: 'YouTube',
      icon: '<path fill="currentColor" stroke="none" d="M21.6 7.2s-.2-1.4-.8-2c-.75-.8-1.6-.8-2-.85C16 4.2 12 4.2 12 4.2s-4 0-6.8.2c-.4.05-1.25.05-2 .85-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.5v1.6c0 1.7.2 3.3.2 3.3s.2 1.4.8 2c.75.8 1.74.77 2.17.85 1.6.15 6.63.2 6.63.2s4 0 6.8-.21c.4-.05 1.25-.05 2-.85.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.6c0-1.7-.2-3.3-.2-3.3ZM9.9 14.1V8.6l5.2 2.76-5.2 2.74Z"/>'
    }
  ];

  function socialRow() {
    return `
      <div class="mt-7">
        <h2 class="font-display text-sm font-bold uppercase tracking-[0.14em] text-charcoal">Follow us</h2>
        <ul class="mt-4 flex flex-wrap items-center gap-2.5">
          ${socials.map(s => `<li>
            <button type="button" aria-label="NestMarket on ${s.label}" data-toast="${s.label} is not connected in this frontend demo."
                    class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#EAE1D2] bg-white text-[#4B5563] transition-colors hover:border-walnut hover:bg-walnut hover:text-white">
              <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${s.icon}</svg>
            </button>
          </li>`).join('')}
        </ul>
      </div>`;
  }

  mount.innerHTML = `
  <footer class="bg-white text-charcoal border-t border-[#EAE1D2]" role="contentinfo">
    <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

        <div class="sm:col-span-2 lg:col-span-1">
          <a href="${url('index.html')}" class="inline-flex items-center gap-2.5" aria-label="NestMarket home">
            ${logoMark(38)}
            <span class="flex flex-col leading-none">
              <span class="font-display text-[19px] font-bold tracking-tight text-[#1F2933]">NestMarket</span>
              <span class="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6B4F3A]/75 block">Good Furniture. New Homes.</span>
            </span>
          </a>
          <p class="mt-4 max-w-xs text-sm leading-relaxed text-[#4B5563]">
            Discover affordable second-hand furniture from people in your community and give pre-loved pieces a new home.
          </p>

          <div class="mt-6 flex items-center gap-3">
            <a href="${url('sell-furniture.html')}" class="inline-flex items-center gap-2 rounded-xl bg-walnut px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#56402E]">Post a Listing</a>
            <a href="${url('browse.html')}" class="inline-flex items-center gap-2 rounded-xl border border-[#DED3C0] px-4 py-2.5 text-sm font-semibold text-[#1F2933] transition-colors hover:bg-[#F5EFE4]">Browse</a>
          </div>

          ${socialRow()}
        </div>

        ${col('Marketplace', marketplace)}
        ${col('How It Works', how)}
        ${col('Support', support)}
      </div>

      <div class="mt-12 border-t border-[#EAE1D2] pt-7">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-sm text-[#4B5563]">&copy; 2026 NestMarket. All rights reserved.</p>
          <p class="text-center text-xs text-[#6B7683] sm:text-right">
            Frontend demonstration only &mdash; no real payments, accounts or bookings are processed.
          </p>
        </div>
      </div>
    </div>
  </footer>`;
})();
