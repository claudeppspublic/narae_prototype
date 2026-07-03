// GOAL 시드 — WF-03 목표 관리 (OKR 계층). 업무상세 관련목표 "효율성 25% 향상".
// 스키마: goalId, objective, keyResults[](+진척), orgUnitId, level
export const goals = [
  {
    goalId: 'GOAL-1',
    objective: '행정 효율성 25% 향상',
    orgUnitId: 'ORG-01',
    level: '실',
    keyResults: [
      { krId: 'KR-1-1', title: '업무 처리 리드타임 20% 단축', progress: 62, linkedTaskIds: ['T-002-01', 'T-005-01'] },
      { krId: 'KR-1-2', title: '민원 만족도 90점 달성', progress: 78, linkedTaskIds: ['T-005-01'] },
    ],
  },
  {
    goalId: 'GOAL-2',
    objective: '디지털 전환 기반 구축',
    orgUnitId: 'ORG-01-01-03',
    level: '과',
    keyResults: [
      { krId: 'KR-2-1', title: 'AI 민원처리 시스템 1단계 구축', progress: 50, linkedTaskIds: ['T-003-01'] },
      { krId: 'KR-2-2', title: '클라우드 전환율 40% 달성', progress: 30, linkedTaskIds: ['T-003-02'] },
    ],
  },
  {
    goalId: 'GOAL-3',
    objective: '재정 건전성 강화',
    orgUnitId: 'ORG-01-01-01',
    level: '과',
    keyResults: [
      { krId: 'KR-3-1', title: '예산 집행률 95% 이상', progress: 42, linkedTaskIds: ['T-001-01', 'T-001-02'] },
    ],
  },
]

export const findGoal = (id) => goals.find((g) => g.goalId === id)
// 업무가 기여하는 목표 조회 (WF-02 목표 바인딩)
export const goalsForTask = (taskId) =>
  goals.filter((g) => g.keyResults.some((kr) => kr.linkedTaskIds?.includes(taskId)))
