import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      shipping: null, // { id, nome, preco, prazo } | null

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      setShipping: (modalidade) => set({ shipping: modalidade }),
      clearShipping: () => set({ shipping: null }),

      addItem: (product, size) => {
        const { items } = get()
        const existingItem = items.find(
          (item) => item._id === product._id && item.size === size
        )

        // Limpa o frete ao adicionar algo novo para evitar cálculo "sujo"
        set({ shipping: null })

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
        set({ isOpen: true })
      },

      removeItem: (productId, size) => {
        const newItems = get().items.filter(
          (item) => !(item._id === productId && item.size === size)
        );
        
        set({ items: newItems });

        // Se o carrinho esvaziou, limpa o frete
        if (newItems.length === 0) {
          set({ shipping: null });
        }
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size)
          return
        }
        
        const newItems = get().items.map((item) =>
          item._id === productId && item.size === size
            ? { ...item, quantity }
            : item
        );

        set({ items: newItems });
        
        // Sempre que a quantidade muda, é bom resetar o frete pois o peso mudou
        set({ shipping: null });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      // Mantém compatibilidade com código antigo que usa getTotal()
      getTotal: () => {
        const subtotal = get().getSubtotal()
        const shippingPrice = get().shipping?.preco ?? 0
        return subtotal + shippingPrice / 100 // preco está em centavos
      },

      clearCart: () => set({ items: [], shipping: null }),
    }),
    {
      name: 'fabayo-cart-storage',
    }
  )
)
