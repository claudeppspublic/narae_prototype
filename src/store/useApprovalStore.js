// 결재 상신 오버레이 스토어 — INT-WF02-12 상태 전이(mock)를 화면 간 동기화(WF-02 Drawer ↔ CM-03 노드 배지).
// 시드(approvalLines)는 불변, 상신된 taskId만 기록하고 조회 시 applySubmit을 겹쳐 계산한다.
import { create } from 'zustand'
import { approvalLinesOf } from '@/mock/approvalLines'
import { applySubmit } from '@/lib/approval'

export const useApprovalStore = create((set) => ({
  submitted: {}, // { [taskId]: true }
  submit: (taskId) => set((s) => ({ submitted: { ...s.submitted, [taskId]: true } })),
}))

// 효과적 결재선: 상신 오버레이 반영 (컴포넌트에서 submitted 구독 후 호출)
export const effectiveLinesOf = (taskId, submitted) => {
  const lines = approvalLinesOf(taskId)
  return submitted?.[taskId] ? applySubmit(lines) : lines
}
