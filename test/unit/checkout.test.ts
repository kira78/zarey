import { describe, expect, it } from 'vitest'
import { PRODUCTS, SHIPPING } from '#shared/catalog'
import { buildLineItems, buildShippingOptions, cartMetadata } from '../../server/utils/checkout'

const tee = PRODUCTS[0]!

describe('buildLineItems', () => {
  it('prend le prix du catalogue serveur', () => {
    const [line] = buildLineItems([{ slug: tee.slug, size: 'L', qty: 3 }], 'http://localhost:3000')
    expect(line!.quantity).toBe(3)
    expect(line!.price_data!.unit_amount).toBe(tee.price)
    expect(line!.price_data!.currency).toBe('eur')
    expect(line!.price_data!.product_data!.name).toContain('L')
  })

  it('n’envoie les images à Stripe qu’en HTTPS', () => {
    const [http] = buildLineItems([{ slug: tee.slug, size: 'M', qty: 1 }], 'http://localhost:3000')
    const [https] = buildLineItems([{ slug: tee.slug, size: 'M', qty: 1 }], 'https://zarey.fr')
    expect(http!.price_data!.product_data!.images).toBeUndefined()
    expect(https!.price_data!.product_data!.images![0]).toMatch(/^https:\/\/zarey\.fr\/media\//)
  })

  it('refuse un produit inconnu', () => {
    expect(() => buildLineItems([{ slug: 'inconnu', size: 'M', qty: 1 }], 'https://zarey.fr')).toThrow()
  })
})

describe('livraison et métadonnées', () => {
  it('applique la livraison standard sous le seuil', () => {
    const [opt] = buildShippingOptions([{ slug: tee.slug, size: 'M', qty: 1 }])
    expect(opt!.shipping_rate_data!.fixed_amount!.amount).toBe(SHIPPING.standard)
  })

  it('limite les métadonnées à 500 caractères', () => {
    const items = Array.from({ length: 20 }, () => ({ slug: 'oval-longsleeve-blanc', size: 'XXL' as const, qty: 10 }))
    expect(cartMetadata(items).length).toBeLessThanOrEqual(500)
  })
})
