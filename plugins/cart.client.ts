// Memuat isi keranjang dari localStorage begitu aplikasi dibuka di browser
export default defineNuxtPlugin(() => {
  const { hydrate } = useCart()
  hydrate()
})
