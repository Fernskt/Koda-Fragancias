import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

export type StoreConfig = Database['public']['Tables']['store_config']['Row'];

export const storeConfigService = {
  async get(): Promise<StoreConfig> {
    const { data, error } = await supabase
      .from('store_config')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async touchCatalogUpdatedAt(): Promise<void> {
    const { data: config, error: fetchError } = await supabase
      .from('store_config')
      .select('id')
      .single();
    if (fetchError) throw fetchError;

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const { error } = await supabase
      .from('store_config')
      .update({ catalog_updated_at: today })
      .eq('id', config.id);

    if (error) throw error;
  },
};
