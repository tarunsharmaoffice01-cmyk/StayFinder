import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Set SUPABASE_URL and a server-side key, or provide the VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
