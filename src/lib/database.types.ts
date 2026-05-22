export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      perfumes: {
        Row: {
          id: number;
          name: string;
          brand: string;
          type: 'Arabe' | 'Diseñador';
          gender: 'Hombre' | 'Mujer' | 'Unisex' | 'Femenino';
          family: string[];
          use_cases: string[];
          notes: string;
          price: string;
          status: 'Disponible' | 'Última unidad' | 'Sin stock';
          image: string | null;
          fragrantica_url: string | null;
          fragrantica_name: string | null;
          verification: string | null;
          starter: boolean;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['perfumes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['perfumes']['Insert']>;
      };
      tips: {
        Row: {
          id: number;
          content: string;
          active: boolean;
          order_pos: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tips']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['tips']['Insert']>;
      };
      store_config: {
        Row: {
          id: number;
          whatsapp_number: string;
          instagram_url: string;
          catalog_updated_at: string;
          store_name: string;
          store_tagline: string;
          about_text: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['store_config']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['store_config']['Insert']>;
      };
    };
  };
}