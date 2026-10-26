import { describe, expect, it } from 'vitest'
import { MAX_LINES, MAX_QTY_PER_LINE, PRODUCTS, SHIPPING } from '#shared/catalog'
import { addItem, checkoutBodySchema, countItems, removeItem, sanitizeCart, setQty, shippingFor, subtotal } from '#shared/cart'

const tee = PRODUCTS[0]!

describe('panier', () => {
  it('fusionne les lignes identiques et plafonne la quantité', () => {
    let items = addItem([], { slug: tee.slug, size: 'M', qty: 4 })
    items = addItem(items, { slug: tee.slug, size: 'M', qty: 9 })
    expect(items).toHaveLength(1)
    expect(items[0]!.qty).toBe(MAX_QTY_PER_LINE)
  })

  it('sépare les tailles différentes', () => {
    const items = addItem(addItem([], { slug: tee.slug, size: 'M', qty: 1 }), { slug: tee.slug, size: 'L', qty: 1 })
    expect(items).toHaveLength(2)
    expect(countItems(items)).toBe(2)
  })

  it('supprime une ligne quand la quantité tombe à 0', () => {
    const items = setQty([{ slug: tee.slug, size: 'S', qty: 1 }], tee.slug, 'S', 0)
    expect(items).toEqual([])
    expect(removeItem([{ slug: tee.slug, size: 'S', qty: 2 }], tee.slug, 'S')).toEqual([])
  })

  it('calcule le sous-total depuis le catalogue', () => {
    expect(subtotal([{ slug: tee.slug, size: 'M', qty: 2 }])).toBe(tee.price * 2)
    expect(subtotal([{ slug: 'inconnu', size: 'M', qty: 2 }])).toBe(0)
  })

  it('offre la livraison au-delà du seuil', () => {
    expect(shippingFor(0)).toBe(0)
    expect(shippingFor(SHIPPING.freeFrom - 1)).toBe(SHIPPING.standard)
    expect(shippingFor(SHIPPING.freeFrom)).toBe(0)
  })
})

describe('sanitizeCart (données localStorage non fiables)', () => {
  it('rejette les structures invalides', () => {
    expect(sanitizeCart('pas un tableau')).toEqual([])
    expect(sanitizeCart([{ slug: tee.slug, size: 'M', qty: -3 }])).toEqual([])
    expect(sanitizeCart([{ slug: '<script>', size: 'M', qty: 1 }])).toEqual([])
    expect(sanitizeCart(Array.from({ length: MAX_LINES + 1 }, () => ({ slug: tee.slug, size: 'M', qty: 1 })))).toEqual([])
  })

  it('retire les produits absents du catalogue', () => {
    expect(sanitizeCart([{ slug: 'produit-supprime', size: 'M', qty: 1 }, { slug: tee.slug, size: 'M', qty: 1 }]))
      .toEqual([{ slug: tee.slug, size: 'M', qty: 1 }])
  })
})

describe('checkoutBodySchema', () => {
  const items = [{ slug: tee.slug, size: 'M', qty: 1 }]

  it('exige l’acceptation des CGV', () => {
    expect(checkoutBodySchema.safeParse({ items, acceptTerms: false }).success).toBe(false)
    expect(checkoutBodySchema.safeParse({ items, acceptTerms: true }).success).toBe(true)
  })

  it('refuse un prix injecté par le client', () => {
    expect(checkoutBodySchema.safeParse({ items, acceptTerms: true, price: 1 }).success).toBe(false)
    expect(checkoutBodySchema.safeParse({ items: [{ ...items[0], price: 1 }], acceptTerms: true }).success).toBe(false)
  })

  it('refuse un panier vide ou une quantité hors limites', () => {
    expect(checkoutBodySchema.safeParse({ items: [], acceptTerms: true }).success).toBe(false)
    expect(checkoutBodySchema.safeParse({ items: [{ ...items[0], qty: 999 }], acceptTerms: true }).success).toBe(false)
  })
})
