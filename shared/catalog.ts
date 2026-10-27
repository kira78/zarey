// TODO: valider prix et compo avec la marque

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const
export type Size = (typeof SIZES)[number]

export interface Product {
  slug: string
  // même group = coloris d'un même modèle
  group: string
  name: string
  colorway: string
  swatch: string
  // TTC, en centimes
  price: number
  images: string[]
  sizes: readonly Size[]
  description: string
  details: string[]
  badge?: string
}

const OVAL_TEE_DETAILS = [
  'Coupe oversize, épaules tombantes',
  'Logo ovale ZAREY sur la poitrine',
  'Unisexe — prends ta taille habituelle pour un tombé large',
]

const ovalTee = (slug: string, colorway: string, swatch: string, images: string[], badge?: string): Product => ({
  slug,
  group: 'oval-tee',
  name: 'Oval Tee',
  colorway,
  swatch,
  price: 3500,
  images,
  sizes: SIZES,
  description: 'Le t-shirt signature. Coupe boxy, logo ovale porté côté cœur. La base de chaque fit ZAREY.',
  details: OVAL_TEE_DETAILS,
  badge,
})

export const PRODUCTS: Product[] = [
  ovalTee('oval-tee-bleu-roi', 'Bleu roi', '#1f3fd9', ['/media/tee-bleu-roi-1.webp', '/media/tee-bleu-roi-2.webp', '/media/flatlay-1-1600.webp'], 'Drop 01'),
  ovalTee('oval-tee-rose', 'Rose', '#eba99b', ['/media/tee-rose-1.webp', '/media/tee-rose-2.webp', '/media/flatlay-1-1600.webp'], 'Drop 01'),
  ovalTee('oval-tee-blanc', 'Blanc', '#ffffff', ['/media/tee-blanc-1.webp', '/media/parking-1-1600.webp', '/media/parking-4-1600.webp']),
  ovalTee('oval-tee-noir', 'Noir', '#0d0d0d', ['/media/tee-noir-1.webp', '/media/tee-noir-2.webp', '/media/vestiaire-1-1600.webp']),
  ovalTee('oval-tee-kaki', 'Kaki', '#7e8c3b', ['/media/tee-kaki-1.webp', '/media/tee-kaki-2.webp', '/media/flatlay-2-1600.webp'], 'Drop 01'),
  {
    slug: 'oval-longsleeve-blanc',
    group: 'oval-longsleeve',
    name: 'Oval Longsleeve',
    colorway: 'Blanc',
    swatch: '#ffffff',
    price: 4500,
    images: ['/media/cite-1-1600.webp', '/media/porte-bleue-1-1600.webp', '/media/cite-4-1600.webp', '/media/cite-2-1600.webp'],
    sizes: SIZES,
    description: 'Le manches longues pour les jours gris. Même logo ovale, même attitude.',
    details: ['Coupe ample', 'Logo ovale ZAREY sur la poitrine', 'Unisexe'],
  },
]

export const MAX_QTY_PER_LINE = 10
export const MAX_LINES = 20

// en centimes
export const SHIPPING = {
  standard: 490,
  freeFrom: 8000,
  countries: ['FR', 'BE', 'LU', 'CH', 'MC'] as const,
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}

export function getColorways(group: string): Product[] {
  return PRODUCTS.filter(p => p.group === group)
}
