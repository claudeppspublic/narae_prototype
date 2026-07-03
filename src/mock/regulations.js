// REGULATION 시드 — AI-01 규정테이블 / WF-02 규정연계.
// 스키마: regulationId, name, fileType(hwp/pdf/xlsx), sizeKB, stepId, url
// category는 규정테이블 분류용(직제/운영/업무분장/인사/기타).
export const regulations = [
  { regulationId: 'REG-001', name: '직제규정_2024.pdf', fileType: 'pdf', sizeKB: 1843, category: 'ORGANIZATION', stepId: 'STEP-001-1', url: '/mock/reg/reg-001.pdf', uploadedAt: '2024-12-01' },
  { regulationId: 'REG-002', name: '조직도_운영규정_v2.pdf', fileType: 'pdf', sizeKB: 980, category: 'OPERATION', stepId: 'STEP-001-2', url: '/mock/reg/reg-002.pdf', uploadedAt: '2024-10-05' },
  { regulationId: 'REG-003', name: '업무분장표_2025.hwp', fileType: 'hwp', sizeKB: 245, category: 'DUTY', stepId: 'STEP-002-1', url: '/mock/reg/reg-003.hwp', uploadedAt: '2025-03-12' },
  { regulationId: 'REG-004', name: '재정집행_지침_2026.pdf', fileType: 'pdf', sizeKB: 1520, category: 'OPERATION', stepId: 'STEP-001-2', url: '/mock/reg/reg-004.pdf', uploadedAt: '2026-01-10' },
  { regulationId: 'REG-005', name: '인사평가_운영규칙.hwp', fileType: 'hwp', sizeKB: 320, category: 'HR', stepId: null, url: '/mock/reg/reg-005.hwp', uploadedAt: '2025-06-20' },
]

export const findRegulation = (id) => regulations.find((r) => r.regulationId === id)
export const regulationsByCategory = (cat) =>
  cat ? regulations.filter((r) => r.category === cat) : regulations
export const regulationsOfStep = (stepId) => regulations.filter((r) => r.stepId === stepId)
