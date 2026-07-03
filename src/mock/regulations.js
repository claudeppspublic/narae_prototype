// REGULATION 시드 — AI-01 규정테이블 / WF-02 규정연계.
// 스키마: regulationId, name, fileType(hwp/pdf/xlsx), sizeKB, stepId, url
// category는 규정테이블 분류용(직제/운영/업무분장/인사/기타).
export const regulations = [
  { regulationId: 'REG-001', name: '행정안전부와 그 소속기관 직제', fileType: 'pdf', sizeKB: 1820, category: 'ORGANIZATION', stepId: 'S-008-03', url: '/mock/reg/reg-001.pdf', uploadedAt: '2025-12-15' },
  { regulationId: 'REG-002', name: '행정안전부와 그 소속기관 직제 시행규칙', fileType: 'hwp', sizeKB: 640, category: 'ORGANIZATION', stepId: null, url: '/mock/reg/reg-002.hwp', uploadedAt: '2025-12-15' },
  { regulationId: 'REG-003', name: '행정기관의 조직과 정원에 관한 통칙', fileType: 'pdf', sizeKB: 430, category: 'ORGANIZATION', stepId: 'S-007-03', url: '/mock/reg/reg-003.pdf', uploadedAt: '2025-12-20' },
  { regulationId: 'REG-004', name: '정부조직관리지침(2026)', fileType: 'hwp', sizeKB: 520, category: 'ORGANIZATION', stepId: null, url: '/mock/reg/reg-004.hwp', uploadedAt: '2026-01-05' },
  { regulationId: 'REG-005', name: '국가재정법', fileType: 'pdf', sizeKB: 2100, category: 'OPERATION', stepId: 'S-001-02', url: '/mock/reg/reg-005.pdf', uploadedAt: '2025-12-10' },
  { regulationId: 'REG-006', name: '국가재정법 시행령', fileType: 'pdf', sizeKB: 1750, category: 'OPERATION', stepId: null, url: '/mock/reg/reg-006.pdf', uploadedAt: '2025-12-10' },
  { regulationId: 'REG-007', name: '2026 예산안 편성 및 기금운용계획안 작성지침', fileType: 'hwp', sizeKB: 980, category: 'OPERATION', stepId: 'S-009-01', url: '/mock/reg/reg-007.hwp', uploadedAt: '2026-01-10' },
  { regulationId: 'REG-008', name: '예산요구서 서식', fileType: 'xlsx', sizeKB: 210, category: 'OPERATION', stepId: null, url: '/mock/reg/reg-008.xlsx', uploadedAt: '2026-01-12' },
  { regulationId: 'REG-009', name: '행정업무의 운영 및 혁신에 관한 규정', fileType: 'pdf', sizeKB: 560, category: 'OPERATION', stepId: 'S-005-01', url: '/mock/reg/reg-009.pdf', uploadedAt: '2026-01-08' },
  { regulationId: 'REG-010', name: '기안문 서식(별지 제1호)', fileType: 'hwp', sizeKB: 95, category: 'OPERATION', stepId: null, url: '/mock/reg/reg-010.hwp', uploadedAt: '2026-01-08' },
  { regulationId: 'REG-011', name: '내부결재문서 서식(별지 제2호)', fileType: 'hwp', sizeKB: 88, category: 'OPERATION', stepId: 'S-010-01', url: '/mock/reg/reg-011.hwp', uploadedAt: '2026-01-08' },
  { regulationId: 'REG-012', name: '정부업무평가 기본법', fileType: 'pdf', sizeKB: 430, category: 'OPERATION', stepId: null, url: '/mock/reg/reg-012.pdf', uploadedAt: '2026-01-15' },
  { regulationId: 'REG-013', name: '지방자치법', fileType: 'pdf', sizeKB: 1600, category: 'OPERATION', stepId: 'S-004-01', url: '/mock/reg/reg-013.pdf', uploadedAt: '2026-01-15' },
  { regulationId: 'REG-014', name: '행정업무운영 편람(2026)', fileType: 'pdf', sizeKB: 3200, category: 'OPERATION', stepId: null, url: '/mock/reg/reg-014.pdf', uploadedAt: '2026-02-02' },
  { regulationId: 'REG-015', name: '공무원 인사규정', fileType: 'pdf', sizeKB: 780, category: 'HR', stepId: 'S-004-01', url: '/mock/reg/reg-015.pdf', uploadedAt: '2026-01-20' },
  { regulationId: 'REG-016', name: '사무분장 규정', fileType: 'hwp', sizeKB: 150, category: 'DUTY', stepId: null, url: '/mock/reg/reg-016.hwp', uploadedAt: '2026-01-20' },
]

export const findRegulation = (id) => regulations.find((r) => r.regulationId === id)
export const regulationsByCategory = (cat) =>
  cat ? regulations.filter((r) => r.category === cat) : regulations
export const regulationsOfStep = (stepId) => regulations.filter((r) => r.stepId === stepId)
