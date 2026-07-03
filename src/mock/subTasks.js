// 하위 업무 — WF-02 하위업무 탭 (화면설계서 p8 실측).
// [CONFIRM] TASK 스키마에 상위-하위(parentTaskId) 필드 미정의 → 별도 맵으로 임시 구현(기획확인 대상).
export const subTasksByTask = {
  'T-005-01': [
    { subTaskId: 'ST-005-01-1', taskNm: '급여 명세서 양식 검토', status: 'IN_PROGRESS', assigneeNm: '강현우', due: '~01/08' },
    { subTaskId: 'ST-005-01-2', taskNm: '세전·세후 금액 검증', status: 'IN_PROGRESS', assigneeNm: '이하늘', due: '~01/10' },
    { subTaskId: 'ST-005-01-3', taskNm: '급여 데이터 수집', status: 'COMPLETED', assigneeNm: '서지우', due: '01/06' },
  ],
  'T-001-03': [
    { subTaskId: 'ST-001-03-1', taskNm: '시스템 요구사항 정의', status: 'COMPLETED', assigneeNm: '오세훈', due: '02/10' },
    { subTaskId: 'ST-001-03-2', taskNm: 'RFP 초안 작성', status: 'IN_PROGRESS', assigneeNm: '오세훈', due: '~03/15' },
    { subTaskId: 'ST-001-03-3', taskNm: '예산 확보 협의', status: 'PENDING', assigneeNm: '이하늘', due: '~04/01' },
  ],
}

export const subTasksOf = (taskId) => subTasksByTask[taskId] ?? []

// 마일스톤 (WF-02 마일스톤 탭) — [CONFIRM] 스키마 미정의(임시)
export const milestonesByTask = {
  'T-005-01': [
    { msId: 'M1', name: '착수 보고 완료', date: '2024-12-05', done: true },
    { msId: 'M2', name: '중간 점검', date: '2025-01-10', done: true },
    { msId: 'M3', name: '최종 보고', date: '2025-01-31', done: false },
  ],
}
export const milestonesOf = (taskId) => milestonesByTask[taskId] ?? []
