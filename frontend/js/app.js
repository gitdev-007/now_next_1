/* ========================================================
   LAYOVERX - Main Application Module
   Handles: Auth, Hash-based Routing, State, Modals, 
   Marketplace Filters, AI Planner, Cost Estimator
   ======================================================== */

(function () {
  'use strict';

  window.layoverx = window.layoverx || {};

  /* ===== STATE ===== */
  const state = {
    isAuthenticated: false,
    user: null,
    savedPlans: [],
    // Planner current configuration
    currentPlan: {
      location: 'near-airport',
      arrivalDateTime: '',
      departureDateTime: '',
      travelers: 2,
      cabType: 'sedan',
      hotelId: null,
      diningId: null,
      activityId: null,
      spaId: null,
      gamingId: null
    }
  };

  /* ===== UTILS ===== */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const on = (el, evt, fn) => el && el.addEventListener(evt, fn);

  /* Convert a Date to 'YYYY-MM-DDTHH:MM' for datetime-local inputs */
  function toLocalISO(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  /* ===== MOCK DATA ===== */
  const HOTELS = {
    1: { id: 1, name: "Niranta Airport Transit Hotel & Lounge", stars: 5, rating: 4.8, reviews: 2400, distance: 0.0, price: 3499, amenities: ["24/7 Check-in", "Free WiFi", "Shower Room", "Massage Spa"], image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop", desc: "Located directly inside Terminal 2 Arrivals area. No transit visa required. Express spa, restaurant, clean sleeping pods, and shower suites." },
    2: { id: 2, name: "JW Marriott Mumbai Sahar", stars: 5, rating: 4.7, reviews: 1800, distance: 1.2, price: 5499, amenities: ["24/7 Check-in", "Free Airport Shuttle", "Swimming Pool", "Spa & Gym"], image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop", desc: "Five-star luxury oasis next to T2. Features premium suites, resort pool, luxury wellness treatments, and complimentary terminal dropoffs." },
    3: { id: 3, name: "Ibis Mumbai Airport", stars: 3, rating: 4.2, reviews: 1100, distance: 0.8, price: 2200, amenities: ["24/7 Check-in", "Free WiFi", "Airport Shuttle", "Breakfast Buffet"], image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop", desc: "Ergonomic budget rooms situated next to the domestic terminal. Soundproof windows, all-day check-in, and convenient working desks." },
    4: { id: 4, name: "The Orchid Hotel Mumbai Vile Parle", stars: 4, rating: 4.6, reviews: 1500, distance: 2.1, price: 4500, amenities: ["24/7 Check-in", "Free Airport Shuttle", "Rooftop Pool", "Green Certified"], image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop", desc: "Asia's first certified five-star ecofriendly hotel. Runway-view pool, spa, airport transportations, and delicious multiple dining options." }
  };

  const DINING = {
    1: { id: 1, name: "Gajalee Coastal Seafood Restaurant", cuisine: "seafood", rating: 4.8, reviews: 940, distance: 3.5, price: 1800, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop", desc: "Legendary seafood destination famous for butter garlic pepper crabs, bombil fry, stuffed pomfret, and local sol kadhi drink." },
    2: { id: 2, name: "Peshawri - ITC Maratha", cuisine: "fine-dining", rating: 4.9, reviews: 1240, distance: 1.1, price: 4500, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop", desc: "Ultra luxury traditional North-West Frontier clay-oven diner. World-famous Dal Bukhara, paneer tikka, and slow cooked lamb." },
    3: { id: 3, name: "Highway Gomantak", cuisine: "local", rating: 4.5, reviews: 560, distance: 2.2, price: 800, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop", desc: "An unpretentious local icon serving Konkan seafood thalis, sol kadhi, and crispy bombay duck fry." },
    4: { id: 4, name: "Elco Pani Puri Center", cuisine: "street-food", rating: 4.4, reviews: 1890, distance: 4.2, price: 400, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&h=400&fit=crop", desc: "High-hygiene local street food. Purified mineral water golgappe, pav bhaji, ragda pattice, and fresh fruit juices." }
  };

  const EXPERIENCES = {
    1: { id: 1, name: "South Mumbai Gateway Heritage Tour", category: "sightseeing", rating: 4.9, duration: 5, price: 2899, image: "https://images.unsplash.com/photo-1605307066130-098b5f638948?w=600&h=400&fit=crop", desc: "AC private vehicle tour visiting the Gateway of India, Queen's Necklace, Taj Mahal Palace, and Victoria Terminus." },
    2: { id: 2, name: "Guided Bandra Street Food Trail", category: "food", rating: 4.8, duration: 3, price: 1299, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop", desc: "Hygienic culinary walk through Bandra West. Sample local snacks, sweet rolls, seekh kebabs, and vada pav." },
    3: { id: 3, name: "Elephanta Caves Fast-Track Excursion", category: "culture", rating: 4.7, duration: 4, price: 1999, image: "https://images.unsplash.com/photo-1598977123418-45f04b616a0e?w=600&h=400&fit=crop", desc: "Ferry tickets and professional guides to explore the historic rock-cut cave temples on Elephanta Island." },
    4: { id: 4, name: "Bazaar & Boutique Shopping Expedition", category: "shopping", rating: 4.6, duration: 3.5, price: 1500, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop", desc: "Accompanied market tour to buy Indian cottons, silks, spices, and souvenirs with secure baggage drop back in cab." }
  };

  const SPA_WELLNESS = {
    1: { id: 1, name: "Heavenly Spa by Westin", category: "massage", rating: 4.9, duration: 1.5, price: 4500, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop", desc: "Full-body Swedish massage, steam room access, and luxury aromatherapy in a tranquil airport-adjacent setting." },
    2: { id: 2, name: "O2 Spa - Terminal 2", category: "express", rating: 4.7, duration: 0.5, price: 1800, image: "https://images.unsplash.com/photo-1611077544192-332e67500366?w=600&h=400&fit=crop", desc: "Convenient express foot reflexology and head-neck-shoulder massage located right at the T2 arrivals lounge." },
    3: { id: 3, name: "Six Senses Wellness Circuit", category: "full-day", rating: 4.8, duration: 3, price: 8500, image: "https://images.unsplash.com/photo-1540555700478-4be289fbece8?w=600&h=400&fit=crop", desc: "Holistic wellness journey including detox juices, meditation session, deep tissue massage, and facial treatment." }
  };

  const GAMING_ENTERTAINMENT = {
    1: { id: 1, name: "Smaaash Entertainment Hub", category: "gaming", rating: 4.6, duration: 2, price: 1200, image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop", desc: "Virtual reality games, bowling, cricket simulators, and arcade fun. Perfect for high-energy transit breaks." },
    2: { id: 2, name: "PVR Directors Cut Luxury Cinema", category: "movie", rating: 4.9, duration: 3, price: 2500, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop", desc: "Ultra-premium movie watching with recliner seats, butler service, and fine dining at the airport mall." },
    3: { id: 3, name: "The Game Palacio - Casino Style Arcade", category: "gaming", rating: 4.7, duration: 2.5, price: 1800, image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&h=400&fit=crop", desc: "Boutique bowling, high-end retro arcade games, and mechanical bull rides with a premium lounge bar." }
  };

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
      const name = email.split('@')[0];
      const user = { email, name, avatar: name[0].toUpperCase() };
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('layoverx_user', JSON.stringify(user));
      this.updateUI();
      Modal.closeAll();
      showToast(`Welcome back, ${name}!`);
    },
    signup(name, email, password) {
      const user = { email, name, avatar: name[0].toUpperCase() };
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('layoverx_user', JSON.stringify(user));
      this.updateUI();
      Modal.closeAll();
      showToast(`Account created! Welcome, ${name}.`);
    },
    logout() {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('layoverx_user');
      showToast("Signed out successfully.");
      setTimeout(() => window.location.reload(), 800);
    },
    updateUI() {
      const isAuth = state.isAuthenticated;
      $$('.auth-guest').forEach((el) => el.style.display = isAuth ? 'none' : 'flex');
      $$('.auth-user').forEach((el) => el.style.display = isAuth ? 'flex' : 'none');
      $$('.user-name').forEach((el) => el.textContent = state.user?.name || '');
      $$('.user-avatar-letter').forEach((el) => el.textContent = state.user?.avatar || 'U');
    }
  };

  /* ===== MODALS ===== */
  const Modal = {
    open(name) {
      const modal = $(`#modal-${name}`);
      if (!modal) return;
      modal.classList.add('flex');
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      const focusable = modal.querySelectorAll('input, button, a');
      if (focusable.length) focusable[0].focus();
    },
    close(name) {
      const modal = $(`#modal-${name}`);
      if (!modal) return;
      modal.classList.remove('flex');
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    },
    closeAll() {
      $$('.modal-overlay').forEach((el) => {
        el.classList.remove('flex');
        el.classList.add('hidden');
      });
      document.body.style.overflow = '';
    }
  };

  /* ===== HASH BASED ROUTING ===== */
  function initHashRouting() {
    function checkHash() {
      const hash = window.location.hash;
      if (hash === '#login') {
        Modal.open('login');
      } else if (hash === '#signup') {
        Modal.open('signup');
      } else if (hash === '#forgot') {
        Modal.open('forgot');
      }
    }
    window.addEventListener('hashchange', checkHash);
    checkHash(); // on page load
  }

  /* ===== TOAST SYSTEM ===== */
  function showToast(msg) {
    let container = $('#toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-6 right-6 z-[2000] flex flex-col gap-3';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-gray-800 text-sm font-semibold';
    toast.innerHTML = `
      <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <span>${msg}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-all', 'duration-500');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  /* ===== NAVBAR DECORATOR ===== */
  function decorateNavbar() {
    const navbar = $('#navbar');
    const logoText = $('#logo-text');
    const menuBtn = $('#menu-btn');
    if (!navbar) return;
    
    function handleScroll() {
      const scrolled = window.scrollY > 40;
      navbar.classList.toggle('bg-transparent', !scrolled);
      navbar.classList.toggle('bg-white/95', scrolled);
      navbar.classList.toggle('backdrop-blur-xl', scrolled);
      navbar.classList.toggle('shadow-md', scrolled);
      navbar.classList.toggle('scrolled', scrolled);
      // Colors are now handled purely by CSS variables and .scrolled class in design-system.css
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  /* ===== MOBILE MENU CALLBACKS ===== */
  function decorateMobileMenu() {
    const btn = $('#menu-btn');
    const menu = $('#mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
      const expanded = !menu.classList.contains('hidden');
      btn.setAttribute('aria-expanded', expanded);
    });
  }

  /* ===== KEYBOARD NAVIGATION AND TAB ACCESS ===== */
  function initAccessibility() {
    // Esc key closing modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') Modal.closeAll();
    });
  }

  /* ===== MARKETPLACE FILTER ENGINES ===== */
  
  // Hotels filter
  function initHotelsFilter() {
    const list = $('#hotel-list');
    if (!list) return;

    function applyFilters() {
      // Gather checked values
      const prices = Array.from($$('input[name="filter-price"]:checked')).map(el => el.value);
      const distances = Array.from($$('input[name="filter-distance"]:checked')).map(el => el.value);
      const stars = Array.from($$('input[name="filter-stars"]:checked')).map(el => el.value);
      const amenities = Array.from($$('input[name="filter-amenity"]:checked')).map(el => el.value);

      const items = $$('.hotel-item');
      let visibleCount = 0;

      items.forEach(item => {
        const price = parseInt(item.getAttribute('data-price'));
        const distance = parseFloat(item.getAttribute('data-distance'));
        const itemStars = item.getAttribute('data-stars');
        const itemAmenities = item.getAttribute('data-amenities').split(',');

        let matchPrice = prices.length === 0;
        prices.forEach(val => {
          if (val === 'under-2500' && price < 2500) matchPrice = true;
          if (val === '2500-5000' && price >= 2500 && price <= 5000) matchPrice = true;
          if (val === '5000-7500' && price >= 5000 && price <= 7500) matchPrice = true;
          if (val === 'above-7500' && price > 7500) matchPrice = true;
        });

        let matchDistance = distances.length === 0;
        distances.forEach(val => {
          if (val === 'in-terminal' && distance === 0.0) matchDistance = true;
          if (val === 'under-2km' && distance < 2.0) matchDistance = true;
          if (val === '2-5km' && distance >= 2.0 && distance <= 5.0) matchDistance = true;
        });

        let matchStars = stars.length === 0 || stars.includes(itemStars);

        let matchAmenity = true;
        amenities.forEach(val => {
          if (!itemAmenities.includes(val)) matchAmenity = false;
        });

        if (matchPrice && matchDistance && matchStars && matchAmenity) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });

      $('#hotel-count').textContent = visibleCount;
      $('#hotel-empty').classList.toggle('hidden', visibleCount > 0);
    }

    $$('input[name^="filter-"]').forEach(el => {
      el.addEventListener('change', applyFilters);
    });

    on($('#clear-filters'), 'click', () => {
      $$('input[name^="filter-"]').forEach(el => el.checked = false);
      applyFilters();
    });

    // Also expose as global for the empty state "Reset Filters" button
    window.layoverx.resetFilters = function() {
      $$('input[name^="filter-"]').forEach(el => el.checked = false);
      applyFilters();
    };

    on($('#hotel-sort'), 'change', function() {
      const order = this.value;
      const container = $('#hotel-list');
      const items = Array.from($$('.hotel-item'));
      
      items.sort((a, b) => {
        if (order === 'price-low') return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
        if (order === 'price-high') return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
        if (order === 'rating') return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
        if (order === 'distance') return parseFloat(a.getAttribute('data-distance')) - parseFloat(b.getAttribute('data-distance'));
        return 0;
      });

      items.forEach(el => container.appendChild(el));
    });

    // Initialize hotel count to match actual visible items
    const initialCount = $$('.hotel-item:not(.hidden)').length;
    const countEl = $('#hotel-count');
    if (countEl) countEl.textContent = initialCount || $$('.hotel-item').length;
  }

  // Dining filter
  function initDiningFilter() {
    const list = $('#restaurant-list');
    if (!list) return;

    let selectedCuisine = 'all';

    window.layoverx.filterCuisine = function(cuisine) {
      selectedCuisine = cuisine;
      $$('#cuisine-tabs button').forEach(el => {
        el.classList.remove('bg-emerald-600', 'text-white');
        el.classList.add('bg-gray-55', 'text-gray-700');
      });
      const activeTab = Array.from($$('#cuisine-tabs button')).find(el => el.textContent.toLowerCase().includes(cuisine) || (cuisine === 'all' && el.textContent.includes('All')));
      if (activeTab) {
        activeTab.classList.remove('bg-gray-55', 'text-gray-700');
        activeTab.classList.add('bg-emerald-600', 'text-white');
      }
      applyRestFilters();
    };

    function applyRestFilters() {
      const prices = Array.from($$('input[name="rest-price"]:checked')).map(el => el.value);
      const distances = Array.from($$('input[name="rest-distance"]:checked')).map(el => el.value);
      const checkedRatingEl = $('input[name="rest-rating"]:checked');
      const minRating = checkedRatingEl && checkedRatingEl.value !== 'all' ? parseFloat(checkedRatingEl.value) : 0;

      const items = $$('.rest-item');
      let visibleCount = 0;

      items.forEach(item => {
        const itemCuisine = item.getAttribute('data-cuisine');
        const price = parseInt(item.getAttribute('data-price'));
        const distance = parseFloat(item.getAttribute('data-distance'));
        const rating = parseFloat(item.getAttribute('data-rating'));

        let matchCuisine = selectedCuisine === 'all' || itemCuisine === selectedCuisine;

        let matchPrice = prices.length === 0;
        prices.forEach(val => {
          if (val === 'under-1000' && price < 1000) matchPrice = true;
          if (val === '1000-2500' && price >= 1000 && price <= 2500) matchPrice = true;
          if (val === 'above-2500' && price > 2500) matchPrice = true;
        });

        let matchDistance = distances.length === 0;
        distances.forEach(val => {
          if (val === 'under-2km' && distance < 2.0) matchDistance = true;
          if (val === '2-6km' && distance >= 2.0 && distance <= 6.0) matchDistance = true;
          if (val === 'above-6km' && distance > 6.0) matchDistance = true;
        });

        let matchRating = rating >= minRating;

        if (matchCuisine && matchPrice && matchDistance && matchRating) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });

      $('#rest-empty').classList.toggle('hidden', visibleCount > 0);
    }

    $$('input[name^="rest-"]').forEach(el => {
      el.addEventListener('change', applyRestFilters);
    });

    window.layoverx.clearRestFilters = function() {
      $$('input[name^="rest-"]').forEach(el => {
        if (el.type === 'checkbox') el.checked = false;
        if (el.type === 'radio') el.checked = el.value === 'all';
      });
      window.layoverx.filterCuisine('all');
    };
  }

  // Experiences filter
  function initExperiencesFilter() {
    const list = $('#exp-list');
    if (!list) return;

    let selectedCat = 'all';

    window.layoverx.filterExp = function(cat) {
      selectedCat = cat;
      $$('#experience-tabs button').forEach(el => {
        el.classList.remove('bg-amber-600', 'text-white');
        el.classList.add('bg-gray-55', 'text-gray-700');
      });
      const activeTab = Array.from($$('#experience-tabs button')).find(el => el.textContent.toLowerCase().includes(cat) || (cat === 'all' && el.textContent.includes('All')));
      if (activeTab) {
        activeTab.classList.remove('bg-gray-55', 'text-gray-700');
        activeTab.classList.add('bg-amber-600', 'text-white');
      }
      applyExpFilters();
    };

    function applyExpFilters() {
      const fits = Array.from($$('input[name="exp-fit"]:checked')).map(el => el.value);
      const prices = Array.from($$('input[name="exp-price"]:checked')).map(el => el.value);

      const items = $$('.exp-item');
      let visibleCount = 0;

      items.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        const duration = parseFloat(item.getAttribute('data-duration'));
        const price = parseInt(item.getAttribute('data-price'));

        let matchCat = selectedCat === 'all' || itemCat === selectedCat;

        let matchFit = fits.length === 0;
        fits.forEach(val => {
          if (val === 'under-4h' && duration < 4.0) matchFit = true;
          if (val === '4-8h' && duration >= 4.0 && duration <= 8.0) matchFit = true;
          if (val === 'above-8h' && duration > 8.0) matchFit = true;
        });

        let matchPrice = prices.length === 0;
        prices.forEach(val => {
          if (val === 'under-1500' && price < 1500) matchPrice = true;
          if (val === '1500-3000' && price >= 1500 && price <= 3000) matchPrice = true;
          if (val === 'above-3000' && price > 3000) matchPrice = true;
        });

        if (matchCat && matchFit && matchPrice) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });

      $('#exp-empty').classList.toggle('hidden', visibleCount > 0);
    }

    $$('input[name^="exp-"]').forEach(el => {
      el.addEventListener('change', applyExpFilters);
    });

    window.layoverx.clearExpFilters = function() {
      $$('input[name^="exp-"]').forEach(el => el.checked = false);
      window.layoverx.filterExp('all');
    };
  }

  // Spa filter
  function initSpaFilter() {
    const list = $('#spa-list');
    if (!list) return;

    let selectedCat = 'all';
    window.layoverx.filterSpa = function(cat) {
      selectedCat = cat;
      $$('#spa-tabs button').forEach(el => {
        el.classList.remove('bg-sky-700', 'text-white');
        el.classList.add('bg-gray-55', 'text-gray-700');
      });
      const activeTab = Array.from($$('#spa-tabs button')).find(el => el.textContent.toLowerCase().includes(cat) || (cat === 'all' && el.textContent.includes('All')));
      if (activeTab) {
        activeTab.classList.remove('bg-gray-55', 'text-gray-700');
        activeTab.classList.add('bg-sky-700', 'text-white');
      }
      applySpaFilters();
    };

    function applySpaFilters() {
      const items = $$('.spa-item');
      let visibleCount = 0;
      items.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        let matchCat = selectedCat === 'all' || itemCat === selectedCat;
        if (matchCat) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });
      $('#spa-empty').classList.toggle('hidden', visibleCount > 0);
    }
  }

  // Gaming filter
  function initGamingFilter() {
    const list = $('#gaming-list');
    if (!list) return;

    let selectedCat = 'all';
    window.layoverx.filterGaming = function(cat) {
      selectedCat = cat;
      $$('#gaming-tabs button').forEach(el => {
        el.classList.remove('bg-purple-700', 'text-white');
        el.classList.add('bg-gray-55', 'text-gray-700');
      });
      const activeTab = Array.from($$('#gaming-tabs button')).find(el => el.textContent.toLowerCase().includes(cat) || (cat === 'all' && el.textContent.includes('All')));
      if (activeTab) {
        activeTab.classList.remove('bg-gray-55', 'text-gray-700');
        activeTab.classList.add('bg-purple-700', 'text-white');
      }
      applyGamingFilters();
    };

    function applyGamingFilters() {
      const items = $$('.gaming-item');
      let visibleCount = 0;
      items.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        let matchCat = selectedCat === 'all' || itemCat === selectedCat;
        if (matchCat) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });
      $('#gaming-empty').classList.toggle('hidden', visibleCount > 0);
    }
  }

  /* ===== MARKETPLACE ACTIONS & DETAILS MODALS ===== */
  window.layoverx.openHotelDetail = function(id) {
    const h = HOTELS[id];
    if (!h) return;
    $('#detail-hotel-image').src = h.image;
    $('#hotel-detail-title').textContent = h.name;
    $('#detail-hotel-location').innerHTML = `📍 CSMIA Airport Area • ⭐ ${h.stars} Star`;
    $('#detail-hotel-rating').textContent = `${h.rating}★`;
    $('#detail-hotel-distance').textContent = `${h.distance} km`;
    $('#detail-hotel-price').textContent = `₹${h.price.toLocaleString()}`;
    $('#detail-hotel-description').textContent = h.desc;
    
    const amenList = $('#detail-hotel-amenities');
    amenList.innerHTML = '';
    h.amenities.forEach(a => {
      amenList.innerHTML += `<li>✅ ${a}</li>`;
    });
    
    $('#detail-book-btn').onclick = () => {
      window.layoverx.bookHotel(id);
      window.layoverx.closeHotelDetail();
    };
    
    Modal.open('hotel-detail');
  };
  window.layoverx.closeHotelDetail = function() {
    Modal.close('hotel-detail');
  };
  window.layoverx.bookHotel = function(id) {
    showToast(`Hotel "${HOTELS[id].name}" day room selected!`);
  };

  window.layoverx.openRestDetail = function(id) {
    const r = DINING[id];
    if (!r) return;
    $('#detail-rest-image').src = r.image;
    $('#rest-detail-title').textContent = r.name;
    $('#detail-rest-location').innerHTML = `📍 Near CSMIA Terminals • 🍽️ Cuisine: ${r.cuisine}`;
    $('#detail-rest-rating').textContent = `${r.rating}★`;
    $('#detail-rest-cuisine').textContent = r.cuisine;
    $('#detail-rest-price').textContent = `₹${r.price.toLocaleString()}`;
    $('#detail-rest-description').textContent = r.desc;
    
    $('#detail-rest-reserve-btn').onclick = () => {
      window.layoverx.reserveRest(id);
      window.layoverx.closeRestDetail();
    };
    
    Modal.open('rest-detail');
  };
  window.layoverx.closeRestDetail = function() {
    Modal.close('rest-detail');
  };
  window.layoverx.reserveRest = function(id) {
    showToast(`Table reserved at "${DINING[id].name}"! Confirmation sent via SMS.`);
  };

  window.layoverx.openExpDetail = function(id) {
    const e = EXPERIENCES[id];
    if (!e) return;
    $('#detail-exp-image').src = e.image;
    $('#exp-detail-title').textContent = e.name;
    $('#detail-exp-duration').innerHTML = `📍 Mumbai Tours • ⏱️ ${e.duration} Hours`;
    $('#detail-exp-rating').textContent = `${e.rating}★`;
    $('#detail-exp-dur-val').textContent = `${e.duration}h`;
    $('#detail-exp-price').textContent = `₹${e.price.toLocaleString()}`;
    $('#detail-exp-description').textContent = e.desc;

    $('#detail-exp-book-btn').onclick = () => {
      window.layoverx.bookExp(id);
      window.layoverx.closeExpDetail();
    };

    Modal.open('exp-detail');
  };
  window.layoverx.closeExpDetail = function() {
    Modal.close('exp-detail');
  };

  window.layoverx.openSpaDetail = function(id) {
    const e = SPA_WELLNESS[id];
    if (!e) return;
    $('#detail-spa-image').src = e.image;
    $('#spa-detail-title').textContent = e.name;
    $('#detail-spa-duration').textContent = `${e.duration} Hour Session`;
    $('#detail-spa-description').textContent = e.desc;
    $('#detail-spa-book-btn').onclick = () => {
      window.layoverx.bookSpa(id);
      window.layoverx.closeSpaDetail();
    };
    Modal.open('spa-detail');
  };
  window.layoverx.closeSpaDetail = function() {
    Modal.close('spa-detail');
  };

  window.layoverx.openGamingDetail = function(id) {
    const e = GAMING_ENTERTAINMENT[id];
    if (!e) return;
    $('#detail-gaming-image').src = e.image;
    $('#gaming-detail-title').textContent = e.name;
    $('#detail-gaming-duration').textContent = `${e.duration} Hour Session`;
    $('#detail-gaming-description').textContent = e.desc;
    $('#detail-gaming-book-btn').onclick = () => {
      window.layoverx.bookGaming(id);
      window.layoverx.closeGamingDetail();
    };
    Modal.open('gaming-detail');
  };
  window.layoverx.closeGamingDetail = function() {
    Modal.close('gaming-detail');
  };

  window.layoverx.bookExp = function(id) {
    showToast(`Experience "${EXPERIENCES[id].name}" added! Private guide assigned.`);
  };
  window.layoverx.bookSpa = function(id) {
    showToast(`Spa Session "${SPA_WELLNESS[id].name}" reserved!`);
  };
  window.layoverx.bookGaming = function(id) {
    showToast(`Entertainment "${GAMING_ENTERTAINMENT[id].name}" reserved!`);
  };

  window.layoverx.bookCab = function(type) {
    showToast(`Flat-rate ${type.toUpperCase()} transfer cab reserved! Chauffeur details arriving soon.`);
  };

  /* ===== FLAGSHIP AI PLANNER TIMELINE & ESTIMATOR ===== */
  function initPlanner() {
    const form = $('#planner-form');
    if (!form) return;

    // Load URL params if any
    const params = new URLSearchParams(window.location.search);
    const landing = params.get('arrivalDateTime');
    const boarding = params.get('departureDateTime');
    const loc = params.get('location');
    const travelers = params.get('travelers');

    // Default dates
    const now = new Date();
    const sixh = new Date(now.getTime() + 6*60*60*1000);
    
    $('#plan-arrival').value = landing || toLocalISO(now);
    $('#plan-departure').value = boarding || toLocalISO(sixh);
    if (loc) $('#plan-location').value = loc;
    if (travelers) $('#plan-travelers').value = travelers;

    // Setup bindings
    $$('#plan-hotels-options input[type="checkbox"]').forEach((el, index) => {
      el.addEventListener('change', () => {
        if (el.checked) {
          // Uncheck others in group
          $$('#plan-hotels-options input[type="checkbox"]').forEach(c => { if(c!==el) c.checked = false });
          state.currentPlan.hotelId = index + 1;
        } else {
          state.currentPlan.hotelId = null;
        }
        recalculateItinerary();
      });
    });

    $$('#plan-dining-options input[type="checkbox"]').forEach((el, index) => {
      el.addEventListener('change', () => {
        if (el.checked) {
          $$('#plan-dining-options input[type="checkbox"]').forEach(c => { if(c!==el) c.checked = false });
          state.currentPlan.diningId = index + 1;
        } else {
          state.currentPlan.diningId = null;
        }
        recalculateItinerary();
      });
    });

    $$('#plan-activities-options input[type="checkbox"]').forEach((el, index) => {
      el.addEventListener('change', () => {
        if (el.checked) {
          $$('#plan-activities-options input[type="checkbox"]').forEach(c => { if(c!==el) c.checked = false });
          state.currentPlan.activityId = index + 1;
        } else {
          state.currentPlan.activityId = null;
        }
        recalculateItinerary();
      });
    });

    $$('#plan-spa-options input[type="checkbox"]').forEach((el, index) => {
      el.addEventListener('change', () => {
        if (el.checked) {
          $$('#plan-spa-options input[type="checkbox"]').forEach(c => { if(c!==el) c.checked = false });
          state.currentPlan.spaId = index + 1;
        } else {
          state.currentPlan.spaId = null;
        }
        recalculateItinerary();
      });
    });

    $$('#plan-gaming-options input[type="checkbox"]').forEach((el, index) => {
      el.addEventListener('change', () => {
        if (el.checked) {
          $$('#plan-gaming-options input[type="checkbox"]').forEach(c => { if(c!==el) c.checked = false });
          state.currentPlan.gamingId = index + 1;
        } else {
          state.currentPlan.gamingId = null;
        }
        recalculateItinerary();
      });
    });

    $$('input[name="plan-cab"]').forEach(el => {
      el.addEventListener('change', () => {
        state.currentPlan.cabType = el.value;
        recalculateItinerary();
      });
    });

    on($('#plan-arrival'), 'input', recalculateItinerary);
    on($('#plan-departure'), 'input', recalculateItinerary);
    on($('#plan-location'), 'change', recalculateItinerary);
    on($('#plan-travelers'), 'change', recalculateItinerary);

    // Initial run
    recalculateItinerary();
  }

  function formatTime(d) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function recalculateItinerary() {
    const arrVal = $('#plan-arrival')?.value;
    const depVal = $('#plan-departure')?.value;
    if (!arrVal || !depVal) return;

    const arr = new Date(arrVal);
    const dep = new Date(depVal);
    const diff = dep - arr;
    
    // Update layout timings banner
    if (diff <= 0) {
      $('#plan-duration-display').textContent = '--';
      $('#plan-exit-hours').textContent = 'Invalid Timing';
      return;
    }

    const hrs = diff / (1000*60*60);
    const formattedDiff = Math.floor(hrs) + 'h ' + Math.floor((diff % (1000*60*60))/(1000*60)) + 'm';
    $('#plan-duration-display').textContent = formattedDiff;

    // Buffer is 3h 30m
    const safeWindow = Math.max(0, hrs - 3.5);
    $('#plan-exit-hours').textContent = safeWindow.toFixed(1) + ' Hours';
    
    const travelersCount = parseInt($('#plan-travelers').value);
    $('#travelers-badge').textContent = `${travelersCount} ${travelersCount === 1 ? 'Guest' : 'Guests'}`;

    // Read selected entities
    const cab = $('input[name="plan-cab"]:checked')?.value || 'sedan';
    const hotelId = state.currentPlan.hotelId;
    const diningId = state.currentPlan.diningId;
    const activityId = state.currentPlan.activityId;
    const spaId = state.currentPlan.spaId;
    const gamingId = state.currentPlan.gamingId;

    let total = 0;
    const summaryList = $('#summary-items-list');
    const timelineList = $('#timeline-list');
    
    summaryList.innerHTML = '';
    timelineList.innerHTML = '';

    // 1. Cab pricing
    const cabPrice = cab === 'suv' ? 1499 : 899;
    total += cabPrice;
    summaryList.innerHTML += `
      <li class="flex items-start justify-between gap-4">
        <span class="flex items-center gap-2"><span class="text-base">🚖</span> Airport Cabs (Return)</span>
        <strong class="font-bold text-gray-900 flex-shrink-0">₹${cabPrice}</strong>
      </li>`;

    // 2. Hotel pricing
    if (hotelId) {
      const hPrice = HOTELS[hotelId].price;
      total += hPrice;
      summaryList.innerHTML += `
        <li class="flex items-start justify-between gap-4">
          <span class="flex items-center gap-2"><span class="text-base">🏨</span> Transit Room (${HOTELS[hotelId].name.split(' ')[0]})</span>
          <strong class="font-bold text-gray-900 flex-shrink-0">₹${hPrice}</strong>
        </li>`;
    }

    // 3. Dining pricing
    if (diningId) {
      const dPrice = DINING[diningId].price;
      total += dPrice;
      summaryList.innerHTML += `
        <li class="flex items-start justify-between gap-4">
          <span class="flex items-center gap-2"><span class="text-base">🍽️</span> Table (${DINING[diningId].name.split(' ')[0]})</span>
          <strong class="font-bold text-gray-900 flex-shrink-0">₹${dPrice}</strong>
        </li>`;
    }

    // 4. Activity pricing
    if (activityId) {
      const aPrice = EXPERIENCES[activityId].price * travelersCount;
      total += aPrice;
      summaryList.innerHTML += `
        <li class="flex items-start justify-between gap-4">
          <span class="flex items-center gap-2"><span class="text-base">📸</span> Tours (${EXPERIENCES[activityId].name.slice(0, 12)}...)</span>
          <strong class="font-bold text-gray-900 flex-shrink-0">₹${aPrice}</strong>
        </li>`;
    }

    // 5. Spa pricing
    if (spaId) {
      const sPrice = SPA_WELLNESS[spaId].price * travelersCount;
      total += sPrice;
      summaryList.innerHTML += `
        <li class="flex items-start justify-between gap-4">
          <span class="flex items-center gap-2"><span class="text-base">💆</span> Spa (${SPA_WELLNESS[spaId].name.split(' ')[0]})</span>
          <strong class="font-bold text-gray-900 flex-shrink-0">₹${sPrice}</strong>
        </li>`;
    }

    // 6. Gaming pricing
    if (gamingId) {
      const gPrice = GAMING_ENTERTAINMENT[gamingId].price * travelersCount;
      total += gPrice;
      summaryList.innerHTML += `
        <li class="flex items-start justify-between gap-4">
          <span class="flex items-center gap-2"><span class="text-base">🎮</span> Gaming (${GAMING_ENTERTAINMENT[gamingId].name.split(' ')[0]})</span>
          <strong class="font-bold text-gray-900 flex-shrink-0">₹${gPrice}</strong>
        </li>`;
    }

    $('#total-cost').textContent = `₹${total.toLocaleString()}`;

    // Render Timeline Graphical Nodes
    // Time offsets
    let current = new Date(arr.getTime());
    
    // Node 1: Landing
    addTimelineNode(formatTime(current), "🛫 Landing & Customs Exit", "De-board and pass immigration (calculated wait buffer: 1.5h).", "sky");
    
    // Exit queue
    current = new Date(current.getTime() + 1.5 * 60 * 60 * 1000);

    // Node 2: Cab pickup
    addTimelineNode(formatTime(current), "🚖 Chauffeur Pickup", `Meet your driver at Exit Gate 2. Board AC ${cab.toUpperCase()}.`, "sky");
    
    current = new Date(current.getTime() + 30 * 60 * 1000); // 30 min transit

    // Node 3: Custom selected items
    if (hotelId) {
      addTimelineNode(formatTime(current), `🏨 Check-in: ${HOTELS[hotelId].name}`, "Day-use room ready. Enjoy showers and pool access.", "emerald");
      current = new Date(current.getTime() + 3 * 60 * 60 * 1000); // 3 hours rest
    }

    if (spaId) {
      addTimelineNode(formatTime(current), `💆 Wellness Session: ${SPA_WELLNESS[spaId].name}`, "Express therapy session to refresh after flight.", "sky");
      current = new Date(current.getTime() + SPA_WELLNESS[spaId].duration * 60 * 60 * 1000);
    }

    if (gamingId) {
      addTimelineNode(formatTime(current), `🎮 Gaming & Fun: ${GAMING_ENTERTAINMENT[gamingId].name}`, "Interactive gaming break for transit energy.", "amber");
      current = new Date(current.getTime() + GAMING_ENTERTAINMENT[gamingId].duration * 60 * 60 * 1000);
    }

    if (activityId) {
      addTimelineNode(formatTime(current), `📸 Tour Starts: ${EXPERIENCES[activityId].name}`, `Private guide tour window for ${travelersCount} travelers.`, "amber");
      current = new Date(current.getTime() + EXPERIENCES[activityId].duration * 60 * 60 * 1000);
    }

    if (diningId) {
      addTimelineNode(formatTime(current), `🍽️ Table Reserved: ${DINING[diningId].name}`, "Savor hot local coastal delicacies. Table confirmed.", "emerald");
      current = new Date(current.getTime() + 1.5 * 60 * 60 * 1000); // 1.5h dining
    }

    // Node 4: Return Cab
    const returnCabTime = new Date(dep.getTime() - 2 * 60 * 60 * 1000); // boarding - 2h
    addTimelineNode(formatTime(returnCabTime), "🚖 Airport Dropoff", "Driver drops you directly at departure ramp T2.", "sky");

    // Node 5: Takeoff
    addTimelineNode(formatTime(dep), "🛫 Takeoff & Departure", "Security cleared. Boarding at assigned gate. Safe travels!", "red");
  }

  function addTimelineNode(time, title, desc, color) {
    const list = $('#timeline-list');
    if (!list) return;

    let colorClass = "bg-sky-500";
    if (color === "emerald") colorClass = "bg-emerald-500";
    if (color === "amber") colorClass = "bg-amber-500";
    if (color === "red") colorClass = "bg-red-500";

    list.innerHTML += `
      <div class="relative">
        <div class="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full ${colorClass} border-2 border-white shadow-sm"></div>
        <strong class="text-gray-900 block text-xs sm:text-sm font-extrabold">${time} • ${title}</strong>
        <p class="text-gray-500 text-xs mt-0.5 leading-relaxed">${desc}</p>
      </div>
    `;
  }

  /* ===== LOCAL STORAGE SAVE & SHARE PLAN ===== */
  window.layoverx.saveCurrentPlan = function() {
    const arr = $('#plan-arrival').value;
    const dep = $('#plan-departure').value;
    const loc = $('#plan-location').value;
    const travelers = $('#plan-travelers').value;
    const cost = $('#total-cost').textContent;

    const plan = {
      id: Date.now(),
      arrival: arr,
      departure: dep,
      location: loc,
      travelers,
      cost,
      dateSaved: new Date().toLocaleDateString(),
      details: state.currentPlan
    };

    let list = [];
    try {
      const saved = localStorage.getItem('layoverx_saved_plans');
      if (saved) list = JSON.parse(saved);
    } catch(e) { console.error(e); }

    list.push(plan);
    localStorage.setItem('layoverx_saved_plans', JSON.stringify(list));
    showToast("Layover itinerary successfully saved!");
    loadSavedPlans();
  };

  window.layoverx.shareCurrentPlan = function() {
    const url = window.location.href.split('?')[0];
    const params = new URLSearchParams({
      arrivalDateTime: $('#plan-arrival').value,
      departureDateTime: $('#plan-departure').value,
      location: $('#plan-location').value,
      travelers: $('#plan-travelers').value
    });
    const shareUrl = `${url}?${params.toString()}`;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => showToast("Shareable link copied to clipboard!"))
      .catch(() => showToast("Could not copy link automatically."));
  };

  function loadSavedPlans() {
    const countEl = $('#saved-plans-count');
    const listEl = $('#saved-plans-list');
    if (!listEl) return;

    let saved = [];
    try {
      const data = localStorage.getItem('layoverx_saved_plans');
      if (data) saved = JSON.parse(data);
    } catch(e) { console.error(e); }

    if (countEl) countEl.textContent = saved.length;

    if (saved.length === 0) {
      listEl.innerHTML = `<li class="text-xs text-gray-400 text-center py-4 italic" id="no-saved-plans">No saved itineraries. Build a plan and click "Save Plan" above.</li>`;
      return;
    }

    listEl.innerHTML = '';
    saved.forEach((p, idx) => {
      const hours = ((new Date(p.departure) - new Date(p.arrival)) / 3600000).toFixed(1);
      listEl.innerHTML += `
        <li class="bg-gray-50 border border-gray-150 p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm">
          <div>
            <strong class="text-gray-900 block font-bold">${p.location.toUpperCase()} (${hours}h Layover)</strong>
            <span class="text-gray-400 text-xs">Saved on ${p.dateSaved} • ${p.cost}</span>
          </div>
          <div class="flex gap-2">
            <button onclick="layoverx.loadPlan(${idx})" class="text-sky-600 font-bold hover:underline">Load</button>
            <button onclick="layoverx.deletePlan(${idx})" class="text-red-500 font-bold hover:underline">Delete</button>
          </div>
        </li>
      `;
    });
  }

  window.layoverx.loadPlan = function(idx) {
    try {
      const data = JSON.parse(localStorage.getItem('layoverx_saved_plans'));
      const plan = data[idx];
      if (plan) {
        $('#plan-arrival').value = plan.arrival;
        $('#plan-departure').value = plan.departure;
        $('#plan-location').value = plan.location;
        $('#plan-travelers').value = plan.travelers;
        state.currentPlan = plan.details || state.currentPlan;
        
        // Restore checklists
        if (state.currentPlan.hotelId) {
          const chk = $(`#chk-hotel-${state.currentPlan.hotelId}`);
          if (chk) chk.checked = true;
        }
        if (state.currentPlan.diningId) {
          const chk = $(`#chk-dining-${state.currentPlan.diningId}`);
          if (chk) chk.checked = true;
        }
        if (state.currentPlan.activityId) {
          const chk = $(`#chk-activity-${state.currentPlan.activityId}`);
          if (chk) chk.checked = true;
        }
        
        recalculateItinerary();
        showToast("Loaded saved itinerary details!");
      }
    } catch(e) { console.error(e); }
  };

  window.layoverx.deletePlan = function(idx) {
    try {
      const data = JSON.parse(localStorage.getItem('layoverx_saved_plans'));
      data.splice(idx, 1);
      localStorage.setItem('layoverx_saved_plans', JSON.stringify(data));
      showToast("Plan deleted.");
      loadSavedPlans();
    } catch(e) { console.error(e); }
  };

  /* ===== AUTH BRIDGE TRIGGERS ===== */
  window.openAuthModal = (name) => Modal.open(name);
  window.closeAuthModal = (name) => Modal.close(name);
  Object.assign(window.layoverx, {
    openModal: (name) => Modal.open(name),
    closeModal: (name) => Modal.close(name),
    switchModal: (from, to) => { Modal.close(from); Modal.open(to); },
    logout: () => Auth.logout(),
    socialLogin: (p) => {
      showToast(`Redirecting to ${p.toUpperCase()} login...`);
      setTimeout(() => Auth.login(`${p}@layoverx.com`, "123456"), 1000);
    },
    handleLogin: (e) => {
      e.preventDefault();
      const email = $('#login-email')?.value;
      const pass = $('#login-password')?.value;
      if (email && pass) Auth.login(email, pass);
    },
    handleSignup: (e) => {
      e.preventDefault();
      const name = $('#signup-name')?.value;
      const email = $('#signup-email')?.value;
      const pass = $('#signup-password')?.value;
      if (name && email && pass) Auth.signup(name, email, pass);
    },
    handleForgot: () => {
      const email = $('#forgot-email')?.value;
      if (email) {
        showToast(`Reset code successfully sent to ${email}`);
        Modal.close('forgot');
      }
    }
  });

  /* ===== HOMEPAGE SEARCH INTEGRATION ===== */
  function initHomepageSearch() {
    const btn = $('#search-btn');
    const arrivalEl = $('#search-arrival');
    const departureEl = $('#search-departure');
    if (!btn) return;

    // Live duration calculator
    function updateDuration() {
      const a = arrivalEl?.value;
      const d = departureEl?.value;
      const durEl = $('#layover-duration');
      const validMsg = $('#validation-message');
      if (!a || !d || !durEl) return;
      const diff = new Date(d) - new Date(a);
      if (diff <= 0) {
        if (validMsg) { validMsg.textContent = '⚠️ Departure must be after arrival'; validMsg.classList.remove('hidden'); }
        durEl.textContent = '--';
        return;
      }
      if (validMsg) validMsg.classList.add('hidden');
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      durEl.textContent = `${h}h ${m}m`;
    }

    if (arrivalEl) arrivalEl.addEventListener('input', updateDuration);
    if (departureEl) departureEl.addEventListener('input', updateDuration);

    btn.addEventListener('click', () => {
      const arrival = arrivalEl?.value;
      const departure = departureEl?.value;
      const location = $('#search-location')?.value || 'near-airport';
      const travelers = $('#search-travelers')?.value || '2';
      
      if (!arrival || !departure) {
        showToast('Please enter your arrival and departure times first.');
        return;
      }
      if (new Date(departure) <= new Date(arrival)) {
        showToast('Departure time must be after arrival time.');
        return;
      }
      const params = new URLSearchParams({ arrivalDateTime: arrival, departureDateTime: departure, location, travelers });
      window.location.href = `plan-my-layover.html?${params.toString()}`;
    });
  }

  /* ===== MAIN APPLICATION BOOT STRAP ===== */
  function initServicesCarousel() {
    const carousel = $('#services-carousel');
    const prevBtn = $('#prev-service');
    const nextBtn = $('#next-service');
    if (!carousel || !prevBtn || !nextBtn) return;

    const scrollAmount = () => carousel.offsetWidth;

    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    // Optional: Hide buttons if not scrollable or update states
    const updateButtons = () => {
        prevBtn.disabled = carousel.scrollLeft <= 0;
        nextBtn.disabled = carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 10;
    };

    carousel.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }

  function init() {
    Auth.init();
    initHashRouting();
    decorateNavbar();
    decorateMobileMenu();
    initAccessibility();
    
    // Page specific setups
    initHotelsFilter();
    initDiningFilter();
    initExperiencesFilter();
    initSpaFilter();
    initGamingFilter();
    initPlanner();
    initServicesCarousel();
    loadSavedPlans();
    initHomepageSearch();

    console.log('%c LayoverX Premium Portal Activated ✈️ ', 'background:#0ea5e9;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
