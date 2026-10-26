import { z } from 'zod'
import { MAX_LINES, MAX_QTY_PER_LINE, PRODUCTS, SHIPPING, SIZES, getProduct } from './catalog'

// Schéma d'une ligne de panier : sert à valider le localStorage côté client
// et le corps de requête côté serveur (même contrat des deux côtés).
export const cartItemSchema = z.object({
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  size: z.enum(SIZES),
  qty: z.number().int().min(1).max(MAX_QTY_PER_LINE),
}).strict()

export const cartSchema = z.array(cartItemSchema).max(MAX_LINES)

export const checkoutBodySchema = z.object({
  items: cartSchema.min(1),
  acceptTerms: z.literal(true),
}).strict()

export type CartItem = z.infer<typeof cartItemSchema>

/** Ne garde que les lignes valides qui existent au catalogue. */
export function sanitizeCart(raw: unknown): CartItem[] {
  const parsed = cartSchema.safeParse(raw)
  if (!parsed.success) return []
  return parsed.data.filter((i) => {
    const p = getProduct(i.slug)
    return p && p.sizes.includes(i.size)
  })
}

export function addItem(items: CartItem[], item: CartItem): CartItem[] {
  const existing = items.find(i => i.slug === item.slug && i.size === item.size)
  if (existing) {
    return items.map(i => i === existing ? { ...i, qty: Math.min(i.qty + item.qty, MAX_QTY_PER_LINE) } : i)
  }
  if (items.length >= MAX_LINES) return items
  return [...items, { ...item, qty: Math.min(item.qty, MAX_QTY_PER_LINE) }]
}

export function setQty(items: CartItem[], slug: string, size: CartItem['size'], qty: number): CartItem[] {
  if (qty <= 0) return removeItem(items, slug, size)
  const q = Math.min(Math.floor(qty), MAX_QTY_PER_LINE)
  return items.map(i => i.slug === slug && i.size === size ? { ...i, qty: q } : i)
}

export function removeItem(items: CartItem[], slug: string, size: CartItem['size']): CartItem[] {
  return items.filter(i => !(i.slug === slug && i.size === size))
}

export function countItems(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.qty, 0)
}

/** Sous-total en centimes, calculé uniquement depuis le catalogue. */
export function subtotal(items: CartItem[], catalog = PRODUCTS): number {
  return items.reduce((sum, i) => {
    const p = catalog.find(c => c.slug === i.slug)
    return p ? sum + p.price * i.qty : sum
  }, 0)
}

export function shippingFor(subtotalCents: number): number {
  return subtotalCents === 0 || subtotalCents >= SHIPPING.freeFrom ? 0 : SHIPPING.standard
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}
