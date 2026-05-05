import { supabase } from "./supabaseClient";

export interface ApiRecord {
  id?: string;
  name: string;
  base_url: string;
  version: string;
  owner_id: string | null;
  tags: string[];
  lifecycle: string;
  description: string | null;
  team: string | null;
  openapi_path: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function listApis(search?: string, tag?: string): Promise<ApiRecord[]> {
  let query = supabase.from('apis').select('*');

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as ApiRecord[];
}

// Defines the ApiRecord interface representing the structure of an API entry in the database and implements the listApis function to query the 'apis' table with optional search and tag filters, returning a list of API records.
