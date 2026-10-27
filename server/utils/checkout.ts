import type Stripe from 'stripe'
import { createError } from 'h3'
import { SHIPPING, getProduct } from '#shared/catalog'
import { type CartItem, shippingFor, subtotal } from '#shared/cart'

// Les prix viennent du catalogue, jamais du client
export function buildLineItems(items: CartItem[], siteUrl: string): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return items.map((item) => {
    const product = getProduct(item.slug)
    if (!product || !product.sizes.includes(item.size)) {
      throw createError({ statusCode: 400, statusMessage: 'Produit indisponible' })
    }
    const image = product.images[0]
    return {
      quantity: item.qty,
      price_data: {
        currency: 'eur',
        unit_amount: product.price,
        product_data: {
          name: `${product.name} — ${product.colorway} — ${item.size}`,
          images: siteUrl.startsWith('https://') && image ? [new URL(image, siteUrl).toString()] : undefined,
          metadata: { slug: product.slug, size: item.size },
        },
      },
    }
  })
}

export function buildShippingOptions(items: CartItem[]): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  const amount = shippingFor(subtotal(items))
  return [{
    shipping_rate_data: {
      type: 'fixed_amount',
      display_name: amount === 0 ? 'Livraison offerte' : 'Livraison standard',
      fixed_amount: { amount, currency: 'eur' },
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 2 },
        maximum: { unit: 'business_day', value: 5 },
      },
    },
  }]
}

// metadata Stripe limitée à 500 caractères
export function cartMetadata(items: CartItem[]): string {
  return items.map(i => `${i.slug}:${i.size}:${i.qty}`).join(',').slice(0, 500)
}

export const ALLOWED_COUNTRIES = [...SHIPPING.countries]
