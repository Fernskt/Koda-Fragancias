import { supabase } from '../lib/supabase';
import { adaptPerfumeFromDB, adaptPerfumeToDB } from '../lib/adapters';
import type { Perfume } from '../types/perfume';

export const perfumeService = {
  async getAll(): Promise<Perfume[]> {
    const { data, error } = await supabase
      .from('perfumes')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) throw error;
    return data.map(adaptPerfumeFromDB);
  },

  async getAllAdmin(): Promise<Perfume[]> {
    // Para el panel admin — incluye inactivos
    const { data, error } = await supabase
      .from('perfumes')
      .select('*')
      .order('name');

    if (error) throw error;
    return data.map(adaptPerfumeFromDB);
  },

  async create(perfume: Omit<Perfume, 'id'>): Promise<Perfume> {
    const { data, error } = await supabase
      .from('perfumes')
      .insert(adaptPerfumeToDB(perfume))
      .select()
      .single();

    if (error) throw error;
    return adaptPerfumeFromDB(data);
  },

  async update(id: number, perfume: Partial<Omit<Perfume, 'id'>>): Promise<Perfume> {
    const updateData: Record<string, unknown> = {};
    if (perfume.name)        updateData.name         = perfume.name;
    if (perfume.brand)       updateData.brand        = perfume.brand;
    if (perfume.type)        updateData.type         = perfume.type;
    if (perfume.gender)      updateData.gender       = perfume.gender;
    if (perfume.family)      updateData.family       = perfume.family;
    if (perfume.use)         updateData.use_cases    = perfume.use;
    if (perfume.notes)       updateData.notes        = perfume.notes;
    if (perfume.price)       updateData.price        = perfume.price;
    if (perfume.status)      updateData.status       = perfume.status;
    if (perfume.image !== undefined)         updateData.image          = perfume.image ?? null;
    if (perfume.fragranticaUrl !== undefined) updateData.fragrantica_url = perfume.fragranticaUrl ?? null;
    if (perfume.starter !== undefined)       updateData.starter        = perfume.starter;

    const { data, error } = await supabase
      .from('perfumes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return adaptPerfumeFromDB(data);
  },

  async updateStatus(id: number, status: Perfume['status']): Promise<void> {
    const { error } = await supabase
      .from('perfumes')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: number): Promise<void> {
    // Soft delete — no borra el registro
    const { error } = await supabase
      .from('perfumes')
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  },

  async setActive(id: number, active: boolean): Promise<void> {
    const { error } = await supabase
      .from('perfumes')
      .update({ active })
      .eq('id', id);

    if (error) throw error;
  },
};