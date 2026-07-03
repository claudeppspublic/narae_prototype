// DOC_ASSET 시드 — AI-02 규정 등록 업로드 목록.
// 스키마: docId, fileName, category(직제/운영/업무분장/인사/기타), mime, size
export const docAssets = [
  { docId: 'DOC-PLAN-001', fileName: '2026년도 예산요구서_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.5MB', uploadedAt: '2026-01-05' },
  { docId: 'DOC-PLAN-002', fileName: '2026 예산편성지침 _사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.4MB', uploadedAt: '2026-01-06' },
  { docId: 'DOC-PLAN-004', fileName: '부내 미래전략 수립·총_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.6MB', uploadedAt: '2026-01-08' },
  { docId: 'DOC-PLAN-005', fileName: '청년정책 추진계획_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.6MB', uploadedAt: '2026-01-09' },
  { docId: 'DOC-PLAN-006', fileName: '2026 성과관리 시행_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '1.1MB', uploadedAt: '2026-01-10' },
  { docId: 'DOC-PLAN-008', fileName: '소관 법령 제·개정 관_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '1.2MB', uploadedAt: '2026-01-12' },
  { docId: 'DOC-PLAN-009', fileName: '규제개혁 과제 관리_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.8MB', uploadedAt: '2026-01-13' },
  { docId: 'DOC-PLAN-011', fileName: '부내 정보보호 강화_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.6MB', uploadedAt: '2026-01-05' },
  { docId: 'DOC-PLAN-012', fileName: '국제행정 협력사업 추진_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '1.1MB', uploadedAt: '2026-01-06' },
  { docId: 'DOC-PLAN-013', fileName: '정부조직·정원 진단_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.8MB', uploadedAt: '2026-01-07' },
  { docId: 'DOC-PLAN-014', fileName: '정부혁신 종합계획 추진_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '1.4MB', uploadedAt: '2026-01-08' },
  { docId: 'DOC-PLAN-015', fileName: 'AI 행정서비스 확대_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '1.2MB', uploadedAt: '2026-01-09' },
  { docId: 'DOC-PLAN-016', fileName: '공공데이터 개방 확대_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '1.2MB', uploadedAt: '2026-01-10' },
  { docId: 'DOC-PLAN-017', fileName: '디지털 공공서비스 혁신_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '1.1MB', uploadedAt: '2026-01-11' },
  { docId: 'DOC-PLAN-018', fileName: '지방자치 제도 개선_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.9MB', uploadedAt: '2026-01-12' },
  { docId: 'DOC-PLAN-019', fileName: '지방재정 건전성 관리_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.4MB', uploadedAt: '2026-01-13' },
  { docId: 'DOC-PLAN-020', fileName: '재난안전 예방대책 수립_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '1.1MB', uploadedAt: '2026-01-14' },
  { docId: 'DOC-PLAN-022', fileName: '국정감사 대응_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '1.1MB', uploadedAt: '2026-01-06' },
  { docId: 'DOC-PLAN-024', fileName: '공공데이터 분석기반 구_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.4MB', uploadedAt: '2026-01-08' },
  { docId: 'DOC-PLAN-026', fileName: '행정한류 수출 확대_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.7MB', uploadedAt: '2026-01-10' },
  { docId: 'DOC-PLAN-027', fileName: '통합포털 개편_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.9MB', uploadedAt: '2026-01-11' },
  { docId: 'DOC-PLAN-028', fileName: '지방세 제도 개선_사업계획서.hwp', category: 'ETC', mime: 'application/x-hwp', size: '0.6MB', uploadedAt: '2026-01-12' },
  { docId: 'DOC-ORG-001', fileName: '직제규정_2026.pdf', category: 'ORGANIZATION', mime: 'application/pdf', size: '1.8MB', uploadedAt: '2025-12-15' },
  { docId: 'DOC-ORG-002', fileName: '사무분장표_2026.hwp', category: 'DUTY', mime: 'application/x-hwp', size: '245KB', uploadedAt: '2026-01-08' },
]

export const docsByCategory = (cat) =>
  cat ? docAssets.filter((d) => d.category === cat) : docAssets
