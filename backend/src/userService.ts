import { supabase } from './supabaseClient';

export async function getUserByNumber(userNumber: string) {
  const { data, error } = await supabase
    .from('users')
    .select('user_number, display_name, groups')
    .eq('user_number', userNumber)
    .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
}

// This function retrieves a user from the 'users' table in the Supabase database based on their user number.
// It selects the user_number, display_name, and groups fields for the matching user and returns the data if found.
// If there is an error during the database query, it logs the error and returns null.