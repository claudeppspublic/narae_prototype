// 하위 업무 — WF-02 하위업무 탭 (화면설계서 p8 실측).
// [CONFIRM] TASK 스키마에 상위-하위(parentTaskId) 필드 미정의 → 별도 맵으로 임시 구현(기획확인 대상).
export const subTasksByTask = {
  'T-001-02': [
    { subTaskId: 'ST-001-02-1', taskNm: '부서별 요구액 취합표 작성', status: 'COMPLETED', assigneeNm: '손승현', due: '02/07' },
    { subTaskId: 'ST-001-02-2', taskNm: '미제출 부서 재요청', status: 'IN_PROGRESS', assigneeNm: '황도경', due: '~02/20' },
    { subTaskId: 'ST-001-02-3', taskNm: '요구 총괄표 초안 검토', status: 'PENDING', assigneeNm: '구한결', due: '~02/27' },
  ],
  'T-001-03': [
    { subTaskId: 'ST-001-03-1', taskNm: '재정위험 지표 정의', status: 'COMPLETED', assigneeNm: '황도경', due: '02/24' },
    { subTaskId: 'ST-001-03-2', taskNm: '관계부서 의견조회', status: 'IN_PROGRESS', assigneeNm: '손승현', due: '~03/06' },
    { subTaskId: 'ST-001-03-3', taskNm: '관리체계 개선안 작성', status: 'PENDING', assigneeNm: '황도경', due: '~03/13' },
  ],
}

export const subTasksOf = (taskId) => subTasksByTask[taskId] ?? []

// 마일스톤 (WF-02 마일스톤 탭) — [CONFIRM] 스키마 미정의(임시)
export const milestonesByTask = {
  'T-001-03': [
    { msId: 'M1', name: '착수 보고 완료', date: '2026-02-12', done: true },
    { msId: 'M2', name: '중간 점검', date: '2026-02-27', done: true },
    { msId: 'M3', name: '최종 보고', date: '2026-03-15', done: false },
  ],
}
export const milestonesOf = (taskId) => milestonesByTask[taskId] ?? []
