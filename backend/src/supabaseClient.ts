import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log config status for debugging (safe - no secrets exposed)
console.log('Supabase config status:');
console.log('  SUPABASE_URL:', url ? '✓ loaded' : '✗ MISSING');
console.log('  SUPABASE_SERVICE_ROLE_KEY:', key ? `✓ loaded (${key.substring(0, 20)}...)` : '✗ MISSING');

if (!url) {
  throw new Error('Missing SUPABASE_URL in backend environment');
}

if (!key) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in backend environment');
}

export const supabase = createClient(url, key);

// This file initializes the Supabase client using the URL and anonymous key from environment variables.
// Creates a Supabase client instance that can be imported and used in other parts of the application to perform database operations.
// Loads the environment variables from the .env file and creates a Supabase client instance that can be used to interact with the Supabase database throughout the application.
// Exports my Supabase client instance for use in other parts of the application.