import { supabase } from '../config/database.js';

export async function findAll() {
  const { data, error } = await supabase.from('locais').select('*');
  if (error) throw error;
  return data;
}

export async function findById(id) {
  const { data, error } = await supabase.from('locais').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function create(local) {
  const { data, error } = await supabase.from('locais').insert([local]).select();
  if (error) throw error;
  return data[0];
}

export async function update(id, local) {
  const { data, error } = await supabase.from('locais').update(local).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function remove(id) {
  const { data, error } = await supabase.from('locais').delete().eq('id', id).select();
  if (error) throw error;
  return data[0];
}
