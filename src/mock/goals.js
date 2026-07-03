// GOAL 시드 — WF-03 목표 관리 (OKR 계층). 업무상세 관련목표 "효율성 25% 향상".
// 스키마: goalId, objective, keyResults[](+진척), orgUnitId, level
export const goals = [
  {
    goalId: 'G-001',
    objective: '국민 안전과 재난 대응 역량 강화',
    orgUnitId: 'MOI-DSM',
    level: '실',
    keyResults: [
      { krId: 'KR-001-1', title: '재난 사망자 전년 대비 10% 감축', progress: 35, linkedTaskIds: [] },
      { krId: 'KR-001-2', title: '재난안전 예방점검 이행률 95%', progress: 60, linkedTaskIds: ['T-020-01', 'T-020-03'] },
    ],
  },
  {
    goalId: 'G-002',
    objective: '지방시대·균형발전 실현',
    orgUnitId: 'MOI-LAI',
    level: '실',
    keyResults: [
      { krId: 'KR-002-1', title: '지방재정자립도 개선 1.5%p', progress: 40, linkedTaskIds: ['T-019-03'] },
      { krId: 'KR-002-2', title: '균형발전 사업 집행률 90%', progress: 55, linkedTaskIds: [] },
    ],
  },
  {
    goalId: 'G-003',
    objective: '디지털·AI 정부 구현',
    orgUnitId: 'MOI-AIG',
    level: '실',
    keyResults: [
      { krId: 'KR-003-1', title: 'AI 행정서비스 30종 확대', progress: 48, linkedTaskIds: ['T-015-01', 'T-015-03'] },
      { krId: 'KR-003-2', title: '공공데이터 개방 5천건', progress: 62, linkedTaskIds: ['T-016-01', 'T-016-04'] },
      { krId: 'KR-003-3', title: '전자결재 100% 전환', progress: 80, linkedTaskIds: [] },
    ],
  },
  {
    goalId: 'G-004',
    objective: '정부혁신과 참여·협업 확대',
    orgUnitId: 'MOI-PIO',
    level: '실',
    keyResults: [
      { krId: 'KR-004-1', title: '정부혁신 국민체감도 70점', progress: 52, linkedTaskIds: ['T-014-01', 'T-014-03'] },
      { krId: 'KR-004-2', title: '국민참여 과제 200건', progress: 45, linkedTaskIds: ['T-025-01'] },
    ],
  },
  {
    goalId: 'G-005',
    objective: '재정 건전성과 효율성 제고',
    orgUnitId: 'MOI-DPI-01',
    level: '관',
    keyResults: [
      { krId: 'KR-005-1', title: '예산 집행 오차율 3% 이하', progress: 60, linkedTaskIds: ['T-001-02'] },
      { krId: 'KR-005-2', title: '불용예산 10% 감축', progress: 45, linkedTaskIds: ['T-001-03'] },
    ],
  },
  {
    goalId: 'G-006',
    objective: '국제행정 협력 강화',
    orgUnitId: 'MOI-DPI-06',
    level: '관',
    keyResults: [
      { krId: 'KR-006-1', title: '행정한류 수출 12개국', progress: 30, linkedTaskIds: ['T-026-01'] },
      { krId: 'KR-006-2', title: '국제협력 MOU 8건', progress: 50, linkedTaskIds: ['T-012-02'] },
    ],
  },
]

export const findGoal = (id) => goals.find((g) => g.goalId === id)
// 업무가 기여하는 목표 조회 (WF-02 목표 바인딩)
export const goalsForTask = (taskId) =>
  goals.filter((g) => g.keyResults.some((kr) => kr.linkedTaskIds?.includes(taskId)))
