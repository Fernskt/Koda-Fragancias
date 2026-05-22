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
};
