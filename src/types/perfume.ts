export type PerfumeStatus = 'Disponible' | 'Última unidad' | 'Sin stock';
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
  active?: boolean;
}

export interface CartItem {
  perfume: Perfume;
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
