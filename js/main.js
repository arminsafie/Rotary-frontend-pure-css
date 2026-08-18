/* ==================================================================
   ROTARY — interaction layer
   All visual states/animations live in CSS; this file only wires
   the handful of behaviors CSS alone can't do (math, DOM removal).
   ================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- helpers ---------- */
  const money = (n) => `$${n.toFixed(2)}`;

  /* ---------- generic quantity steppers ---------- */
  document.querySelectorAll('.qty-stepper').forEach((stepper) => {
    const valueEl = stepper.querySelector('.qty-stepper__value');
    const minusBtn = stepper.querySelector('[data-action="decrease"]');
    const plusBtn = stepper.querySelector('[data-action="increase"]');
    if (!valueEl) return;

    const clamp = (n) => Math.min(99, Math.max(1, n));

    const update = (next) => {
      valueEl.textContent = clamp(next);
      stepper.dispatchEvent(new CustomEvent('qtychange', { bubbles: true }));
    };

    minusBtn && minusBtn.addEventListener('click', () => {
      update(parseInt(valueEl.textContent, 10) - 1);
    });
    plusBtn && plusBtn.addEventListener('click', () => {
      update(parseInt(valueEl.textContent, 10) + 1);
    });
  });

  /* ---------- add to cart micro-interaction (product page) ---------- */
  const addBtn = document.querySelector('.btn--add-cart');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addBtn.classList.add('is-added');
      bumpCartBadge(1);
      setTimeout(() => addBtn.classList.remove('is-added'), 1800);
    });
  }

  function bumpCartBadge(delta) {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;
    const current = parseInt(badge.textContent, 10) || 0;
    badge.textContent = Math.max(0, current + delta);
  }

  /* ---------- cart page: live totals ---------- */
  const cartTable = document.querySelector('.cart-table');
  if (cartTable) {
    const SHIPPING = 18;
    const TAX_RATE = 0.0825;
    let discount = 0;

    const recalc = () => {
      let subtotal = 0;
      cartTable.querySelectorAll('.track-row').forEach((row) => {
        const unit = parseFloat(row.dataset.price);
        const qty = parseInt(row.querySelector('.qty-stepper__value').textContent, 10);
        const lineTotal = unit * qty;
        row.querySelector('.track-price').textContent = money(lineTotal);
        subtotal += lineTotal;
      });

      const shipping = subtotal > 0 ? SHIPPING : 0;
      const tax = subtotal * TAX_RATE;
      const total = Math.max(0, subtotal - discount) + shipping + tax;

      document.querySelector('[data-summary="subtotal"]').textContent = money(subtotal);
      document.querySelector('[data-summary="shipping"]').textContent = subtotal > 0 ? money(shipping) : '—';
      document.querySelector('[data-summary="tax"]').textContent = money(tax);
      const discountEl = document.querySelector('[data-summary="discount"]');
      if (discountEl) discountEl.textContent = discount > 0 ? `-${money(discount)}` : '—';

      const totalEl = document.querySelector('[data-summary="total"]');
      totalEl.textContent = money(total);
      totalEl.classList.remove('is-bump');
      void totalEl.offsetWidth; /* restart animation */
      totalEl.classList.add('is-bump');

      const countEl = document.querySelector('[data-cart-count]');
      const itemCount = cartTable.querySelectorAll('.track-row').length;
      if (countEl) countEl.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;

      const badge = document.querySelector('.cart-badge');
      if (badge) badge.textContent = itemCount;
    };

    cartTable.addEventListener('qtychange', recalc);

    cartTable.querySelectorAll('.track-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.track-row');
        row.classList.add('is-removing');
        row.addEventListener('transitionend', () => {
          row.remove();
          recalc();
        }, { once: true });
      });
    });

    const promoForm = document.querySelector('.promo-row');
    if (promoForm) {
      promoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = promoForm.querySelector('input');
        const btn = promoForm.querySelector('button');
        if (input.value.trim().toUpperCase() === 'GROOVE10') {
          let subtotal = 0;
          cartTable.querySelectorAll('.track-row').forEach((row) => {
            subtotal += parseFloat(row.dataset.price) * parseInt(row.querySelector('.qty-stepper__value').textContent, 10);
          });
          discount = subtotal * 0.10;
          btn.textContent = 'Applied';
          input.disabled = true;
        } else {
          input.style.borderColor = 'var(--danger)';
          setTimeout(() => { input.style.borderColor = ''; }, 900);
        }
        recalc();
      });
    }

    recalc();
  }

  /* ---------- gallery thumbnail swap (product page) ---------- */
  document.querySelectorAll('.thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.thumb').forEach((t) => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
      const label = document.querySelector('.gallery__caption');
      if (label && thumb.dataset.label) label.textContent = thumb.dataset.label;
    });
  });

  /* ---------- password visibility toggle (login page) ---------- */
  document.querySelectorAll('.password-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const input = toggle.previousElementSibling;
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      toggle.classList.toggle('is-visible', isPassword);
    });
  });

  /* ---------- auth form submit — simulated loading state ---------- */
  document.querySelectorAll('.auth-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn--submit');
      if (!btn || btn.classList.contains('is-loading')) return;
      btn.classList.add('is-loading');
      setTimeout(() => {
        btn.classList.remove('is-loading');
        btn.classList.add('is-done');
        setTimeout(() => btn.classList.remove('is-done'), 1200);
      }, 1400);
    });
  });

  /* ---------- newsletter form ---------- */
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Subscribed \u2713';
      newsletterForm.querySelector('input').value = '';
      setTimeout(() => { btn.textContent = original; }, 2400);
    });
  }

  /* ---------- scroll-reveal for sections ---------- */
  const revealTargets = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('reveal'));
  }

  /* ---------- active nav link by current page ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach((link) => {
    if (link.getAttribute('href') === path) link.classList.add('is-active');
  });

});
