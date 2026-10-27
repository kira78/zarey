# ZAREY

Boutique en ligne de la marque de streetwear ZAREY.

Nuxt 4 (SSR) · Tailwind · GSAP + Lenis · Pinia · Stripe Checkout

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Le site tourne sur http://localhost:3000. Sans clés Stripe, tout fonctionne sauf le paiement (l'API répond 503).

## Scripts

- `npm run dev` : serveur de dev
- `npm run build` : build de prod (`node .output/server/index.mjs` pour le lancer)
- `npm test` : tests unitaires + tests sur le build
- `npm run test:unit` : tests unitaires seuls
- `npm run media` : régénère `public/media` à partir des fichiers bruts de `assets/photo` (non versionnés)

## Organisation

```
app/        pages, composants, store du panier
server/     API checkout + webhook Stripe
shared/     catalogue et logique panier, utilisés côté client et serveur
scripts/    optimisation des images et vidéos
test/       vitest
```

Les produits sont dans `shared/catalog.ts`. Les prix sont en centimes.

## Paiement

Le panier n'envoie que le produit, la taille et la quantité. Le serveur recalcule le total à partir du catalogue
et crée une session Stripe Checkout, donc aucune donnée bancaire ne passe par le site.
La confirmation de commande arrive par le webhook `/api/webhooks/stripe` (événement `checkout.session.completed`).

Variables d'environnement :

| Variable | |
| --- | --- |
| `NUXT_STRIPE_SECRET_KEY` | clé secrète Stripe |
| `NUXT_STRIPE_WEBHOOK_SECRET` | secret de signature du webhook |
| `NUXT_PUBLIC_SITE_URL` | URL du site, sans slash final |

## Sécurité

Headers gérés par `nuxt-security` : CSP avec nonce, protection contre l'iframe, HSTS, limite de requêtes par IP
(plus stricte sur `/api/checkout`). Le checkout vérifie aussi l'en-tête `Origin`.

## Déploiement (Netlify)

La config est dans `netlify.toml`. Importer le repo dans Netlify, ajouter les trois variables
d'environnement ci-dessus puis déployer.

À noter : sur Netlify, la limite de requêtes est comptée par instance de fonction.

## Avant l'ouverture

- [ ] valider les prix, la composition et les frais de livraison
- [ ] compléter les mentions légales, les CGV et la page confidentialité
- [ ] passer les clés Stripe en live et déclarer le webhook
- [ ] envoyer les commandes payées vers l'email / la logistique (`server/api/webhooks/stripe.post.ts`)

## Licence

© ZAREY. Code et visuels, tous droits réservés.
