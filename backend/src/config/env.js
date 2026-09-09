import 'dotenv/config';

const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'ADMIN_EMAIL'];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variable(s): ${missing.join(', ')}. Copy .env.example to backend/.env and fill them in.`
  );
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  // Comma-separated list so multiple local dev servers (e.g. Vite falling
  // back to 5174 when 5173 is taken) can all reach the API at once.
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()),
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  adminEmail: process.env.ADMIN_EMAIL.toLowerCase(),
};
