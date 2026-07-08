// 공통 코드 — 입출력데이터정의서 v0.8 `4_공통코드` 단일 소스.
// KEY(영문 enum) ↔ 한글 라벨. mock·UI 바인딩은 이 파일만 참조한다.

// 과제/업무 상태
export const TASK_STATUS = {
  PENDING: '대기',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  ON_HOLD: '보류',
  DELAYED: '지연',
}

// 위험 등급 (녹/주/빨)
export const RISK_GRADE = {
  OK: '정상',
  WARN: '경고',
  RISK: '위험',
}

// 역할 (5단계 + 미부여)
export const ROLE = {
  ROLE_ADMIN: '시스템관리자',
  ROLE_DIR: '기획관+',
  ROLE_CHF: '과장',
  ROLE_TML: '팀장',
  ROLE_STF: '담당자',
  9999: '역할미부여',
}

// 재직 상태
export const EMPLOYMENT_STATUS = {
  ACTIVE: '재직',
  ON_LEAVE: '휴직',
  RESIGNED: '퇴직',
}

// 결재 상태 — REF-23 §4.2: 4값 enum 고정(임의 상태 추가 금지)
export const APPROVAL_STATUS = {
  DRAFTING: '기안',
  APPROVING: '결재중',
  APPROVED: '결재완료',
  REJECTED: '반려',
}

// 결재상태 KEY → 그래픽 색 토큰 (REF-23 §4.2 · DEF-05). 배지 솔리드/틴트 구분은 UI에서(노랑=틴트).
export const APPROVAL_TOKEN = {
  DRAFTING: 'var(--color-neutral-base)',
  APPROVING: 'var(--color-warn-base)',
  APPROVED: 'var(--color-ok-base)',
  REJECTED: 'var(--color-risk-base)',
}

// HITL 결정
export const HITL_DECISION = {
  approve: '승인',
  edit: '수정',
  reject: '거부',
}

// AI 진행 (StepStatus)
export const AI_STEP_STATUS = {
  CLASSIFYING: '분류중',
  MODEL_GENERATING: '생성중',
  RESPONSE_RETURNED: '반환완료',
}

// 프로세스 단계
export const PROCESS_STEP = {
  RECEIPT: '접수',
  REVIEW: '검토',
  PROMOTE: '추진',
}

// 노드 종류 (홈/조직도 캔버스)
export const NODE_TYPE = {
  COMPANY: '회사',
  ORG: '조직',
  WORKER: '근무자',
  TASK: '업무',
  TASK_DETAIL: '업무상세',
  TOOL: '도구',
}

// 엣지 종류
export const EDGE_TYPE = {
  PARENT_CHILD: '부모자식',
  TASK_REL: '업무관계',
  TOOL_ATTACH: '도구첨부',
}

// 홈 도구 (5종)
export const HOME_TOOL = {
  MEETING: '회의록',
  REGULATION: '규정',
  WORK_EVAL: '업무평가',
  RISK_EVAL: '리스크평가',
}

// 업무 카테고리 7종 — v1.1(REF-24 D8): 좌측 컬럼, 교육·기타 신설. [CONFIRM] 카테고리↔업무 매핑은 mock 기준
export const HOME_CATEGORY = {
  HR: '인사',
  FINANCE: '자금',
  ADMIN: '관리',
  TECH: '기술',
  INFO: '정보',
  EDU: '교육',
  ETC: '기타',
}

// 홈 간트 기간 스코프 — v1.1(REF-24 D8): 조회 기간에 따라 차트 유기적 변동
export const GANTT_SCOPE = {
  WEEKLY: '주간',
  MONTHLY: '월간',
  YEARLY: '연간',
}

// WF-02 프로세스 맵 뷰 — v1.1(REF-24 D11)
export const PROCESS_VIEW = {
  DAY: '일',
  WEEK: '주',
  MONTH: '월',
}

// 업무 구분
export const TASK_TYPE = {
  REGULAR: '정기',
  ADHOC: '수시',
}

// 중요도
export const PRIORITY_LEVEL = {
  LOW: '낮음',
  NORMAL: '보통',
  HIGH: '높음',
  URGENT: '긴급',
}

// 보안 등급
export const SECURITY_LEVEL = {
  L1: '1급',
  L2: '2급',
  L3: '3급',
}

// 결재 역할
export const APPROVAL_ROLE = {
  DRAFT: '기안',
  LEADER: '리더',
  OWNER: '담당',
}

// 절차 담당
export const PROCEDURE_OWNER = {
  MAIN: '주담당',
  SUB: '중담당',
}

// 과제 유형
export const PROJECT_TYPE = {
  GENERAL: '일반',
  DEPT_REGULAR: '부서정기',
}

// 조직 레벨
export const ORG_LEVEL = { OFFICE: '실', BUREAU: '관', DIVISION: '과' }

// 규정 분류 (AI-02)
export const REGULATION_CATEGORY = {
  ORGANIZATION: '직제규정',
  OPERATION: '운영규정',
  DUTY: '업무분장',
  HR: '인사규정',
  ETC: '기타',
}

// 상태 KEY → 그래픽(점·링·게이지) 색 토큰 — 상태색상정책 §2.2 -base 단계(텍스트 사용 금지)
export const RISK_TOKEN = {
  OK: 'var(--color-ok-base)',
  WARN: 'var(--color-warn-base)',
  RISK: 'var(--color-risk-base)',
}

export const label = (map, key) => map[key] ?? key
