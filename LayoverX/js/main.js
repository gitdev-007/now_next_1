// LayoverX Main JavaScript - Production Grade
(function () {
  "use strict";

  // === Utils ===
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // === Navbar Scroll Effect ===
  const navbar = $('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // === Mobile Menu Toggle ===
  const mobileBtn = $('.mobile-menu-btn');
  const navLinks = $('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileBtn.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });
  }

  // === Smooth Scroll for Anchor Links ===
  document.querySelectorAll('a[href^="#'"]
    .forEach(a => {
      a.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

  // === Lazy Loading Images ===
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });
    $$('img[data-src]').forEach(img => imgObserver.observe(img));
  }

  // === Back to Top Button ===
  const backToTop = $('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === Form Validation ===
  $$('form').forEach(form => {
    form.addEventListener('submit', function (e) {
      let valid = true;
      this.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#EF4444';
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) {
        e.preventDefault();
        alert('Please fill all required fields');
      }
    });
  });

  // === Search Functionality ===
  const searchBtn = $('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const location = $('#location');
      const arrivalDate = $('#arrival-date');
      const arrivalTime = $('#arrival-time');
      const departureDate = $('#departure-date');
      const departureTime = $('#departure-time');
      const travelers = $('#travelers');

      if (!location?.value || !arrivalDate?.value || !arrivalTime?.value ||
          !departureDate?.value || !departureTime?.value || !travelers?.value) {
        alert('Please fill all fields');
        return;
      }

      const data = {
        location: location.value,
        arrivalDate: arrivalDate.value,
        arrivalTime: arrivalTime.value,
        departureDate: departureDate.value,
        departureTime: departureTime.value,
        travelers: travelers.value
      };
      localStorage.setItem('layoverData', JSON.stringify(data));
      window.location.href = 'plan-layover.html';
    });
  }

  // === AOS-like Scroll Animations ===
  const revealElements = $$('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // === Tab System ===
  const tabBtns = $$('.tab-btn');
  const tabContents = $$('.tab-content');
  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(target)?.classList.add('active');
      });
    });
  }

  // === Trust Badge Animation ===
  const trustBadges = $('.trust-badges');
  if (trustBadges && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          trustBadges.classList.add('visible');
          observer.unobserve(trustBadges);
        }
      });
    });
    observer.observe(trustBadges);
  }

  // === Console Welcome ===
  console.log('%c LayoverX ', 'background: #0EA5E9; color: white; font-size: 20px; padding: 10px; border-radius: 8px;');
  console.log('%c Production-grade travel tech ', 'color: #0EA5E9; font-size: 14px;');
})();
