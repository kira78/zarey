// Statut minimal d'une session pour la page de confirmation (aucune donnée personnelle renvoyée)
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Session invalide' })
  }
  const stripe = useStripe()
  try {
    const session = await stripe.checkout.sessions.retrieve(id)
    return {
      paid: session.payment_status === 'paid',
      amountTotal: session.amount_total ?? 0,
    }
  }
  catch {
    throw createError({ statusCode: 404, statusMessage: 'Session introuvable' })
  }
})
