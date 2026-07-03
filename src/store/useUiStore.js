// useUiStore — 전역 UI: Drawer(라우트 오버레이 보조)·Toast·Modal.
import { create } from 'zustand'

let toastSeq = 0

export const useUiStore = create((set) => ({
  // Drawer: { key, payload } | null
  drawer: null,
  openDrawer: (key, payload = null) => set({ drawer: { key, payload } }),
  closeDrawer: () => set({ drawer: null }),

  // Toast 큐
  toasts: [],
  toast: (message, variant = 'info') =>
    set((s) => ({ toasts: [...s.toasts, { id: ++toastSeq, message, variant }] })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // Modal: { key, payload } | null
  modal: null,
  openModal: (key, payload = null) => set({ modal: { key, payload } }),
  closeModal: () => set({ modal: null }),
}))
