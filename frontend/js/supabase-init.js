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

const createMockSupabase = () => {
  const listeners = [];
  let currentUser = null;
  
  const getStoredUser = () => {
    try {
      const userStr = sessionStorage.getItem('__mockUser') || localStorage.getItem('layoverx_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch(e) { return null; }
  };

  currentUser = getStoredUser();

  const trigger = (event, session) => {
    listeners.forEach(cb => {
      try { cb(event, session); } catch(e) {}
    });
  };

  const getSession = () => {
    if (!currentUser) return { session: null };
    return {
      session: {
        user: currentUser,
        access_token: 'mock-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600
      }
    };
  };

  return {
    auth: {
      onAuthStateChange: (cb) => {
        listeners.push(cb);
        const session = getSession().session;
        setTimeout(() => cb(currentUser ? 'SIGNED_IN' : 'SIGNED_OUT', session), 10);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                const idx = listeners.indexOf(cb);
                if (idx > -1) listeners.splice(idx, 1);
              }
            }
          }
        };
      },
      getSession: async () => {
        return { data: getSession(), error: null };
      },
      signInWithOAuth: async ({ provider }) => {
        console.log(`MOCK SUPABASE AUTH: signInWithOAuth called for ${provider}`);
        currentUser = {
          id: 'usr_mock_google',
          email: 'google_user@test.com',
          user_metadata: {
            full_name: 'Google Test User'
          }
        };
        try {
          sessionStorage.setItem('__mockUser', JSON.stringify(currentUser));
          localStorage.setItem('layoverx_user', JSON.stringify(currentUser));
        } catch(e) {}
        const session = getSession().session;
        trigger('SIGNED_IN', session);
        return { data: { user: currentUser, session }, error: null };
      },
      signInWithPassword: async ({ email, password }) => {
        console.log(`MOCK SUPABASE AUTH: signInWithPassword called for ${email}`);
        currentUser = {
          id: 'usr_' + Math.random().toString(36).substring(2, 11),
          email: email,
          user_metadata: {
            full_name: email.split('@')[0]
          }
        };
        try {
          sessionStorage.setItem('__mockUser', JSON.stringify(currentUser));
          localStorage.setItem('layoverx_user', JSON.stringify(currentUser));
        } catch(e) {}
        const session = getSession().session;
        trigger('SIGNED_IN', session);
        return { data: { user: currentUser, session }, error: null };
      },
      signUp: async ({ email, password, options }) => {
        console.log(`MOCK SUPABASE AUTH: signUp called for ${email}`);
        currentUser = {
          id: 'usr_' + Math.random().toString(36).substring(2, 11),
          email: email,
          user_metadata: {
            full_name: options?.data?.full_name || email.split('@')[0]
          }
        };
        try {
          sessionStorage.setItem('__mockUser', JSON.stringify(currentUser));
          localStorage.setItem('layoverx_user', JSON.stringify(currentUser));
        } catch(e) {}
        const session = getSession().session;
        trigger('SIGNED_IN', session);
        return { data: { user: currentUser, session }, error: null };
      },
      signOut: async () => {
        console.log(`MOCK SUPABASE AUTH: signOut called`);
        currentUser = null;
        try {
          sessionStorage.removeItem('__mockUser');
          localStorage.removeItem('layoverx_user');
        } catch(e) {}
        trigger('SIGNED_OUT', null);
        return { error: null };
      }
    },
    from: (table) => {
      console.log(`MOCK SUPABASE DB: access table ${table}`);
      return {
        upsert: async (data) => {
          console.log(`MOCK SUPABASE DB: upsert in ${table}:`, data);
          return { error: null };
        },
        insert: async (data) => {
          console.log(`MOCK SUPABASE DB: insert in ${table}:`, data);
          return { error: null };
        },
        select: async () => {
          console.log(`MOCK SUPABASE DB: select from ${table}`);
          return { data: [], error: null };
        }
      };
    }
  };
};

// Initialize Supabase client, fallback to mock if script is blocked or offline
window.supabase = (typeof Supabase !== 'undefined') 
  ? Supabase.createClient(LAYOVERX_SUPABASE_CONFIG.url, LAYOVERX_SUPABASE_CONFIG.anonKey)
  : createMockSupabase();
