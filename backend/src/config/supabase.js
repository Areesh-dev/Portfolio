import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Service-role client — full database/storage access, bypasses RLS.
// This must NEVER be imported by frontend code or leaked in a response.
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
