// RISK_ITEM 시드 — RB-02 리스크 알림.
// 스키마: riskId, severity(위험/경고/정상 = RISK/WARN/OK), title, refId(대상 과제/업무)
export const riskItems = [
  { riskId: 'RISK-001', severity: 'RISK', title: '디지털 예산관리 시스템 구축 지연 위험', refId: 'T-001-03', type: '일정', detectedAt: '2026-03-05' },
  { riskId: 'RISK-002', severity: 'RISK', title: 'AI 민원처리 시스템 담당자 과부하', refId: 'T-003-01', type: '병목', detectedAt: '2026-02-20' },
  { riskId: 'RISK-003', severity: 'WARN', title: '재정집행 점검 마감 임박', refId: 'T-001-02', type: '일정', detectedAt: '2026-03-18' },
  { riskId: 'RISK-004', severity: 'WARN', title: '다자협력체 가입 검토 보류 장기화', refId: 'T-004-03', type: '병목', detectedAt: '2026-02-26' },
  { riskId: 'RISK-005', severity: 'WARN', title: '행정서비스 품질 개선 착수 지연', refId: 'T-002-02', type: '일정', detectedAt: '2026-04-02' },
]

export const findRisk = (id) => riskItems.find((r) => r.riskId === id)
