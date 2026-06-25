// Polyfill import.meta.env for browser runtime execution when loaded as a module
if (typeof import.meta !== 'undefined' && !import.meta.env) {
  import.meta.env = {
    VITE_SUPABASE_URL: "https://mock-supabase.supabase.co",
    VITE_SUPABASE_ANON_KEY: "mock-anon-key-12345",
    VITE_BACKEND_URL: "https://api.layoverx.in"
  };
}

const LAYOVERX_SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  backendUrl: import.meta.env.VITE_BACKEND_URL
};

window.LAYOVERX_SUPABASE_CONFIG = LAYOVERX_SUPABASE_CONFIG;

const createMockSupabaseClient = () => {
  console.log("Initializing fallback mock Supabase client...");
  
  const authCallbacks = [];
  let currentUser = null;
  try {
    const saved = localStorage.getItem('layoverx_user');
    if (saved) currentUser = JSON.parse(saved);
  } catch(e) {}

  const mockSession = () => {
    if (!currentUser) return null;
    return {
      user: currentUser,
      access_token: 'mock-access-token',
      expires_in: 3600
    };
  };

  const notifyListeners = (event = 'SIGNED_IN') => {
    authCallbacks.forEach(cb => cb(event, mockSession()));
  };

  return {
    auth: {
      onAuthStateChange: function(cb) {
        authCallbacks.push(cb);
        setTimeout(() => cb(currentUser ? 'SIGNED_IN' : 'SIGNED_OUT', mockSession()), 10);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                const index = authCallbacks.indexOf(cb);
                if (index > -1) authCallbacks.splice(index, 1);
              }
            }
          }
        };
      },
      getSession: async function() {
        return { data: { session: mockSession() }, error: null };
      },
      signUp: async function({ email, password, options }) {
        const fullName = options?.data?.full_name || email.split('@')[0];
        currentUser = {
          id: 'usr_' + Math.random().toString(36).substring(2, 11),
          email,
          user_metadata: { full_name: fullName }
        };
        try {
          localStorage.setItem('layoverx_user', JSON.stringify(currentUser));
        } catch(e) {}
        setTimeout(() => notifyListeners('SIGNED_IN'), 10);
        return { data: { user: currentUser }, error: null };
      },
      signInWithPassword: async function({ email, password }) {
        currentUser = {
          id: 'usr_' + Math.random().toString(36).substring(2, 11),
          email,
          user_metadata: { full_name: email.split('@')[0] }
        };
        try {
          localStorage.setItem('layoverx_user', JSON.stringify(currentUser));
        } catch(e) {}
        setTimeout(() => notifyListeners('SIGNED_IN'), 10);
        return { data: { session: mockSession(), user: currentUser }, error: null };
      },
      signOut: async function() {
        currentUser = null;
        try {
          localStorage.removeItem('layoverx_user');
        } catch(e) {}
        setTimeout(() => notifyListeners('SIGNED_OUT'), 10);
        return { error: null };
      },
      signInWithOAuth: async function(options) {
        currentUser = {
          id: 'usr_google_mock',
          email: 'google_user@gmail.com',
          user_metadata: { full_name: 'Mock Google User' }
        };
        try {
          localStorage.setItem('layoverx_user', JSON.stringify(currentUser));
        } catch(e) {}
        setTimeout(() => notifyListeners('SIGNED_IN'), 10);
        return { data: { provider: 'google', url: '#' }, error: null };
      }
    },
    from: function(tableName) {
      return {
        upsert: async function(payload) {
          try {
            const store = JSON.parse(localStorage.getItem('__mockDbStore')) || {};
            if (!store[tableName]) store[tableName] = {};
            const key = payload.uid || payload.id || 'doc_' + Math.random().toString(36).substring(2, 11);
            store[tableName][key] = { ...store[tableName][key], ...payload };
            localStorage.setItem('__mockDbStore', JSON.stringify(store));
          } catch(e) {}
          return { error: null };
        },
        insert: async function(payloads) {
          try {
            const store = JSON.parse(localStorage.getItem('__mockDbStore')) || {};
            if (!store[tableName]) store[tableName] = [];
            if (Array.isArray(store[tableName])) {
              store[tableName].push(...payloads);
            } else {
              store[tableName] = payloads;
            }
            localStorage.setItem('__mockDbStore', JSON.stringify(store));
          } catch(e) {}
          return { error: null };
        },
        select: function() {
          return {
            eq: function() {
              return {
                maybeSingle: async function() {
                  return { data: null, error: null };
                },
                execute: async function() {
                  return { data: [], error: null };
                }
              };
            }
          };
        }
      };
    }
  };
};

// Initialize Supabase client, fallback to mock if Supabase class is not present or if configured to mock
window.supabase = (typeof Supabase !== 'undefined' && LAYOVERX_SUPABASE_CONFIG.url !== "https://mock-supabase.supabase.co") 
  ? Supabase.createClient(LAYOVERX_SUPABASE_CONFIG.url, LAYOVERX_SUPABASE_CONFIG.anonKey)
  : createMockSupabaseClient();
