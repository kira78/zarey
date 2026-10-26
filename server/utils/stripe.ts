import Stripe from 'stripe'

let client: Stripe | null = null

/** Client Stripe paresseux : renvoie 503 tant que la clé secrète n'est pas configurée. */
export function useStripe(): Stripe {
  const { stripeSecretKey } = useRuntimeConfig()
  if (!stripeSecretKey) {
    throw createError({ statusCode: 503, statusMessage: 'Paiement non configuré' })
  }
  client ??= new Stripe(stripeSecretKey, { maxNetworkRetries: 2, timeout: 15000 })
  return client
}
