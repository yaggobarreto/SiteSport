import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, size) => {
        const { items } = get()
        const existingItem = items.find(
          (item) => item._id === product._id && item.size === size
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              item._id === product._id && item.size === size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({ items: [...items, { ...product, size, quantity: 1 }] })
        }
        set({ isOpen: true }) // Open cart when item added
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item._id === productId && item.size === size)
          ),
        })
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size)
          return
        }
        set({
          items: get().items.map((item) =>
            item._id === productId && item.size === size
              ? { ...item, quantity }
              : item
          ),
        })
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'fabayo-cart-storage',
    }
  )
)
