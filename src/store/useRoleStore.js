// useRoleStore — 역할(5단계)·현재 사용자·조회범위 흉내 (기능상세 3_권한매트릭스).
// 역할 전환(데모)은 CM-02 역할 토글에서 사용. 화면 데이터 범위만 mock에서 필터.
import { create } from 'zustand'
import { CURRENT_USER, findUser } from '@/mock/users'

export const useRoleStore = create((set, get) => ({
  empNo: CURRENT_USER,
  role: findUser(CURRENT_USER)?.roleId ?? 'ROLE_STF',

  setRole: (role) => set({ role }),
  setUser: (empNo) => set({ empNo, role: findUser(empNo)?.roleId ?? 'ROLE_STF' }),

  // 권한 헬퍼 (권한매트릭스 기반)
  isAdmin: () => get().role === 'ROLE_ADMIN',
  isManagerUp: () => ['ROLE_ADMIN', 'ROLE_DIR', 'ROLE_CHF', 'ROLE_TML'].includes(get().role), // 팀장+
  isChiefUp: () => ['ROLE_ADMIN', 'ROLE_DIR', 'ROLE_CHF'].includes(get().role), // 과장+
}))
