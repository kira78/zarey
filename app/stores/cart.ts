import { defineStore } from 'pinia'
import { getProduct } from '#shared/catalog'
import { type CartItem, addItem, countItems, removeItem, sanitizeCart, setQty, shippingFor, subtotal } from '#shared/cart'

const STORAGE_KEY = 'zarey-cart-v1'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    open: false,
    hydrated: false,
  }),
  getters: {
    count: s => countItems(s.items),
    subtotal: s => subtotal(s.items),
    shipping(): number { return shippingFor(this.subtotal) },
    lines: s => s.items.flatMap((i) => {
      const product = getProduct(i.slug)
      return product ? [{ ...i, product }] : []
    }),
  },
  actions: {
    // le localStorage peut avoir été modifié à la main, on revalide
    hydrate() {
      if (this.hydrated || import.meta.server) return
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        this.items = raw ? sanitizeCart(JSON.parse(raw)) : []
      }
      catch {
        this.items = []
      }
      this.hydrated = true
    },
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      }
      catch { /* stockage indisponible : le panier reste en mémoire */ }
    },
    add(item: CartItem) {
      this.items = addItem(this.items, item)
      this.persist()
    },
    setQty(slug: string, size: CartItem['size'], qty: number) {
      this.items = setQty(this.items, slug, size, qty)
      this.persist()
    },
    remove(slug: string, size: CartItem['size']) {
      this.items = removeItem(this.items, slug, size)
      this.persist()
    },
    clear() {
      this.items = []
      this.persist()
    },
  },
})
