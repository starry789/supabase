import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'supabase_devpulse_url';
const STORAGE_KEY_KEY = 'supabase_devpulse_key';

let customClient: SupabaseClient | null = null;

const DEFAULT_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jjmezlzxainyswrugxoo.supabase.co';
const DEFAULT_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbWV6bHp4YWlueXN3cnVneG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3Mjk1NTAsImV4cCI6MjEwNDMwNTU1MH0.hrZBMiNbOlWG6e5VQPAnlNTrQsPHdui24XnPK5cd3vg';

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
