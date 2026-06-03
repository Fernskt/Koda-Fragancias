import type { CartItem, Perfume } from '../types/perfume';

const DEFAULT_NUMBER = '5491156009539';

export function buildWhatsAppUrl(message: string, number = DEFAULT_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildProductMessage(perfume: Perfume): string {
  if (perfume.status === 'Sin stock') {
    return `Hola Koda! Quería consultar cuándo vuelve a entrar ${perfume.name} (${perfume.brand}).`;
  }
  return `Hola Koda! Quería consultar por ${perfume.name} (${perfume.brand}). Vi que figura: ${perfume.status}.`;
}

export function buildOutOfStockMessage(perfume: Perfume): string {
  return `Hola Koda! Quería consultar cuándo vuelve a entrar ${perfume.name} (${perfume.brand}).`;
}

export function buildCartMessage(items: CartItem[]): string {
  const lines = items
    .map((item) => `• ${item.perfume.name} (${item.perfume.brand}) x${item.quantity} - ${item.perfume.price}`)
    .join('\n');

  const total = items.reduce((acc, item) => {
    const raw = item.perfume.price.replace(/\D/g, '');
    const num = parseInt(raw, 10);
    return isNaN(num) ? acc : acc + num * item.quantity;
  }, 0);

  const totalLine =
    total > 0
      ? `\n\u{1F4B0} Total estimado: $${total.toLocaleString('es-AR')}`
      : '';

  return `Hola Koda! Quiero hacer el siguiente pedido:\n\n\u{1F6D2} Mi pedido:\n${lines}${totalLine}\n\n¿Podés confirmarme disponibilidad?`;
}

export function buildGeneralMessage(): string {
  return 'Hola Koda Fragancias! No encuentro el perfume que busco. ¿Me podés ayudar?';
}
