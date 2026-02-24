import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Popup, CrisisConfession, ViewState, CrisisMetrics } from '@/types';

interface CrisisStore {
  // View State
  currentView: ViewState;
  setView: (view: ViewState) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  
  // Popups
  popups: Popup[];
  addPopup: (popup: Omit<Popup, 'id'>) => void;
  removePopup: (id: string) => void;
  clearPopups: () => void;
  popupStack: number;
  setPopupStack: (stack: number) => void;
  
  // Crisis Confessions
  confessions: CrisisConfession[];
  addConfession: (confession: Omit<CrisisConfession, 'id' | 'timestamp'>) => void;
  
  // Audio
  audioEnabled: boolean;
  toggleAudio: () => void;
  
  // Admin
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  
  // Metrics
  metrics: CrisisMetrics;
  updateMetrics: (metrics: Partial<CrisisMetrics>) => void;
  
  // UI State
  isCrisisOrbOpen: boolean;
  setCrisisOrbOpen: (open: boolean) => void;
  scrollY: number;
  setScrollY: (y: number) => void;
}

const ADMIN_PASSWORD = 'crisis2026';

const initialMetrics: CrisisMetrics = {
  totalSales: 1337,
  cartAbandonment: 69.420,
  popupDismissalRate: 88.8,
  averageChaosLevel: 9.5,
  activeUsers: 42,
};

export const useCrisisStore = create<CrisisStore>()(
  persist(
    (set, get) => ({
      // View State
      currentView: 'landing',
      setView: (view) => set({ currentView: view }),
      selectedProduct: null,
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      
      // Cart
      cart: [],
      addToCart: (item) => {
        const existing = get().cart.find(
          (i) => i.product.id === item.product.id && i.size === item.size && i.color === item.color
        );
        if (existing) {
          set({
            cart: get().cart.map((i) =>
              i.product.id === item.product.id && i.size === item.size && i.color === item.color
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ cart: [...get().cart, item] });
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((i) => i.product.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
        } else {
          set({
            cart: get().cart.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
          });
        }
      },
      clearCart: () => set({ cart: [] }),
      cartTotal: () => {
        return get().cart.reduce((total, item) => total + item.product.salePrice * item.quantity, 0);
      },
      
      // Popups
      popups: [],
      addPopup: (popup) => {
        const id = Math.random().toString(36).substr(2, 9);
        set({ popups: [...get().popups, { ...popup, id }] });
      },
      removePopup: (id) => {
        set({ popups: get().popups.filter((p) => p.id !== id) });
      },
      clearPopups: () => set({ popups: [], popupStack: 0 }),
      popupStack: 0,
      setPopupStack: (stack) => set({ popupStack: stack }),
      
      // Crisis Confessions
      confessions: [],
      addConfession: (confession) => {
        const newConfession: CrisisConfession = {
          ...confession,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
        };
        set({ confessions: [newConfession, ...get().confessions] });
      },
      
      // Audio
      audioEnabled: false,
      toggleAudio: () => set({ audioEnabled: !get().audioEnabled }),
      
      // Admin
      isAdmin: false,
      loginAdmin: (password) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAdmin: true });
          return true;
        }
        return false;
      },
      logoutAdmin: () => set({ isAdmin: false }),
      
      // Metrics
      metrics: initialMetrics,
      updateMetrics: (newMetrics) => {
        set({ metrics: { ...get().metrics, ...newMetrics } });
      },
      
      // UI State
      isCrisisOrbOpen: false,
      setCrisisOrbOpen: (open) => set({ isCrisisOrbOpen: open }),
      scrollY: 0,
      setScrollY: (y) => set({ scrollY: y }),
    }),
    {
      name: 'crisis-store',
      partialize: (state) => ({
        cart: state.cart,
        confessions: state.confessions,
        audioEnabled: state.audioEnabled,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
