import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'supabase_devpulse_url';
const STORAGE_KEY_KEY = 'supabase_devpulse_key';

let customClient: SupabaseClient | null = null;

const DEFAULT_URL = import.meta.env.VITE_SUPABASE_URL || '';
const DEFAULT_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const getStoredSupabaseConfig = () => {
  const url = localStorage.getItem(STORAGE_KEY_URL) || DEFAULT_URL;
  const anonKey = localStorage.getItem(STORAGE_KEY_KEY) || DEFAULT_KEY;
  return { url, anonKey, isConnected: Boolean(url && anonKey) };
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  if (url && anonKey) {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    customClient = createClient(url.trim(), anonKey.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
    customClient = null;
  }
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (customClient) return customClient;
  
  const { url, anonKey } = getStoredSupabaseConfig();
  if (url && anonKey) {
    try {
      customClient = createClient(url, anonKey);
      return customClient;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
};
