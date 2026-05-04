import { createSlice } from '@reduxjs/toolkit'

const getCart = () => { try { return JSON.parse(localStorage.getItem('p3d_cart')) || [] } catch { return [] } }
const saveCart = (items) => localStorage.setItem('p3d_cart', JSON.stringify(items))

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: getCart() },
  reducers: {
    addToCart(state, { payload: { product, quantity = 1, material } }) {
      const mat = material || product.material
      const existing = state.items.find(i => i.productId === product._id && i.material === mat)
      if (existing) { existing.quantity += quantity }
      else { state.items.push({ productId: product._id, title: product.title, image: product.images?.[0] || '', material: mat, price: product.price, quantity }) }
      saveCart(state.items)
    },
    removeFromCart(state, { payload: index }) { state.items.splice(index, 1); saveCart(state.items) },
    updateQty(state, { payload: { index, quantity } }) { if (quantity >= 1) { state.items[index].quantity = quantity; saveCart(state.items) } },
    clearCart(state) { state.items = []; saveCart([]) }
  }
})

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions
export const selectCartTotal = (s) => s.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
export const selectCartCount = (s) => s.cart.items.reduce((sum, i) => sum + i.quantity, 0)
export default cartSlice.reducer
