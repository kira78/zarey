import type Stripe from 'stripe'

// Endpoint à déclarer dans Stripe (événement checkout.session.completed)
export default defineEventHandler(async (event) => {
  const { stripeWebhookSecret } = useRuntimeConfig()
  if (!stripeWebhookSecret) {
    throw createError({ statusCode: 503, statusMessage: 'Webhook non configuré' })
  }

  const signature = getRequestHeader(event, 'stripe-signature')
  const raw = await readRawBody(event, false)
  if (!signature || !raw) {
    throw createError({ statusCode: 400, statusMessage: 'Requête invalide' })
  }

  let stripeEvent: Stripe.Event
  try {
    stripeEvent = useStripe().webhooks.constructEvent(raw, signature, stripeWebhookSecret)
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'Signature invalide' })
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object
    if (session.payment_status === 'paid') {
      // TODO: email de confirmation + envoi à la logistique
      console.info('[commande payée]', session.id, session.amount_total, session.metadata?.cart)
    }
  }

  return { received: true }
})
