import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://haozznyisdztjlgxxhau.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhb3p6bnlpc2R6dGpsZ3h4aGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTU1MzEsImV4cCI6MjA5MTY3MTUzMX0.soPaFZFKEEhvuwq4nZDSnvyxLc1nQEJVeIiNH7JGfP0';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
