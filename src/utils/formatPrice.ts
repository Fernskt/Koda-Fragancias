export function formatPrice(price: string): string {
  return price || 'Consultar precio';
}

export function isConsultPrice(price: string): boolean {
  return !price || price.toLowerCase().includes('consultar');
}
