import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { $fetch, fetch, setup } from '@nuxt/test-utils/e2e'

// Build de production + serveur réel, sans clés Stripe (paiement "non configuré").
await setup({
  rootDir: fileURLToPath(new URL('../..', import.meta.url)),
  server: true,
  browser: false,
})

const ORIGIN = 'http://localhost:3000'
const validBody = { items: [{ slug: 'oval-tee-noir', size: 'M', qty: 1 }], acceptTerms: true }

describe('pages', () => {
  it('rend l’accueil en SSR', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('Le drop')
    expect(html).toContain('lang="fr"')
  })

  it('rend une fiche produit avec son prix', async () => {
    const html = await $fetch<string>('/produit/oval-tee-kaki')
    expect(html).toContain('Oval Tee')
    expect(html).toContain('Kaki')
    expect(html).toMatch(/35,00\s?€/)
  })

  it('renvoie 404 sur un produit inconnu', async () => {
    const res = await fetch('/produit/n-existe-pas')
    expect(res.status).toBe(404)
  })
})

describe('en-têtes de sécurité', () => {
  it('pose CSP, anti-clickjacking et nosniff', async () => {
    const res = await fetch('/')
    const csp = res.headers.get('content-security-policy') ?? ''
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toMatch(/script-src[^;]*'nonce-/)
    expect(res.headers.get('x-frame-options')).toBe('DENY')
    expect(res.headers.get('x-content-type-options')).toBe('nosniff')
    expect(res.headers.get('x-powered-by')).toBeNull()
  })
})

describe('API checkout', () => {
  const post = (body: unknown, headers: Record<string, string> = {}) =>
    fetch('/api/checkout', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) })

  it('refuse une requête sans origine (CSRF)', async () => {
    expect((await post(validBody)).status).toBe(403)
  })

  it('refuse une origine étrangère', async () => {
    expect((await post(validBody, { origin: 'https://evil.example' })).status).toBe(403)
  })

  it('refuse un panier invalide', async () => {
    expect((await post({ items: [{ slug: 'oval-tee-noir', size: 'M', qty: 1, price: 1 }], acceptTerms: true }, { origin: ORIGIN })).status).toBe(400)
    expect((await post({ items: [], acceptTerms: true }, { origin: ORIGIN })).status).toBe(400)
    expect((await post({ ...validBody, acceptTerms: false }, { origin: ORIGIN })).status).toBe(400)
  })

  it('répond 503 tant que Stripe n’est pas configuré', async () => {
    expect((await post(validBody, { origin: ORIGIN })).status).toBe(503)
  })

  it('refuse les méthodes non prévues', async () => {
    const res = await fetch('/api/checkout', { method: 'GET' })
    expect(res.ok).toBe(false)
  })
})

describe('webhook Stripe', () => {
  it('refuse tout appel tant que le secret n’est pas configuré', async () => {
    const res = await fetch('/api/webhooks/stripe', { method: 'POST', body: '{}', headers: { 'stripe-signature': 'faux' } })
    expect(res.status).toBe(503)
  })
})

describe('statut de session', () => {
  it('valide le format de l’identifiant', async () => {
    const res = await fetch('/api/checkout/..%2F..%2Fetc')
    expect(res.status).toBe(400)
  })
})
