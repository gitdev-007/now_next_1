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

// Initialize Supabase client
window.supabase = (typeof Supabase !== 'undefined') 
  ? Supabase.createClient(LAYOVERX_SUPABASE_CONFIG.url, LAYOVERX_SUPABASE_CONFIG.anonKey)
  : null;
