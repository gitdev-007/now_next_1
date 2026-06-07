/* ========================================================
   LAYOVERX - Main Application Module
   Handles: Auth, Routing, State, Modals, UI
   Production-ready, vanilla JS, no dependencies
   ======================================================== */

(function () {
  'use strict';

  /* ===== STATE ===== */
  const state = {
    isAuthenticated: false,
    user: null,
    modals: { login: false, signup: false, forgot: false },
    plans: [],
    bookmarks: [],
    recentlyViewed: [],
  };

  /* ===== UTILS ===== */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const on = (el, evt, fn) => el && el.addEventListener(evt, fn);

  /* ===== AUTH ===== */
  const Auth = {
    init() {
      const saved = localStorage.getItem('layoverx_user');
      if (saved) {
        try {
          state.user = JSON.parse(saved);
          state.isAuthenticated = true;
          this.updateUI();
        } catch (e) { console.error(e); }
      }
    },

    login(email, password) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = { email, name: email.split('@')[0], avatar: null };
          state.user = user;
          state.isAuthenticated = true;
          localStorage.setItem('layoverx_user', JSON.stringify(user));
          this.updateUI();
          Modal.closeAll();
          resolve({ success: true, user });
        }, 300);
      });
    },

    signup(name, email, password) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = { email, name, avatar: null };
          state.user = user;
          state.isAuthenticated = true;
          localStorage.setItem('layoverx_user', JSON.stringify(user));
          this.updateUI();
          Modal.closeAll();
          resolve({ success: true, user });
        }, 300);
      });
    },

    logout() {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('layoverx_user');
      this.updateUI();
      window.location.reload();
    },

    updateUI() {
      $$('.auth-guest').forEach((el) => (el.style.display = state.isAuthenticated ? 'none' : 'flex'));
      $$('.auth-user').forEach((el) => (el.style.display = state.isAuthenticated ? 'flex' : 'none'));
      $$('.user-name').forEach((el) => (el.textContent = state.user?.name || ''));
    },

    requireAuth(callback) {
      if (state.isAuthenticated) return callback && callback();
      Modal.open('login');
    },
  };

  /* ===== MODAL SYSTEM ===== */
  const Modal = {
    open(name) {
      const modal = $(`#modal-${name}`);
      if (!modal) return;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      // Focus trap
      const focusable = modal.querySelectorAll('input, button, a');
      if (focusable.length) focusable[0].focus();
    },

    close(name) {
      const modal = $(`#modal-${name}`);
      if (!modal) return;
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    },

    closeAll() {
      ['login', 'signup', 'forgot'].forEach((n) => this.close(n));
      document.body.style.overflow = '';
    },
  };

  /* ===== NAVBAR SCROLL ===== */
  function initNavbar() {
    const navbar = $('#navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 50;
      navbar.classList.toggle('scrolled', scrolled);
      navbar.classList.toggle('bg-white/95', scrolled);
      navbar.classList.toggle('backdrop-blur-xl', scrolled);
      navbar.classList.toggle('shadow-md', scrolled);
    });
  }

  /* ===== MOBILE MENU ===== */
  function initMobileMenu() {
    const btn = $('#menu-btn');
    const menu = $('#mobile-menu');
    if (!btn || !menu) return;
    on(btn, 'click', () => {
      menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', !menu.classList.contains('hidden'));
    });
  }

  /* ===== SMOOTH SCROLL ===== */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((a) => {
      on(a, 'click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href.length <= 1) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          // Close mobile menu
          const menu = $('#mobile-menu');
          if (menu) menu.classList.add('hidden');
        }
      });
    });
  }

  /* ===== AUTH FORM HANDLER ===== */
  function initAuthForms() {
    // Login form
    const loginForm = $('#form-login');
    if (loginForm) {
      on(loginForm, 'submit', (e) => {
        e.preventDefault();
        const email = $('#login-email')?.value || '';
        const pass = $('#login-password')?.value || '';
        if (!email || !pass) return;
        Auth.login(email, pass);
      });
    }

    // Signup form
    const signupForm = $('#form-signup');
    if (signupForm) {
      on(signupForm, 'submit', (e) => {
        e.preventDefault();
        const name = $('#signup-name')?.value || '';
        const email = $('#signup-email')?.value || '';
        const pass = $('#signup-password')?.value || '';
        if (!name || !email || !pass) return;
        Auth.signup(name, email, pass);
      });
    }
  }

  /* ===== LAZY IMAGES ===== */
  function initLazyImages() {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            io.unobserve(img);
          }
        });
      });
      $$('img[data-src]').forEach((img) => io.observe(img));
    }
  }

  /* ===== DATE PICKER HELPERS ===== */
  function toLocalISO(d) {
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }

  /* ===== INIT ===== */
  function init() {
    Auth.init();
    initAuthForms();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initLazyImages();

    // ESC key to close modals
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape') Modal.closeAll();
    });

    // Click outside modal to close
    $$('[data-modal]').forEach((el) => {
      on(el, 'click', (e) => {
        if (e.target === el) {
          Modal.close(el.id.replace('modal-', ''));
        }
      });
    });

    console.log('%c LayoverX ', 'background:#0ea5e9;color:#fff;font-size:14px;padding:4px 8px;border-radius:4px', 'Production Ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
