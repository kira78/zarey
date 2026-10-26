import { checkoutBodySchema } from '#shared/cart'

export default defineEventHandler(async (event) => {
  const { public: { siteUrl } } = useRuntimeConfig()

  // Défense CSRF : la requête doit venir de notre propre origine
  const origin = getRequestHeader(event, 'origin')
  if (!origin || origin !== new URL(siteUrl).origin) {
    throw createError({ statusCode: 403, statusMessage: 'Origine refusée' })
  }

  const body = await readValidatedBody(event, data => checkoutBodySchema.safeParse(data))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Panier invalide' })
  }
  const { items } = body.data

  const lineItems = buildLineItems(items, siteUrl)
  const stripe = useStripe()

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'fr',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ALLOWED_COUNTRIES },
      shipping_options: buildShippingOptions(items),
      phone_number_collection: { enabled: true },
      billing_address_collection: 'auto',
      metadata: { cart: cartMetadata(items) },
      success_url: `${siteUrl}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/commande/annulee`,
    })
    if (!session.url) throw new Error('Session Stripe sans URL')
    return { url: session.url }
  }
  catch (err) {
    // Ne jamais renvoyer le détail Stripe au client
    console.error('[checkout] échec création session', err instanceof Error ? err.message : err)
    throw createError({ statusCode: 502, statusMessage: 'Paiement momentanément indisponible' })
  }
})
