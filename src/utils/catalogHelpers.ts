import type { CatalogProduct, DisplayProduct } from '../types/perfume';
import { t, ACCORDS_ES, GENDER_ES, SEASON_ES, OCCASION_ES } from './translations';

function deriveUse(product: CatalogProduct): string[] {
  const seasons = (product.fragrance['Season Ranking'] ?? [])
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 2)
    .map((s) => t(SEASON_ES, s.name));

  const occasions = (product.fragrance['Occasion Ranking'] ?? [])
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 2)
    .map((o) => t(OCCASION_ES, o.name));

  return [...new Set([...seasons, ...occasions])];
}

function deriveStarter(product: CatalogProduct): boolean {
  const rating = parseFloat(product.fragrance.rating ?? '0');
  return rating >= 4.3;
}

export function toCatalogDisplay(product: CatalogProduct): DisplayProduct {
  const { fragrance } = product;
  return {
    id: product.id,
    fragella_id: product.fragella_id,
    name: fragrance.Name,
    brand: fragrance.Brand,
    image: fragrance['Image URL Transparent'] ?? fragrance['Image URL'],
    notes: fragrance['General Notes']?.join(' · ') ?? '',
    family: (fragrance['Main Accords'] ?? []).map((a) => t(ACCORDS_ES, a)),
    use: deriveUse(product),
    status: product.stock_status,
    price: product.price,
    gender: t(GENDER_ES, fragrance.Gender ?? ''),
    oilType: fragrance.OilType,
    starter: deriveStarter(product),
    stock_qty: product.stock_qty,
    active: product.active,
    order_pos: product.order_pos,
  };
}
