import { supabase } from '../lib/supabase';
import type { FragellaFragrance, ProductRecord, PerfumeStatus } from '../types/perfume';
import type { Json } from '../lib/database.types';

type ProductInsert = {
  fragella_id: string;
  price?: string;
  stock_status?: PerfumeStatus;
  stock_qty?: number | null;
  active?: boolean;
  notes_admin?: string | null;
  fragella_cache?: Json | null;
  order_pos?: number;
};

export const productService = {
  async getAll(): Promise<ProductRecord[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('order_pos')
      .order('created_at');

    if (error) throw error;
    return data as ProductRecord[];
  },

  async getAllAdmin(): Promise<ProductRecord[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('order_pos')
      .order('created_at');

    if (error) throw error;
    return data as ProductRecord[];
  },

  async addFromFragella(
    fragellaId: string,
    fragrance: FragellaFragrance,
    businessData: {
      price: string;
      stock_status: PerfumeStatus;
      stock_qty?: number;
      notes_admin?: string;
    }
  ): Promise<ProductRecord> {
    const insert: ProductInsert = {
      fragella_id: fragellaId,
      price: businessData.price,
      stock_status: businessData.stock_status,
      stock_qty: businessData.stock_qty ?? null,
      notes_admin: businessData.notes_admin ?? null,
      fragella_cache: fragrance as unknown as Json,
      active: true,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(insert)
      .select()
      .single();

    if (error) throw error;
    return data as ProductRecord;
  },

  async updateBusiness(
    id: number,
    data: Partial<Pick<ProductRecord, 'price' | 'stock_status' | 'stock_qty' | 'active' | 'notes_admin' | 'order_pos'>>
  ): Promise<ProductRecord> {
    const { data: updated, error } = await supabase
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated as ProductRecord;
  },

  async setActive(id: number, active: boolean): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ active })
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  },
};
