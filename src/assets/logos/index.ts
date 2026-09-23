import { normalize } from '../../utils/normalize';

import Afnan from './Afnan.png';
import AlHaramain from './al-haramain-logo-png.png';
import Armaf from './Armaf.png';
import Bharara from './Bharara.png';
import FrenchAvenue from './FrenchAvenue.webp';
import Lattafa from './Lattafa.png';
import MaisonAlhambra from './maison-alhambra.png';
import SabrinaCarpenter from './nobilis-group-Sabrina-Carpenter-logo-portfolio-page1.webp';
import Rasasi from './Rasasi Logo.png';
import Rayhaan from './Rayhaan.png';
import Versace from './VersaceLogo.png';

/**
 * Un logo por marca. La clave es el nombre de marca tal como aparece en el
 * catálogo (campo `brand` de Perfume); `getBrandLogo` compara sin importar
 * mayúsculas/acentos, así que no hace falta que coincida caracter a caracter.
 */
export const brandLogos = {
  Afnan,
  'Al Haramain': AlHaramain,
  Armaf,
  Bharara,
  'French Avenue': FrenchAvenue,
  Lattafa,
  'Maison Alhambra': MaisonAlhambra,
  'Sabrina Carpenter': SabrinaCarpenter,
  Rasasi,
  Rayhaan,
  Versace,
} satisfies Record<string, string>;

export type Brand = keyof typeof brandLogos;

const lookup = new Map(Object.entries(brandLogos).map(([brand, src]) => [normalize(brand), src]));

/** Devuelve el logo de una marca, o undefined si no tenemos uno cargado. */
export function getBrandLogo(brand: string): string | undefined {
  return lookup.get(normalize(brand));
}

export {
  Afnan,
  AlHaramain,
  Armaf,
  Bharara,
  FrenchAvenue,
  Lattafa,
  MaisonAlhambra,
  SabrinaCarpenter,
  Rasasi,
  Rayhaan,
  Versace,
};
