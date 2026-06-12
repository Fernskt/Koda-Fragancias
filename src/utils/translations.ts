export const ACCORDS_ES: Record<string, string> = {
  sweet: 'Dulce',
  woody: 'Amaderado',
  floral: 'Floral',
  fruity: 'Frutal',
  fresh: 'Fresco',
  citrus: 'Cítrico',
  aromatic: 'Aromático',
  musky: 'Almizclado',
  spicy: 'Especiado',
  'warm spicy': 'Especiado cálido',
  'fresh spicy': 'Especiado fresco',
  vanilla: 'Avainillado',
  amber: 'Ámbar',
  oud: 'Oud',
  aquatic: 'Acuático',
  gourmand: 'Gourmand',
  powdery: 'Empolvado',
  earthy: 'Terroso',
  green: 'Verde',
  leather: 'Cuero',
  smoky: 'Ahumado',
  balsamic: 'Balsámico',
  rose: 'Rosa',
  lavender: 'Lavanda',
  jasmine: 'Jazmín',
  sandalwood: 'Sándalo',
  patchouli: 'Pachulí',
  bergamot: 'Bergamota',
  vetiver: 'Vetiver',
  iris: 'Iris',
  animalic: 'Animalico',
  mossy: 'Musgoso',
  cinnamon: 'Canela',
  coconut: 'Coco',
  honey: 'Miel',
  tobacco: 'Tabaco',
  coffee: 'Café',
  'white floral': 'Floral blanco',
  tropical: 'Tropical',
  herbal: 'Herbal',
  fougere: 'Fougère',
  chypre: 'Chypre',
};

export const LONGEVITY_ES: Record<string, string> = {
  'long lasting': 'Larga duración',
  moderate: 'Moderada',
  'short lived': 'Corta',
  'very long lasting': 'Muy larga duración',
  eternal: 'Eterna',
};

export const SILLAGE_ES: Record<string, string> = {
  intimate: 'Íntima',
  moderate: 'Moderada',
  strong: 'Fuerte',
  enormous: 'Enorme',
  soft: 'Suave',
};

export const GENDER_ES: Record<string, string> = {
  men: 'Hombre',
  'for men': 'Hombre',
  male: 'Hombre',
  women: 'Mujer',
  'for women': 'Mujer',
  female: 'Mujer',
  unisex: 'Unisex',
};

export const SEASON_ES: Record<string, string> = {
  spring: 'Primavera',
  summer: 'Verano',
  fall: 'Otoño',
  autumn: 'Otoño',
  winter: 'Invierno',
};

export const OCCASION_ES: Record<string, string> = {
  casual: 'Casual',
  professional: 'Oficina',
  'night out': 'Noche',
  daily: 'Diario',
  'special occasion': 'Ocasión especial',
  sport: 'Deporte',
  business: 'Negocios',
  leisure: 'Ocio',
};

/** Si no hay traducción, devuelve la clave original con primera letra en mayúscula */
export const t = (dict: Record<string, string>, key: string): string => {
  const lower = key.toLowerCase();
  if (dict[lower]) return dict[lower];
  return key.charAt(0).toUpperCase() + key.slice(1);
};
