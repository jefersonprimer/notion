import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Garante que as variáveis de .env sejam carregadas

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key must be provided in .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
