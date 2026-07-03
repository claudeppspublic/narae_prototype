// MEETING 시드 — DO-01 회의록 (생성·목록·상세).
// 스키마: meetingId, meetingNm, projectId, summaryText, actionItems[]
export const meetings = [
  {
    meetingId: 'MTG-001',
    meetingNm: '2026년 예산 편성 착수 회의',
    projectId: 'PRJ-2026-001',
    date: '2026-01-08',
    participants: ['김민준', '박서준', '이하늘', '오세훈'],
    summaryText:
      '2026년도 예산 편성 방향과 부서별 요구안 취합 일정을 논의. 디지털 예산관리 시스템 도입을 우선 검토하기로 함.',
    transcript: [
      { speaker: '김민준', text: '올해 편성 지침은 전년 대비 긴축 기조입니다.' },
      { speaker: '이하늘', text: '부서 요구안은 1월 말까지 취합하겠습니다.' },
      { speaker: '오세훈', text: '예산관리 시스템 구축 기본계획을 병행 추진하겠습니다.' },
    ],
    actionItems: [
      { itemId: 'AI-1', text: '부서별 예산 요구안 취합', assigneeNm: '이하늘', due: '2026-01-28', linkedProjectId: 'PRJ-2026-001', approved: false },
      { itemId: 'AI-2', text: '예산관리 시스템 RFP 초안 작성', assigneeNm: '오세훈', due: '2026-02-15', linkedProjectId: null, approved: false },
    ],
  },
  {
    meetingId: 'MTG-002',
    meetingNm: '민원서비스 개선 점검 회의',
    projectId: 'PRJ-2026-005',
    date: '2024-12-11',
    participants: ['조하은', '서지우', '이도현'],
    summaryText: '민원서비스 만족도 조사 중간 결과를 공유하고 개선 과제를 도출.',
    transcript: [
      { speaker: '조하은', text: '만족도 조사 응답률이 목표를 상회했습니다.' },
      { speaker: '서지우', text: '대기시간 관련 불만이 가장 많았습니다.' },
    ],
    actionItems: [
      { itemId: 'AI-3', text: '대기시간 단축 방안 수립', assigneeNm: '서지우', due: '2025-01-15', linkedProjectId: 'PRJ-2026-005', approved: true },
    ],
  },
]

export const findMeeting = (id) => meetings.find((m) => m.meetingId === id)
