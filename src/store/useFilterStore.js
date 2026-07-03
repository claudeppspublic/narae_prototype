// useFilterStore — 화면별 필터 상태(네임스페이스별). 화면 언마운트 시 유지(뒤로가기 UX).
import { create } from 'zustand'

export const useFilterStore = create((set, get) => ({
  // { [scope]: { ...filters } }
  filters: {},

  get: (scope) => get().filters[scope] ?? {},
  set: (scope, patch) =>
    set((s) => ({ filters: { ...s.filters, [scope]: { ...(s.filters[scope] ?? {}), ...patch } } })),
  reset: (scope) => set((s) => ({ filters: { ...s.filters, [scope]: {} } })),
}))
