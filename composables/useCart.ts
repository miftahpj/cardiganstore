import type { Product } from '~/composables/useProducts'

export interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  code: string
  qty: number
}

const CART_STORAGE_KEY = 'wooman-cart'

// State keranjang, dipakai bersama di seluruh halaman (header, produk, halaman keranjang)
function cartState() {
  return useState<CartItem[]>('cart-items', () => [])
}

function persist(items: CartItem[]) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage tidak tersedia (mode private dsb), abaikan saja
  }
}

export function useCart() {
  const items = cartState()

  // Ambil data keranjang yang tersimpan di browser. Dipanggil sekali lewat plugin client.
  function hydrate() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY)
      if (raw) items.value = JSON.parse(raw)
    } catch {
      items.value = []
    }
  }

  function addToCart(product: Product, qty = 1) {
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.qty += qty
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: price || 0,
        image_url: product.image_url,
        code: product.code,
        qty
      })
    }
    persist(items.value)
  }

  function removeFromCart(id: number) {
    items.value = items.value.filter((item) => item.id !== id)
    persist(items.value)
  }

  function setQty(id: number, qty: number) {
    const item = items.value.find((i) => i.id === id)
    if (!item) return
    if (qty <= 0) {
      removeFromCart(id)
      return
    }
    item.qty = qty
    persist(items.value)
  }

  function increment(id: number) {
    const item = items.value.find((i) => i.id === id)
    if (item) setQty(id, item.qty + 1)
  }

  function decrement(id: number) {
    const item = items.value.find((i) => i.id === id)
    if (item) setQty(id, item.qty - 1)
  }

  function clearCart() {
    items.value = []
    persist(items.value)
  }

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.price * item.qty, 0))

  return {
    items,
    totalItems,
    totalPrice,
    hydrate,
    addToCart,
    removeFromCart,
    setQty,
    increment,
    decrement,
    clearCart
  }
}

// Susun pesan WhatsApp berisi semua barang di keranjang, lalu kembalikan link wa.me siap pakai
export function buildCartWhatsappLink(items: CartItem[], number?: string): string {
  const clean = (number || WA_ADMIN_NUMBER).replace(/[^0-9]/g, '')
  const lines = items.map(
    (item, idx) =>
      `${idx + 1}. ${item.name}${item.code ? ` (${item.code})` : ''} x${item.qty} - ${formatRupiah(
        item.price * item.qty
      )}`
  )
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const message = `Halo Admin WOOMAN, saya mau pesan produk berikut:\n\n${lines.join(
    '\n'
  )}\n\nTotal: ${formatRupiah(total)}\n\nApakah stoknya masih ada?`
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}
