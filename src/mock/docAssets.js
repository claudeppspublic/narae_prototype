// DOC_ASSET 시드 — AI-02 규정 등록 업로드 목록.
// 스키마: docId, fileName, category(직제/운영/업무분장/인사/기타), mime, size
export const docAssets = [
  { docId: 'DOC-001', fileName: '직제규정_2024.pdf', category: 'ORGANIZATION', mime: 'application/pdf', size: '1.8MB', uploadedAt: '2024-12-01' },
  { docId: 'DOC-002', fileName: '조직도_운영규정_v2.pdf', category: 'OPERATION', mime: 'application/pdf', size: '980KB', uploadedAt: '2024-10-05' },
  { docId: 'DOC-003', fileName: '업무분장표_2025.hwp', category: 'DUTY', mime: 'application/x-hwp', size: '245KB', uploadedAt: '2025-03-12' },
]

export const docsByCategory = (cat) =>
  cat ? docAssets.filter((d) => d.category === cat) : docAssets
