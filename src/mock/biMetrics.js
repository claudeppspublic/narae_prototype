// BI_METRICS 시드 — RB-01 결재 BI 위젯 B1~B9 (REF-23 §4.4).
// 구조: { widgetId, type, value|series, target?, unit?, aiLine }
// 값은 시연용 mock(상호 정합성 불요·"있어보이게"). 단 B3·B9 행은 실존 taskId 매핑(WF-02 drill용).
// 색 규칙(DEF-05): 순수 진행률=primary/neutral · 문제성(지연·미달·위험)만 risk/warn ·
//   SLA 임계 90↑ok / 70~89warn / 70↓risk [CONFIRM: 임계값] — 렌더는 RB-01(Phase 3)에서 적용.

export const biMetrics = [
  { widgetId: 'B1', type: 'gauge', title: '결재 리드타임',
    value: { avg: 4.2, median: 3.8, p90: 7.1 }, target: 3, unit: '일',
    aiLine: '평균 4.2일, 목표 대비 +1.2일' },

  { widgetId: 'B2', type: 'heatmap', title: '단계별 병목 히트맵',
    series: [
      { dept: '기획재정담당관', 기안: 8, 검토: 62, 승인: 12 },
      { dept: '혁신행정담당관', 기안: 11, 검토: 48, 승인: 9 },
      { dept: '정보통계담당관', 기안: 6, 검토: 31, 승인: 14 },
      { dept: '감사담당관', 기안: 9, 검토: 55, 승인: 18 },
    ], unit: '%',
    aiLine: '검토 단계가 전체 지연의 62%' },

  { widgetId: 'B3', type: 'ranklist', title: '지연 결재 Top 5',
    series: [
      { rank: 1, taskId: 'T-001-02', taskNm: '부서별 예산요구 취합', assigneeNm: '손승현', stage: '검토', elapsedDays: 5 },
      { rank: 2, taskId: 'T-002-02', taskNm: '시범 운영', assigneeNm: '노현우', stage: '검토', elapsedDays: 4 },
      { rank: 3, taskId: 'T-003-04', taskNm: '결과 보고', assigneeNm: '노현우', stage: '승인', elapsedDays: 3 },
      { rank: 4, taskId: 'T-001-05', taskNm: '국회 예산심의 대응자료', assigneeNm: '손하준', stage: '검토', elapsedDays: 2 },
      { rank: 5, taskId: 'T-001-03', taskNm: '재정위험 관리체계 검토', assigneeNm: '황도경', stage: '검토', elapsedDays: 1 },
    ], unit: '일',
    aiLine: "'부서별 예산요구 취합' 검토 5일 최장" },

  { widgetId: 'B4', type: 'stackedbar', title: '반려·재상신율',
    series: [
      { stage: '기안', 정상: 94, 반려: 4, 재상신: 2 },
      { stage: '검토', 정상: 78, 반려: 14, 재상신: 8 },
      { stage: '승인', 정상: 91, 반려: 6, 재상신: 3 },
    ], unit: '%',
    aiLine: '검토 반려율 14%(전월 +6%p)' },

  { widgetId: 'B5', type: 'gauge', title: 'SLA 준수율(부서별)',
    series: [
      { dept: '기획재정담당관', value: 92 },
      { dept: '혁신행정담당관', value: 85 },
      { dept: '정보통계담당관', value: 74 },
      { dept: '감사담당관', value: 68 },
    ], target: 90, unit: '%',
    aiLine: '감사담당관 68% — 기준 미달' },

  { widgetId: 'B6', type: 'trendline', title: '결재 적체 추세',
    series: [
      { week: 'W1', value: 9 }, { week: 'W2', value: 8 }, { week: 'W3', value: 7 }, { week: 'W4', value: 8 },
      { week: 'W5', value: 9 }, { week: 'W6', value: 11 }, { week: 'W7', value: 13 }, { week: 'W8', value: 15 },
    ], unit: '건',
    aiLine: '3주 연속 적체 증가' },

  { widgetId: 'B7', type: 'donut', title: '지연 원인 분포',
    series: [
      { cause: '결재자 부재', value: 22 },
      { cause: '검토 과부하', value: 41 },
      { cause: '정보 부족', value: 27 },
      { cause: '기타', value: 10 },
    ], unit: '%',
    aiLine: '검토 과부하 41%가 최다 원인' },

  { widgetId: 'B8', type: 'scatter', title: '담당자 부하 vs 지연',
    series: [
      { name: '손승현', load: 9, delay: 4.8, risk: true },
      { name: '노현우', load: 8, delay: 4.1, risk: true },
      { name: '허민준', load: 7, delay: 3.6, risk: true },
      { name: '황도경', load: 6, delay: 1.8, risk: false },
      { name: '손하준', load: 5, delay: 2.2, risk: false },
      { name: '남수빈', load: 5, delay: 1.1, risk: false },
      { name: '송지훈', load: 4, delay: 0.9, risk: false },
      { name: '정예은', load: 4, delay: 0.6, risk: false },
      { name: '안지우', load: 3, delay: 1.4, risk: false },
      { name: '전민재', load: 3, delay: 0.4, risk: false },
      { name: '강다은', load: 2, delay: 0.7, risk: false },
      { name: '조민준', load: 2, delay: 0.3, risk: false },
    ], unit: '건·일',
    aiLine: '고부하·고지연 3명 — 재배치 검토' },

  { widgetId: 'B9', type: 'prediction', title: '예측(AI)',
    series: [
      { taskId: 'T-001-02', taskNm: '부서별 예산요구 취합', reason: '검토 정체 5일·기한 초과' },
      { taskId: 'T-002-02', taskNm: '시범 운영', reason: '담당자 과부하·선행 지연' },
      { taskId: 'T-003-04', taskNm: '결과 보고', reason: '승인 대기 적체 추세' },
    ],
    aiLine: '이번 주 지연 위험 결재 3건 예측' },
]

export const biWidget = (widgetId) => biMetrics.find((w) => w.widgetId === widgetId)

// RB-01 → RB-03 전달 스냅샷 (REF-23 §4.4 biSnapshot)
export const biSnapshot = {
  leadTime: 4.2,
  bottleneck: '검토 62%',
  rejectRate: '14%',
  slaWorst: '감사담당관 68%',
  delayedTop: ['T-001-02', 'T-002-02', 'T-003-04'],
  problems: [
    '검토 단계 병목(전체 지연의 62%)',
    "지연 결재 3건 — '부서별 예산요구 취합' 검토 5일 최장",
    "반려 1건 — '국회 예산심의 대응자료'(예산 산출 근거 미비)",
    '감사담당관 SLA 68%로 기준(90%) 미달',
  ],
}
