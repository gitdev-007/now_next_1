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
    1: { 
      id: 1, 
      name: "Niranta Airport Transit Hotel & Lounge", 
      stars: 5, 
      rating: 4.8, 
      reviews: 2400, 
      distance: 0.0, 
      price: 3499, 
      amenities: ["24/7 Check-in", "Free WiFi", "Shower Room", "Massage Spa"], 
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop", 
      desc: "Located directly inside Terminal 2 Arrivals area. No transit visa required. Express spa, restaurant, clean sleeping pods, and shower suites.",
      coordinates: { lat: 19.0883, lng: 72.8683 },
      address: {
        full: "Terminal 2, Arrival Level, Chhatrapati Shivaji Maharaj International Airport, Mumbai 400099",
        area: "T2 Arrivals"
      },
      google_place_id: "ChIJ53zP4vXG5zsRx4YhS_Rk0Q8"
    },
    2: { 
      id: 2, 
      name: "JW Marriott Mumbai Sahar", 
      stars: 5, 
      rating: 4.7, 
      reviews: 1800, 
      distance: 1.2, 
      price: 5499, 
      amenities: ["24/7 Check-in", "Free Airport Shuttle", "Swimming Pool", "Spa & Gym"], 
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop", 
      desc: "Five-star luxury oasis next to T2. Features premium suites, resort pool, luxury wellness treatments, and complimentary terminal dropoffs.",
      coordinates: { lat: 19.1030, lng: 72.8735 },
      address: {
        full: "IA Project Road, Chhatrapati Shivaji International Airport Area, Andheri, Mumbai 400099",
        area: "Sahar"
      },
      google_place_id: "ChIJN7pUOfvG5zsREJ1_R_Yw7Z8"
    },
    3: { 
      id: 3, 
      name: "Ibis Mumbai Airport", 
      stars: 3, 
      rating: 4.2, 
      reviews: 1100, 
      distance: 0.8, 
      price: 2200, 
      amenities: ["24/7 Check-in", "Free WiFi", "Airport Shuttle", "Breakfast Buffet"], 
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop", 
      desc: "Ergonomic budget rooms situated next to the domestic terminal. Soundproof windows, all-day check-in, and convenient working desks.",
      coordinates: { lat: 19.0952, lng: 72.8529 },
      address: {
        full: "Plot No 26, Nehru Rd, Adarsh Nagar, Vile Parle East, Mumbai 400099",
        area: "Vile Parle East"
      },
      google_place_id: "ChIJR979DvfG5zsR_z1_X_Yw7Z8"
    },
    4: { 
      id: 4, 
      name: "The Orchid Hotel Mumbai Vile Parle", 
      stars: 4, 
      rating: 4.6, 
      reviews: 1500, 
      distance: 2.1, 
      price: 4500, 
      amenities: ["24/7 Check-in", "Free Airport Shuttle", "Rooftop Pool", "Green Certified"], 
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop", 
      desc: "Asia's first certified five-star ecofriendly hotel. Runway-view pool, spa, airport transportations, and delicious multiple dining options.",
      coordinates: { lat: 19.0950, lng: 72.8520 },
      address: {
        full: "Nehru Road, Adarsh Nagar, Near Mumbai Domestic Airport, Vile Parle East, Mumbai 400099",
        area: "Vile Parle East"
      },
      google_place_id: "ChIJp1eZDvfG5zsREJ1_R_Yw7Z8"
    }
  };

  const DINING = {
    1: { 
      id: 1, 
      name: "Gajalee Coastal Seafood Restaurant", 
      cuisine: "seafood", 
      rating: 4.8, 
      reviews: 940, 
      distance: 3.5, 
      price: 1800, 
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop", 
      desc: "Legendary seafood destination famous for butter garlic pepper crabs, bombil fry, stuffed pomfret, and local sol kadhi drink.",
      coordinates: { lat: 19.1022, lng: 72.8464 },
      address: {
        full: "Kadamgiri Complex, Hanuman Rd, Vile Parle East, Mumbai 400057",
        area: "Vile Parle East"
      },
      google_place_id: "ChIJv53pYvfG5zsRfMvV8H-i_3Q"
    },
    2: { 
      id: 2, 
      name: "Peshawri - ITC Maratha", 
      cuisine: "fine-dining", 
      rating: 4.9, 
      reviews: 1240, 
      distance: 1.1, 
      price: 4500, 
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop", 
      desc: "Ultra luxury traditional North-West Frontier clay-oven diner. World-famous Dal Bukhara, paneer tikka, and slow cooked lamb.",
      coordinates: { lat: 19.1028, lng: 72.8705 },
      address: {
        full: "ITC Maratha, Sahar Rd, Andheri East, Mumbai 400099",
        area: "Andheri East"
      },
      google_place_id: "ChIJuS9_R_vG5zsR-T_Lz7qU8Ww"
    },
    3: { 
      id: 3, 
      name: "Highway Gomantak", 
      cuisine: "local", 
      rating: 4.5, 
      reviews: 560, 
      distance: 2.2, 
      price: 800, 
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop", 
      desc: "An unpretentious local icon serving Konkan seafood thalis, sol kadhi, and crispy bombay duck fry.",
      coordinates: { lat: 19.0620, lng: 72.8480 },
      address: {
        full: "44/2179, Gandhi Nagar, Service Rd, Bandra East, Mumbai 400051",
        area: "Bandra East"
      },
      google_place_id: "ChIJ_U-YI_HG5zsRAw_M_7qU8Ww"
    },
    4: { 
      id: 4, 
      name: "Elco Pani Puri Center", 
      cuisine: "street-food", 
      rating: 4.4, 
      reviews: 1890, 
      distance: 4.2, 
      price: 400, 
      image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&h=400&fit=crop", 
      desc: "High-hygiene local street food. Purified mineral water golgappe, pav bhaji, ragda pattice, and fresh fruit juices.",
      coordinates: { lat: 19.0594, lng: 72.8333 },
      address: {
        full: "2/A, Elco Market, Hill Rd, Bandra West, Mumbai 400050",
        area: "Bandra West"
      },
      google_place_id: "ChIJ7T-YI_HG5zsRAw_M_7qU8Ww"
    }
  };

  const EXPERIENCES = {
    1: { 
      id: 1, 
      name: "South Mumbai Gateway Heritage Tour", 
      category: "sightseeing", 
      rating: 4.9, 
      duration: 5, 
      price: 2899, 
      image: "https://images.unsplash.com/photo-1605307066130-098b5f638948?w=600&h=400&fit=crop", 
      desc: "AC private vehicle tour visiting the Gateway of India, Queen's Necklace, Taj Mahal Palace, and Victoria Terminus.",
      coordinates: { lat: 18.9220, lng: 72.8347 },
      address: {
        full: "Apollo Bandar, Colaba, Mumbai 400001",
        area: "Colaba"
      },
      google_place_id: "ChIJW2x9_7HG5zsR_z1_X_Yw7Z8"
    },
    2: { 
      id: 2, 
      name: "Guided Bandra Street Food Trail", 
      category: "food", 
      rating: 4.8, 
      duration: 3, 
      price: 1299, 
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop", 
      desc: "Hygienic culinary walk through Bandra West. Sample local snacks, sweet rolls, seekh kebabs, and vada pav.",
      coordinates: { lat: 19.0594, lng: 72.8333 },
      address: {
        full: "Hill Road, Bandra West, Mumbai 400050",
        area: "Bandra West"
      },
      google_place_id: "ChIJ7T-YI_HG5zsRAw_M_7qU8Ww"
    },
    3: { 
      id: 3, 
      name: "Elephanta Caves Fast-Track Excursion", 
      category: "culture", 
      rating: 4.7, 
      duration: 4, 
      price: 1999, 
      image: "https://images.unsplash.com/photo-1598977123418-45f04b616a0e?w=600&h=400&fit=crop", 
      desc: "Ferry tickets and professional guides to explore the historic rock-cut cave temples on Elephanta Island.",
      coordinates: { lat: 18.9220, lng: 72.8347 },
      address: {
        full: "Gateway of India, Colaba, Mumbai 400001",
        area: "Colaba Jetty"
      },
      google_place_id: "ChIJW2x9_7HG5zsR_z1_X_Yw7Z8"
    },
    4: { 
      id: 4, 
      name: "Bazaar & Boutique Shopping Expedition", 
      category: "shopping", 
      rating: 4.6, 
      duration: 3.5, 
      price: 1500, 
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop", 
      desc: "Accompanied market tour to buy Indian cottons, silks, spices, and souvenirs with secure baggage drop back in cab.",
      coordinates: { lat: 18.9472, lng: 72.8354 },
      address: {
        full: "Mahatma Jyotiba Phule Mandai, Dhobi Talao, Mumbai 400001",
        area: "South Mumbai"
      },
      google_place_id: "ChIJu-YI_7HG5zsRAw_M_7qU8Ww"
    }
  };

  const SPA_WELLNESS = {
    1: { 
      id: 1, 
      name: "Heavenly Spa by Westin", 
      category: "massage", 
      rating: 4.9, 
      duration: 1.5, 
      price: 4500, 
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop", 
      desc: "Full-body Swedish massage, steam room access, and luxury aromatherapy in a tranquil airport-adjacent setting.",
      coordinates: { lat: 19.1020, lng: 72.8720 },
      address: {
        full: "The Westin Mumbai Sahar, Marol, Andheri East, Mumbai 400059",
        area: "Andheri East"
      },
      google_place_id: "ChIJuS9_R_vG5zsR-T_Lz7qU8Ww"
    },
    2: { 
      id: 2, 
      name: "O2 Spa - Terminal 2", 
      category: "express", 
      rating: 4.7, 
      duration: 0.5, 
      price: 1800, 
      image: "https://images.unsplash.com/photo-1611077544192-332e67500366?w=600&h=400&fit=crop", 
      desc: "Convenient express foot reflexology and head-neck-shoulder massage located right at the T2 arrivals lounge.",
      coordinates: { lat: 19.0883, lng: 72.8683 },
      address: {
        full: "T2 Arrival Level, Chhatrapati Shivaji Maharaj International Airport, Mumbai 400099",
        area: "T2 Arrivals"
      },
      google_place_id: "ChIJ53zP4vXG5zsRx4YhS_Rk0Q8"
    },
    3: { 
      id: 3, 
      name: "Six Senses Wellness Circuit", 
      category: "full-day", 
      rating: 4.8, 
      duration: 3, 
      price: 8500, 
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbece8?w=600&h=400&fit=crop", 
      desc: "Holistic wellness journey including detox juices, meditation session, deep tissue massage, and facial treatment.",
      coordinates: { lat: 19.1020, lng: 72.8720 },
      address: {
        full: "The Westin Mumbai Sahar, Marol, Andheri East, Mumbai 400059",
        area: "Andheri East"
      },
      google_place_id: "ChIJuS9_R_vG5zsR-T_Lz7qU8Ww"
    }
  };

  const GAMING_ENTERTAINMENT = {
    1: { 
      id: 1, 
      name: "Smaaash Entertainment Hub", 
      category: "gaming", 
      rating: 4.6, 
      duration: 2, 
      price: 1200, 
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop", 
      desc: "Virtual reality games, bowling, cricket simulators, and arcade fun. Perfect for high-energy transit breaks.",
      coordinates: { lat: 19.1350, lng: 72.8800 },
      address: {
        full: "R City Mall, LBS Rd, Amrut Nagar, Ghatkopar West, Mumbai 400086",
        area: "Ghatkopar West"
      },
      google_place_id: "ChIJv53pYvfG5zsRfMvV8H-i_3Q"
    },
    2: { 
      id: 2, 
      name: "PVR Directors Cut Luxury Cinema", 
      category: "movie", 
      rating: 4.9, 
      duration: 3, 
      price: 2500, 
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop", 
      desc: "Ultra-premium movie watching with recliner seats, butler service, and fine dining at the airport mall.",
      coordinates: { lat: 19.0860, lng: 72.8880 },
      address: {
        full: "Phoenix Marketcity, Kurla West, Mumbai 400070",
        area: "Kurla West"
      },
      google_place_id: "ChIJv53pYvfG5zsRfMvV8H-i_3Q"
    },
    3: { 
      id: 3, 
      name: "The Game Palacio - Casino Style Arcade", 
      category: "gaming", 
      rating: 4.7, 
      duration: 2.5, 
      price: 1800, 
      image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&h=400&fit=crop", 
      desc: "Boutique bowling, high-end retro arcade games, and mechanical bull rides with a premium lounge bar.",
      coordinates: { lat: 19.0590, lng: 72.8300 },
      address: {
        full: "Elanza, Hill Rd, Bandra West, Mumbai 400050",
        area: "Bandra West"
      },
      google_place_id: "ChIJ7T-YI_HG5zsRAw_M_7qU8Ww"
    }
  };

  /* ===== DATABASE & AUTH INTEGRATION ===== */
  function mapTripToDatabase(trip) {
    return {
      booking_id: trip.bookingId,
      uid: trip.uid,
      status: trip.status || 'confirmed',
      arrival: trip.arrival || trip.arrivalDateTime || null,
      departure: trip.departure || trip.departureDateTime || null,
      incoming_flight: trip.incomingFlight || null,
      outgoing_flight: trip.outgoingFlight || null,
      incoming_flight_delay: trip.incomingFlightDelay || 0,
      outgoing_flight_delay: trip.outgoingFlightDelay || 0,
      flight_cancelled: trip.flightCancelled || false,
      departure_gate: trip.departureGate || null,
      actual_arrival: trip.actualArrival || null,
      actual_departure: trip.actualDeparture || null,
      layover_duration: trip.layoverDuration || 0.0,
      safe_exit_window: trip.safeExitWindow || 0.0,
      experience_feasible: trip.experienceFeasible !== false,
      details: trip,
      payment_id: trip.paymentId || null,
      order_id: trip.orderId || null,
      payment_failure_reason: trip.paymentFailureReason || null,
      created_at: trip.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  function mapTripFromDatabase(row) {
    if (!row) return null;
    return row.details || {
      bookingId: row.booking_id,
      uid: row.uid,
      status: row.status,
      arrival: row.arrival,
      departure: row.departure,
      arrivalDateTime: row.arrival,
      departureDateTime: row.departure,
      incomingFlight: row.incoming_flight,
      outgoingFlight: row.outgoing_flight,
      incomingFlightDelay: row.incoming_flight_delay || 0,
      outgoingFlightDelay: row.outgoing_flight_delay || 0,
      flightCancelled: row.flight_cancelled || false,
      departureGate: row.departure_gate,
      actualArrival: row.actual_arrival,
      actualDeparture: row.actual_departure,
      layoverDuration: row.layover_duration,
      safeExitWindow: row.safe_exit_window,
      experienceFeasible: row.experience_feasible,
      details: row.details,
      paymentId: row.payment_id,
      orderId: row.order_id,
      paymentFailureReason: row.payment_failure_reason,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /* ===== AUTH ===== */
  const Auth = {
    init() {
      if (window.supabase) {
        window.supabase.auth.onAuthStateChange(async (event, session) => {
          const user = session?.user;
          if (user) {
            state.user = { 
              email: user.email, 
              name: user.user_metadata?.full_name || user.email.split('@')[0], 
              avatar: (user.user_metadata?.full_name || user.email)[0].toUpperCase(),
              uid: user.id
            };
            state.isAuthenticated = true;

            // Auto-upsert user profile to database
            try {
              await window.supabase.from("users").upsert({
                uid: user.id,
                full_name: user.user_metadata?.full_name || user.email.split('@')[0],
                email: user.email,
                created_at: new Date().toISOString()
              });
            } catch (dbError) {
              console.warn("Supabase user profile auto-upsert failed:", dbError);
            }
          } else {
            state.user = null;
            state.isAuthenticated = false;
          }
          this.updateUI();
        });
      }
    },
    async login(email, password) {
      try {
        const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Propagate login to legacy test auth framework if overridden
        if (window.layoverxAuth && typeof window.layoverxAuth.signInWithEmailAndPassword === 'function' && !window.layoverxAuth.signInWithEmailAndPassword.toString().includes('window.supabase')) {
          try {
            await window.layoverxAuth.signInWithEmailAndPassword(email, password);
          } catch(e) { console.warn("Firebase compatibility auth login bridge failed:", e); }
        }

        Modal.closeAll();
        showToast(`Welcome back!`, 'success');
      } catch (error) {
        console.error("Login Error:", error);
        let msg = error.message || 'Invalid email or password.';
        showToast(msg, 'error');
        throw error;
      }
    },
    async signup(name, email, password) {
      try {
        const { data, error } = await window.supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name
            }
          }
        });
        if (error) throw error;
        const user = data.user;
        
        // Save user profile to Supabase users table
        const { error: dbError } = await window.supabase.from("users").upsert({
          uid: user.id,
          full_name: name,
          email: email,
          created_at: new Date().toISOString()
        });
        if (dbError) throw dbError;
        
        // Propagate signup to legacy test auth framework if overridden
        if (window.layoverxAuth && typeof window.layoverxAuth.createUserWithEmailAndPassword === 'function' && !window.layoverxAuth.createUserWithEmailAndPassword.toString().includes('window.supabase')) {
          try {
            await window.layoverxAuth.createUserWithEmailAndPassword(email, password);
          } catch(e) { console.warn("Firebase compatibility auth signup bridge failed:", e); }
        }

        Modal.closeAll();
        showToast(`Account created! Welcome, ${name}.`, 'success');
      } catch (error) {
        console.error("Signup Error:", error);
        showToast(error.message || 'Signup failed', 'error');
        throw error;
      }
    },
    async logout() {
      try {
        const { error } = await window.supabase.auth.signOut();
        if (error) throw error;

        // Propagate logout to legacy test auth framework if overridden
        if (window.layoverxAuth && typeof window.layoverxAuth.signOut === 'function' && !window.layoverxAuth.signOut.toString().includes('window.supabase')) {
          try {
            await window.layoverxAuth.signOut();
          } catch(e) { console.warn("Firebase compatibility auth logout bridge failed:", e); }
        }

        showToast("Signed out successfully.", 'info');
        setTimeout(() => window.location.reload(), 800);
      } catch (error) {
        console.error("Logout Error:", error);
        showToast(`Logout failed: ${error.message}`, 'error');
      }
    },
    updateUI() {
      const isAuth = state.isAuthenticated;
      $$('.auth-guest').forEach((el) => el.style.display = isAuth ? 'none' : 'flex');
      $$('.auth-user').forEach((el) => el.style.display = isAuth ? 'flex' : 'none');
      $$('.user-name').forEach((el) => el.textContent = state.user?.name || '');
      $$('.user-avatar-letter').forEach((el) => el.textContent = state.user?.avatar || 'U');
      $$('.user-email-display').forEach((el) => el.textContent = state.user?.email || 'traveler@layoverx.com');
    }
  };

  /* ===== MODALS ===== */
  const Modal = {
    open(name) {
      const modal = $(`#modal-${name}`);
      if (!modal) return;

      if (name === 'trip-context') {
        try {
          const saved = JSON.parse(localStorage.getItem('layoverx_search_params'));
          if (saved) {
            const locInput = $('#context-location');
            const arrInput = $('#context-arrival');
            const depInput = $('#context-departure');
            const travInput = $('#context-travelers');
            if (locInput) locInput.value = saved.location || 'near-airport';
            if (arrInput) arrInput.value = saved.arrivalDateTime || '';
            if (depInput) depInput.value = saved.departureDateTime || '';
            if (travInput) travInput.value = saved.travelers || '2';
            
            // Also update context duration display instantly
            const disp = $('#context-duration-display');
            const msg = $('#context-validation-message');
            const btn = $('#btn-context-submit');
            if (saved.arrivalDateTime && saved.departureDateTime) {
              const diff = new Date(saved.departureDateTime) - new Date(saved.arrivalDateTime);
              if (diff > 0) {
                const hours = diff / (1000 * 60 * 60);
                if (disp) disp.textContent = `${hours.toFixed(1)}h`;
                if (msg) msg.classList.add('hidden');
                if (btn) btn.disabled = false;
              } else {
                if (disp) disp.textContent = '--';
                if (msg) {
                  msg.textContent = '⚠️ Departure must be after arrival.';
                  msg.classList.remove('hidden');
                }
                if (btn) btn.disabled = true;
              }
            }
          }
        } catch(e) { console.error(e); }
      }

      modal.classList.remove('hidden');
      // trigger reflow
      void modal.offsetWidth;
      modal.classList.add('flex', 'opacity-100');
      const content = modal.querySelector('.modal-content');
      if (content) content.classList.add('scale-100');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const focusable = modal.querySelectorAll('input:not([type="hidden"]), button:not(.modal-close)');
        if (focusable.length) focusable[0].focus();
      }, 100);
    },
    close(name) {
      const modal = $(`#modal-${name}`);
      if (!modal) return;
      modal.classList.remove('opacity-100');
      const content = modal.querySelector('.modal-content');
      if (content) content.classList.remove('scale-100');
      
      setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        const anyOpen = Array.from(document.querySelectorAll('.modal-overlay')).some(el => el.classList.contains('flex'));
        if (!anyOpen) document.body.style.overflow = '';
      }, 300); // match transition duration
    },
    closeAll() {
      $$('.modal-overlay').forEach((modal) => {
        modal.classList.remove('opacity-100');
        const content = modal.querySelector('.modal-content');
        if (content) content.classList.remove('scale-100');
        setTimeout(() => {
          modal.classList.remove('flex');
          modal.classList.add('hidden');
        }, 300);
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
  window.layoverx.showToast = function(msg, type = 'info') {
    let container = $('#toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="w-5 h-5 toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg class="w-5 h-5 toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    } else {
      iconSvg = '<svg class="w-5 h-5 toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${msg}</span>`;
    container.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('toast-show'));

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };
  const showToast = window.layoverx.showToast;
  window.showToast = showToast;

  /* ===== NAVBAR DECORATOR ===== */
  function decorateNavbar() {
    const navbar = $('#navbar');
    const logoText = $('#logo-text');
    const menuBtn = $('#menu-btn');
    if (!navbar) return;
    
    // Check if page has a dark hero section or layout
    const hasHero = document.querySelector('#hero-section') || document.querySelector('.theme-hero');
    
    function handleScroll() {
      // If no hero section exists, always use the scrolled/opaque style
      const scrolled = window.scrollY > 40 || !hasHero;
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

  /* ===== USER MENU DROPDOWN ===== */
  function decorateUserDropdown() {
    document.addEventListener('click', (e) => {
      const btn = document.getElementById('user-menu-btn');
      const dropdown = document.getElementById('user-profile-dropdown');
      const arrow = document.getElementById('user-menu-arrow');
      if (!btn || !dropdown) return;
      
      const clickedBtn = e.target.closest('#user-menu-btn');
      const clickedDropdown = e.target.closest('#user-profile-dropdown');
      
      if (clickedBtn) {
        dropdown.classList.toggle('hidden');
        const visible = !dropdown.classList.contains('hidden');
        btn.setAttribute('aria-expanded', visible);
        if (arrow) arrow.style.transform = visible ? 'rotate(180deg)' : 'rotate(0deg)';
      } else if (!clickedDropdown) {
        dropdown.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    });
  }

  /* ===== KEYBOARD NAVIGATION AND TAB ACCESS ===== */
  function initAccessibility() {
    // Esc key closing modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') Modal.closeAll();
    });

    // Close modal on close button click or overlay click (outside modal content)
    document.addEventListener('click', (e) => {
      // If click target is overlay
      if (e.target.classList.contains('modal-overlay')) {
        Modal.closeAll();
        return;
      }
      // If click target is close button or inside it
      const closeBtn = e.target.closest('.modal-close');
      if (closeBtn) {
        Modal.closeAll();
      }
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

      // Search values
      const selectedArea = $('#hotel-location')?.value || 'all';
      const durationVal = parseInt($('#hotel-duration')?.value || '6');

      // Price multiplier definition
      let multiplier = 1.0;
      if (durationVal === 3) multiplier = 0.6;
      if (durationVal === 6) multiplier = 1.0;
      if (durationVal === 12) multiplier = 1.5;
      if (durationVal === 24) multiplier = 2.2;

      const items = $$('.hotel-item');
      let visibleCount = 0;

      items.forEach(item => {
        const basePrice = parseInt(item.getAttribute('data-price'));
        const price = Math.round(basePrice * multiplier);
        const distance = parseFloat(item.getAttribute('data-distance'));
        const itemStars = item.getAttribute('data-stars');
        const itemAmenities = item.getAttribute('data-amenities').split(',');
        const itemLocation = item.getAttribute('data-location');

        // Update card price displays
        const priceDisplay = item.querySelector('.hotel-price-display');
        if (priceDisplay) {
          priceDisplay.textContent = `₹${price.toLocaleString()}`;
        }
        const durationLabel = item.querySelector('.hotel-duration-label');
        if (durationLabel) {
          durationLabel.textContent = durationVal === 24 ? 'Overnight stay' : `Day-Use (${durationVal}h slot)`;
        }

        // Apply filters
        let matchArea = selectedArea === 'all' || itemLocation === selectedArea;

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

        if (matchArea && matchPrice && matchDistance && matchStars && matchAmenity) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });

      const countEl = $('#hotel-count');
      if (countEl) countEl.textContent = visibleCount;
      const emptyEl = $('#hotel-empty');
      if (emptyEl) emptyEl.classList.toggle('hidden', visibleCount > 0);
    }

    // Handle Search Form Submission
    const searchForm = $('#hotel-search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate check-in date
        const checkinVal = $('#hotel-checkin').value;
        const errorEl = $('#hotel-checkin-error');
        
        if (checkinVal) {
          const checkinDate = new Date(checkinVal);
          const now = new Date();
          if (checkinDate.getTime() < now.getTime() - 60000) {
            if (errorEl) {
              errorEl.classList.remove('hidden');
              errorEl.textContent = 'Check-in date cannot be in the past';
            }
            showToast('Error: Check-in date cannot be in the past');
            return;
          }
        }
        
        if (errorEl) errorEl.classList.add('hidden');
        
        // Simulated loading state
        const skeleton = $('#hotel-skeleton');
        const emptyState = $('#hotel-empty');
        if (skeleton) skeleton.classList.remove('hidden');
        if (list) list.classList.add('hidden');
        if (emptyState) emptyState.classList.add('hidden');
        
        setTimeout(() => {
          applyFilters();
          if (skeleton) skeleton.classList.add('hidden');
          if (list) list.classList.remove('hidden');
        }, 600);
      });
    }

    $$('input[name^="filter-"]').forEach(el => {
      el.addEventListener('change', applyFilters);
    });

    on($('#clear-filters'), 'click', () => {
      $$('input[name^="filter-"]').forEach(el => el.checked = false);
      const locSelect = $('#hotel-location');
      const durSelect = $('#hotel-duration');
      if (locSelect) locSelect.value = 'all';
      if (durSelect) durSelect.value = '6';
      applyFilters();
    });

    // Also expose as global for the empty state "Reset Filters" button
    window.layoverx.resetFilters = function() {
      $$('input[name^="filter-"]').forEach(el => el.checked = false);
      const locSelect = $('#hotel-location');
      const durSelect = $('#hotel-duration');
      if (locSelect) locSelect.value = 'all';
      if (durSelect) durSelect.value = '6';
      applyFilters();
    };

    on($('#hotel-sort'), 'change', function() {
      const order = this.value;
      const container = $('#hotel-list');
      const items = Array.from($$('.hotel-item'));
      const durationVal = parseInt($('#hotel-duration')?.value || '6');
      
      let multiplier = 1.0;
      if (durationVal === 3) multiplier = 0.6;
      if (durationVal === 6) multiplier = 1.0;
      if (durationVal === 12) multiplier = 1.5;
      if (durationVal === 24) multiplier = 2.2;
      
      items.sort((a, b) => {
        if (order === 'price-low') {
          return Math.round(parseInt(a.getAttribute('data-price')) * multiplier) - Math.round(parseInt(b.getAttribute('data-price')) * multiplier);
        }
        if (order === 'price-high') {
          return Math.round(parseInt(b.getAttribute('data-price')) * multiplier) - Math.round(parseInt(a.getAttribute('data-price')) * multiplier);
        }
        if (order === 'rating') return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
        if (order === 'distance') return parseFloat(a.getAttribute('data-distance')) - parseFloat(b.getAttribute('data-distance'));
        return 0;
      });

      items.forEach(el => container.appendChild(el));
    });

    // Initialize hotel count to match actual visible items
    applyFilters();
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
      const durations = Array.from($$('input[name="spa-duration"]:checked')).map(el => el.value);
      const items = $$('.spa-item');
      let visibleCount = 0;
      
      items.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        const duration = parseFloat(item.getAttribute('data-duration'));
        
        let matchCat = selectedCat === 'all' || itemCat === selectedCat;
        
        let matchDuration = durations.length === 0;
        durations.forEach(val => {
          if (val === 'under-1h' && duration < 1.0) matchDuration = true;
          if (val === '1-2h' && duration >= 1.0 && duration <= 2.0) matchDuration = true;
          if (val === 'above-2h' && duration > 2.0) matchDuration = true;
        });

        if (matchCat && matchDuration) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });
      $('#spa-empty').classList.toggle('hidden', visibleCount > 0);
    }

    $$('input[name="spa-duration"]').forEach(el => {
      el.addEventListener('change', applySpaFilters);
    });

    window.layoverx.clearSpaFilters = function() {
      $$('input[name="spa-duration"]').forEach(el => el.checked = false);
      window.layoverx.filterSpa('all');
    };
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
      const intensities = Array.from($$('input[name="gaming-intensity"]:checked')).map(el => el.value);
      const items = $$('.gaming-item');
      let visibleCount = 0;
      
      items.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        
        let matchCat = selectedCat === 'all' || itemCat === selectedCat;
        
        let matchIntensity = intensities.length === 0;
        intensities.forEach(val => {
          if (val === 'high' && itemCat === 'gaming') matchIntensity = true;
          if (val === 'low' && itemCat === 'movie') matchIntensity = true;
        });

        if (matchCat && matchIntensity) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });
      $('#gaming-empty').classList.toggle('hidden', visibleCount > 0);
    }

    $$('input[name="gaming-intensity"]').forEach(el => {
      el.addEventListener('change', applyGamingFilters);
    });

    window.layoverx.clearGamingFilters = function() {
      $$('input[name="gaming-intensity"]').forEach(el => el.checked = false);
      window.layoverx.filterGaming('all');
    };
  }

  // Transfers/Cab filter
  function initTransfersFilter() {
    const list = $('#cab-list');
    if (!list) return;

    function applyCabFilters() {
      const types = Array.from($$('input[name="cab-type"]:checked')).map(el => el.value);
      const capacities = Array.from($$('input[name="cab-capacity"]:checked')).map(el => el.value);
      const items = $$('.cab-item');
      let visibleCount = 0;

      items.forEach(item => {
        const itemType = item.getAttribute('data-type');
        const itemCapacity = item.getAttribute('data-capacity');

        let matchType = types.length === 0 || types.includes(itemType);
        let matchCapacity = capacities.length === 0 || capacities.includes(itemCapacity);

        if (matchType && matchCapacity) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });

      const emptyEl = $('#cab-empty');
      if (emptyEl) emptyEl.classList.toggle('hidden', visibleCount > 0);
    }

    $$('input[name="cab-type"], input[name="cab-capacity"]').forEach(el => {
      el.addEventListener('change', applyCabFilters);
    });

    window.layoverx.clearCabFilters = function() {
      $$('input[name="cab-type"], input[name="cab-capacity"]').forEach(el => el.checked = false);
      applyCabFilters();
    };

    // Form validation and loading
    const form = $('#transfer-search-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const cabTimeVal = $('#cab-time')?.value;
        if (cabTimeVal) {
          const cabTime = new Date(cabTimeVal);
          const now = new Date();
          if (cabTime.getTime() < now.getTime() - 60000) {
            showToast('Error: Pickup date/time cannot be in the past');
            return;
          }
        }
        showToast('Searching for verified airport transfer vehicles...');
        applyCabFilters();
      });
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
      window.layoverx.openHotelBooking(id);
      window.layoverx.closeHotelDetail();
    };
    
    Modal.open('hotel-detail');
  };
  window.layoverx.closeHotelDetail = function() {
    Modal.close('hotel-detail');
  };
  window.layoverx.bookHotel = function(id) {
    window.layoverx.openHotelBooking(id);
  };

  window.layoverx.openHotelBooking = function(id) {
    const h = HOTELS[id];
    if (!h) return;
    
    const durationVal = parseInt($('#hotel-duration')?.value || '6');
    let multiplier = 1.0;
    if (durationVal === 3) multiplier = 0.6;
    if (durationVal === 6) multiplier = 1.0;
    if (durationVal === 12) multiplier = 1.5;
    if (durationVal === 24) multiplier = 2.2;
    
    const basePrice = h.price;
    const standardPrice = Math.round(basePrice * multiplier * 0.6);
    const premiumPrice = Math.round(basePrice * multiplier);
    
    // Set text in modal
    const nameEl = $('#booking-hotel-name');
    const durEl = $('#booking-hotel-duration');
    const priceStdEl = $('#booking-price-standard');
    const pricePremEl = $('#booking-price-premium');
    
    if (nameEl) nameEl.textContent = h.name;
    if (durEl) durEl.textContent = durationVal === 24 ? 'Overnight' : `${durationVal} Hours`;
    if (priceStdEl) priceStdEl.textContent = `₹${standardPrice.toLocaleString()}`;
    if (pricePremEl) pricePremEl.textContent = `₹${premiumPrice.toLocaleString()}`;
    
    // Store active booking data in modal context
    const bookingForm = $('#hotel-booking-form');
    if (bookingForm) {
      bookingForm.dataset.hotelId = id;
      bookingForm.dataset.hotelName = h.name;
      bookingForm.dataset.duration = durationVal === 24 ? 'Overnight' : `${durationVal} Hours`;
      bookingForm.dataset.standardPrice = standardPrice;
      bookingForm.dataset.premiumPrice = premiumPrice;
      bookingForm.reset();
    }
    
    const formSlide = $('#hotel-booking-form-slide');
    const successSlide = $('#hotel-booking-success-slide');
    if (formSlide) formSlide.classList.remove('hidden');
    if (successSlide) successSlide.classList.add('hidden');
    
    Modal.open('hotel-booking');
  };
  
  window.layoverx.closeHotelBooking = function() {
    Modal.close('hotel-booking');
  };
  
  window.layoverx.confirmHotelBooking = function(e) {
    e.preventDefault();
    
    const form = $('#hotel-booking-form');
    if (!form) return;
    
    const hotelId = form.dataset.hotelId;
    const hotelName = form.dataset.hotelName;
    const duration = form.dataset.duration;
    
    const checkedRoom = form.querySelector('input[name="hotel-room-type"]:checked');
    const roomTypeVal = checkedRoom ? checkedRoom.value : 'standard';
    const price = roomTypeVal === 'standard' ? form.dataset.standardPrice : form.dataset.premiumPrice;
    const roomTypeLabel = roomTypeVal === 'standard' ? 'Standard Pod / Cabin' : 'Premium Double Suite';
    
    const refCode = `LHX-${Math.floor(Math.random() * 90000 + 10000)}-MUM`;
    
    // Populate success screen fields
    const successRef = $('#success-booking-ref');
    const successName = $('#success-hotel-name');
    const successType = $('#success-room-type');
    const successCheckin = $('#success-checkin-time');
    const successDurCost = $('#success-duration-cost');
    
    if (successRef) successRef.textContent = refCode;
    if (successName) successName.textContent = hotelName;
    if (successType) successType.textContent = roomTypeLabel;
    
    const checkinTimeInput = $('#hotel-checkin')?.value;
    const checkinLabel = checkinTimeInput ? new Date(checkinTimeInput).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Immediate (flexible)';
    if (successCheckin) successCheckin.textContent = checkinLabel;
    if (successDurCost) successDurCost.textContent = `${duration} - ₹${parseInt(price).toLocaleString()}`;
    
    // Transition slides
    const formSlide = $('#hotel-booking-form-slide');
    const successSlide = $('#hotel-booking-success-slide');
    if (formSlide) formSlide.classList.add('hidden');
    if (successSlide) successSlide.classList.remove('hidden');
    
    showToast(`Transit Room booked successfully! Ref: ${refCode}`);
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
  // Helper to add or replace single-select items in state
  function setSingleSelectItineraryItem(type, id, duration) {
    if (!state.currentPlan.items) state.currentPlan.items = [];
    state.currentPlan.items = state.currentPlan.items.filter(item => item.type !== type);
    if (id !== null) {
      state.currentPlan.items.push({ type, id, duration });
    }
    recalculateItinerary();
  }

  // Reorder, remove and edit timing event listeners exposed globally
  window.layoverx.moveItineraryItem = function(idx, direction) {
    const items = state.currentPlan.items || [];
    if (direction === 'up' && idx > 0) {
      const temp = items[idx];
      items[idx] = items[idx - 1];
      items[idx - 1] = temp;
    } else if (direction === 'down' && idx < items.length - 1) {
      const temp = items[idx];
      items[idx] = items[idx + 1];
      items[idx + 1] = temp;
    }
    recalculateItinerary();
  };

  window.layoverx.removeItineraryItem = function(idx) {
    const items = state.currentPlan.items || [];
    const item = items[idx];
    if (item) {
      // Uncheck corresponding checkbox
      let chk = null;
      if (item.type === 'hotel') chk = $(`#chk-hotel-${item.id}`);
      if (item.type === 'dining') chk = $(`#chk-dining-${item.id}`);
      if (item.type === 'activity') chk = $(`#chk-activity-${item.id}`);
      if (item.type === 'spa') chk = $(`#chk-spa-${item.id}`);
      if (item.type === 'gaming') chk = $(`#chk-gaming-${item.id}`);
      if (chk) chk.checked = false;

      // Reset fallback IDs
      if (item.type === 'hotel') state.currentPlan.hotelId = null;
      if (item.type === 'dining') state.currentPlan.diningId = null;
      if (item.type === 'spa') state.currentPlan.spaId = null;
      if (item.type === 'gaming') state.currentPlan.gamingId = null;
      if (item.type === 'activity') {
        const remaining = items.filter(x => x.type === 'activity' && x.id !== item.id);
        state.currentPlan.activityId = remaining.length > 0 ? remaining[0].id : null;
      }

      // Remove from array
      items.splice(idx, 1);
    }
    recalculateItinerary();
  };

  window.layoverx.updateItemDuration = function(idx, duration) {
    const items = state.currentPlan.items || [];
    if (items[idx]) {
      items[idx].duration = parseFloat(duration);
    }
    recalculateItinerary();
  };

  function initPlanner() {
    const form = $('#planner-form');
    if (!form) return;

    // Load URL params if any
    const params = new URLSearchParams(window.location.search);
    let landing = params.get('arrivalDateTime');
    let boarding = params.get('departureDateTime');
    let loc = params.get('location');
    let travelers = params.get('travelers');

    // Fallback to localStorage
    if (!landing || !boarding || !loc || !travelers) {
      try {
        const saved = JSON.parse(localStorage.getItem('layoverx_search_params'));
        if (saved) {
          landing = landing || saved.arrivalDateTime;
          boarding = boarding || saved.departureDateTime;
          loc = loc || saved.location;
          travelers = travelers || saved.travelers;
        }
      } catch(e) { console.error(e); }
    }

    // Default dates
    const now = new Date();
    const sixh = new Date(now.getTime() + 6*60*60*1000);
    
    $('#plan-arrival').value = landing || toLocalISO(now);
    $('#plan-departure').value = boarding || toLocalISO(sixh);
    if (loc) $('#plan-location').value = loc;
    if (travelers) $('#plan-travelers').value = travelers;

    // Save planner search criteria to localStorage
    const savePlannerParams = () => {
      const arr = $('#plan-arrival').value;
      const dep = $('#plan-departure').value;
      const l = $('#plan-location').value;
      const t = $('#plan-travelers').value;
      const hours = (new Date(dep) - new Date(arr)) / 3600000;
      try {
        localStorage.setItem('layoverx_search_params', JSON.stringify({
          arrivalDateTime: arr,
          departureDateTime: dep,
          location: l,
          travelers: t,
          layoverDuration: hours
        }));
      } catch(e) { console.error(e); }
    };

    // Setup bindings
    $$('#plan-hotels-options input[type="checkbox"]').forEach((el, index) => {
      el.addEventListener('change', () => {
        const id = index + 1;
        if (el.checked) {
          $$('#plan-hotels-options input[type="checkbox"]').forEach(c => { if(c!==el) c.checked = false });
          state.currentPlan.hotelId = id;
          setSingleSelectItineraryItem('hotel', id, 6.0); // default stay duration: 6h
        } else {
          state.currentPlan.hotelId = null;
          setSingleSelectItineraryItem('hotel', null);
        }
      });
    });

    $$('#plan-dining-options input[type="checkbox"]').forEach((el, index) => {
      el.addEventListener('change', () => {
        const id = index + 1;
        if (el.checked) {
          $$('#plan-dining-options input[type="checkbox"]').forEach(c => { if(c!==el) c.checked = false });
          state.currentPlan.diningId = id;
          setSingleSelectItineraryItem('dining', id, 1.5); // default dining: 1.5h
        } else {
          state.currentPlan.diningId = null;
          setSingleSelectItineraryItem('dining', null);
        }
      });
    });

    $$('#plan-activities-options input[type="checkbox"]').forEach((el, index) => {
      el.addEventListener('change', () => {
        const id = index + 1;
        const e = EXPERIENCES[id];
        if (el.checked) {
          if (!state.currentPlan.items) state.currentPlan.items = [];
          if (!state.currentPlan.items.some(x => x.type === 'activity' && x.id === id)) {
            state.currentPlan.items.push({ type: 'activity', id, duration: e ? e.duration : 3.0 });
          }
          state.currentPlan.activityId = id;
        } else {
          if (state.currentPlan.items) {
            state.currentPlan.items = state.currentPlan.items.filter(x => !(x.type === 'activity' && x.id === id));
          }
          const remaining = (state.currentPlan.items || []).filter(x => x.type === 'activity');
          state.currentPlan.activityId = remaining.length > 0 ? remaining[0].id : null;
        }
        recalculateItinerary();
      });
    });

    $$('#plan-spa-options input[type="checkbox"]').forEach((el, index) => {
      el.addEventListener('change', () => {
        const id = index + 1;
        const s = SPA_WELLNESS[id];
        if (el.checked) {
          $$('#plan-spa-options input[type="checkbox"]').forEach(c => { if(c!==el) c.checked = false });
          state.currentPlan.spaId = id;
          setSingleSelectItineraryItem('spa', id, s ? s.duration : 1.0);
        } else {
          state.currentPlan.spaId = null;
          setSingleSelectItineraryItem('spa', null);
        }
      });
    });

    $$('#plan-gaming-options input[type="checkbox"]').forEach((el, index) => {
      el.addEventListener('change', () => {
        const id = index + 1;
        const g = GAMING_ENTERTAINMENT[id];
        if (el.checked) {
          $$('#plan-gaming-options input[type="checkbox"]').forEach(c => { if(c!==el) c.checked = false });
          state.currentPlan.gamingId = id;
          setSingleSelectItineraryItem('gaming', id, g ? g.duration : 2.0);
        } else {
          state.currentPlan.gamingId = null;
          setSingleSelectItineraryItem('gaming', null);
        }
      });
    });

    $$('input[name="plan-cab"]').forEach(el => {
      el.addEventListener('change', () => {
        state.currentPlan.cabType = el.value;
        recalculateItinerary();
      });
    });

    on($('#plan-arrival'), 'input', () => { savePlannerParams(); recalculateItinerary(); });
    on($('#plan-departure'), 'input', () => { savePlannerParams(); recalculateItinerary(); });
    on($('#plan-location'), 'change', () => { savePlannerParams(); recalculateItinerary(); });
    on($('#plan-travelers'), 'change', () => { savePlannerParams(); recalculateItinerary(); });

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
    
    const travelersCount = parseInt($('#plan-travelers').value) || 2;
    $('#travelers-badge').textContent = `${travelersCount} ${travelersCount === 1 ? 'Guest' : 'Guests'}`;

    // Read selected entities
    const cab = $('input[name="plan-cab"]:checked')?.value || 'sedan';
    const items = state.currentPlan.items || [];

    let total = 0;
    const summaryList = $('#summary-items-list');
    const timelineList = $('#timeline-list');
    
    if (summaryList) summaryList.innerHTML = '';
    if (timelineList) timelineList.innerHTML = '';

    // 1. Cab pricing
    const cabPrice = cab === 'suv' ? 1499 : 899;
    total += cabPrice;
    if (summaryList) {
      summaryList.innerHTML += `
        <li class="flex items-start justify-between gap-4">
          <span class="flex items-center gap-2"><span class="text-base">🚖</span> Airport Cabs (Return)</span>
          <strong class="font-bold text-gray-900 flex-shrink-0">₹${cabPrice}</strong>
        </li>`;
    }

    // 2. Loop over currentPlan.items for pricing
    items.forEach(item => {
      if (item.type === 'hotel') {
        const hPrice = HOTELS[item.id].price;
        total += hPrice;
        if (summaryList) {
          summaryList.innerHTML += `
            <li class="flex items-start justify-between gap-4">
              <span class="flex items-center gap-2"><span class="text-base">🏨</span> Transit Room (${HOTELS[item.id].name.split(' ')[0]})</span>
              <strong class="font-bold text-gray-900 flex-shrink-0">₹${hPrice}</strong>
            </li>`;
        }
      } else if (item.type === 'dining') {
        const dPrice = DINING[item.id].price;
        total += dPrice;
        if (summaryList) {
          summaryList.innerHTML += `
            <li class="flex items-start justify-between gap-4">
              <span class="flex items-center gap-2"><span class="text-base">🍽️</span> Table (${DINING[item.id].name.split(' ')[0]})</span>
              <strong class="font-bold text-gray-900 flex-shrink-0">₹${dPrice}</strong>
            </li>`;
        }
      } else if (item.type === 'activity') {
        const aPrice = EXPERIENCES[item.id].price * travelersCount;
        total += aPrice;
        if (summaryList) {
          summaryList.innerHTML += `
            <li class="flex items-start justify-between gap-4">
              <span class="flex items-center gap-2"><span class="text-base">📸</span> Tours (${EXPERIENCES[item.id].name.slice(0, 12)}...)</span>
              <strong class="font-bold text-gray-900 flex-shrink-0">₹${aPrice}</strong>
            </li>`;
        }
      } else if (item.type === 'spa') {
        const sPrice = SPA_WELLNESS[item.id].price * travelersCount;
        total += sPrice;
        if (summaryList) {
          summaryList.innerHTML += `
            <li class="flex items-start justify-between gap-4">
              <span class="flex items-center gap-2"><span class="text-base">💆</span> Spa (${SPA_WELLNESS[item.id].name.split(' ')[0]})</span>
              <strong class="font-bold text-gray-900 flex-shrink-0">₹${sPrice}</strong>
            </li>`;
        }
      } else if (item.type === 'gaming') {
        const gPrice = GAMING_ENTERTAINMENT[item.id].price * travelersCount;
        total += gPrice;
        if (summaryList) {
          summaryList.innerHTML += `
            <li class="flex items-start justify-between gap-4">
              <span class="flex items-center gap-2"><span class="text-base">🎮</span> Gaming (${GAMING_ENTERTAINMENT[item.id].name.split(' ')[0]})</span>
              <strong class="font-bold text-gray-900 flex-shrink-0">₹${gPrice}</strong>
            </li>`;
        }
      }
    });

    const totalCostEl = $('#total-cost');
    if (totalCostEl) totalCostEl.textContent = `₹${total.toLocaleString()}`;

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

    // Node 3: Custom selected items (ordered dynamically)
    items.forEach((item, idx) => {
      let color = "sky";
      let icon = "🎯";
      let text = "";
      let desc = "";
      let priceText = "";

      if (item.type === 'hotel') {
        const h = HOTELS[item.id];
        color = "emerald";
        icon = "🏨";
        text = `Stay: ${h.name}`;
        desc = `Day-use room slot. Showers & amenities included.`;
        priceText = `₹${h.price}`;
      } else if (item.type === 'dining') {
        const r = DINING[item.id];
        color = "emerald";
        icon = "🍽️";
        text = `Dining: ${r.name}`;
        desc = `Table reserved. Enjoy local culinary delights.`;
        priceText = `₹${r.price}`;
      } else if (item.type === 'activity') {
        const e = EXPERIENCES[item.id];
        color = "amber";
        icon = "📸";
        text = `Tour: ${e.name}`;
        desc = `Guided city sightseeing optimized for layovers.`;
        priceText = `₹${e.price * travelersCount} (${travelersCount} Guests)`;
      } else if (item.type === 'spa') {
        const s = SPA_WELLNESS[item.id];
        color = "sky";
        icon = "💆";
        text = `Spa: ${s.name}`;
        desc = `Relaxing express massage treatment.`;
        priceText = `₹${s.price * travelersCount} (${travelersCount} Guests)`;
      } else if (item.type === 'gaming') {
        const g = GAMING_ENTERTAINMENT[item.id];
        color = "purple";
        icon = "🎮";
        text = `Entertainment: ${g.name}`;
        desc = `High-energy VR and arcade gaming break.`;
        priceText = `₹${g.price * travelersCount} (${travelersCount} Guests)`;
      }

      addTimelineNodeWithControls(idx, formatTime(current), text, desc, color, icon, priceText, item.duration, item.type, items.length);
      current = new Date(current.getTime() + item.duration * 60 * 60 * 1000);
    });

    // Node 4: Return Cab
    const returnCabTime = new Date(dep.getTime() - 2 * 60 * 60 * 1000); // boarding - 2h
    addTimelineNode(formatTime(returnCabTime), "🚖 Airport Dropoff", "Driver drops you directly at departure ramp T2.", "sky");

    // Node 5: Takeoff
    addTimelineNode(formatTime(dep), "🛫 Takeoff & Departure", "Security cleared. Boarding at assigned gate. Safe travels!", "red");

    // Dynamic warning if total hours exceed safe exit hours
    let selectedDuration = 0;
    items.forEach(item => {
      selectedDuration += item.duration;
    });

    const durationWarningEl = $('#timeline-warning');
    if (selectedDuration > safeWindow) {
      if (!durationWarningEl) {
        const warning = document.createElement('div');
        warning.id = 'timeline-warning';
        warning.className = 'bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl mb-4 font-semibold flex items-center gap-2 animate-pulse';
        warning.innerHTML = `
          <span>⚠️ Total activities duration (${selectedDuration.toFixed(1)}h) exceeds safe layover exit window (${safeWindow.toFixed(1)}h). Please remove some items or reduce timings.</span>
        `;
        if (timelineList) timelineList.parentNode.insertBefore(warning, timelineList);
      } else {
        durationWarningEl.innerHTML = `<span>⚠️ Total activities duration (${selectedDuration.toFixed(1)}h) exceeds safe layover exit window (${safeWindow.toFixed(1)}h). Please remove some items or reduce timings.</span>`;
        durationWarningEl.classList.remove('hidden');
      }
    } else {
      if (durationWarningEl) durationWarningEl.classList.add('hidden');
    }
  }

  function addTimelineNode(time, title, desc, color) {
    const list = $('#timeline-list');
    if (!list) return;

    let colorClass = "bg-sky-500";
    if (color === "emerald") colorClass = "bg-emerald-500";
    if (color === "amber") colorClass = "bg-amber-500";
    if (color === "red") colorClass = "bg-red-500";

    list.innerHTML += `
      <div class="relative bg-gray-50 border border-dashed border-gray-200 p-4 rounded-xl">
        <div class="absolute -left-[32px] top-4 w-4 h-4 rounded-full ${colorClass} border-2 border-white shadow-sm"></div>
        <strong class="text-gray-900 block text-xs sm:text-sm font-extrabold">${time} • ${title}</strong>
        <p class="text-gray-500 text-xs mt-0.5 leading-relaxed">${desc}</p>
      </div>
    `;
  }

  function addTimelineNodeWithControls(idx, time, title, desc, color, icon, priceText, durationVal, itemType, totalItems) {
    const list = $('#timeline-list');
    if (!list) return;

    let colorClass = "bg-sky-500";
    if (color === "emerald") colorClass = "bg-emerald-500";
    if (color === "amber") colorClass = "bg-amber-500";
    if (color === "purple") colorClass = "bg-purple-500";

    // Generate duration options
    let durationOptionsHtml = '';
    if (itemType === 'hotel') {
      const opts = [3, 6, 12];
      durationOptionsHtml = opts.map(o => `<option value="${o}" ${durationVal === o ? 'selected' : ''}>${o} Hours stay</option>`).join('');
    } else if (itemType === 'dining') {
      const opts = [1, 1.5, 2];
      durationOptionsHtml = opts.map(o => `<option value="${o}" ${durationVal === o ? 'selected' : ''}>${o} Hours dining</option>`).join('');
    } else if (itemType === 'spa') {
      const opts = [0.5, 1, 1.5, 2];
      durationOptionsHtml = opts.map(o => `<option value="${o}" ${durationVal === o ? 'selected' : ''}>${o === 0.5 ? '30 Mins session' : o + ' Hours session'}</option>`).join('');
    } else if (itemType === 'gaming') {
      const opts = [1, 2, 3];
      durationOptionsHtml = opts.map(o => `<option value="${o}" ${durationVal === o ? 'selected' : ''}>${o} Hours fun</option>`).join('');
    } else if (itemType === 'activity') {
      const opts = [2, 3, 4, 5, 6];
      durationOptionsHtml = opts.map(o => `<option value="${o}" ${durationVal === o ? 'selected' : ''}>${o} Hours tour</option>`).join('');
    }

    list.innerHTML += `
      <div class="relative bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition">
        <div class="absolute -left-[36px] top-4 w-6 h-6 rounded-full ${colorClass} border-2 border-white shadow-sm flex items-center justify-center text-xs text-white">${icon}</div>
        
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-sky-700 text-xs font-bold">${time}</span>
              <span class="bg-gray-100 text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded">${priceText}</span>
            </div>
            <strong class="text-gray-900 block text-sm font-extrabold mt-1">${title}</strong>
            <p class="text-gray-500 text-xs mt-1 leading-relaxed">${desc}</p>
          </div>
          
          <!-- Controls Panel -->
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <!-- Reorder Controls -->
            <div class="flex flex-col gap-1">
              <button onclick="layoverx.moveItineraryItem(${idx}, 'up')" class="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-sky-700 disabled:opacity-20 disabled:hover:bg-transparent" title="Move Up" ${idx === 0 ? 'disabled' : ''}>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
              </button>
              <button onclick="layoverx.moveItineraryItem(${idx}, 'down')" class="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-sky-700 disabled:opacity-20 disabled:hover:bg-transparent" title="Move Down" ${idx === totalItems - 1 ? 'disabled' : ''}>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>
            
            <!-- Remove Control -->
            <button onclick="layoverx.removeItineraryItem(${idx})" class="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition" title="Remove Item">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
        
        <!-- Duration selector -->
        <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-500 font-bold uppercase whitespace-nowrap">Timing Duration:</span>
            <select onchange="layoverx.updateItemDuration(${idx}, this.value)" class="bg-gray-50 border border-gray-200 rounded py-0.5 px-1.5 text-[10px] font-bold text-gray-800 focus:ring-1 focus:ring-sky-500 cursor-pointer">
              ${durationOptionsHtml}
            </select>
          </div>
        </div>
      </div>
    `;
  }

  /* ===== LOCAL STORAGE SAVE & SHARE PLAN ===== */
  window.layoverx.saveCurrentPlan = async function() {
    const btn = document.getElementById('btn-save-plan');
    if (btn && btn.disabled) return;
    
    const arr = $('#plan-arrival').value;
    const dep = $('#plan-departure').value;
    const loc = $('#plan-location').value;
    const travelers = $('#plan-travelers').value;
    const cost = $('#total-cost').textContent;

    if (!arr || !dep) {
      showToast("Please enter arrival and departure times before saving.", "error");
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.classList.add('opacity-80', 'cursor-not-allowed');
      const span = btn.querySelector('span');
      if (span) span.textContent = 'Saving...';
    }

    // Simulate network delay for premium feel
    await new Promise(r => setTimeout(r, 800));

    const plan = {
      id: Date.now(),
      arrival: arr,
      departure: dep,
      location: loc,
      travelers,
      cost,
      dateSaved: new Date().toLocaleDateString(),
      details: JSON.parse(JSON.stringify(state.currentPlan))
    };

    let list = [];
    try {
      const saved = localStorage.getItem('layoverx_saved_plans');
      if (saved) list = JSON.parse(saved);
    } catch(e) { console.error(e); }

    list.push(plan);
    localStorage.setItem('layoverx_saved_plans', JSON.stringify(list));
    
    loadSavedPlans();
    
    showToast("Your itinerary has been saved successfully. Scrolling to your saved itineraries.", "success");

    if (btn) {
      const span = btn.querySelector('span');
      if (span) span.textContent = 'Plan Saved ✓';
      btn.classList.remove('bg-gray-900', 'hover:bg-black');
      btn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
    }

    // Smooth scroll to the saved plans section
    const savedSection = document.getElementById('saved-plans-section');
    if (savedSection) {
      savedSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Apply highlight animation to the newest item
      setTimeout(() => {
        const items = document.querySelectorAll('#saved-plans-list li');
        if (items.length > 0) {
          const newest = items[items.length - 1];
          newest.classList.add('ring-4', 'ring-sky-400', 'ring-opacity-50', 'transition-all', 'duration-500');
          setTimeout(() => {
            newest.classList.remove('ring-4', 'ring-sky-400', 'ring-opacity-50');
          }, 3000);
        }
      }, 500);
    }

    if (btn) {
      setTimeout(() => {
        btn.disabled = false;
        btn.classList.remove('opacity-80', 'cursor-not-allowed', 'bg-emerald-600', 'hover:bg-emerald-700');
        btn.classList.add('bg-gray-900', 'hover:bg-black');
        const span = btn.querySelector('span');
        if (span) span.textContent = '💾 Save Plan';
      }, 2000);
    }
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
      .then(() => showToast("Shareable link copied to clipboard!", "success"))
      .catch(() => showToast("Could not copy link automatically.", "error"));
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
        <li class="bg-white border border-gray-200 shadow-sm p-4 rounded-xl flex flex-col justify-between gap-3 text-xs sm:text-sm transition-all duration-300">
          <div>
            <strong class="text-gray-900 block font-extrabold text-sm sm:text-base">${p.location === 'near-airport' ? 'Near Mumbai Airport' : p.location.toUpperCase()} (${hours}h Layover)</strong>
            <span class="text-gray-500 text-xs mt-1 block">Saved on ${p.dateSaved} • <span class="font-bold text-sky-700">${p.cost}</span></span>
          </div>
          <div class="flex flex-wrap gap-1.5 sm:justify-end">
            <a href="trip-details.html?id=${p.id}" class="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg font-bold text-[11px] transition text-center flex items-center justify-center">View Details</a>
            <button onclick="layoverx.loadPlan(${idx})" class="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-100 rounded-lg font-bold text-[11px] transition">Edit</button>
            <button onclick="layoverx.duplicatePlan(${idx})" class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-lg font-bold text-[11px] transition">Duplicate</button>
            <button onclick="layoverx.sharePlan(${idx})" class="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100 rounded-lg font-bold text-[11px] transition">Share</button>
            <button onclick="layoverx.deletePlan(${idx})" class="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg font-bold text-[11px] transition">Delete</button>
          </div>
        </li>
      `;
    });
  }

  window.layoverx.duplicatePlan = function(idx) {
    try {
      const data = JSON.parse(localStorage.getItem('layoverx_saved_plans')) || [];
      const plan = data[idx];
      if (plan) {
        const copy = JSON.parse(JSON.stringify(plan));
        copy.id = Date.now();
        copy.dateSaved = new Date().toLocaleDateString();
        data.push(copy);
        localStorage.setItem('layoverx_saved_plans', JSON.stringify(data));
        showToast("Itinerary duplicated successfully!", "success");
        loadSavedPlans();
        if (typeof renderSavedPlansPage === 'function') {
          renderSavedPlansPage();
        }
      }
    } catch(e) { console.error(e); }
  };

  window.layoverx.sharePlan = function(idx) {
    try {
      const data = JSON.parse(localStorage.getItem('layoverx_saved_plans')) || [];
      const plan = data[idx];
      if (plan) {
        const url = window.location.origin + '/plan-my-layover.html';
        const params = new URLSearchParams({
          arrivalDateTime: plan.arrival,
          departureDateTime: plan.departure,
          location: plan.location,
          travelers: plan.travelers
        });
        navigator.clipboard.writeText(`${url}?${params.toString()}`)
          .then(() => showToast("Shareable link copied to clipboard!", "success"))
          .catch(() => showToast("Failed to copy link.", "error"));
      }
    } catch(e) { console.error(e); }
  };

  window.layoverx.viewPlanDetails = function(idx) {
    try {
      const data = JSON.parse(localStorage.getItem('layoverx_saved_plans'));
      const plan = data[idx];
      if (!plan) return;

      const hours = ((new Date(plan.departure) - new Date(plan.arrival)) / 3600000).toFixed(1);
      
      $('#itinerary-details-title').textContent = `${plan.location === 'near-airport' ? 'Near Mumbai Airport' : plan.location.toUpperCase()}`;
      $('#itinerary-details-meta').textContent = `Saved on ${plan.dateSaved}`;
      $('#itinerary-details-cost').textContent = plan.cost;
      $('#itinerary-details-duration').textContent = `${hours} Hours`;
      $('#itinerary-details-travelers').textContent = `${plan.travelers} Guests`;
      
      const formatDt = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      };
      
      $('#itinerary-details-arrival').textContent = formatDt(plan.arrival);
      $('#itinerary-details-departure').textContent = formatDt(plan.departure);

      const servicesContainer = $('#itinerary-details-services');
      servicesContainer.innerHTML = '';
      
      const d = plan.details;
      let count = 0;

      const addService = (name, price, desc) => {
        count++;
        servicesContainer.innerHTML += `
          <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
            <div>
              <h4 class="font-bold text-gray-900 text-sm">${name}</h4>
              <p class="text-xs text-gray-500 mt-1">${desc}</p>
            </div>
            <div class="font-black text-sky-700 whitespace-nowrap">₹${price.toLocaleString()}</div>
          </div>
        `;
      };

      if (d.cabType) {
        const price = d.cabType === 'suv' ? 1499 : 899;
        addService('Airport Transfer (Return)', price, `AC ${d.cabType.toUpperCase()} with driver.`);
      }
      if (d.hotelId && HOTELS[d.hotelId]) addService(`Hotel: ${HOTELS[d.hotelId].name}`, HOTELS[d.hotelId].price, 'Day-use transit room.');
      if (d.diningId && DINING[d.diningId]) addService(`Dining: ${DINING[d.diningId].name}`, DINING[d.diningId].price, 'Reserved table.');
      if (d.activityId && EXPERIENCES[d.activityId]) addService(`Tour: ${EXPERIENCES[d.activityId].name}`, EXPERIENCES[d.activityId].price * plan.travelers, `${EXPERIENCES[d.activityId].duration}h guided experience.`);
      if (d.spaId && SPA_WELLNESS[d.spaId]) addService(`Spa: ${SPA_WELLNESS[d.spaId].name}`, SPA_WELLNESS[d.spaId].price * plan.travelers, `${SPA_WELLNESS[d.spaId].duration}h wellness session.`);
      if (d.gamingId && GAMING_ENTERTAINMENT[d.gamingId]) addService(`Gaming: ${GAMING_ENTERTAINMENT[d.gamingId].name}`, GAMING_ENTERTAINMENT[d.gamingId].price * plan.travelers, 'Entertainment pass.');

      if (count === 0) {
        servicesContainer.innerHTML = '<p class="text-sm text-gray-500 italic">No services selected in this itinerary.</p>';
      }

      $('#itinerary-details-load-btn').onclick = () => {
        Modal.close('itinerary-details');
        window.layoverx.loadPlan(idx);
      };

      Modal.open('itinerary-details');
    } catch(e) { console.error(e); }
  };

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
        
        // Populate items array if not present (legacy migration)
        if (!state.currentPlan.items) {
          state.currentPlan.items = [];
          if (state.currentPlan.hotelId) state.currentPlan.items.push({ type: 'hotel', id: state.currentPlan.hotelId, duration: 6.0 });
          if (state.currentPlan.diningId) state.currentPlan.items.push({ type: 'dining', id: state.currentPlan.diningId, duration: 1.5 });
          if (state.currentPlan.activityId) state.currentPlan.items.push({ type: 'activity', id: state.currentPlan.activityId, duration: 3.0 });
          if (state.currentPlan.spaId) state.currentPlan.items.push({ type: 'spa', id: state.currentPlan.spaId, duration: 1.0 });
          if (state.currentPlan.gamingId) state.currentPlan.items.push({ type: 'gaming', id: state.currentPlan.gamingId, duration: 2.0 });
        }

        // Uncheck all first
        $$('#plan-hotels-options input[type="checkbox"]').forEach(c => c.checked = false);
        $$('#plan-dining-options input[type="checkbox"]').forEach(c => c.checked = false);
        $$('#plan-activities-options input[type="checkbox"]').forEach(c => c.checked = false);
        $$('#plan-spa-options input[type="checkbox"]').forEach(c => c.checked = false);
        $$('#plan-gaming-options input[type="checkbox"]').forEach(c => c.checked = false);
        
        // Restore checklists
        state.currentPlan.items.forEach(item => {
          let chk = null;
          if (item.type === 'hotel') chk = $(`#chk-hotel-${item.id}`);
          if (item.type === 'dining') chk = $(`#chk-dining-${item.id}`);
          if (item.type === 'activity') chk = $(`#chk-activity-${item.id}`);
          if (item.type === 'spa') chk = $(`#chk-spa-${item.id}`);
          if (item.type === 'gaming') chk = $(`#chk-gaming-${item.id}`);
          if (chk) chk.checked = true;
        });

        // Restore cab selection
        if (state.currentPlan.cabType) {
          const radio = $(`input[name="plan-cab"][value="${state.currentPlan.cabType}"]`);
          if (radio) radio.checked = true;
        }
        
        recalculateItinerary();
        showToast("Loaded saved itinerary details!");
        
        const plannerForm = $('#planner-form') || $('#plan-arrival');
        if (plannerForm) {
          plannerForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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
    socialLogin: async (p) => {
      if (p === 'google') {
        try {
          const { error } = await window.supabase.auth.signInWithOAuth({
            provider: 'google'
          });
          if (error) throw error;
        } catch (error) {
          console.error("Google Login Error:", error);
          showToast(`Google login failed: ${error.message || error}`);
        }
      } else {
        showToast(`Redirecting to ${p.toUpperCase()} login...`);
        setTimeout(() => Auth.login(`${p}@layoverx.com`, "123456"), 1000);
      }
    },
    togglePassword: (id) => {
      const input = document.getElementById(id);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    },
    handleLogin: async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-login-submit');
      if (btn.disabled) return;
      const email = $('#login-email')?.value;
      const pass = $('#login-password')?.value;
      if (email && pass) {
        try {
          btn.disabled = true;
          btn.classList.add('opacity-80', 'cursor-not-allowed');
          btn.querySelector('span').textContent = 'Signing In...';
          btn.querySelector('.loading-spinner').classList.remove('hidden');
          await Auth.login(email, pass);
        } finally {
          btn.disabled = false;
          btn.classList.remove('opacity-80', 'cursor-not-allowed');
          btn.querySelector('span').textContent = 'Sign In';
          btn.querySelector('.loading-spinner').classList.add('hidden');
        }
      }
    },
    handleSignup: async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-signup-submit');
      if (btn.disabled) return;
      const name = $('#signup-name')?.value;
      const email = $('#signup-email')?.value;
      const pass = $('#signup-password')?.value;
      if (name && email && pass) {
        try {
          btn.disabled = true;
          btn.classList.add('opacity-80', 'cursor-not-allowed');
          btn.querySelector('span').textContent = 'Creating Account...';
          btn.querySelector('.loading-spinner').classList.remove('hidden');
          await Auth.signup(name, email, pass);
        } finally {
          btn.disabled = false;
          btn.classList.remove('opacity-80', 'cursor-not-allowed');
          btn.querySelector('span').textContent = 'Create Account';
          btn.querySelector('.loading-spinner').classList.add('hidden');
        }
      }
    },
    checkPasswordStrength: (val) => {
      const container = document.getElementById('pwd-strength-container');
      const bar = document.getElementById('pwd-strength-bar');
      const text = document.getElementById('pwd-strength-text');
      if (!container || !bar || !text) return;
      
      if (!val) {
        container.classList.add('hidden');
        return;
      }
      
      container.classList.remove('hidden');
      
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;
      
      let width = "25%";
      let color = "bg-red-500";
      let msg = "Weak (add capital, number, or symbol)";
      
      if (score === 2) {
        width = "50%";
        color = "bg-amber-500";
        msg = "Medium (add number or symbol)";
      } else if (score === 3) {
        width = "75%";
        color = "bg-blue-500";
        msg = "Strong";
      } else if (score >= 4) {
        width = "100%";
        color = "bg-emerald-500";
        msg = "Very Strong";
      }
      
      bar.style.width = width;
      bar.className = `h-full transition-all duration-300 ${color}`;
      text.textContent = msg;
    },
    handleForgot: async () => {
      const btn = document.getElementById('btn-forgot-submit');
      if (btn && btn.disabled) return;
      const email = $('#forgot-email')?.value;
      if (email) {
        if (btn) {
          btn.disabled = true;
          btn.classList.add('opacity-80', 'cursor-not-allowed');
          btn.querySelector('span').textContent = 'Sending...';
          btn.querySelector('.loading-spinner').classList.remove('hidden');
        }
        
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showToast(`Reset code successfully sent to ${email}`, 'success');
        Modal.close('forgot');
        
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('opacity-80', 'cursor-not-allowed');
          btn.querySelector('span').textContent = 'Send Reset Link';
          btn.querySelector('.loading-spinner').classList.add('hidden');
        }
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

    // Auto-populate from localStorage on homepage load
    try {
      const saved = JSON.parse(localStorage.getItem('layoverx_search_params'));
      if (saved) {
        if (saved.arrivalDateTime && arrivalEl) arrivalEl.value = saved.arrivalDateTime;
        if (saved.departureDateTime && departureEl) departureEl.value = saved.departureDateTime;
        if (saved.location && $('#search-location')) $('#search-location').value = saved.location;
        if (saved.travelers && $('#search-travelers')) $('#search-travelers').value = saved.travelers;
        updateDuration();
      }
    } catch(e) { console.error(e); }

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
      
      const hours = (new Date(departure) - new Date(arrival)) / 3600000;
      
      // Save search parameters to localStorage
      try {
        localStorage.setItem('layoverx_search_params', JSON.stringify({
          arrivalDateTime: arrival,
          departureDateTime: departure,
          location,
          travelers,
          layoverDuration: hours
        }));
      } catch(e) { console.error(e); }

      const params = new URLSearchParams({ arrivalDateTime: arrival, departureDateTime: departure, location, travelers, layoverDuration: hours });
      window.location.href = `plan-my-layover.html?${params.toString()}`;
    });
  }

  /* ===== MAIN APPLICATION BOOT STRAP ===== */
  function initCarousel(carouselId, prevId, nextId) {
    const carousel = $(carouselId);
    const prevBtn = $(prevId);
    const nextBtn = $(nextId);
    if (!carousel || !prevBtn || !nextBtn) return;

    const scrollAmount = () => carousel.offsetWidth;

    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    const updateButtons = () => {
        prevBtn.disabled = carousel.scrollLeft <= 0;
        nextBtn.disabled = carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 10;
    };

    carousel.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();

    // Keyboard support when focused
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      }
    });
  }

  function init() {
    // Global Image Error Handling
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') {
        console.warn('Handling broken image:', e.target.src);
        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop'; // Stable Hotel Fallback
        e.target.classList.add('image-fallback');
      }
    }, true);

    // Image Loading States
    $$('img').forEach(img => {
      if (!img.complete) {
        img.classList.add('loading-image');
        img.onload = () => img.classList.remove('loading-image');
      }
    });

    Auth.init();
    initHashRouting();
    decorateNavbar();
    decorateMobileMenu();
    decorateUserDropdown();
    initAccessibility();
    
    // Page specific setups
    initHotelsFilter();
    initDiningFilter();
    initExperiencesFilter();
    initSpaFilter();
    initGamingFilter();
    initTransfersFilter();
    initPlanner();
    initCarousel('#services-carousel', '#prev-service', '#next-service');
    initCarousel('#experiences-carousel', '#prev-experience', '#next-experience');
    initCarousel('#planner-services-carousel', '#planner-prev', '#planner-next');
    loadSavedPlans();
    initHomepageSearch();
    
    // Add new marketplace initializers
    initGlobalTravelContext();
    initServiceDetailsPage();
    initItineraryWorkspacePage();
    initCheckoutPage();
    initMyTripsPage();
    updateItineraryBadges();

    const isCheckoutPage = window.location.pathname.includes('checkout.html') ||
                           window.location.pathname.includes('payment-selection.html') ||
                           window.location.pathname.includes('booking-review.html');
    if (isCheckoutPage) {
      checkAndCreateLock();
      initCrossTabSync();
    }

    console.log('%c LayoverX Premium Portal Activated ✈️ ', 'background:#0ea5e9;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px');
  }

  /* ===== EXTENDED MARKETPLACE ENGINE ===== */
  
  /* ===== ENTERPRISE PRICING & REVENUE ENGINE ===== */
  if (!localStorage.getItem('layoverx_base_prices')) {
    const defaults = {
      hotel: { 1: 3499, 2: 5499, 3: 2200, 4: 4500 },
      dining: { 1: 1800, 2: 4500, 3: 800, 4: 400 },
      activity: { 1: 2899, 2: 1299, 3: 1999, 4: 1500 },
      spa: { 1: 4500, 2: 1800, 3: 8500 },
      gaming: { 1: 1200, 2: 2500, 3: 1800 },
      transfer: { sedan: 899, suv: 1499, luxury: 3499 }
    };
    localStorage.setItem('layoverx_base_prices', JSON.stringify(defaults));
  }

  if (!localStorage.getItem('layoverx_seasonal_pricing')) {
    const seasons = [
      { name: "Winter Peak", start: "10-01", end: "02-28", multiplier: 1.25 },
      { name: "Monsoon Low", start: "07-01", end: "09-30", multiplier: 0.85 },
      { name: "Summer Standard", start: "03-01", end: "06-30", multiplier: 1.00 }
    ];
    localStorage.setItem('layoverx_seasonal_pricing', JSON.stringify(seasons));
  }

  if (!localStorage.getItem('layoverx_demand_settings')) {
    const demand = {
      simulatedOccupancy: 78,
      highOccupancyThreshold: 80,
      highOccupancyMultiplier: 1.20,
      lowOccupancyThreshold: 30,
      lowOccupancyMultiplier: 0.90,
      autoDemandIncrease: true
    };
    localStorage.setItem('layoverx_demand_settings', JSON.stringify(demand));
  }

  if (!localStorage.getItem('layoverx_pricing_settings')) {
    const general = {
      globalMarkupPercent: 0,
      globalMarkupFlat: 0,
      weekendMultiplier: 1.10,
      baseCommissionRate: 0.15,
      flatConvenienceFee: 150,
      serviceFeePercent: 0.02,
      insurancePremium: 199,
      manualOverridePercent: 0
    };
    localStorage.setItem('layoverx_pricing_settings', JSON.stringify(general));
  }

  if (!localStorage.getItem('layoverx_coupons')) {
    const defaultCoupons = [
      { code: "WELCOME10", discountType: "percent", value: 10, priority: 1, stackable: true, desc: "10% off for first-time transit flyers" },
      { code: "REFER500", discountType: "flat", value: 500, priority: 2, stackable: true, desc: "₹500 flat discount on referring a traveler" },
      { code: "FESTIVE20", discountType: "percent", value: 20, priority: 3, stackable: false, desc: "20% off for festive seasons (Non-stackable)" },
      { code: "FLASH30", discountType: "percent", value: 30, priority: 4, stackable: false, desc: "30% off limited flash sale (Non-stackable)" }
    ];
    localStorage.setItem('layoverx_coupons', JSON.stringify(defaultCoupons));
  }

  if (!localStorage.getItem('layoverx_discounts')) {
    const discounts = [
      { name: "Group Booking", value: 15, unit: "percent", trigger: "pax >= 3", active: true },
      { name: "Long Stay", value: 10, unit: "percent", trigger: "hours > 8", active: true },
      { name: "Loyalty Member", value: 5, unit: "percent", trigger: "logged_in", active: true }
    ];
    localStorage.setItem('layoverx_discounts', JSON.stringify(discounts));
  }

  if (!localStorage.getItem('layoverx_commissions')) {
    const commissions = [
      { category: "hotel", ratePercent: 15, name: "Room Booking Commission" },
      { category: "dining", ratePercent: 12, name: "Dining Reservation Fee" },
      { category: "activity", ratePercent: 18, name: "Tour Experience Commission" },
      { category: "spa", ratePercent: 15, name: "Wellness Partner Commission" },
      { category: "gaming", ratePercent: 10, name: "Entertainment Partner Commission" },
      { category: "transfer", ratePercent: 10, name: "Chauffeur Fleet Commission" }
    ];
    localStorage.setItem('layoverx_commissions', JSON.stringify(commissions));
  }

  if (!localStorage.getItem('layoverx_pricing_history')) {
    const defaultHistory = [
      { timestamp: new Date(Date.now() - 3600000 * 24 * 5).toISOString(), admin: "admin@layoverx.com", action: "Updated base prices for hotels and lounges", details: "Hotel Base standard room increased to ₹3,499" },
      { timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), admin: "admin@layoverx.com", action: "Adjusted Winter Peak seasonal pricing", details: "Set winter peak multiplier to 1.25x (Oct 1 - Feb 28)" },
      { timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), admin: "admin@layoverx.com", action: "Added Flash Sale coupon", details: "Added coupon code FLASH30 with 30% discount (non-stackable)" }
    ];
    localStorage.setItem('layoverx_pricing_history', JSON.stringify(defaultHistory));
  }

  if (!localStorage.getItem('layoverx_revenue_transactions')) {
    const mockTx = [
      {
        bookingId: "LX-89104-CSMIA",
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        passenger: "Sarah Jenkins",
        subtotal: 10298,
        totalDiscount: 1544.7,
        convenienceFee: 150,
        serviceFee: 175.07,
        taxes: 58.51,
        insurancePremium: 398,
        grandTotal: 9534.88,
        items: [
          { type: "hotel", name: "Premium Transit Cabin (BOM)", finalTotalCost: 7499, vendorId: "v_hotel_1" },
          { type: "transfer", name: "Premium SUV (Toyota Innova)", finalTotalCost: 2799, vendorId: "v_trans_2" }
        ],
        appliedCoupon: "WELCOME10",
        paxCount: 2,
        layoverHours: 8.5
      },
      {
        bookingId: "LX-14589-CSMIA",
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
        passenger: "Amit Sharma",
        subtotal: 4500,
        totalDiscount: 225,
        convenienceFee: 150,
        serviceFee: 85.5,
        taxes: 42.39,
        insurancePremium: 0,
        grandTotal: 4552.89,
        items: [
          { type: "dining", name: "Veda Indian Bistro Buffet", finalTotalCost: 4500, vendorId: "v_dine_1" }
        ],
        appliedCoupon: null,
        paxCount: 3,
        layoverHours: 4.5
      },
      {
        bookingId: "LX-72301-CSMIA",
        createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
        passenger: "Robert Chen",
        subtotal: 14798,
        totalDiscount: 2219.7,
        convenienceFee: 150,
        serviceFee: 251.57,
        taxes: 72.28,
        insurancePremium: 199,
        grandTotal: 13251.15,
        items: [
          { type: "hotel", name: "Niranta Airport Transit Hotel", finalTotalCost: 5499, vendorId: "v_hotel_2" },
          { type: "spa", name: "O2 Express Back Massage", finalTotalCost: 5800, vendorId: "v_spa_1" },
          { type: "transfer", name: "Compact Sedan", finalTotalCost: 3499, vendorId: "v_trans_1" }
        ],
        appliedCoupon: "REFER500",
        paxCount: 1,
        layoverHours: 12.0
      },
      {
        bookingId: "LX-49812-CSMIA",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        passenger: "Elena Rostova",
        subtotal: 7800,
        totalDiscount: 2340,
        convenienceFee: 150,
        serviceFee: 109.2,
        taxes: 46.66,
        insurancePremium: 398,
        grandTotal: 6163.86,
        items: [
          { type: "gaming", name: "Smaaash VR & Gaming Arena", finalTotalCost: 4300, vendorId: "v_game_1" },
          { type: "activity", name: "Gateway of India Speed Tour", finalTotalCost: 3500, vendorId: "v_act_1" }
        ],
        appliedCoupon: "FLASH30",
        paxCount: 2,
        layoverHours: 7.0
      }
    ];
    localStorage.setItem('layoverx_revenue_transactions', JSON.stringify(mockTx));
  }

  if (!localStorage.getItem('layoverx_vendor_payouts')) {
    const payouts = [
      { payoutId: "PO-82910", bookingId: "LX-72301-CSMIA", vendorId: "v_hotel_2", amount: 4674.15, commissionAmount: 824.85, ratePercent: 15, itemName: "Niranta Airport Transit Hotel", status: "Paid", datePaid: new Date(Date.now() - 3600000 * 12).toISOString() },
      { payoutId: "PO-82911", bookingId: "LX-72301-CSMIA", vendorId: "v_spa_1", amount: 4930.00, commissionAmount: 870.00, ratePercent: 15, itemName: "O2 Express Back Massage", status: "Paid", datePaid: new Date(Date.now() - 3600000 * 12).toISOString() },
      { payoutId: "PO-82912", bookingId: "LX-72301-CSMIA", vendorId: "v_trans_1", amount: 3149.10, commissionAmount: 349.90, ratePercent: 10, itemName: "Compact Sedan", status: "Pending", datePaid: null }
    ];
    localStorage.setItem('layoverx_vendor_payouts', JSON.stringify(payouts));
  }

  if (!localStorage.getItem('layoverx_financial_reports')) {
    const reports = [
      { period: "May 2026", grossBookingValue: 412500, discountsApplied: 51200, convenienceFees: 8550, serviceFees: 7226, taxes: 2840, netRevenue: 15776, payoutsApproved: 345524, reportDate: "2026-06-01" },
      { period: "Q1 2026", grossBookingValue: 1250800, discountsApplied: 142000, convenienceFees: 24300, serviceFees: 22176, taxes: 8365, netRevenue: 46476, payoutsApproved: 1086624, reportDate: "2026-04-01" }
    ];
    localStorage.setItem('layoverx_financial_reports', JSON.stringify(reports));
  }

  function getSeasonalMultiplier(dateStr) {
    const date = dateStr ? new Date(dateStr) : new Date();
    const mmdd = String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    try {
      const seasons = JSON.parse(localStorage.getItem('layoverx_seasonal_pricing')) || [];
      for (const s of seasons) {
        if (s.start <= s.end) {
          if (mmdd >= s.start && mmdd <= s.end) return s.multiplier;
        } else {
          if (mmdd >= s.start || mmdd <= s.end) return s.multiplier;
        }
      }
    } catch(e) { console.error(e); }
    return 1.0;
  }

  function getWeekendMultiplier(dateStr) {
    const date = dateStr ? new Date(dateStr) : new Date();
    const day = date.getDay();
    if (day === 0 || day === 5 || day === 6) {
      try {
        const settings = JSON.parse(localStorage.getItem('layoverx_pricing_settings'));
        if (settings && settings.weekendMultiplier !== undefined) {
          return parseFloat(settings.weekendMultiplier);
        }
      } catch(e) {}
      return 1.10;
    }
    return 1.0;
  }

  function getDemandMultiplier() {
    try {
      const d = JSON.parse(localStorage.getItem('layoverx_demand_settings'));
      if (d && d.autoDemandIncrease) {
        if (d.simulatedOccupancy >= d.highOccupancyThreshold) {
          return d.highOccupancyMultiplier;
        } else if (d.simulatedOccupancy <= d.lowOccupancyThreshold) {
          return d.lowOccupancyMultiplier;
        }
      }
    } catch(e) { console.error(e); }
    return 1.0;
  }

  function getManualOverrideMultiplier() {
    try {
      const s = JSON.parse(localStorage.getItem('layoverx_pricing_settings'));
      if (s && s.manualOverridePercent) {
        return 1.0 + (parseFloat(s.manualOverridePercent) / 100.0);
      }
    } catch(e) {}
    return 1.0;
  }

  window.layoverx.calculateItineraryPrice = function(itinerary, options = {}) {
    let searchParams = { travelers: '2', layoverDuration: 6.5, location: 'near-airport', arrivalDateTime: '' };
    try {
      const stored = localStorage.getItem('layoverx_search_params');
      if (stored) searchParams = JSON.parse(stored);
    } catch(e) { console.error(e); }

    const pax = parseInt(searchParams.travelers) || 2;
    const duration = parseFloat(searchParams.layoverDuration) || 6.5;
    const arrivalDate = searchParams.arrivalDateTime;

    const basePrices = JSON.parse(localStorage.getItem('layoverx_base_prices')) || {};
    const settings = JSON.parse(localStorage.getItem('layoverx_pricing_settings')) || {};
    
    const sMult = getSeasonalMultiplier(arrivalDate);
    const wMult = getWeekendMultiplier(arrivalDate);
    const dMult = getDemandMultiplier();
    const oMult = getManualOverrideMultiplier();

    const pricingLogs = [];
    pricingLogs.push(`Arrival: ${arrivalDate || 'Not specified'}`);
    pricingLogs.push(`Base Pricing adjustments loaded: SeasonalMultiplier=${sMult.toFixed(2)}, WeekendMultiplier=${wMult.toFixed(2)}, DemandMultiplier=${dMult.toFixed(2)}, ManualOverrideMultiplier=${oMult.toFixed(2)}`);

    let itemPricingDetails = [];
    let subtotal = 0;

    itinerary.forEach(item => {
      let baseVal = item.price;
      if (basePrices[item.type] && basePrices[item.type][item.id] !== undefined) {
        baseVal = basePrices[item.type][item.id];
      }

      let durationScale = 1.0;
      if (item.type === 'hotel') {
        if (item.duration == 3) durationScale = 0.7;
        else if (item.duration == 12) durationScale = 1.5;
        else if (item.duration == 24) durationScale = 2.2;
      } else if (item.type === 'dining') {
        if (item.duration == 1) durationScale = 0.8;
        else if (item.duration == 2) durationScale = 1.2;
      }

      let scaledBase = baseVal * durationScale;
      let finalItemPrice = scaledBase * sMult * wMult * dMult * oMult;
      
      if (settings.globalMarkupPercent) {
        finalItemPrice *= (1 + parseFloat(settings.globalMarkupPercent) / 100.0);
      }
      if (settings.globalMarkupFlat) {
        finalItemPrice += parseFloat(settings.globalMarkupFlat);
      }

      let finalTotalItemCost = finalItemPrice;
      let isPaxDependent = (item.type === 'activity' || item.type === 'spa' || item.type === 'gaming');
      if (isPaxDependent) {
        finalTotalItemCost = finalItemPrice * pax;
      }

      subtotal += finalTotalItemCost;

      itemPricingDetails.push({
        type: item.type,
        id: item.id,
        name: item.name,
        duration: item.duration,
        basePrice: baseVal,
        scaledBasePrice: scaledBase,
        finalItemUnitPrice: finalItemPrice,
        finalTotalCost: finalTotalItemCost,
        isPaxDependent
      });

      pricingLogs.push(`Item "${item.name}" (Type: ${item.type}, ID: ${item.id}): baseVal=${baseVal}, scaledBase=${scaledBase.toFixed(2)}, finalTotalCost=${finalTotalItemCost.toFixed(2)}`);
    });

    let totalDiscount = 0;
    const discountLogs = [];

    if (pax >= 3) {
      const discVal = subtotal * 0.15;
      totalDiscount += discVal;
      discountLogs.push(`Group booking discount (15%): -₹${discVal.toFixed(2)}`);
    }

    if (duration > 8.0) {
      const discVal = subtotal * 0.10;
      totalDiscount += discVal;
      discountLogs.push(`Long-stay discount (10%): -₹${discVal.toFixed(2)}`);
    }

    if (state.isAuthenticated) {
      const discVal = subtotal * 0.05;
      totalDiscount += discVal;
      discountLogs.push(`Loyalty member discount (5%): -₹${discVal.toFixed(2)}`);
    }

    let activeCoupon = null;
    let couponDiscount = 0;
    if (options.couponCode) {
      const code = options.couponCode.trim().toUpperCase();
      try {
        const coupons = JSON.parse(localStorage.getItem('layoverx_coupons')) || [];
        const coupon = coupons.find(c => c.code === code);
        if (coupon) {
          activeCoupon = coupon;
          if (coupon.discountType === 'percent') {
            couponDiscount = subtotal * (parseFloat(coupon.value) / 100.0);
          } else {
            couponDiscount = parseFloat(coupon.value);
          }
          discountLogs.push(`Coupon code [${code}]: -₹${couponDiscount.toFixed(2)}`);
        } else {
          pricingLogs.push(`Coupon code [${code}] not found or invalid.`);
        }
      } catch(e) { console.error(e); }
    }

    if (activeCoupon) {
      if (activeCoupon.stackable) {
        totalDiscount += couponDiscount;
      } else {
        if (couponDiscount > totalDiscount) {
          totalDiscount = couponDiscount;
          discountLogs.length = 0;
          discountLogs.push(`Non-stackable coupon code [${activeCoupon.code}] preferred: -₹${couponDiscount.toFixed(2)}`);
        } else {
          pricingLogs.push(`Stacked discounts are higher than non-stackable coupon code [${activeCoupon.code}]. Coupon not applied.`);
        }
      }
    }

    const maxDiscount = subtotal * 0.35;
    if (totalDiscount > maxDiscount) {
      totalDiscount = maxDiscount;
      discountLogs.push(`Discounts capped at 35% margin ceiling: -₹${totalDiscount.toFixed(2)}`);
    }

    const priceAfterDiscount = Math.max(0, subtotal - totalDiscount);
    const convenienceFee = settings.flatConvenienceFee !== undefined ? parseFloat(settings.flatConvenienceFee) : 150;
    const serviceFeePercent = settings.serviceFeePercent !== undefined ? parseFloat(settings.serviceFeePercent) : 0.02;
    const serviceFee = priceAfterDiscount * serviceFeePercent;
    const taxRate = 0.18;
    const taxes = (convenienceFee + serviceFee) * taxRate;
    const insurancePremium = options.optionalInsurance ? ((settings.insurancePremium !== undefined ? parseFloat(settings.insurancePremium) : 199) * pax) : 0;
    const grandTotal = priceAfterDiscount + convenienceFee + serviceFee + taxes + insurancePremium;

    pricingLogs.push(`Summary: Subtotal=${subtotal.toFixed(2)}, Discount=${totalDiscount.toFixed(2)}, ConvenienceFee=${convenienceFee}, ServiceFee=${serviceFee.toFixed(2)}, GST=${taxes.toFixed(2)}, Insurance=${insurancePremium}, GrandTotal=${grandTotal.toFixed(2)}`);

    return {
      subtotal,
      itemPricingDetails,
      totalDiscount,
      discountLogs,
      convenienceFee,
      serviceFee,
      taxes,
      insurancePremium,
      grandTotal,
      pricingLogs,
      appliedCoupon: activeCoupon ? activeCoupon.code : null
    };
  };

  const TRANSFERS = {
    'sedan': { 
      id: 'sedan', 
      name: "Compact Sedan (Toyota Etios or similar)", 
      type: "sedan", 
      rating: 4.8, 
      reviews: 2100, 
      price: 899, 
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=400&fit=crop", 
      desc: "Ideal for 1-3 passengers with standard luggage. AC, GPS tracking, and verified high hygiene standards.", 
      amenities: ["4 Passengers", "2 Large Bags", "Instant Confirmation"],
      coordinates: { lat: null, lng: null },
      address: {
        full: "Vehicle Fleet",
        area: "City-wide"
      },
      google_place_id: "fleet_sedan"
    },
    'suv': { 
      id: 'suv', 
      name: "Premium SUV (Toyota Innova Crysta)", 
      type: "suv", 
      rating: 4.9, 
      reviews: 1800, 
      price: 1499, 
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop", 
      desc: "Extra room, premium comfort, great for families. AC, high luggage capacity, and professional English-speaking drivers.", 
      amenities: ["6 Passengers", "4 Large Bags", "Popular Choice"],
      coordinates: { lat: null, lng: null },
      address: {
        full: "Vehicle Fleet",
        area: "City-wide"
      },
      google_place_id: "fleet_suv"
    },
    'luxury': { 
      id: 'luxury', 
      name: "Luxury Executive (Mercedes C-Class or Audi A4)", 
      type: "luxury", 
      rating: 4.9, 
      reviews: 840, 
      price: 3499, 
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=400&fit=crop", 
      desc: "Chauffeur-driven luxury class vehicle. Leather seats, airport exit gate placard meet and greet service included.", 
      amenities: ["4 Passengers", "2 Large Bags", "Premium Chauffeur"],
      coordinates: { lat: null, lng: null },
      address: {
        full: "Vehicle Fleet",
        area: "City-wide"
      },
      google_place_id: "fleet_luxury"
    }
  };

  const TERMINAL_NODES = {
    'CSMIA_T1': {
      id: 'CSMIA_T1',
      name: 'Mumbai Airport Terminal 1',
      type: 'airport_terminal',
      coordinates: { lat: 19.0913, lng: 72.8524 },
      address: {
        full: "Domestic Terminal, Santacruz East, Mumbai 400099",
        area: "Santacruz"
      }
    },
    'CSMIA_T2': {
      id: 'CSMIA_T2',
      name: 'Mumbai Airport Terminal 2',
      type: 'airport_terminal',
      coordinates: { lat: 19.0896, lng: 72.8656 },
      address: {
        full: "International Terminal, Sahar Road, Andheri East, Mumbai 400099",
        area: "Sahar"
      }
    }
  };

  function initGlobalTravelContext() {
    let params = null;
    
    // Check URL parameters first to ensure dynamic redirects set context
    const urlParams = new URLSearchParams(window.location.search);
    const urlArrival = urlParams.get('arrivalDateTime');
    const urlDeparture = urlParams.get('departureDateTime');
    const urlLocation = urlParams.get('location');
    const urlTravelers = urlParams.get('travelers');
    
    if (urlArrival && urlDeparture) {
      const dur = (new Date(urlDeparture) - new Date(urlArrival)) / 3600000;
      params = {
        location: urlLocation || 'near-airport',
        arrivalDateTime: urlArrival,
        departureDateTime: urlDeparture,
        travelers: urlTravelers || '2',
        layoverDuration: dur
      };
      try {
        localStorage.setItem('layoverx_search_params', JSON.stringify(params));
      } catch(e) { console.error(e); }
    } else {
      try {
        params = JSON.parse(localStorage.getItem('layoverx_search_params'));
      } catch(e) { console.error(e); }
    }

    if (!params) {
      const now = new Date();
      const sixHoursLater = new Date(now.getTime() + 6.5 * 60 * 60 * 1000);
      params = {
        location: 'near-airport',
        arrivalDateTime: toLocalISO(now),
        departureDateTime: toLocalISO(sixHoursLater),
        travelers: '2',
        layoverDuration: 6.5
      };
      try {
        localStorage.setItem('layoverx_search_params', JSON.stringify(params));
      } catch(e) { console.error(e); }
    }

    if (params && (params.layoverDuration === undefined || params.layoverDuration === null)) {
      const arr = params.arrivalDateTime;
      const dep = params.departureDateTime;
      if (arr && dep) {
        params.layoverDuration = (new Date(dep) - new Date(arr)) / 3600000;
      } else {
        params.layoverDuration = 6.5;
      }
    }

    state.currentPlan.location = params.location;
    state.currentPlan.arrivalDateTime = params.arrivalDateTime;
    state.currentPlan.departureDateTime = params.departureDateTime;
    state.currentPlan.travelers = parseInt(params.travelers) || 2;

    updateGlobalTripBadges(params);
    syncPageInputsWithGlobalContext(params);
  }

  function updateGlobalTripBadges(params) {
    const hours = parseFloat(params.layoverDuration) || 0;
    const travelers = params.travelers || '2';
    const locName = params.location === 'near-airport' ? 'BOM' : (params.location === 'bandra' ? 'Bandra' : 'SoMu');
    const label = `✏️ Trip Details: ${locName} (${hours.toFixed(1)}h, ${travelers} Guests)`;

    const badge = $('#global-trip-badge');
    const badgeMobile = $('#global-trip-badge-mobile');
    if (badge) badge.textContent = label;
    if (badgeMobile) badgeMobile.textContent = label;
  }

  function calculateContextDuration() {
    const arrVal = $('#context-arrival')?.value;
    const depVal = $('#context-departure')?.value;
    const disp = $('#context-duration-display');
    const msg = $('#context-validation-message');
    const btn = $('#btn-context-submit');

    if (!arrVal || !depVal) return;

    const arr = new Date(arrVal);
    const dep = new Date(depVal);
    const diff = dep - arr;

    if (diff <= 0) {
      if (disp) disp.textContent = '--';
      if (msg) {
        msg.textContent = '⚠️ Departure must be after arrival.';
        msg.classList.remove('hidden');
      }
      if (btn) btn.disabled = true;
      return;
    }

    const hours = diff / (1000 * 60 * 60);
    if (disp) disp.textContent = `${hours.toFixed(1)}h`;
    if (msg) msg.classList.add('hidden');
    if (btn) btn.disabled = false;
  }

  function handleTripContextSubmit(e) {
    e.preventDefault();
    const loc = $('#context-location').value;
    const arr = $('#context-arrival').value;
    const dep = $('#context-departure').value;
    const trav = $('#context-travelers').value;

    const hours = (new Date(dep) - new Date(arr)) / 3600000;

    const params = {
      location: loc,
      arrivalDateTime: arr,
      departureDateTime: dep,
      travelers: trav,
      layoverDuration: hours
    };

    try {
      localStorage.setItem('layoverx_search_params', JSON.stringify(params));
    } catch(err) { console.error(err); }

    state.currentPlan.location = loc;
    state.currentPlan.arrivalDateTime = arr;
    state.currentPlan.departureDateTime = dep;
    state.currentPlan.travelers = parseInt(trav) || 2;

    updateGlobalTripBadges(params);
    Modal.close('trip-context');
    showToast("Trip details updated successfully!", "success");

    syncPageInputsWithGlobalContext(params);
    
    if (window.location.pathname.includes('my-itinerary')) {
      renderWorkspaceItinerary();
    }

    if (window.layoverxAnalytics) {
      window.layoverxAnalytics.trackEvent("Search Context Updated", { location: loc, duration: hours, travelers: trav });
    }
  }

  function syncPageInputsWithGlobalContext(params) {
    const hotelLoc = $('#hotel-location');
    const hotelCheckin = $('#hotel-checkin');
    const hotelDur = $('#hotel-duration');
    if (hotelLoc && hotelCheckin && hotelDur) {
      hotelLoc.value = 'all';
      hotelCheckin.value = params.arrivalDateTime;
      const hours = params.layoverDuration;
      if (hours <= 4) hotelDur.value = "3";
      else if (hours <= 9) hotelDur.value = "6";
      else if (hours <= 18) hotelDur.value = "12";
      else hotelDur.value = "24";
      
      const form = $('#hotel-search-form');
      if (form) form.dispatchEvent(new Event('submit'));
    }

    const searchArrival = $('#search-arrival');
    const searchDeparture = $('#search-departure');
    const searchLoc = $('#search-location');
    const searchTrav = $('#search-travelers');
    if (searchArrival && searchDeparture) {
      searchArrival.value = params.arrivalDateTime;
      searchDeparture.value = params.departureDateTime;
      if (searchLoc) searchLoc.value = params.location;
      if (searchTrav) searchTrav.value = params.travelers;
      
      const durEl = $('#layover-duration');
      if (durEl) {
        const diff = new Date(params.departureDateTime) - new Date(params.arrivalDateTime);
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        durEl.textContent = `${h}h ${m}m`;
      }
    }

    const cabTime = $('#cab-time');
    const cabLoc = $('#cab-location');
    if (cabTime) {
      cabTime.value = params.arrivalDateTime;
      if (cabLoc) cabLoc.value = params.location;
      const form = $('#transfer-search-form');
      if (form) form.dispatchEvent(new Event('submit'));
    }
  }

  function updateItineraryBadges() {
    let itinerary = [];
    try {
      const stored = localStorage.getItem('layoverx_current_itinerary');
      if (stored) itinerary = JSON.parse(stored);
    } catch(e) { console.error(e); }
    
    const count = itinerary.length;
    const badge = $('#itinerary-badge');
    const badgeMobile = $('#itinerary-badge-mobile');
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    }
    if (badgeMobile) {
      badgeMobile.textContent = count;
      badgeMobile.classList.toggle('hidden', count === 0);
    }
  }

  function initServiceDetailsPage() {
    if (!window.location.pathname.includes('service-details')) return;

    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const id = params.get('id');

    if (!type || !id) {
      showToast("Invalid service ID or category.", "error");
      setTimeout(() => window.location.href = 'index.html', 1500);
      return;
    }

    let dict = null;
    if (type === 'hotel') dict = HOTELS;
    else if (type === 'dining') dict = DINING;
    else if (type === 'spa') dict = SPA_WELLNESS;
    else if (type === 'gaming') dict = GAMING_ENTERTAINMENT;
    else if (type === 'activity') dict = EXPERIENCES;
    else if (type === 'transfer') dict = TRANSFERS;

    const item = dict ? dict[id] : null;

    if (!item) {
      showToast("Service details not found.", "error");
      setTimeout(() => window.location.href = 'index.html', 1500);
      return;
    }

    const skeleton = $('#details-skeleton');
    if (skeleton) skeleton.classList.add('hidden');
    const content = $('#details-content');
    if (content) content.classList.remove('hidden');

    const heroBg = $('#details-hero-bg');
    if (heroBg) heroBg.style.backgroundImage = `url('${item.image}')`;
    
    const catEl = $('#details-breadcrumb-category');
    if (catEl) catEl.textContent = type;
    
    const breadTitle = $('#details-breadcrumb-title');
    if (breadTitle) breadTitle.textContent = item.name;
    
    const titleEl = $('#details-title');
    if (titleEl) titleEl.textContent = item.name;

    const starsDisp = $('#details-stars-display');
    if (starsDisp) {
      const starsCount = item.stars || (item.rating >= 4.7 ? 5 : 4);
      starsDisp.textContent = '⭐'.repeat(starsCount);
    }

    const ratingDisp = $('#details-rating-display');
    if (ratingDisp) {
      const reviewsCount = item.reviews || 240;
      ratingDisp.textContent = `★ ${item.rating} (${reviewsCount} reviews)`;
    }

    const locText = $('#details-location-text');
    if (locText) {
      const distText = item.distance !== undefined ? ` • ${item.distance} km from airport` : '';
      locText.textContent = `📍 CSMIA Airport Area${distText}`;
    }

    const mainImg = $('#details-main-img');
    if (mainImg) mainImg.src = item.image;

    const descEl = $('#details-description');
    if (descEl) descEl.textContent = item.desc || "Experience premium service and flexible timings customized for international transit passengers at Chhatrapati Shivaji Maharaj International Airport (CSMIA). Clean facilities, high hygiene standards, and verified operators.";

    const cardPrice = $('#details-card-price');
    if (cardPrice) cardPrice.textContent = `₹${item.price.toLocaleString()}`;
    const priceUnit = $('#details-price-unit');
    if (priceUnit) {
      if (type === 'hotel') priceUnit.textContent = '/ stay slot';
      else if (type === 'dining') priceUnit.textContent = '/ table';
      else priceUnit.textContent = '/ guest';
    }

    let searchParams = { travelers: '2', layoverDuration: 6.5, location: 'near-airport', arrivalDateTime: '' };
    try {
      const stored = localStorage.getItem('layoverx_search_params');
      if (stored) searchParams = JSON.parse(stored);
    } catch(e) { console.error(e); }

    const activeLoc = $('#details-active-loc');
    if (activeLoc) activeLoc.textContent = searchParams.location === 'near-airport' ? 'Near Mumbai Airport' : searchParams.location.toUpperCase();
    const activeGuests = $('#details-active-guests');
    if (activeGuests) activeGuests.textContent = `${searchParams.travelers} Guests`;
    
    const activeDurRow = $('#details-active-duration-row');
    const activeDur = $('#details-active-duration');
    if (type === 'hotel') {
      if (activeDur) {
        const hrs = parseFloat(searchParams.layoverDuration) || 6.5;
        activeDur.textContent = `${hrs.toFixed(1)} hours`;
      }
    } else {
      if (activeDurRow) activeDurRow.classList.add('hidden');
    }

    const activeTime = $('#details-active-time');
    if (activeTime && searchParams.arrivalDateTime) {
      const landingTime = new Date(searchParams.arrivalDateTime);
      activeTime.textContent = landingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const amenList = $('#details-amenities-list');
    if (amenList) {
      amenList.innerHTML = '';
      const list = item.amenities || ["Free high-speed WiFi", "Air Conditioning", "Baggage drop", "Flexible timing", "Verified host"];
      list.forEach(a => {
        amenList.innerHTML += `
          <li class="flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700">
            <span class="text-emerald-500 text-sm">✅</span> ${a}
          </li>
        `;
      });
    }

    const highlights = $('#details-highlights');
    if (highlights) {
      highlights.innerHTML = `
        <div class="flex items-start gap-3 bg-sky-50/50 border border-sky-100/50 p-4 rounded-2xl">
          <span class="text-xl">⚡</span>
          <div>
            <h4 class="font-bold text-slate-900 text-xs">Transit Friendly</h4>
            <p class="text-[10px] text-slate-500 mt-0.5 leading-relaxed">No overnight booking constraint. Optimized hourly rates.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 bg-emerald-50/50 border border-emerald-100/50 p-4 rounded-2xl">
          <span class="text-xl">🛡️</span>
          <div>
            <h4 class="font-bold text-slate-900 text-xs">Safe Exit Certified</h4>
            <p class="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Operator assists with express security lines & transfer timings.</p>
          </div>
        </div>
      `;
    }

    const reviewsList = $('#details-reviews-list');
    if (reviewsList) {
      reviewsList.innerHTML = '';
      const reviews = [
        { author: "Markus S.", country: "Germany", rating: 5, date: "June 2026", text: "Extremely convenient during my 8-hour flight transfer. The operator was prompt and helped me calculate exact boarding timing buffers. High quality!" },
        { author: "Priya Patel", country: "India", rating: 4, date: "May 2026", text: "Clean and quiet room. Very close to Terminal 2, shuttle was ready at exit gate 2. Perfect stopover solution." },
        { author: "David L.", country: "Australia", rating: 5, date: "April 2026", text: "Outstanding service. The food was delicious and the spa massage rejuvenated me completely. Highly recommend this transit choice." }
      ];
      reviews.forEach(r => {
        reviewsList.innerHTML += `
          <div class="border-b border-gray-55 pb-4 last:border-b-0 space-y-2">
            <div class="flex justify-between items-center gap-2">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center uppercase">${r.author[0]}</div>
                <div>
                  <strong class="text-xs font-extrabold text-slate-900">${r.author}</strong>
                  <span class="text-[10px] text-slate-400 block">${r.country} • ${r.date}</span>
                </div>
              </div>
              <span class="text-xs font-bold text-amber-500">${'★'.repeat(r.rating)}</span>
            </div>
            <p class="text-xs text-slate-650 leading-relaxed">${r.text}</p>
          </div>
        `;
      });
    }

    const addBtn = $('#details-add-itinerary');
    if (addBtn) {
      addBtn.onclick = () => {
        layoverx.addToItinerary(type, id);
      };
    }

    const bookBtn = $('#details-book-instant');
    if (bookBtn) {
      bookBtn.onclick = () => {
        layoverx.addToItinerary(type, id);
        setTimeout(() => window.location.href = 'my-itinerary.html', 800);
      };
    }
  }

  function initItineraryWorkspacePage() {
    if (!window.location.pathname.includes('my-itinerary')) return;

    renderWorkspaceItinerary();
    loadWorkspaceDraftsSelect();
  }

  function renderWorkspaceItinerary() {
    const timelineList = $('#workspace-timeline-list');
    const emptyState = $('#workspace-empty');
    const usedHrsEl = $('#workspace-used-hours');
    const totalHrsEl = $('#workspace-total-hours');
    const remainingHrsEl = $('#workspace-remaining-hours');
    const barUsed = $('#workspace-bar-used');
    const barBuffer = $('#workspace-bar-buffer');
    const warningEl = $('#workspace-warning');
    const countEl = $('#workspace-items-count');
    const summaryPrices = $('#workspace-summary-prices');
    const totalPriceEl = $('#workspace-total-price');

    if (!timelineList) return;

    let itinerary = [];
    try {
      const stored = localStorage.getItem('layoverx_current_itinerary');
      if (stored) itinerary = JSON.parse(stored);
    } catch(e) { console.error(e); }

    let searchParams = { travelers: '2', layoverDuration: 6.5, location: 'near-airport', arrivalDateTime: '' };
    try {
      const stored = localStorage.getItem('layoverx_search_params');
      if (stored) searchParams = JSON.parse(stored);
    } catch(e) { console.error(e); }

    const totalHours = searchParams.layoverDuration || 6.5;
    const safeWindow = Math.max(0, totalHours - 3.5);

    if (totalHrsEl) totalHrsEl.textContent = `${totalHours.toFixed(1)} Hours`;

    if (itinerary.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (timelineList) timelineList.classList.add('hidden');
      if (usedHrsEl) usedHrsEl.textContent = `0.0h`;
      if (remainingHrsEl) remainingHrsEl.textContent = `${safeWindow.toFixed(1)}h`;
      if (barUsed) barUsed.style.width = `0%`;
      if (barBuffer) barBuffer.style.width = `${(3.5 / totalHours * 100).toFixed(1)}%`;
      if (warningEl) warningEl.classList.add('hidden');
      if (countEl) countEl.textContent = `0 items`;
      if (summaryPrices) summaryPrices.innerHTML = `<li class="text-slate-400 italic">No items selected</li>`;
      if (totalPriceEl) totalPriceEl.textContent = `₹0`;
      
      const chkBtn = $('#btn-checkout');
      if (chkBtn) {
        chkBtn.disabled = true;
        chkBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (timelineList) timelineList.classList.remove('hidden');

    timelineList.innerHTML = '';
    if (summaryPrices) summaryPrices.innerHTML = '';

    let usedHours = 0;
    let totalCost = 0;
    const travelersCount = parseInt(searchParams.travelers) || 2;

    itinerary.forEach((item, idx) => {
      usedHours += parseFloat(item.duration) || 0;
      
      let itemCost = item.price;
      if (item.type === 'activity' || item.type === 'spa' || item.type === 'gaming') {
        itemCost = item.price * travelersCount;
      }
      totalCost += itemCost;

      if (summaryPrices) {
        let catIcon = "🏨";
        if (item.type === 'dining') catIcon = "🍽️";
        else if (item.type === 'spa') catIcon = "💆";
        else if (item.type === 'gaming') catIcon = "🎮";
        else if (item.type === 'activity') catIcon = "📸";
        else if (item.type === 'transfer') catIcon = "🚖";
        
        summaryPrices.innerHTML += `
          <li class="flex items-start justify-between gap-4">
            <span class="flex items-center gap-2"><span>${catIcon}</span> ${item.name}</span>
            <strong class="font-bold text-slate-900 flex-shrink-0">₹${itemCost.toLocaleString()}</strong>
          </li>
        `;
      }

      let optionsHtml = '';
      if (item.type === 'hotel') {
        optionsHtml = [3, 6, 12, 24].map(o => `<option value="${o}" ${item.duration == o ? 'selected' : ''}>${o} Hours Stay</option>`).join('');
      } else if (item.type === 'dining') {
        optionsHtml = [1, 1.5, 2].map(o => `<option value="${o}" ${item.duration == o ? 'selected' : ''}>${o} Hours dining</option>`).join('');
      } else if (item.type === 'spa') {
        optionsHtml = [0.5, 1, 1.5, 2].map(o => `<option value="${o}" ${item.duration == o ? 'selected' : ''}>${o === 0.5 ? '30 Mins Session' : o + ' Hours Session'}</option>`).join('');
      } else if (item.type === 'gaming') {
        optionsHtml = [1, 2, 3].map(o => `<option value="${o}" ${item.duration == o ? 'selected' : ''}>${o} Hours Play</option>`).join('');
      } else if (item.type === 'activity') {
        optionsHtml = [2, 3, 4, 5, 6].map(o => `<option value="${o}" ${item.duration == o ? 'selected' : ''}>${o} Hours Tour</option>`).join('');
      } else if (item.type === 'transfer') {
        optionsHtml = [0.5, 1].map(o => `<option value="${o}" ${item.duration == o ? 'selected' : ''}>${o === 0.5 ? '30 Mins Cab' : '1 Hour Cab'}</option>`).join('');
      }

      let categoryColor = "bg-sky-500";
      if (item.type === 'hotel') categoryColor = "bg-emerald-500";
      else if (item.type === 'dining') categoryColor = "bg-orange-500";
      else if (item.type === 'spa') categoryColor = "bg-purple-500";
      
      timelineList.innerHTML += `
        <div class="relative bg-white border border-gray-200 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition flex gap-4">
          <div class="absolute -left-[31px] top-6 w-5 h-5 rounded-full ${categoryColor} border-4 border-white shadow-sm"></div>
          
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover"/>
          </div>
          
          <div class="flex-grow flex flex-col justify-between">
            <div class="flex justify-between items-start gap-4">
              <div>
                <span class="text-[10px] uppercase font-black text-sky-600 block mb-0.5 tracking-wider">${item.type}</span>
                <h4 class="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">${item.name}</h4>
                <p class="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-1">${item.desc || 'Flexible transit hours'}</p>
              </div>
              
              <div class="flex items-center gap-1.5 flex-shrink-0 bg-slate-50 border border-slate-100 p-1 rounded-xl">
                <button onclick="layoverx.reorderWorkspaceItem(${idx}, 'up')" class="p-1 hover:bg-white rounded-lg text-slate-500 hover:text-sky-600 transition disabled:opacity-20" ${idx === 0 ? 'disabled' : ''} title="Move Up">
                  ▲
                </button>
                <button onclick="layoverx.reorderWorkspaceItem(${idx}, 'down')" class="p-1 hover:bg-white rounded-lg text-slate-500 hover:text-sky-600 transition disabled:opacity-20" ${idx === itinerary.length - 1 ? 'disabled' : ''} title="Move Down">
                  ▼
                </button>
                <div class="w-[1px] h-3.5 bg-slate-200 mx-0.5"></div>
                <button onclick="layoverx.removeWorkspaceItem(${idx})" class="p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition" title="Delete">
                  🗑️
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-100">
              <div class="flex items-center gap-2">
                <label class="text-[10px] text-slate-500 font-extrabold uppercase whitespace-nowrap">Duration:</label>
                <select onchange="layoverx.updateWorkspaceItemDuration(${idx}, this.value)" class="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-800 focus:ring-1 focus:ring-sky-500 cursor-pointer">
                  ${optionsHtml}
                </select>
              </div>
              <strong class="text-xs sm:text-sm font-black text-sky-700">₹${itemCost.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      `;
    });

    if (usedHrsEl) usedHrsEl.textContent = `${usedHours.toFixed(1)}h`;
    if (countEl) countEl.textContent = `${itinerary.length} items`;
    if (totalPriceEl) totalPriceEl.textContent = `₹${totalCost.toLocaleString()}`;

    const remainingVal = safeWindow - usedHours;
    if (remainingHrsEl) {
      remainingHrsEl.textContent = `${remainingVal.toFixed(1)}h`;
      if (remainingVal < 0) remainingHrsEl.className = "text-sm font-extrabold text-red-600";
      else remainingHrsEl.className = "text-sm font-extrabold text-indigo-800";
    }

    if (barUsed) {
      const pctUsed = Math.min(100, (usedHours / totalHours) * 100);
      barUsed.style.width = `${pctUsed.toFixed(1)}%`;
      if (remainingVal < 0) {
        barUsed.className = "h-full bg-red-500 transition-all duration-500";
      } else {
        barUsed.className = "h-full bg-sky-500 transition-all duration-500";
      }
    }
    if (barBuffer) {
      const pctBuffer = (3.5 / totalHours) * 100;
      barBuffer.style.width = `${pctBuffer.toFixed(1)}%`;
    }

    const chkBtn = $('#btn-checkout');
    const draftBtn = $('#btn-save-draft');
    if (remainingVal < 0) {
      if (warningEl) {
        warningEl.innerHTML = `<span>⚠️ Your selected activities duration (${usedHours.toFixed(1)}h) exceeds safe layover exit window (${safeWindow.toFixed(1)}h). Remove some items or reduce timings.</span>`;
        warningEl.classList.remove('hidden');
        warningEl.classList.add('flex');
      }
      if (chkBtn) { chkBtn.disabled = true; chkBtn.classList.add('opacity-50', 'cursor-not-allowed'); }
      if (draftBtn) { draftBtn.disabled = true; draftBtn.classList.add('opacity-50', 'cursor-not-allowed'); }
    } else {
      if (warningEl) warningEl.classList.add('hidden');
      if (chkBtn) { chkBtn.disabled = false; chkBtn.classList.remove('opacity-50', 'cursor-not-allowed'); }
      if (draftBtn) { draftBtn.disabled = false; draftBtn.classList.remove('opacity-50', 'cursor-not-allowed'); }
    }
  }

  function loadWorkspaceDraftsSelect() {
    const select = $('#workspace-drafts-select');
    if (!select) return;

    let drafts = [];
    try {
      const stored = localStorage.getItem('layoverx_saved_plans');
      if (stored) drafts = JSON.parse(stored);
    } catch(e) { console.error(e); }

    select.innerHTML = '<option value="">-- Load Saved Draft --</option>';
    drafts.forEach((d, idx) => {
      select.innerHTML += `<option value="${idx}">Draft #${idx + 1} - ${d.cost} (${d.dateSaved})</option>`;
    });

    select.onchange = function() {
      const val = this.value;
      if (val !== "") {
        layoverx.loadWorkspaceDraft(parseInt(val));
      }
    };
  }

  function initCheckoutPage() {
    if (!window.location.pathname.includes('checkout')) return;

    let itinerary = [];
    try {
      const stored = localStorage.getItem('layoverx_current_itinerary');
      if (stored) itinerary = JSON.parse(stored);
    } catch(e) { console.error(e); }

    const listEl = $('#checkout-summary-list');
    const totalEl = $('#checkout-total-price');

    if (!listEl || itinerary.length === 0) {
      if (listEl) listEl.innerHTML = '<li class="text-slate-400 italic">No services in cart.</li>';
      return;
    }

    let calculations = null;
    try {
      const storedCalc = localStorage.getItem('layoverx_active_calculation');
      if (storedCalc) calculations = JSON.parse(storedCalc);
    } catch(e) { console.error(e); }

    if (!calculations) {
      calculations = window.layoverx.calculateItineraryPrice(itinerary);
    }

    listEl.innerHTML = '';
    calculations.itemPricingDetails.forEach(item => {
      let catIcon = "🏨";
      if (item.type === 'dining') catIcon = "🍽️";
      else if (item.type === 'spa') catIcon = "💆";
      else if (item.type === 'gaming') catIcon = "🎮";
      else if (item.type === 'activity') catIcon = "📸";
      else if (item.type === 'transfer') catIcon = "🚖";

      listEl.innerHTML += `
        <li class="flex items-start justify-between gap-4">
          <span class="flex items-center gap-2"><span>${catIcon}</span> ${item.name}</span>
          <strong class="font-bold text-slate-900 flex-shrink-0">₹${item.finalTotalCost.toFixed(2)}</strong>
        </li>
      `;
    });

    if (calculations.totalDiscount > 0) {
      listEl.innerHTML += `
        <li class="flex items-start justify-between gap-4 text-emerald-650 font-bold border-t border-dashed border-gray-200 pt-2">
          <span>Discounts & Coupons</span>
          <span>-₹${calculations.totalDiscount.toFixed(2)}</span>
        </li>
      `;
    }
    const fees = calculations.convenienceFee + calculations.serviceFee + calculations.taxes;
    if (fees > 0) {
      listEl.innerHTML += `
        <li class="flex items-start justify-between gap-4 text-slate-500">
          <span>Taxes & Service Fees</span>
          <span>+₹${fees.toFixed(2)}</span>
        </li>
      `;
    }

    if (totalEl) totalEl.textContent = `₹${calculations.grandTotal.toFixed(2)}`;

    let tempBooking = null;
    try {
      const storedTemp = localStorage.getItem('layoverx_temp_booking');
      if (storedTemp) tempBooking = JSON.parse(storedTemp);
    } catch(e) { console.error(e); }

    const nameVal = (tempBooking && tempBooking.passenger) || localStorage.getItem('layoverx_passenger_name');
    const passportVal = (tempBooking && tempBooking.passport) || localStorage.getItem('layoverx_passport_number');
    const nationalityVal = tempBooking && tempBooking.nationality;
    const flightVal = (tempBooking && tempBooking.incomingFlight) || localStorage.getItem('layoverx_flight_number');
    const flightOutVal = tempBooking && tempBooking.outgoingFlight;
    const emergencyVal = (tempBooking && tempBooking.emergencyContact) || localStorage.getItem('layoverx_emergency_contact');

    if (nameVal && $('#chk-traveler-name')) $('#chk-traveler-name').value = nameVal;
    if (passportVal && $('#chk-passport')) $('#chk-passport').value = passportVal;
    if (nationalityVal && $('#chk-traveler-nationality')) $('#chk-traveler-nationality').value = nationalityVal;
    if (flightVal && $('#chk-flight-in')) $('#chk-flight-in').value = flightVal;
    if (flightOutVal && $('#chk-flight-departure')) $('#chk-flight-departure').value = flightOutVal;
    if (emergencyVal && $('#chk-emergency')) $('#chk-emergency').value = emergencyVal;

    if (window.supabase) {
      window.supabase.auth.getSession().then(({ data: { session } }) => {
        const user = session?.user;
        if (user) {
          const nameInput = $('#chk-traveler-name');
          if (nameInput && !nameInput.value) {
            nameInput.value = user.user_metadata?.full_name || user.email.split('@')[0];
          }
        }
      });
      window.supabase.auth.onAuthStateChange((event, session) => {
        const user = session?.user;
        if (user) {
          const nameInput = $('#chk-traveler-name');
          if (nameInput && !nameInput.value) {
            nameInput.value = user.user_metadata?.full_name || user.email.split('@')[0];
          }
        }
      });
    }
  }

  function initMyTripsPage() {
    if (!window.location.pathname.includes('my-trips')) return;

    layoverx.switchTripsTab('upcoming');

    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get('bookingId');
    if (bookingId) {
      setTimeout(() => {
        layoverx.openTripReceipt(bookingId);
      }, 500);
    }
  }

  async function renderUpcomingTrips() {
    const container = $('#tab-content-upcoming');
    if (!container) return;

    let trips = getLocalCompletedTrips();

    if (window.supabase) {
      try {
        const { data: { session } } = await window.supabase.auth.getSession();
        const user = session?.user;
        if (user) {
          const { data: dbTrips, error: dbError } = await window.supabase
            .from("trips")
            .select("*")
            .eq("uid", user.id);
          if (dbError) throw dbError;
          const dbTripsMapped = (dbTrips || []).map(row => row.details || mapTripFromDatabase(row));
          if (dbTripsMapped.length > 0) {
            trips = dbTripsMapped;
          }
        }
      } catch (dbError) {
        console.warn("Could not query Supabase upcoming trips:", dbError);
      }
    }

    if (trips.length === 0) {
      container.innerHTML = `
        <div class="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <div class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">📅</div>
          <h3 class="text-base font-bold text-slate-900 mb-1">No Upcoming Bookings</h3>
          <p class="text-slate-500 text-xs max-w-sm mx-auto mb-6">You don't have any finalized stopovers booked yet. Complete checkout to secure your reservations.</p>
          <a href="plan-my-layover.html" class="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition shadow">
            Start Planning
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    trips.forEach(t => {
      const servicesCount = t.items ? t.items.length : 0;
      const dateLabel = t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent';
      
      container.innerHTML += `
        <div class="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="inline-block text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-100">Confirmed Booking</span>
              <span class="text-[10px] text-slate-400 font-bold">Ref: ${t.bookingId}</span>
            </div>
            <h3 class="text-base sm:text-lg font-black text-slate-900">Stopover in Mumbai (${servicesCount} Services Booked)</h3>
            <p class="text-xs text-slate-500 font-semibold">Traveler: ${t.passenger} • Flight Incoming: ${t.incomingFlight} • Date: ${dateLabel}</p>
          </div>
          <div class="flex gap-2.5 sm:self-center w-full sm:w-auto">
            <button onclick="layoverx.openTripReceipt('${t.bookingId}')" class="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer">
              📄 View Receipt &amp; Barcode
            </button>
          </div>
        </div>
      `;
    });
  }

  function renderDraftTrips() {
    const container = $('#tab-content-drafts');
    if (!container) return;

    let drafts = [];
    try {
      const stored = localStorage.getItem('layoverx_saved_plans');
      if (stored) drafts = JSON.parse(stored);
    } catch(e) { console.error(e); }

    if (drafts.length === 0) {
      container.innerHTML = `
        <div class="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <div class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">💾</div>
          <h3 class="text-base font-bold text-slate-900 mb-1">No Saved Drafts</h3>
          <p class="text-slate-500 text-xs max-w-sm mx-auto mb-6">Build a timeline and click "Save Draft" in the itinerary workspace to access them here.</p>
          <a href="my-itinerary.html" class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow">
            Open Planner
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    drafts.forEach((d, idx) => {
      const itemsCount = d.details && d.details.items ? d.details.items.length : 0;
      
      container.innerHTML += `
        <div class="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div class="space-y-1.5">
            <span class="text-[10px] uppercase font-black text-sky-600 block tracking-wider">Draft Itinerary</span>
            <h3 class="text-base sm:text-lg font-black text-slate-900">Stopover Proposal #${idx + 1} (${itemsCount} items)</h3>
            <p class="text-xs text-slate-500 font-medium">Proposed cost: <span class="font-bold text-sky-700">${d.cost}</span> • Saved on ${d.dateSaved}</p>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <button onclick="layoverx.loadWorkspaceDraft(${idx}); window.location.href='my-itinerary.html'" class="flex-grow sm:flex-grow-0 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition shadow">
              Load In Planner
            </button>
            <button onclick="layoverx.deleteDraftTrips(${idx})" class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-650 text-xs font-bold rounded-xl border border-red-100 transition">
              Delete
            </button>
          </div>
        </div>
      `;
    });
  }

  function renderPastTrips() {
    const container = $('#tab-content-past');
    if (!container) return;

    let trips = getLocalCompletedTrips();

    if (trips.length === 0) {
      container.innerHTML = `
        <div class="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <div class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">⏳</div>
          <h3 class="text-base font-bold text-slate-900 mb-1">No Past Trips Found</h3>
          <p class="text-slate-500 text-xs max-w-sm mx-auto mb-6">Trips you complete will appear here as historic records with receipt print downloads.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    trips.forEach(t => {
      const dateLabel = t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent';
      container.innerHTML += `
        <div class="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div class="space-y-1.5">
            <span class="inline-block text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">Archived Stay</span>
            <h3 class="text-base sm:text-lg font-black text-slate-900">Stopover Proposal Ref: ${t.bookingId}</h3>
            <p class="text-xs text-slate-500">Paid: <span class="font-bold text-slate-900">${t.totalCost}</span> • Completed on ${dateLabel}</p>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <button onclick="layoverx.openTripReceipt('${t.bookingId}')" class="w-full sm:w-auto px-4 py-2 bg-slate-55 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition shadow flex items-center justify-center gap-1.5 cursor-pointer">
              📄 View Invoice Receipt
            </button>
          </div>
        </div>
      `;
    });
  }

  // Missing Itinerary, Draft, and Checkout implementations
  function addToItinerary(type, id) {
    let dict = null;
    if (type === 'hotel') dict = HOTELS;
    else if (type === 'dining') dict = DINING;
    else if (type === 'spa') dict = SPA_WELLNESS;
    else if (type === 'gaming') dict = GAMING_ENTERTAINMENT;
    else if (type === 'activity') dict = EXPERIENCES;
    else if (type === 'transfer') dict = TRANSFERS;

    const dictItem = dict ? dict[id] : null;
    if (!dictItem) {
      showToast("Service details not found.", "error");
      return;
    }

    let itinerary = [];
    try {
      const stored = localStorage.getItem('layoverx_current_itinerary');
      if (stored) itinerary = JSON.parse(stored);
    } catch(e) { console.error(e); }

    // Unique check for hotel/dining/transfer
    if (type === 'hotel' || type === 'dining' || type === 'transfer') {
      const exists = itinerary.some(item => item.type === type);
      if (exists) {
        showToast(`You have already added a ${type} to your itinerary. Please remove it first to select a different one.`, "warning");
        return;
      }
    } else {
      const exists = itinerary.some(item => item.type === type && item.id == id);
      if (exists) {
        showToast("This item is already in your itinerary!", "warning");
        return;
      }
    }

    let defaultDuration = 1.0;
    if (type === 'hotel') defaultDuration = 6.0;
    else if (type === 'dining') defaultDuration = 1.5;
    else if (type === 'spa') defaultDuration = 1.0;
    else if (type === 'gaming') defaultDuration = 2.0;
    else if (type === 'activity') defaultDuration = 3.0;
    else if (type === 'transfer') defaultDuration = 0.5;

    const duration = dictItem.duration !== undefined ? parseFloat(dictItem.duration) : defaultDuration;

    itinerary.push({
      type,
      id,
      name: dictItem.name,
      price: dictItem.price,
      duration: duration,
      image: dictItem.image,
      desc: dictItem.desc || ''
    });

    try {
      localStorage.setItem('layoverx_current_itinerary', JSON.stringify(itinerary));
    } catch(e) { console.error(e); }

    updateItineraryBadges();
    showToast(`Added "${dictItem.name}" to Itinerary Workspace.`, "success");

    if (window.layoverxAnalytics) {
      window.layoverxAnalytics.trackEvent("Item Added To Cart", { type, id, name: dictItem.name, price: dictItem.price });
    }
  }

  function reorderWorkspaceItem(idx, direction) {
    let itinerary = [];
    try {
      const stored = localStorage.getItem('layoverx_current_itinerary');
      if (stored) itinerary = JSON.parse(stored);
    } catch(e) { console.error(e); }

    if (direction === 'up' && idx > 0) {
      const temp = itinerary[idx];
      itinerary[idx] = itinerary[idx - 1];
      itinerary[idx - 1] = temp;
    } else if (direction === 'down' && idx < itinerary.length - 1) {
      const temp = itinerary[idx];
      itinerary[idx] = itinerary[idx + 1];
      itinerary[idx + 1] = temp;
    }

    try {
      localStorage.setItem('layoverx_current_itinerary', JSON.stringify(itinerary));
    } catch(e) { console.error(e); }

    renderWorkspaceItinerary();
  }

  function removeWorkspaceItem(idx) {
    let itinerary = [];
    try {
      const stored = localStorage.getItem('layoverx_current_itinerary');
      if (stored) itinerary = JSON.parse(stored);
    } catch(e) { console.error(e); }

    if (itinerary[idx]) {
      const name = itinerary[idx].name;
      const type = itinerary[idx].type;
      const id = itinerary[idx].id;
      itinerary.splice(idx, 1);
      showToast(`Removed "${name}" from Itinerary.`, "info");

      if (window.layoverxAnalytics) {
        window.layoverxAnalytics.trackEvent("Item Removed From Cart", { type, id, name });
      }
    }

    try {
      localStorage.setItem('layoverx_current_itinerary', JSON.stringify(itinerary));
    } catch(e) { console.error(e); }

    updateItineraryBadges();
    renderWorkspaceItinerary();
  }

  function updateWorkspaceItemDuration(idx, duration) {
    let itinerary = [];
    try {
      const stored = localStorage.getItem('layoverx_current_itinerary');
      if (stored) itinerary = JSON.parse(stored);
    } catch(e) { console.error(e); }

    if (itinerary[idx]) {
      itinerary[idx].duration = parseFloat(duration);
    }

    try {
      localStorage.setItem('layoverx_current_itinerary', JSON.stringify(itinerary));
    } catch(e) { console.error(e); }

    renderWorkspaceItinerary();
  }

  async function saveItineraryDraft() {
    let itinerary = [];
    try {
      const stored = localStorage.getItem('layoverx_current_itinerary');
      if (stored) itinerary = JSON.parse(stored);
    } catch(e) { console.error(e); }

    if (itinerary.length === 0) {
      showToast("Cannot save an empty itinerary draft.", "warning");
      return;
    }

    const priceText = $('#workspace-total-price')?.textContent || '₹0';

    const draft = {
      id: Date.now(),
      cost: priceText,
      dateSaved: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: {
        items: itinerary
      }
    };

    let drafts = [];
    try {
      const storedDrafts = localStorage.getItem('layoverx_saved_plans');
      if (storedDrafts) drafts = JSON.parse(storedDrafts);
    } catch(e) { console.error(e); }

    drafts.push(draft);
    localStorage.setItem('layoverx_saved_plans', JSON.stringify(drafts));
    
    showToast("Itinerary draft saved successfully!", "success");
    loadWorkspaceDraftsSelect();
  }

  function loadWorkspaceDraft(draftIdx) {
    let drafts = [];
    try {
      const storedDrafts = localStorage.getItem('layoverx_saved_plans');
      if (storedDrafts) drafts = JSON.parse(storedDrafts);
    } catch(e) { console.error(e); }

    const draft = drafts[draftIdx];
    if (draft && draft.details && draft.details.items) {
      localStorage.setItem('layoverx_current_itinerary', JSON.stringify(draft.details.items));
      updateItineraryBadges();
      if (window.location.pathname.includes('my-itinerary')) {
        renderWorkspaceItinerary();
      }
      showToast("Itinerary draft loaded successfully!", "success");
    } else {
      showToast("Failed to load draft.", "error");
    }
  }

  function duplicateItineraryDraft() {
    const select = $('#workspace-drafts-select');
    if (!select || select.value === "") {
      showToast("Please select a saved draft to duplicate first.", "warning");
      return;
    }

    const idx = parseInt(select.value);
    let drafts = [];
    try {
      const storedDrafts = localStorage.getItem('layoverx_saved_plans');
      if (storedDrafts) drafts = JSON.parse(storedDrafts);
    } catch(e) { console.error(e); }

    const draft = drafts[idx];
    if (draft) {
      const duplicated = JSON.parse(JSON.stringify(draft));
      duplicated.id = Date.now();
      duplicated.dateSaved = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (Copy)';
      drafts.push(duplicated);
      localStorage.setItem('layoverx_saved_plans', JSON.stringify(drafts));
      showToast("Draft duplicated successfully!", "success");
      loadWorkspaceDraftsSelect();
    }
  }

  function switchExperienceTab(tab) {
    const tabs = ['tours', 'spa', 'gaming'];
    tabs.forEach(t => {
      const content = document.getElementById(`tab-content-${t}`);
      const btn = document.getElementById(`tab-exp-${t}`);
      if (content) {
        if (t === tab) content.classList.remove('hidden');
        else content.classList.add('hidden');
      }
      if (btn) {
        if (t === tab) {
          btn.className = 'px-3 py-1.5 text-xs font-bold rounded-lg transition bg-white text-sky-700 shadow-sm';
        } else {
          btn.className = 'px-3 py-1.5 text-xs font-bold rounded-lg transition text-gray-655 hover:text-gray-900';
        }
      }
    });
  }

  function savePlannerToItinerary() {
    const travelerName = $('#review-traveler-name')?.value || '';
    const passportNumber = $('#review-passport')?.value || '';
    const flightNumber = $('#review-flight-in')?.value || '';
    const emergencyContact = $('#review-emergency')?.value || '';

    if (travelerName) localStorage.setItem('layoverx_passenger_name', travelerName);
    if (passportNumber) localStorage.setItem('layoverx_passport_number', passportNumber);
    if (flightNumber) localStorage.setItem('layoverx_flight_number', flightNumber);
    if (emergencyContact) localStorage.setItem('layoverx_emergency_contact', emergencyContact);

    const cab = state.currentPlan.cabType || 'sedan';
    const cItem = TRANSFERS[cab];
    const itinerary = [];
    if (cItem) {
      itinerary.push({
        type: 'transfer',
        id: cab,
        name: cItem.name,
        price: cItem.price,
        duration: 0.5,
        image: cItem.image,
        desc: cItem.desc || ''
      });
    }

    (state.currentPlan.items || []).forEach(item => {
      let dict = null;
      if (item.type === 'hotel') dict = HOTELS;
      else if (item.type === 'dining') dict = DINING;
      else if (item.type === 'activity') dict = EXPERIENCES;
      else if (item.type === 'spa') dict = SPA_WELLNESS;
      else if (item.type === 'gaming') dict = GAMING_ENTERTAINMENT;
      
      const dictItem = dict ? dict[item.id] : null;
      if (dictItem) {
        itinerary.push({
          type: item.type,
          id: item.id,
          name: dictItem.name,
          price: dictItem.price,
          duration: item.duration,
          image: dictItem.image,
          desc: dictItem.desc || ''
        });
      }
    });

    try {
      localStorage.setItem('layoverx_current_itinerary', JSON.stringify(itinerary));
    } catch(e) { console.error(e); }

    updateItineraryBadges();
    proceedToCheckout();
  }

  function proceedToCheckout() {
    let itinerary = [];
    try {
      const stored = localStorage.getItem('layoverx_current_itinerary');
      if (stored) itinerary = JSON.parse(stored);
    } catch(e) { console.error(e); }

    if (itinerary.length === 0) {
      showToast("Your itinerary is empty. Add services first.", "warning");
      return;
    }

    let searchParams = { travelers: '2', layoverDuration: 6.5, location: 'near-airport', arrivalDateTime: '' };
    try {
      const stored = localStorage.getItem('layoverx_search_params');
      if (stored) searchParams = JSON.parse(stored);
    } catch(e) { console.error(e); }

    const totalHours = searchParams.layoverDuration || 6.5;
    const safeWindow = Math.max(0, totalHours - 3.5);
    let usedHours = 0;
    itinerary.forEach(item => {
      usedHours += parseFloat(item.duration) || 0;
    });

    if (usedHours > safeWindow) {
      showToast("Your itinerary duration exceeds your safe layover exit window. Please adjust timings first.", "error");
      return;
    }

    if (window.layoverxAnalytics) {
      window.layoverxAnalytics.trackEvent("Checkout Started", { itemsCount: itinerary.length, usedHours });
    }

    window.location.href = 'booking-review.html';
  }

  async function handleCheckoutSubmit(e) {
    e.preventDefault();
    const btn = $('#btn-submit-payment');
    if (btn && btn.disabled) return;

    if (btn) {
      btn.disabled = true;
      btn.classList.add('opacity-80', 'cursor-not-allowed');
      btn.innerHTML = 'Processing Payment...';
    }

    let itinerary = [];
    try {
      const stored = localStorage.getItem('layoverx_current_itinerary');
      if (stored) itinerary = JSON.parse(stored);
    } catch(e) { console.error(e); }

    let searchParams = { travelers: '2', layoverDuration: 6.5, location: 'near-airport', arrivalDateTime: '' };
    try {
      const stored = localStorage.getItem('layoverx_search_params');
      if (stored) searchParams = JSON.parse(stored);
    } catch(e) { console.error(e); }

    const passenger = $('#chk-traveler-name')?.value || 'Traveler';
    const passport = $('#chk-passport')?.value || 'PASS-MUM-1';
    const incomingFlight = $('#chk-flight-in')?.value || 'AI-101';
    const emergencyContact = $('#chk-emergency')?.value || '';
    const totalCost = $('#checkout-total-price')?.textContent || '₹0';

    const bookingId = `LX-${Math.floor(Math.random() * 90000 + 10000)}-CSMIA`;

    let user = null;
    if (window.supabase) {
      const { data: { session } } = await window.supabase.auth.getSession();
      user = session?.user;
    }

    const tripData = {
      bookingId,
      items: itinerary,
      passenger,
      passport,
      incomingFlight,
      emergencyContact,
      totalCost,
      createdAt: new Date().toISOString(),
      uid: user ? user.id : 'guest-traveler'
    };

    let completedTrips = getLocalCompletedTrips();
    completedTrips.push(tripData);
    localStorage.setItem('layoverx_completed_trips', JSON.stringify(completedTrips));

    if (user && window.supabase) {
      try {
        const payload = mapTripToDatabase(tripData);
        const { error } = await window.supabase.from("trips").upsert(payload);
        if (error) throw error;
      } catch (dbError) {
        console.warn("Supabase trip save failed, saved locally:", dbError);
      }
    }

    await new Promise(r => setTimeout(r, 1200));

    localStorage.removeItem('layoverx_current_itinerary');
    updateItineraryBadges();

    showToast("Booking completed! Flight tracked, pickup scheduled.", "success");
    window.location.href = `my-trips.html?bookingId=${bookingId}`;
  }

  function getLocalCompletedTrips() {
    let completed = [];
    try {
      const stored = localStorage.getItem('layoverx_completed_trips');
      if (stored) completed = JSON.parse(stored);
    } catch(e) { console.error(e); }
    return completed;
  }

  function improvePlanWithAi() {
    let itinerary = [];
    try {
      const stored = localStorage.getItem('layoverx_current_itinerary');
      if (stored) itinerary = JSON.parse(stored);
    } catch(e) { console.error(e); }

    let searchParams = { travelers: '2', layoverDuration: 6.5, location: 'near-airport', arrivalDateTime: '' };
    try {
      const stored = localStorage.getItem('layoverx_search_params');
      if (stored) searchParams = JSON.parse(stored);
    } catch(e) { console.error(e); }

    const totalHours = searchParams.layoverDuration || 6.5;
    const safeWindow = Math.max(0, totalHours - 3.5);
    
    let usedHours = 0;
    itinerary.forEach(item => {
      usedHours += parseFloat(item.duration) || 0;
    });

    let remaining = safeWindow - usedHours;
    if (remaining <= 0.5) {
      showToast("Your itinerary is already fully scheduled for your exit window!", "info");
      return;
    }

    const categories = ['hotel', 'dining', 'activity', 'spa', 'gaming'];
    const usedCategories = itinerary.map(item => item.type);
    const missing = categories.filter(c => !usedCategories.includes(c));

    if (missing.length === 0) {
      showToast("You have services from all categories in your itinerary already!", "info");
      return;
    }

    let addedAny = false;
    for (const type of missing) {
      let dict = null;
      let defaultDuration = 1.0;
      if (type === 'hotel') { dict = HOTELS; defaultDuration = 6.0; }
      else if (type === 'dining') { dict = DINING; defaultDuration = 1.5; }
      else if (type === 'spa') { dict = SPA_WELLNESS; defaultDuration = 1.0; }
      else if (type === 'gaming') { dict = GAMING_ENTERTAINMENT; defaultDuration = 2.0; }
      else if (type === 'activity') { dict = EXPERIENCES; defaultDuration = 3.0; }

      if (dict) {
        const keys = Object.keys(dict);
        if (keys.length > 0) {
          const dictItem = dict[keys[0]];
          const dur = dictItem.duration !== undefined ? parseFloat(dictItem.duration) : defaultDuration;
          if (dur <= remaining) {
            itinerary.push({
              type,
              id: dictItem.id,
              name: dictItem.name,
              price: dictItem.price,
              duration: dur,
              image: dictItem.image,
              desc: dictItem.desc || ''
            });
            remaining -= dur;
            addedAny = true;
            showToast(`AI co-pilot added missing category: ${type} ("${dictItem.name}") to utilize empty time slots.`, "success");
            break;
          }
        }
      }
    }

    if (addedAny) {
      try {
        localStorage.setItem('layoverx_current_itinerary', JSON.stringify(itinerary));
      } catch(e) { console.error(e); }
      updateItineraryBadges();
      renderWorkspaceItinerary();
    } else {
      showToast("No missing service fits in your remaining exit window.", "info");
    }
  }

  function handleAiCopilotSubmit(e) {
    e.preventDefault();
    const budget = $('#copilot-budget').value;
    const interest = $('#copilot-interest').value;

    let searchParams = { travelers: '2', layoverDuration: 6.5, location: 'near-airport', arrivalDateTime: '' };
    try {
      const stored = localStorage.getItem('layoverx_search_params');
      if (stored) searchParams = JSON.parse(stored);
    } catch(e) { console.error(e); }

    const totalHours = searchParams.layoverDuration || 6.5;
    const safeWindow = Math.max(0, totalHours - 3.5);

    let itinerary = [];
    let remaining = safeWindow;

    if (interest === 'relaxed' && remaining >= 3.0) {
      let hId = 3;
      if (budget === 'luxury') hId = 1;
      else if (budget === 'moderate') hId = 4;

      const h = HOTELS[hId];
      if (h) {
        const dur = Math.min(6.0, remaining);
        itinerary.push({
          type: 'hotel',
          id: hId,
          name: h.name,
          price: h.price,
          duration: dur,
          image: h.image,
          desc: h.desc
        });
        remaining -= dur;
      }
    }

    if (remaining >= 0.5) {
      let cabId = 'sedan';
      if (budget === 'luxury') cabId = 'luxury';
      else if (budget === 'moderate') cabId = 'suv';

      const c = TRANSFERS[cabId];
      if (c) {
        itinerary.push({
          type: 'transfer',
          id: cabId,
          name: c.name,
          price: c.price,
          duration: 0.5,
          image: c.image,
          desc: c.desc
        });
        remaining -= 0.5;
      }
    }

    if (remaining >= 1.5) {
      let dId = 3;
      if (budget === 'luxury') dId = 2;
      else if (budget === 'moderate') dId = 1;

      const d = DINING[dId];
      if (d) {
        itinerary.push({
          type: 'dining',
          id: dId,
          name: d.name,
          price: d.price,
          duration: 1.5,
          image: d.image,
          desc: d.desc
        });
        remaining -= 1.5;
      }
    }

    if (interest === 'explorer' && remaining >= 3.0) {
      const a = EXPERIENCES[1];
      if (a && a.duration <= remaining) {
        itinerary.push({
          type: 'activity',
          id: 1,
          name: a.name,
          price: a.price,
          duration: a.duration,
          image: a.image,
          desc: a.desc
        });
        remaining -= a.duration;
      }
    } else if (interest === 'gaming' && remaining >= 2.0) {
      const g = GAMING_ENTERTAINMENT[1];
      if (g && g.duration <= remaining) {
        itinerary.push({
          type: 'gaming',
          id: 1,
          name: g.name,
          price: g.price,
          duration: g.duration,
          image: g.image,
          desc: g.desc
        });
        remaining -= g.duration;
      }
    }

    try {
      localStorage.setItem('layoverx_current_itinerary', JSON.stringify(itinerary));
    } catch(err) { console.error(err); }

    updateItineraryBadges();
    Modal.close('ai-copilot');
    showToast("AI Copilot generated a customized layover itinerary draft for you!", "success");

    if (window.location.pathname.includes('my-itinerary')) {
      renderWorkspaceItinerary();
    }
  }

    function openAiCopilot() {
    Modal.open('ai-copilot');
  }

  function deleteDraftTrips(idx) {
    try {
      const data = JSON.parse(localStorage.getItem('layoverx_saved_plans'));
      data.splice(idx, 1);
      localStorage.setItem('layoverx_saved_plans', JSON.stringify(data));
      showToast("Draft deleted.");
      renderDraftTrips();
    } catch(e) { console.error(e); }
  }

  function switchTripsTab(tab) {
    $$('.trips-tab').forEach(el => {
      el.classList.remove('border-sky-500', 'text-sky-600', 'font-black');
      el.classList.add('border-transparent', 'text-slate-500', 'font-semibold');
    });
    
    const activeBtn = Array.from($$('.trips-tab')).find(el => el.getAttribute('onclick').includes(tab));
    if (activeBtn) {
      activeBtn.classList.remove('border-transparent', 'text-slate-500', 'font-semibold');
      activeBtn.classList.add('border-sky-500', 'text-sky-600', 'font-black');
    }

    $$('.tab-content').forEach(el => el.classList.add('hidden'));
    
    if (tab === 'upcoming') {
      $('#tab-content-upcoming')?.classList.remove('hidden');
      renderUpcomingTrips();
    } else if (tab === 'drafts') {
      $('#tab-content-drafts')?.classList.remove('hidden');
      renderDraftTrips();
    } else if (tab === 'past') {
      $('#tab-content-past')?.classList.remove('hidden');
      renderPastTrips();
    }
  }

  function openTripReceipt(bookingId) {
    let trips = getLocalCompletedTrips();
    let trip = trips.find(t => t.bookingId === bookingId);

    if (!trip) {
      showToast("Receipt details not found.", "error");
      return;
    }

    const codeEl = $('#receipt-booking-id') || $('#receipt-ref-code');
    const nameEl = $('#receipt-passenger') || $('#receipt-passenger-name');
    const flightEl = $('#receipt-flights') || $('#receipt-flight-number');
    const passportEl = $('#receipt-passport') || $('#receipt-passport-number');
    const totalEl = $('#receipt-total-cost');

    if (codeEl) codeEl.textContent = trip.bookingId;
    if (nameEl) nameEl.textContent = trip.passenger;
    if (flightEl) flightEl.textContent = `Incoming: ${trip.incomingFlight}`;
    if (passportEl) passportEl.textContent = trip.passport;
    if (totalEl) totalEl.textContent = trip.totalCost;

    const list = $('#receipt-services-list');
    if (list) {
      list.innerHTML = '';
      trip.items.forEach(item => {
        const itemPrice = item.finalTotalCost !== undefined ? item.finalTotalCost : item.price;
        list.innerHTML += `
          <div class="flex justify-between text-xs py-1.5 border-b border-gray-100 last:border-0">
            <span class="font-medium text-gray-700">${item.name} (${item.duration || 0}h)</span>
            <span class="font-bold text-gray-900">₹${itemPrice.toLocaleString()}</span>
          </div>
        `;
      });

      if (trip.subtotal !== undefined) {
        list.innerHTML += `
          <div class="border-t border-dashed border-gray-200 mt-2 pt-2 text-xs space-y-1">
            <div class="flex justify-between text-gray-500">
              <span>Subtotal:</span>
              <span class="font-semibold text-gray-800">₹${trip.subtotal.toFixed(2)}</span>
            </div>
            ${trip.totalDiscount > 0 ? `
            <div class="flex justify-between text-emerald-650 font-bold">
              <span>Discounts:</span>
              <span>-₹${trip.totalDiscount.toFixed(2)}</span>
            </div>` : ''}
            <div class="flex justify-between text-gray-500">
              <span>Convenience Charge:</span>
              <span>₹${trip.convenienceFee.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-gray-500">
              <span>Service Fee:</span>
              <span>₹${trip.serviceFee.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-gray-500">
              <span>GST (18% on fees):</span>
              <span>₹${trip.taxes.toFixed(2)}</span>
            </div>
            ${trip.insurancePremium > 0 ? `
            <div class="flex justify-between text-sky-600 font-semibold">
              <span>Insurance Protection:</span>
              <span>₹${trip.insurancePremium.toFixed(2)}</span>
            </div>` : ''}
          </div>
        `;
      }
    }

    Modal.open('trip-receipt');
  }

  /* ===== CHECKOUT INVENTORY LOCK & COUNTDOWN TIMER ===== */
  let countdownInterval = null;

  async function checkAndCreateLock() {
    const callApi = async (endpoint, payload) => {
      const backendUrl = window.LAYOVERX_SUPABASE_CONFIG?.backendUrl || "https://api.layoverx.in";
      let token = null;
      if (window.supabase) {
        const { data: { session } } = await window.supabase.auth.getSession();
        if (session) token = session.access_token;
      }
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch(`${backendUrl}/api/${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || resData.message || 'API request failed');
      }
      return resData;
    };

    let expiry = parseInt(localStorage.getItem('layoverx_lock_expiry') || 0);
    let sessionId = localStorage.getItem('layoverx_lock_session_id');
    let lockedItems = [];
    try {
      const stored = localStorage.getItem('layoverx_locked_items');
      if (stored) lockedItems = JSON.parse(stored);
    } catch(e) { console.error(e); }
    
    let itinerary = [];
    try {
      const stored = localStorage.getItem('layoverx_current_itinerary');
      if (stored) itinerary = JSON.parse(stored);
    } catch(e) { console.error(e); }

    if (itinerary.length === 0 && lockedItems.length === 0) {
      return; // nothing to lock
    }

    const items = lockedItems.length > 0 ? lockedItems : itinerary.map(item => ({
      serviceId: String(item.id),
      slot: item.slot || 'slot_default'
    }));

    // If there is an existing session, validate it against backend
    if (sessionId && expiry) {
      try {
        const res = await callApi('bookings/validate-lock', { items, sessionId });
        if (res && res.success) {
          expiry = res.expiresAt;
          localStorage.setItem('layoverx_lock_expiry', expiry);
          localStorage.setItem('layoverx_locked_items', JSON.stringify(items));
          startCountdownTimer(expiry, res.serverTime);
          return;
        } else {
          // Lock session is invalid/expired. Clear it and show expired modal.
          localStorage.removeItem('layoverx_lock_expiry');
          localStorage.removeItem('layoverx_lock_session_id');
          localStorage.removeItem('layoverx_locked_items');
          showExpirationModal();
          return;
        }
      } catch (err) {
        console.error("validateLockSession failed:", err);
        // Fallback to local countdown if valid locally
        const localExpiry = parseInt(localStorage.getItem('layoverx_lock_expiry') || 0);
        if (localExpiry > Date.now()) {
          startCountdownTimer(localExpiry, Date.now());
          return;
        } else {
          localStorage.removeItem('layoverx_lock_expiry');
          localStorage.removeItem('layoverx_lock_session_id');
          localStorage.removeItem('layoverx_locked_items');
          showExpirationModal();
          return;
        }
      }
    }

    // Create a new lock session
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
      const res = await callApi('bookings/lock', { items, sessionId });
      if (res && res.success) {
        expiry = res.expiresAt;
        localStorage.setItem('layoverx_lock_expiry', expiry);
        localStorage.setItem('layoverx_lock_session_id', sessionId);
        localStorage.setItem('layoverx_locked_items', JSON.stringify(items));
        showToast("Inventory locked successfully.", "success");
        startCountdownTimer(expiry, res.serverTime);
      } else {
        showToast("Failed to lock inventory: " + (res ? res.error : "Unknown error"), "error");
        setTimeout(() => {
          window.location.href = 'my-itinerary.html';
        }, 2000);
        return;
      }
    } catch (err) {
      console.error("lockInventory failed:", err);
      showToast("Error locking inventory. Please try again.", "error");
      setTimeout(() => {
        window.location.href = 'my-itinerary.html';
      }, 2000);
      return;
    }
  }

  function startCountdownTimer(serverExpiry, serverTime) {
    if (countdownInterval) clearInterval(countdownInterval);

    // If not called with server time, fallback to local storage values
    if (serverExpiry === undefined || serverTime === undefined) {
      serverExpiry = parseInt(localStorage.getItem('layoverx_lock_expiry') || 0);
      serverTime = Date.now();
    }

    // Monotonic time tracking to prevent clock tampering
    const remainingSecondsOnLoad = (serverExpiry - serverTime) / 1000;
    const loadPerfTime = performance.now();

    // Prepend timer banner inside <main id="main"> if not already present
    let banner = document.getElementById('reservation-timer-banner');
    if (!banner) {
      const mainEl = document.getElementById('main');
      if (mainEl) {
        banner = document.createElement('div');
        banner.id = 'reservation-timer-banner';
        mainEl.insertBefore(banner, mainEl.firstChild);
      }
    }

    function updateTimer() {
      if (!serverExpiry) return;

      const elapsed = (performance.now() - loadPerfTime) / 1000;
      const remainingTime = remainingSecondsOnLoad - elapsed; // clock independent

      // Cache remainingTime globally on window so other components can access it securely without reading localStorage
      window.layoverx.remainingTime = remainingTime;

      if (remainingTime > 0) {
        // ACTIVE state
        const mins = Math.floor(remainingTime / 60);
        const secs = Math.floor(remainingTime % 60);
        const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        if (banner) {
          banner.className = "w-full text-center py-3 px-4 text-sm font-bold z-50 bg-sky-950/90 text-sky-400 border-b border-sky-900 backdrop-blur-md sticky top-[72px] transition-colors duration-300";
          banner.innerHTML = `⏳ Reservation Held — ${timeStr} remaining`;
        }
        enableCheckoutControls();

      } else if (remainingTime <= 0 && remainingTime > -30) {
        // GRACE state
        if (banner) {
          banner.className = "w-full text-center py-3 px-4 text-sm font-bold z-50 bg-amber-950/90 text-amber-500 border-b border-amber-900 backdrop-blur-md sticky top-[72px] animate-pulse transition-colors duration-300";
          banner.innerHTML = `⚠ Reservation expired. Finish payment within 30 seconds.`;
        }

        const isRazorpayOpen = window.layoverx && window.layoverx.razorpayOpen;
        if (!isRazorpayOpen) {
          disableCheckoutControls();
        }

      } else {
        // EXPIRED state
        clearInterval(countdownInterval);

        if (banner) {
          banner.className = "w-full text-center py-3 px-4 text-sm font-bold z-50 bg-red-950/90 text-red-500 border-b border-red-900 backdrop-blur-md sticky top-[72px] transition-colors duration-300";
          banner.innerHTML = `Your reservation has expired. Please restart checkout.`;
        }

        disableCheckoutControls();
        showExpirationModal();
      }
    }

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
  }

  function getRemainingTime() {
    if (window.layoverx.remainingTime !== undefined) {
      return window.layoverx.remainingTime;
    }
    const expiry = parseInt(localStorage.getItem('layoverx_lock_expiry') || 0);
    if (!expiry) return -999;
    return (expiry - Date.now()) / 1000;
  }

  function enableCheckoutControls() {
    const forms = ['#checkout-booking-form', '#payment-selection-form'];
    forms.forEach(selector => {
      const form = document.querySelector(selector);
      if (form) {
        const inputs = form.querySelectorAll('input, select, textarea, button');
        inputs.forEach(el => {
          if (el.id !== 'btn-context-submit') {
            el.removeAttribute('disabled');
            el.classList.remove('opacity-50', 'cursor-not-allowed');
          }
        });
      }
    });

    const payBtn = document.getElementById('btn-pay-now');
    if (payBtn) {
      payBtn.removeAttribute('disabled');
      payBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    const proceedLinks = document.querySelectorAll('a[href="checkout.html"], a[href="payment-selection.html"]');
    proceedLinks.forEach(el => {
      el.classList.remove('opacity-50', 'pointer-events-none', 'cursor-not-allowed');
    });
  }

  function disableCheckoutControls() {
    const forms = ['#checkout-booking-form', '#payment-selection-form'];
    forms.forEach(selector => {
      const form = document.querySelector(selector);
      if (form) {
        const inputs = form.querySelectorAll('input, select, textarea, button');
        inputs.forEach(el => {
          el.setAttribute('disabled', 'true');
          el.classList.add('opacity-50', 'cursor-not-allowed');
        });
      }
    });

    const payBtn = document.getElementById('btn-pay-now');
    if (payBtn) {
      payBtn.setAttribute('disabled', 'true');
      payBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    const proceedLinks = document.querySelectorAll('a[href="checkout.html"], a[href="payment-selection.html"]');
    proceedLinks.forEach(el => {
      el.classList.add('opacity-50', 'pointer-events-none', 'cursor-not-allowed');
    });
  }

  // ===== CROSS-TAB SYNC — BROADCAST CHANNEL =====

  /**
   * Broadcasts a checkout lifecycle event to all other open tabs via localStorage.
   * The storage event fires in every other tab but NOT in the originating tab.
   *
   * @param {'payment_complete'|'expired'|'restarted'} type - Event type
   */
  function broadcastCheckoutEvent(type) {
    try {
      localStorage.setItem('layoverx_checkout_event', JSON.stringify({
        type,
        ts: Date.now()
      }));
    } catch(e) {
      console.warn('broadcastCheckoutEvent: could not write to localStorage', e);
    }
  }

  /**
   * Shows a modal informing the user that checkout was completed in another tab.
   * Does NOT include a Restart button — the user should navigate away normally.
   */
  function showCompletedInOtherTabModal() {
    // Remove any existing expiration modal to avoid overlap
    const existingExpired = document.getElementById('modal-checkout-expired');
    if (existingExpired) existingExpired.remove();

    let modal = document.getElementById('modal-checkout-other-tab');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-checkout-other-tab';
      modal.className = "fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4";
      modal.innerHTML = `
        <div class="modal-content max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 shadow-2xl text-center space-y-6 transform scale-100 transition-all duration-300">
          <div class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto">
            ✅
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-black text-slate-900">Booking Confirmed</h3>
            <p class="text-sm text-slate-600">Checkout was completed in another tab. Your booking is confirmed.</p>
          </div>
          <a href="my-trips.html" class="block w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition transform hover:scale-[1.01] text-center">
            View My Trips
          </a>
        </div>
      `;
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Registers a storage event listener on checkout/payment/review pages.
   * Reacts to cross-tab lock state changes broadcast via layoverx_checkout_event.
   */
  function initCrossTabSync() {
    const isCheckoutPage = window.location.pathname.includes('checkout.html') ||
                           window.location.pathname.includes('payment-selection.html') ||
                           window.location.pathname.includes('booking-review.html');
    if (!isCheckoutPage) return;

    window.addEventListener('storage', function(event) {
      if (event.key !== 'layoverx_checkout_event') return;

      let evt = null;
      try { evt = JSON.parse(event.newValue); } catch(e) { return; }
      if (!evt || typeof evt.type !== 'string') return;

      // Ignore stale events older than 10 seconds (e.g. leftover from previous sessions)
      if ((Date.now() - evt.ts) > 10000) return;

      console.log('[CrossTabSync] Received event from another tab:', evt.type);

      if (evt.type === 'payment_complete') {
        // Another tab successfully completed payment
        if (countdownInterval) clearInterval(countdownInterval);
        disableCheckoutControls();
        showCompletedInOtherTabModal();

      } else if (evt.type === 'expired' || evt.type === 'restarted') {
        // Another tab expired or restarted checkout — sync this tab to expired state
        if (countdownInterval) clearInterval(countdownInterval);
        disableCheckoutControls();
        // Clear local lock state so this tab doesn't re-validate a dead session
        localStorage.removeItem('layoverx_lock_expiry');
        localStorage.removeItem('layoverx_lock_session_id');
        localStorage.removeItem('layoverx_locked_items');
        showExpirationModal();
      }
    });
  }

  // ===== END CROSS-TAB SYNC =====

  function showExpirationModal() {
    // Broadcast to other tabs ONLY if this is the originating tab (not already syncing)
    // Guard: only broadcast if we still have a live session (not already cleared)
    const hasLiveSession = !!localStorage.getItem('layoverx_lock_session_id');
    if (hasLiveSession) {
      broadcastCheckoutEvent('expired');
    }

    let modal = document.getElementById('modal-checkout-expired');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-checkout-expired';
      modal.className = "fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4";
      modal.innerHTML = `
        <div class="modal-content max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 shadow-2xl text-center space-y-6 transform scale-100 transition-all duration-300">
          <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto animate-bounce">
            ⚠️
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-black text-slate-900">Reservation Expired</h3>
            <p class="text-sm text-slate-600">Your reservation has expired. Please restart checkout.</p>
          </div>
          <button id="btn-restart-checkout" onclick="window.layoverx.restartCheckout()" class="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-extrabold text-sm rounded-xl shadow-lg transition transform hover:scale-[1.01]">
            Restart Checkout
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
    }
  }

  function initializeTransitMap(details, activePlan) {
    function showMapFallback(message = "Map unavailable. View itinerary timeline instead.") {
      const mapContainer = document.getElementById('itinerary-map-container');
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div class="p-8 text-center text-slate-500 bg-slate-50 border border-gray-200 rounded-3xl" style="min-height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <svg class="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <p class="text-xs font-semibold text-slate-600">${message}</p>
          </div>
        `;
      }
    }

    function createCustomMarkerIcon(emoji, color) {
      if (typeof L === 'undefined') return null;
      return L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background-color: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
            font-size: 16px;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1.0)'">
            ${emoji}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });
    }

    function updateMapStats(distance, duration) {
      const distKm = (distance / 1000).toFixed(1);
      const durMins = Math.round(duration / 60);

      const mapDistance = document.getElementById('map-distance');
      const mapDuration = document.getElementById('map-duration');
      const mapDistanceVal = document.getElementById('map-distance-val');
      const mapDurationVal = document.getElementById('map-duration-val');

      if (mapDistance) mapDistance.textContent = `${distKm} km`;
      if (mapDuration) mapDuration.textContent = `ETA: ${durMins} mins`;
      if (mapDistanceVal) mapDistanceVal.textContent = `${distKm} km`;
      if (mapDurationVal) {
        mapDurationVal.textContent = `${durMins} mins`;
        mapDurationVal.className = "text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg";
      }
    }

    try {
      if (typeof L === 'undefined') {
        throw new Error("Leaflet Library is not loaded.");
      }

      const apiKey = window.LAYOVERX_MAP_CONFIG?.OPENROUTESERVICE_API_KEY;
      if (!apiKey || apiKey === "YOUR_OPENROUTESERVICE_API_KEY") {
        throw new Error("OpenRouteService API key is missing or not configured.");
      }

      const mapElement = document.getElementById('itinerary-map');
      if (!mapElement) return;

      // Clean up previous map instance if it exists
      if (window.layoverxMap) {
        window.layoverxMap.remove();
        window.layoverxMap = null;
      }

      const map = L.map('itinerary-map', {
        zoomControl: false
      });
      window.layoverxMap = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Determine Origin Terminal
      const airportOrigin = (activePlan && activePlan.location === 'bandra') ? TERMINAL_NODES['CSMIA_T2'] : TERMINAL_NODES['CSMIA_T1'];

      // Build coordinates route list
      const coords = [];
      coords.push([airportOrigin.coordinates.lng, airportOrigin.coordinates.lat]);

      if (details.hotelId && HOTELS[details.hotelId]) {
        const h = HOTELS[details.hotelId];
        coords.push([h.coordinates.lng, h.coordinates.lat]);
      }
      if (details.diningId && DINING[details.diningId]) {
        const d = DINING[details.diningId];
        coords.push([d.coordinates.lng, d.coordinates.lat]);
      }
      if (details.activityId && EXPERIENCES[details.activityId]) {
        const e = EXPERIENCES[details.activityId];
        coords.push([e.coordinates.lng, e.coordinates.lat]);
      }
      if (details.spaId && SPA_WELLNESS[details.spaId]) {
        const s = SPA_WELLNESS[details.spaId];
        coords.push([s.coordinates.lng, s.coordinates.lat]);
      }
      if (details.gamingId && GAMING_ENTERTAINMENT[details.gamingId]) {
        const g = GAMING_ENTERTAINMENT[details.gamingId];
        coords.push([g.coordinates.lng, g.coordinates.lat]);
      }

      coords.push([airportOrigin.coordinates.lng, airportOrigin.coordinates.lat]);

      // Check for empty or single stop itinerary (to avoid calling ORS with 1 unique point)
      const uniqueCoords = Array.from(new Set(coords.map(c => c.join(','))));
      if (uniqueCoords.length <= 1) {
        // Render single airport marker
        map.setView([airportOrigin.coordinates.lat, airportOrigin.coordinates.lng], 14);
        
        L.marker([airportOrigin.coordinates.lat, airportOrigin.coordinates.lng], {
          icon: createCustomMarkerIcon('🛫', '#0284c7')
        }).addTo(map).bindPopup(`<b>${airportOrigin.name}</b><br>Origin & Destination`);

        updateMapStats(0, 0);
        return;
      }

      // Call OpenRouteService Directions API (POST)
      fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': apiKey
        },
        body: JSON.stringify({
          coordinates: coords
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`ORS API responded with status ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Draw route polyline
        const routeLayer = L.geoJSON(data, {
          style: {
            color: '#0ea5e9',
            weight: 5,
            opacity: 0.85
          }
        }).addTo(map);

        // Fit map boundaries to the polyline route
        map.fitBounds(routeLayer.getBounds(), { padding: [40, 40] });

        // Extract total distance and duration from properties summary
        const summary = data.features[0].properties.summary;
        updateMapStats(summary.distance, summary.duration);

        // Render markers
        // Origin Marker (T1 or T2)
        L.marker([airportOrigin.coordinates.lat, airportOrigin.coordinates.lng], {
          icon: createCustomMarkerIcon('🛫', '#0284c7')
        }).addTo(map).bindPopup(`<b>${airportOrigin.name}</b><br>Origin & Destination`);

        // Waypoints
        if (details.hotelId && HOTELS[details.hotelId]) {
          const h = HOTELS[details.hotelId];
          L.marker([h.coordinates.lat, h.coordinates.lng], {
            icon: createCustomMarkerIcon('🏨', '#8b5cf6')
          }).addTo(map).bindPopup(`<b>${h.name}</b><br>Hotel`);
        }
        if (details.diningId && DINING[details.diningId]) {
          const d = DINING[details.diningId];
          L.marker([d.coordinates.lat, d.coordinates.lng], {
            icon: createCustomMarkerIcon('🍽️', '#f97316')
          }).addTo(map).bindPopup(`<b>${d.name}</b><br>Restaurant`);
        }
        if (details.activityId && EXPERIENCES[details.activityId]) {
          const e = EXPERIENCES[details.activityId];
          L.marker([e.coordinates.lat, e.coordinates.lng], {
            icon: createCustomMarkerIcon('📸', '#eab308')
          }).addTo(map).bindPopup(`<b>${e.name}</b><br>Experience`);
        }
        if (details.spaId && SPA_WELLNESS[details.spaId]) {
          const s = SPA_WELLNESS[details.spaId];
          L.marker([s.coordinates.lat, s.coordinates.lng], {
            icon: createCustomMarkerIcon('💆', '#ec4899')
          }).addTo(map).bindPopup(`<b>${s.name}</b><br>Spa`);
        }
        if (details.gamingId && GAMING_ENTERTAINMENT[details.gamingId]) {
          const g = GAMING_ENTERTAINMENT[details.gamingId];
          L.marker([g.coordinates.lat, g.coordinates.lng], {
            icon: createCustomMarkerIcon('🎮', '#10b981')
          }).addTo(map).bindPopup(`<b>${g.name}</b><br>Gaming & Entertainment`);
        }
      })
      .catch(err => {
        console.error("Directions request failed:", err);
        showMapFallback("Map unavailable. View itinerary timeline instead.");
      });

    } catch (err) {
      console.error("Leaflet initialization failed:", err);
      showMapFallback("Map unavailable. View itinerary timeline instead.");
    }
  }

  function restartCheckout() {
    broadcastCheckoutEvent('restarted');
    localStorage.removeItem('layoverx_lock_session_id');
    localStorage.removeItem('layoverx_lock_expiry');
    localStorage.removeItem('layoverx_locked_items');
    document.body.style.overflow = '';
    window.location.href = 'my-itinerary.html';
  }

  // Extend window.layoverx namespace
  Object.assign(window.layoverx, {
    calculateContextDuration,
    handleTripContextSubmit,
    addToItinerary,
    reorderWorkspaceItem,
    removeWorkspaceItem,
    updateWorkspaceItemDuration,
    saveItineraryDraft,
    loadWorkspaceDraft,
    duplicateItineraryDraft,
    proceedToCheckout,
    handleCheckoutSubmit,
    improvePlanWithAi,
    handleAiCopilotSubmit,
    openAiCopilot,
    deleteDraftTrips,
    openTripReceipt,
    switchTripsTab,
    checkAndCreateLock,
    startCountdownTimer,
    restartCheckout,
    getRemainingTime,
    broadcastCheckoutEvent,
    initializeTransitMap,
    switchExperienceTab,
    savePlannerToItinerary
  });

  // --- ANALYTICS SYSTEM ---
  const Analytics = {
    async trackEvent(eventName, eventData = {}) {
      console.log(`[Analytics Event] ${eventName}:`, eventData);
      
      let localEvents = [];
      try {
        localEvents = JSON.parse(localStorage.getItem('layoverx_analytics_events')) || [];
      } catch(e) {}
      
      let userId = 'guest-traveler';
      if (window.supabase) {
        const { data: { session } } = await window.supabase.auth.getSession();
        if (session?.user) {
          userId = session.user.id;
        }
      }

      localEvents.push({
        eventName,
        eventData,
        timestamp: new Date().toISOString(),
        userId
      });
      localStorage.setItem('layoverx_analytics_events', JSON.stringify(localEvents));

      if (window.supabase) {
        try {
          await window.supabase.from("analytics_events").insert([{
            user_id: userId,
            event: eventName,
            data: eventData
          }]);
        } catch (err) {
          console.warn("Could not save event to Supabase:", err);
        }
      }
    }
  };
  window.layoverxAnalytics = Analytics;

  function sanitizeLogContent(str) {
    if (!str) return "";
    let clean = String(str);
    clean = clean.replace(/(passport(?:[_\s]*number)?\s*[:=]?\s*["']?)[A-PR-WY0-9][1-9]\d\s?\d{4}[1-9]\b/gi, "$1[REDACTED_PASSPORT]");
    clean = clean.replace(/\b[A-PR-WY][1-9]\d\s?\d{4}[1-9]\b/gi, "[REDACTED_PASSPORT]");
    clean = clean.replace(/(passport(?:\s*number)?\s*[:=]\s*)['"]?[a-z0-9]+['"]?/gi, "$1[REDACTED_PASSPORT]");
    clean = clean.replace(/\b[a-fA-F0-9]{64}\b/g, "[REDACTED_SIGNATURE]");
    clean = clean.replace(/rzp_(?:test|live)_[a-zA-Z0-9]{14,24}/g, "[REDACTED_RAZORPAY_KEY]");
    clean = clean.replace(/sk_(?:test|live)_[a-zA-Z0-9]{24,100}/g, "[REDACTED_STRIPE_KEY]");
    clean = clean.replace(/ey[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+/g, "[REDACTED_TOKEN]");
    clean = clean.replace(/(password|secret|pass|token)\s*[:=]\s*['"]?[a-zA-Z0-9_\-\.\/+=]{8,}['"]?/gi, "$1: [REDACTED]");
    return clean;
  }

  // --- MONITORING & LOGGING ---
  async function logErrorToStorage(type, message, stack = "", severity = "ERROR", source = "client-runtime") {
    if (type === "Unhandled Promise Rejection" || type === "Javascript Runtime Error") {
      severity = "ERROR";
      source = "client-runtime";
    }

    const cleanMessage = sanitizeLogContent(message);
    const cleanStack = sanitizeLogContent(stack);

    console.error(`[Error Logged] [${severity}] ${type}: ${cleanMessage}`);
    
    let localErrors = [];
    try {
      localErrors = JSON.parse(localStorage.getItem('layoverx_error_logs')) || [];
    } catch(e) {}
    
    let userId = 'guest-traveler';
    if (window.supabase) {
      const { data: { session } } = await window.supabase.auth.getSession();
      if (session?.user) {
        userId = session.user.id;
      }
    }

    localErrors.push({
      type,
      message: cleanMessage,
      stack: cleanStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      severity,
      source
    });
    localStorage.setItem('layoverx_error_logs', JSON.stringify(localErrors));

    if (window.supabase) {
      try {
        await window.supabase.from("error_logs").insert([{
          severity,
          source: source || type || "client-runtime",
          message: cleanMessage,
          stack: cleanStack,
          uid: userId
        }]);
      } catch (err) {
        console.warn("Could not save error log to Supabase:", err);
      }
    }
  }

  // Window error listeners
  window.addEventListener('error', function (event) {
    logErrorToStorage("Javascript Runtime Error", event.message, event.error ? event.error.stack : "");
  });

  window.addEventListener('unhandledrejection', function (event) {
    logErrorToStorage("Unhandled Promise Rejection", String(event.reason), "");
  });

  window.layoverx.logError = logErrorToStorage;

  /* ===== REVEAL ON SCROLL ANIMATION ===== */
  function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      elements.forEach((el) => observer.observe(el));
    } else {
      // Fallback: reveal immediately if observer not supported
      elements.forEach((el) => el.classList.add('revealed'));
    }
  }

  /* ===== HOMEPAGE SEARCH WIDGET ===== */
  function initHomepageSearch() {
    const arrivalInput = document.getElementById('search-arrival');
    const departureInput = document.getElementById('search-departure');
    const durationDisplay = document.getElementById('layover-duration');
    const validationMsg = document.getElementById('validation-message');
    const searchBtn = document.getElementById('search-btn');

    if (!arrivalInput || !departureInput) return;

    // Set default values (3h from now and 9h from now)
    const now = new Date();
    const tplus3 = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const tplus9 = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const toInputValue = (d) => d.toISOString().slice(0, 16);
    arrivalInput.value = toInputValue(tplus3);
    departureInput.value = toInputValue(tplus9);

    function updateLayoverDuration() {
      if (!arrivalInput.value || !departureInput.value) return;
      const arrival = new Date(arrivalInput.value);
      const departure = new Date(departureInput.value);
      const diffMs = departure - arrival;

      if (validationMsg) {
        if (diffMs < 0) {
          validationMsg.textContent = 'Departure must be after arrival.';
          validationMsg.classList.remove('hidden');
          return;
        }
        if (diffMs < 5 * 3600000) {
          validationMsg.textContent = 'A minimum 5h layover is recommended for safe exit.';
          validationMsg.classList.remove('hidden');
        } else {
          validationMsg.classList.add('hidden');
        }
      }

      const totalMin = Math.floor(diffMs / 60000);
      const hours = Math.floor(totalMin / 60);
      const mins = totalMin % 60;
      // Subtract 5h safety buffer
      const activeHours = Math.max(0, hours - 5);
      const activeMin = mins;
      if (durationDisplay) {
        durationDisplay.textContent = `${hours}h ${String(mins).padStart(2, '0')}m total · ~${activeHours}h ${String(activeMin).padStart(2, '0')}m active`;
      }
    }

    arrivalInput.addEventListener('change', updateLayoverDuration);
    arrivalInput.addEventListener('input', updateLayoverDuration);
    departureInput.addEventListener('change', updateLayoverDuration);
    departureInput.addEventListener('input', updateLayoverDuration);
    updateLayoverDuration();

    if (searchBtn) {
      searchBtn.addEventListener('click', function() {
        const arrival = arrivalInput.value;
        const departure = departureInput.value;
        const travelers = document.getElementById('search-travelers')?.value || '2';
        const location = document.getElementById('search-location')?.value || 'near-airport';
        
        if (!arrival || !departure) {
          if (typeof window.layoverx.showToast === 'function') {
            window.layoverx.showToast('Please enter your arrival and departure times first.', 'error');
          }
          return;
        }
        
        const diffMs = new Date(departure) - new Date(arrival);
        if (diffMs <= 0) {
          if (typeof window.layoverx.showToast === 'function') {
            window.layoverx.showToast('Departure time must be after arrival time.', 'error');
          }
          return;
        }

        const hours = diffMs / 3600000;
        
        try {
          localStorage.setItem('layoverx_search_params', JSON.stringify({
            arrivalDateTime: arrival,
            departureDateTime: departure,
            location: location,
            travelers: travelers,
            layoverDuration: hours
          }));
        } catch(e) { console.error(e); }

        const url = `plan-my-layover.html?arrivalDateTime=${encodeURIComponent(arrival)}&departureDateTime=${encodeURIComponent(departure)}&travelers=${travelers}&location=${location}`;
        window.location.href = url;
      });
    }
  }

  /* ===== CAROUSEL ARROW NAVIGATION ===== */
  function initCarouselArrows() {
    const setupArrows = (prevId, nextId, carouselId) => {
      const prev = document.getElementById(prevId);
      const next = document.getElementById(nextId);
      const carousel = document.getElementById(carouselId);
      if (!prev || !next || !carousel) return;

      const scrollAmount = () => carousel.offsetWidth * 0.75;

      next.addEventListener('click', () => carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
      prev.addEventListener('click', () => carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));

      const updateArrows = () => {
        prev.disabled = carousel.scrollLeft < 10;
        next.disabled = carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 10;
      };

      carousel.addEventListener('scroll', updateArrows, { passive: true });
      updateArrows();
    };

    setupArrows('prev-service', 'next-service', 'services-carousel');
    setupArrows('prev-experience', 'next-experience', 'experiences-carousel');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    document.addEventListener('DOMContentLoaded', initReveal);
    document.addEventListener('DOMContentLoaded', initHomepageSearch);
    document.addEventListener('DOMContentLoaded', initCarouselArrows);
  } else {
    init();
    initReveal();
    initHomepageSearch();
    initCarouselArrows();
  }

})();

