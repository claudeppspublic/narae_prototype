// TASK 시드 — 업무(간트 바 = 개별 업무). 화면설계서 간트/캘린더 실측 업무명.
// 스키마: taskId, projectId, taskNm, status, assigneeId, assigneeNm, startAt, endAt,
//         progress, riskGrade, processStepId, taskType, priorityLevel, securityLevel,
//         financeYn, mgmtStatus, category(홈 상단탭 — [CONFIRM] 기획확인 대상)
// parentTaskId(하위업무 계층)는 스키마 미정의 → WF-02 착수 시 [확인필요].
export const tasks = [
  // ── PRJ-001 기획예산담당관 ──
  { taskId: 'T-001-01', projectId: 'PRJ-2026-001', taskNm: '2026년도 예산안 사전 기획 및 지침 수립', status: 'IN_PROGRESS', assigneeId: 'U20260003', assigneeNm: '이하늘', startAt: '2026-01-02', endAt: '2026-01-28', progress: 60, riskGrade: 'OK', processStepId: 'STEP-001-2', taskType: 'REGULAR', priorityLevel: 'HIGH', securityLevel: 'L2', financeYn: true, mgmtStatus: '사용', category: 'FINANCE' },
  { taskId: 'T-001-02', projectId: 'PRJ-2026-001', taskNm: '2026년 상반기 재정집행 점검 및 분석', status: 'IN_PROGRESS', assigneeId: 'U20260004', assigneeNm: '오세훈', startAt: '2026-02-19', endAt: '2026-03-26', progress: 35, riskGrade: 'WARN', processStepId: 'STEP-001-2', taskType: 'REGULAR', priorityLevel: 'NORMAL', securityLevel: 'L2', financeYn: true, mgmtStatus: '사용', category: 'FINANCE' },
  { taskId: 'T-001-03', projectId: 'PRJ-2026-001', taskNm: '디지털 예산관리 시스템 구축 기본계획', status: 'IN_PROGRESS', assigneeId: 'U20260004', assigneeNm: '오세훈', startAt: '2026-01-15', endAt: '2026-04-30', progress: 25, riskGrade: 'RISK', processStepId: 'STEP-001-1', taskType: 'ADHOC', priorityLevel: 'URGENT', securityLevel: 'L2', financeYn: true, mgmtStatus: '사용', category: 'TECH' },
  { taskId: 'T-001-04', projectId: 'PRJ-2026-001', taskNm: '예산편성 기준 매뉴얼 개정', status: 'PENDING', assigneeId: 'U20260003', assigneeNm: '이하늘', startAt: '2026-02-26', endAt: '2026-04-16', progress: 0, riskGrade: 'OK', processStepId: 'STEP-001-1', taskType: 'REGULAR', priorityLevel: 'LOW', securityLevel: 'L1', financeYn: false, mgmtStatus: '사용', category: 'FINANCE' },

  // ── PRJ-002 혁신행정담당관 ──
  { taskId: 'T-002-01', projectId: 'PRJ-2026-002', taskNm: '스마트 행정 혁신방안 수립', status: 'IN_PROGRESS', assigneeId: 'U20260012', assigneeNm: '조하은', startAt: '2026-02-26', endAt: '2026-03-19', progress: 45, riskGrade: 'OK', processStepId: 'STEP-002-2', taskType: 'ADHOC', priorityLevel: 'HIGH', securityLevel: 'L2', financeYn: false, mgmtStatus: '사용', category: 'ADMIN' },
  { taskId: 'T-002-02', projectId: 'PRJ-2026-002', taskNm: '행정서비스 품질 개선 종합계획', status: 'IN_PROGRESS', assigneeId: 'U20260013', assigneeNm: '서지우', startAt: '2026-04-02', endAt: '2026-05-14', progress: 20, riskGrade: 'WARN', processStepId: 'STEP-002-1', taskType: 'REGULAR', priorityLevel: 'NORMAL', securityLevel: 'L1', financeYn: false, mgmtStatus: '사용', category: 'ADMIN' },
  { taskId: 'T-002-03', projectId: 'PRJ-2026-002', taskNm: '공공서비스 디자인 개선 시범사업', status: 'COMPLETED', assigneeId: 'U20260013', assigneeNm: '서지우', startAt: '2026-01-02', endAt: '2026-02-26', progress: 100, riskGrade: 'OK', processStepId: 'STEP-002-3', taskType: 'ADHOC', priorityLevel: 'NORMAL', securityLevel: 'L1', financeYn: false, mgmtStatus: '사용', category: 'ADMIN' },
  { taskId: 'T-002-04', projectId: 'PRJ-2026-002', taskNm: '정부혁신 우수사례 경진대회 운영', status: 'PENDING', assigneeId: 'U20260014', assigneeNm: '이도현', startAt: '2026-02-26', endAt: '2026-04-09', progress: 0, riskGrade: 'OK', processStepId: 'STEP-002-1', taskType: 'ADHOC', priorityLevel: 'LOW', securityLevel: 'L1', financeYn: false, mgmtStatus: '사용', category: 'ADMIN' },

  // ── PRJ-003 정보화담당관 ──
  { taskId: 'T-003-01', projectId: 'PRJ-2026-003', taskNm: 'AI 기반 민원처리 시스템 구축 계획', status: 'IN_PROGRESS', assigneeId: 'U20260023', assigneeNm: '한지훈', startAt: '2026-01-05', endAt: '2026-03-05', progress: 50, riskGrade: 'WARN', processStepId: 'STEP-003-2', taskType: 'ADHOC', priorityLevel: 'HIGH', securityLevel: 'L3', financeYn: true, mgmtStatus: '사용', category: 'TECH' },
  { taskId: 'T-003-02', projectId: 'PRJ-2026-003', taskNm: '클라우드 전환 기본계획 수립', status: 'IN_PROGRESS', assigneeId: 'U20260022', assigneeNm: '정민서', startAt: '2026-02-26', endAt: '2026-03-26', progress: 30, riskGrade: 'OK', processStepId: 'STEP-003-1', taskType: 'ADHOC', priorityLevel: 'NORMAL', securityLevel: 'L2', financeYn: false, mgmtStatus: '사용', category: 'TECH' },
  { taskId: 'T-003-03', projectId: 'PRJ-2026-003', taskNm: '정보자원 통합관리 체계 개선', status: 'PENDING', assigneeId: 'U20260022', assigneeNm: '정민서', startAt: '2026-04-02', endAt: '2026-05-21', progress: 0, riskGrade: 'OK', processStepId: 'STEP-003-1', taskType: 'REGULAR', priorityLevel: 'NORMAL', securityLevel: 'L2', financeYn: false, mgmtStatus: '사용', category: 'INFO' },

  // ── PRJ-004 국제협력담당관 ──
  { taskId: 'T-004-01', projectId: 'PRJ-2026-004', taskNm: '하반기 국제회의 운영계획 수립', status: 'PENDING', assigneeId: 'U20260031', assigneeNm: '문가영', startAt: '2026-03-26', endAt: '2026-04-30', progress: 0, riskGrade: 'OK', processStepId: 'STEP-004-1', taskType: 'ADHOC', priorityLevel: 'NORMAL', securityLevel: 'L1', financeYn: false, mgmtStatus: '사용', category: 'ADMIN' },
  { taskId: 'T-004-02', projectId: 'PRJ-2026-004', taskNm: 'ODA 협력사업 중간점검 및 평가', status: 'IN_PROGRESS', assigneeId: 'U20260032', assigneeNm: '고은채', startAt: '2026-02-05', endAt: '2026-03-12', progress: 40, riskGrade: 'OK', processStepId: 'STEP-004-2', taskType: 'REGULAR', priorityLevel: 'NORMAL', securityLevel: 'L1', financeYn: false, mgmtStatus: '사용', category: 'ADMIN' },
  { taskId: 'T-004-03', projectId: 'PRJ-2026-004', taskNm: '다자협력체 가입 검토 및 추진', status: 'ON_HOLD', assigneeId: 'U20260033', assigneeNm: '심우재', startAt: '2026-01-08', endAt: '2026-02-26', progress: 15, riskGrade: 'WARN', processStepId: 'STEP-004-1', taskType: 'ADHOC', priorityLevel: 'LOW', securityLevel: 'L2', financeYn: false, mgmtStatus: '사용', category: 'ADMIN' },

  // ── PRJ-005 민원서비스 만족도 조사 (WF-02 업무상세 대상) ──
  { taskId: 'T-005-01', projectId: 'PRJ-2026-005', taskNm: '민원서비스 만족도 조사', status: 'IN_PROGRESS', assigneeId: 'U20260012', assigneeNm: '조하은', startAt: '2024-11-26', endAt: '2025-01-31', progress: 34, riskGrade: 'WARN', processStepId: 'STEP-005-3', taskType: 'REGULAR', priorityLevel: 'HIGH', securityLevel: 'L2', financeYn: false, mgmtStatus: '사용', category: 'INFO' },

  // ── PRJ-006 운영지원 정기 업무 (인사·자금·관리 카테고리 데모) ──
  { taskId: 'T-006-01', projectId: 'PRJ-2026-006', taskNm: '2026년 정기 인사이동 계획 수립', status: 'IN_PROGRESS', assigneeId: 'U20260041', assigneeNm: '윤태오', startAt: '2026-02-01', endAt: '2026-03-15', progress: 55, riskGrade: 'OK', processStepId: 'STEP-006-2', taskType: 'REGULAR', priorityLevel: 'HIGH', securityLevel: 'L2', financeYn: false, mgmtStatus: '사용', category: 'HR' },
  { taskId: 'T-006-02', projectId: 'PRJ-2026-006', taskNm: '직원 역량강화 교육 운영', status: 'PENDING', assigneeId: 'U20260041', assigneeNm: '윤태오', startAt: '2026-03-20', endAt: '2026-05-30', progress: 0, riskGrade: 'OK', processStepId: 'STEP-006-1', taskType: 'REGULAR', priorityLevel: 'NORMAL', securityLevel: 'L1', financeYn: false, mgmtStatus: '사용', category: 'HR' },
  { taskId: 'T-006-03', projectId: 'PRJ-2026-006', taskNm: '급여 지급 및 4대보험 관리', status: 'IN_PROGRESS', assigneeId: 'U20260042', assigneeNm: '배수지', startAt: '2026-01-05', endAt: '2026-12-31', progress: 42, riskGrade: 'WARN', processStepId: 'STEP-006-2', taskType: 'REGULAR', priorityLevel: 'HIGH', securityLevel: 'L2', financeYn: true, mgmtStatus: '사용', category: 'FINANCE' },
  { taskId: 'T-006-04', projectId: 'PRJ-2026-006', taskNm: '청사 에너지 절감 대책 수립', status: 'IN_PROGRESS', assigneeId: 'U20260043', assigneeNm: '류준열', startAt: '2026-02-24', endAt: '2026-04-10', progress: 30, riskGrade: 'OK', processStepId: 'STEP-006-1', taskType: 'ADHOC', priorityLevel: 'NORMAL', securityLevel: 'L1', financeYn: false, mgmtStatus: '사용', category: 'ADMIN' },
]

export const findTask = (id) => tasks.find((t) => t.taskId === id)
export const tasksOf = (projectId) => tasks.filter((t) => t.projectId === projectId)
export const tasksByAssignee = (empNo) => tasks.filter((t) => t.assigneeId === empNo)
export const tasksByCategory = (cat) => (cat ? tasks.filter((t) => t.category === cat) : tasks)
