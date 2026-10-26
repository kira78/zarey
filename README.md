# ZAREY — boutique en ligne

Site e-commerce de la marque ZAREY (Nuxt 4, SSR). Direction artistique : logo ovale jaune/rouge/bleu, esprit sticker,
inspirée de [moblinks.fr](https://www.moblinks.fr/) (couleurs, cartes produit, panier tiroir) et
[gassstudios.fr](https://gassstudios.fr/) (hero vidéo, intro jauge, lookbook filtrable).

## Démarrer

```bash
npm install
cp .env.example .env   # puis remplir les clés Stripe de TEST
npm run dev            # http://localhost:3000
```

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` puis `node .output/server/index.mjs` | Build + serveur de production |
| `npm test` | Tests unitaires + intégration (build réel) |
| `npm run test:unit` | Tests unitaires seuls (rapide) |
| `npm run media` | Régénère `public/media` depuis `assets/photo` (photos WebP, packshots, vidéos) |

## Architecture

- `shared/catalog.ts` — catalogue produit, **source de vérité unique** (front + serveur).
- `shared/cart.ts` — logique panier pure + schémas Zod partagés.
- `server/api/checkout.post.ts` — crée une session Stripe Checkout.
- `server/api/webhooks/stripe.post.ts` — confirmation de paiement signée par Stripe.
- `app/` — pages, composants, store Pinia (`stores/cart.ts`), animations GSAP + Lenis (`plugins/motion.client.ts`).

## Sécurité

- **Prix calculés côté serveur** : le client n'envoie que `slug / taille / quantité`, validés par Zod en mode strict
  (tout champ en trop, comme un prix injecté, est rejeté).
- **Aucune donnée bancaire sur le site** : paiement hébergé par Stripe Checkout (PCI-DSS géré par Stripe).
- **CSRF** : `/api/checkout` exige un en-tête `Origin` égal à `NUXT_PUBLIC_SITE_URL`.
- **Redirections** : URLs Stripe construites depuis `NUXT_PUBLIC_SITE_URL`, jamais depuis l'en-tête `Host`.
  Le front ne suit qu'une URL `https://checkout.stripe.com/`.
- **Webhook** : signature vérifiée (`stripe.webhooks.constructEvent`) ; c'est la seule source fiable d'une commande payée.
- **En-têtes** (nuxt-security) : CSP stricte avec nonce + `strict-dynamic`, `frame-ancestors 'none'`, `X-Frame-Options`,
  `nosniff`, HSTS, Permissions-Policy, `X-Powered-By` retiré.
- **Rate limiting** : 150 req / 5 min par IP, 10 req / min sur `/api/checkout`. Taille de requête limitée à 64 Ko.
- **localStorage** : le panier relu est revalidé (schéma + existence au catalogue) avant usage.
- **Secrets** : uniquement en variables d'environnement serveur (`.env` ignoré par git).
- **Aucun script tiers**, polices auto-hébergées (@nuxt/fonts), pas de cookie de suivi.

`npm audit` signale des failles dans des outils de **dev/build** uniquement (`node-forge` via le serveur de dev
`listhen`, `postcss-selector-parser` via Tailwind). Elles n'existent pas dans le serveur de production.
Pas de correctif publié à ce jour : relancer `npm audit` avant la mise en ligne.

## Mise en ligne : checklist

1. **Infos marque** à fournir/valider : prix (`shared/catalog.ts`), composition et grammage des tees,
   frais et pays de livraison (`SHIPPING`), textes d'accroche.
2. **Pages légales** : compléter les champs surlignés dans `/mentions-legales`, `/cgv`, `/confidentialite`
   (SIRET, adresse, hébergeur, médiateur). Faire relire les CGV.
3. **Stripe** : compte activé, clés **live** en variables d'environnement de l'hébergeur,
   webhook `https://<domaine>/api/webhooks/stripe` sur `checkout.session.completed`.
4. `NUXT_PUBLIC_SITE_URL=https://<domaine>` (HTTPS obligatoire).
5. Brancher la préparation de commande dans le webhook (`TODO marque`) : email, logistique, stock.
6. Si l'hébergement est derrière un proxy/CDN, vérifier que le rate limiter voit la vraie IP client.

## Déploiement Netlify

`netlify.toml` est prêt (build `npm run build`, Node 22). Netlify détecte Nuxt et sert les pages via ses fonctions.

1. Sur Netlify : *Add new site* → *Import an existing project* → choisir le dépôt GitHub.
2. *Site configuration* → *Environment variables* : ajouter `NUXT_STRIPE_SECRET_KEY`,
   `NUXT_STRIPE_WEBHOOK_SECRET` et `NUXT_PUBLIC_SITE_URL` (ex. `https://zarey.netlify.app`).
3. Redéployer après chaque changement de variable.

Limite : sur Netlify, le rate limiter garde ses compteurs en mémoire par instance de fonction.
Il freine les abus simples mais ne remplace pas une protection au niveau CDN.

## Médias

Les originaux (`assets/photo`, ~41 Mo) ne sont pas versionnés. Les versions optimisées (`public/media`, WebP 800/1600 px,
boucle hero 1 Mo, film chargé à la demande) sont générées par `npm run media`.
