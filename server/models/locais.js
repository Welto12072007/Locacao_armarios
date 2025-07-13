import { supabase } from '../config/database.js';

export class Local {
  static async findAll() {
    try {
      const { data, error } = await supabase
        .from('locais')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar todos os locais:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('locais')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar local por ID:', error);
      throw error;
    }
  }

  static async create(localData) {
    try {
      const { data, error } = await supabase
        .from('locais')
        .insert([localData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar local:', error);
      throw error;
    }
  }

  static async update(id, localData) {
    try {
      const { data, error } = await supabase
        .from('locais')
        .update(localData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar local:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { error } = await supabase
        .from('locais')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar local:', error);
      throw error;
    }
  }
}
