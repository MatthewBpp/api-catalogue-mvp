import {createClient} from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);


// This file initializes the Supabase client using the URL and anonymous key from environment variables.
// Creates a Supabase client instance that can be imported and used in other parts of the application to perform database operations.
// Loads the environment variables from the .env file and creates a Supabase client instance that can be used to interact with the Supabase database throughout the application.
// Exports my Supabase client instance for use in other parts of the application.