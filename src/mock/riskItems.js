// RISK_ITEM 시드 — RB-02 리스크 알림.
// 스키마: riskId, severity(위험/경고/정상 = RISK/WARN/OK), title, refId(대상 과제/업무)
export const riskItems = [
  { riskId: 'RSK-001', severity: 'WARN', title: '부서별 예산요구 취합 주의', refId: 'T-001-02', type: '병목', detectedAt: '2026-02-02' },
  { riskId: 'RSK-002', severity: 'RISK', title: '재정위험 관리체계 검토 지연·위험', refId: 'T-001-03', type: '일정', detectedAt: '2026-03-07' },
  { riskId: 'RSK-003', severity: 'WARN', title: '국회 예산심의 대응자료 주의', refId: 'T-001-05', type: '병목', detectedAt: '2026-04-08' },
  { riskId: 'RSK-004', severity: 'RISK', title: '시범 운영 지연·위험', refId: 'T-002-02', type: '일정', detectedAt: '2026-03-24' },
  { riskId: 'RSK-005', severity: 'WARN', title: '추진계획 수립 주의', refId: 'T-002-04', type: '병목', detectedAt: '2026-04-06' },
  { riskId: 'RSK-006', severity: 'RISK', title: '결과 보고 지연·위험', refId: 'T-003-04', type: '일정', detectedAt: '2026-04-19' },
  { riskId: 'RSK-007', severity: 'WARN', title: '결과 보고 주의', refId: 'T-003-05', type: '병목', detectedAt: '2026-02-13' },
  { riskId: 'RSK-008', severity: 'RISK', title: '시범 운영 지연·위험', refId: 'T-004-02', type: '일정', detectedAt: '2026-02-26' },
  { riskId: 'RSK-009', severity: 'RISK', title: '후속 개선 지연·위험', refId: 'T-004-03', type: '일정', detectedAt: '2026-03-11' },
  { riskId: 'RSK-010', severity: 'WARN', title: '추진계획 수립 주의', refId: 'T-004-04', type: '병목', detectedAt: '2026-03-24' },
  { riskId: 'RSK-011', severity: 'RISK', title: '후속 개선 지연·위험', refId: 'T-007-01', type: '일정', detectedAt: '2026-04-06' },
  { riskId: 'RSK-012', severity: 'WARN', title: '관계기관 협의 주의', refId: 'T-007-02', type: '병목', detectedAt: '2026-04-19' },
  { riskId: 'RSK-013', severity: 'RISK', title: '세부지침 마련 지연·위험', refId: 'T-007-05', type: '일정', detectedAt: '2026-02-13' },
  { riskId: 'RSK-014', severity: 'RISK', title: '중간 점검 지연·위험', refId: 'T-008-01', type: '일정', detectedAt: '2026-02-26' },
  { riskId: 'RSK-015', severity: 'RISK', title: '추진계획 수립 지연·위험', refId: 'T-009-03', type: '일정', detectedAt: '2026-03-11' },
  { riskId: 'RSK-016', severity: 'RISK', title: '후속 개선 지연·위험', refId: 'T-014-01', type: '일정', detectedAt: '2026-03-24' },
  { riskId: 'RSK-017', severity: 'RISK', title: '후속 개선 지연·위험', refId: 'T-014-02', type: '일정', detectedAt: '2026-04-06' },
  { riskId: 'RSK-018', severity: 'RISK', title: '시범 운영 지연·위험', refId: 'T-016-03', type: '일정', detectedAt: '2026-04-19' },
  { riskId: 'RSK-019', severity: 'RISK', title: '추진계획 수립 지연·위험', refId: 'T-018-02', type: '일정', detectedAt: '2026-02-13' },
  { riskId: 'RSK-020', severity: 'RISK', title: '세부지침 마련 지연·위험', refId: 'T-019-01', type: '일정', detectedAt: '2026-02-26' },
  { riskId: 'RSK-021', severity: 'RISK', title: '결과 보고 지연·위험', refId: 'T-019-02', type: '일정', detectedAt: '2026-03-11' },
  { riskId: 'RSK-022', severity: 'RISK', title: '후속 개선 지연·위험', refId: 'T-020-02', type: '일정', detectedAt: '2026-03-24' },
  { riskId: 'RSK-023', severity: 'RISK', title: '관계기관 협의 지연·위험', refId: 'T-021-02', type: '일정', detectedAt: '2026-04-06' },
  { riskId: 'RSK-024', severity: 'RISK', title: '후속 개선 지연·위험', refId: 'T-027-02', type: '일정', detectedAt: '2026-04-19' },
]

export const findRisk = (id) => riskItems.find((r) => r.riskId === id)
