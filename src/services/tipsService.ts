import { supabase } from '../lib/supabase';

export const tipsService = {
  async getAll(): Promise<string[]> {
    const { data, error } = await supabase
      .from('tips')
      .select('content')
      .eq('active', true)
      .order('order_pos');

    if (error) throw error;
    return data.map((t) => t.content);
  },
};
