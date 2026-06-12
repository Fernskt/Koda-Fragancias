// ─── Fragella API ────────────────────────────────────────────────────────────

export interface FragellaFragrance {
  _id: string;
  Name: string;
  Brand: string;
  Year?: string;
  Gender?: string;
  OilType?: string;
  Longevity?: string;
  Sillage?: string;
  rating?: string;
  Country?: string;
  Price?: string;
  'Image URL'?: string;
  'Image URL Transparent'?: string;
  'General Notes'?: string[];
  'Main Accords'?: string[];
  'Main Accords Percentage'?: Record<string, string>;
  Notes?: {
    Top?: Array<{ name: string; imageUrl?: string }>;
    Middle?: Array<{ name: string; imageUrl?: string }>;
    Base?: Array<{ name: string; imageUrl?: string }>;
  };
  'Season Ranking'?: Array<{ name: string; score?: number }>;
  'Occasion Ranking'?: Array<{ name: string; score?: number }>;
}

// ─── Supabase `products` table ───────────────────────────────────────────────

export type PerfumeStatus = 'Disponible' | 'Última unidad' | 'Sin stock';

export interface ProductRecord {
  id: number;
  fragella_id: string;
  price: string;
  stock_status: PerfumeStatus;
  stock_qty: number | null;
  active: boolean;
  notes_admin: string | null;
  fragella_cache: FragellaFragrance | null;
  order_pos: number;
  created_at: string;
  updated_at: string;
}

// ─── Tipo combinado para el frontend ─────────────────────────────────────────

export interface CatalogProduct extends ProductRecord {
  fragrance: FragellaFragrance;
}

// ─── Tipo plano para los componentes de catálogo ─────────────────────────────

export interface DisplayProduct {
  id: number;
  fragella_id: string;
  name: string;
  brand: string;
  image?: string;
  notes: string;
  family: string[];
  use: string[];
  status: PerfumeStatus;
  price: string;
  gender: string;
  oilType?: string;
  starter: boolean;
  stock_qty: number | null;
  active: boolean;
  order_pos: number;
}

// ─── Legacy — se mantiene mientras los componentes se van migrando ────────────

export type PerfumeGender = 'Hombre' | 'Mujer' | 'Unisex' | 'Femenino';
export type PerfumeType = 'Arabe' | 'Diseñador';

export interface Perfume {
  id: number;
  name: string;
  brand: string;
  type: PerfumeType;
  gender: PerfumeGender;
  family: string[];
  use: string[];
  notes: string;
  price: string;
  status: PerfumeStatus;
  image?: string;
  fragranticaUrl?: string;
  fragranticaName?: string;
  verification?: string;
  starter: boolean;
}

export interface CartItem {
  perfume: DisplayProduct;
  quantity: number;
}

export interface FilterState {
  search: string;
  brand: string;
  status: string;
  gender: string;
  family: string;
  use: string;
}
