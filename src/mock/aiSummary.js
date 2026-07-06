// AI_SUMMARY 시드 — 결재·BI·보고서 뷰 상단 ✦ AI 요약 1–2줄 (REF-23 §4.3, mock 문장 세트).
// 스키마: screen('cm03'|'wf02'|'rb01'|'rb03'), contextType('org'|'project'|'task'|'dept'|'report'),
//         contextId(string|null), text, tone('risk'|'warn'|'neutral')
// 규칙: 표기 시 '✦ ' 접두 · tone별 --color-*-text · 문장 없으면 배너 숨김(빈 배너 금지).
export const aiSummaries = [
  // 화면 기본 문장 (contextId=null) — §4.3 표 그대로
  { screen: 'cm03', contextType: 'org', contextId: null,
    text: "밤사이 결재 2건 완료·1건 반려. '예산요구서' 검토 3일째 정체 — 지금 확인하세요.", tone: 'risk' },
  { screen: 'wf02', contextType: 'task', contextId: null,
    text: "이 업무는 '검토' 단계에서 3일 정체(부서 평균 대비 +2일). 병목=혁신행정담당관.", tone: 'risk' },
  { screen: 'rb01', contextType: 'dept', contextId: null,
    text: '부서 평균 결재 리드타임 4.2일(전주 +0.8). 검토 단계가 62% 차지 — 개선 여지 큼.', tone: 'warn' },
  { screen: 'rb03', contextType: 'report', contextId: null,
    text: '지연 결재 3건·반려 1건을 반영한 주간 보고 초안을 생성했습니다.', tone: 'neutral' },

  // 컨텍스트 변형 — 시연 케이스(§4.5) 업무별 문장
  { screen: 'wf02', contextType: 'task', contextId: 'T-001-02',
    text: "이 업무는 '검토' 단계에서 5일 정체(부서 평균 대비 +3일)·기한 초과. 병목=허민준 팀장 단계.", tone: 'risk' },
  { screen: 'wf02', contextType: 'task', contextId: 'T-001-03',
    text: "검토 단계 1일차 — 기한 내 정상 진행 중입니다. 예상 완료 7-10.", tone: 'neutral' },
  { screen: 'wf02', contextType: 'task', contextId: 'T-001-05',
    text: "검토 단계에서 반려됨(사유: 예산 산출 근거 미비). 재상신 전 산출 근거 보완이 필요합니다.", tone: 'risk' },
  { screen: 'cm03', contextType: 'task', contextId: 'T-001-02',
    text: "'부서별 예산요구 취합' 결재가 검토 단계 5일째 — 기한(7-04) 초과 상태입니다.", tone: 'risk' },
  { screen: 'cm03', contextType: 'task', contextId: 'T-001-05',
    text: "'국회 예산심의 대응자료' 결재가 반려되었습니다(예산 산출 근거 미비).", tone: 'risk' },
]

// 조회: 컨텍스트 정확 일치 → 화면 기본(contextId=null) → null(배너 숨김)
export function aiSummaryFor(screen, { contextType, contextId } = {}) {
  if (contextId != null) {
    const exact = aiSummaries.find((s) => s.screen === screen && s.contextId === contextId
      && (contextType == null || s.contextType === contextType))
    if (exact) return exact
  }
  return aiSummaries.find((s) => s.screen === screen && s.contextId === null
    && (contextType == null || s.contextType === contextType))
    ?? aiSummaries.find((s) => s.screen === screen && s.contextId === null)
    ?? null
}
