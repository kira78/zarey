import type Stripe from 'stripe'

// Webhook Stripe : seule source fiable pour confirmer une commande payée.
// Configurer l'endpoint dans le dashboard Stripe avec l'événement checkout.session.completed.
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
      // TODO marque : brancher ici la préparation de commande (email, outil logistique, stock).
      console.info('[commande payée]', session.id, session.amount_total, session.metadata?.cart)
    }
  }

  return { received: true }
})
