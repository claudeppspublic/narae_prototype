// NOTIFICATION 시드 — 헤더 벨 → RB-02 리스크 알림(알림센터 대체).
// 스키마: notiId, category(리스크/결재/멘션), refId, read
export const notifications = [
  { notiId: 'N-001', category: '리스크', title: '재정위험 관리체계 검토 지연·위험', refId: 'RSK-002', read: false, createdAt: '2026-03-07T09:00:00' },
  { notiId: 'N-002', category: '리스크', title: '시범 운영 지연·위험', refId: 'RSK-004', read: false, createdAt: '2026-03-24T09:37:00' },
  { notiId: 'N-003', category: '리스크', title: '결과 보고 지연·위험', refId: 'RSK-006', read: false, createdAt: '2026-04-19T10:14:00' },
  { notiId: 'N-004', category: '리스크', title: '시범 운영 지연·위험', refId: 'RSK-008', read: false, createdAt: '2026-02-26T10:51:00' },
  { notiId: 'N-005', category: '리스크', title: '후속 개선 지연·위험', refId: 'RSK-009', read: false, createdAt: '2026-03-11T11:28:00' },
  { notiId: 'N-006', category: '리스크', title: '후속 개선 지연·위험', refId: 'RSK-011', read: false, createdAt: '2026-04-06T12:05:00' },
  { notiId: 'N-007', category: '리스크', title: '세부지침 마련 지연·위험', refId: 'RSK-013', read: false, createdAt: '2026-02-13T12:42:00' },
  { notiId: 'N-008', category: '리스크', title: '중간 점검 지연·위험', refId: 'RSK-014', read: false, createdAt: '2026-02-26T13:19:00' },
  { notiId: 'N-009', category: '리스크', title: '추진계획 수립 지연·위험', refId: 'RSK-015', read: false, createdAt: '2026-03-11T13:56:00' },
  { notiId: 'N-010', category: '리스크', title: '후속 개선 지연·위험', refId: 'RSK-016', read: false, createdAt: '2026-03-24T14:33:00' },
  { notiId: 'N-011', category: '리스크', title: '후속 개선 지연·위험', refId: 'RSK-017', read: false, createdAt: '2026-04-06T15:10:00' },
  { notiId: 'N-012', category: '리스크', title: '시범 운영 지연·위험', refId: 'RSK-018', read: false, createdAt: '2026-04-19T15:47:00' },
  { notiId: 'N-013', category: '리스크', title: '추진계획 수립 지연·위험', refId: 'RSK-019', read: false, createdAt: '2026-02-13T16:24:00' },
  { notiId: 'N-014', category: '리스크', title: '세부지침 마련 지연·위험', refId: 'RSK-020', read: false, createdAt: '2026-02-26T09:01:00' },
  { notiId: 'N-015', category: '리스크', title: '결과 보고 지연·위험', refId: 'RSK-021', read: false, createdAt: '2026-03-11T09:38:00' },
  { notiId: 'N-016', category: '리스크', title: '후속 개선 지연·위험', refId: 'RSK-022', read: false, createdAt: '2026-03-24T10:15:00' },
  { notiId: 'N-017', category: '리스크', title: '관계기관 협의 지연·위험', refId: 'RSK-023', read: false, createdAt: '2026-04-06T10:52:00' },
  { notiId: 'N-018', category: '리스크', title: '후속 개선 지연·위험', refId: 'RSK-024', read: false, createdAt: '2026-04-19T11:29:00' },
  { notiId: 'N-019', category: '멘션', title: '정가은님이 \'예산 편성지침 분석\' 업무에서 회원님을 언급했습니다', refId: 'T-001-01', read: true, createdAt: '2026-01-12T10:20:00' },
  { notiId: 'N-020', category: '결재', title: '부서별 예산요구 취합 결재 요청', refId: 'T-001-02', read: true, createdAt: '2026-02-03T14:05:00' },
  { notiId: 'N-021', category: '멘션', title: '황도경님이 \'재정위험 관리체계 검토\' 업무에서 회원님을 언급했습니다', refId: 'T-001-03', read: false, createdAt: '2026-02-16T09:40:00' },
  { notiId: 'N-022', category: '결재', title: '예산요구서 초안 작성 결재 요청', refId: 'T-001-04', read: false, createdAt: '2026-03-16T11:15:00' },
  { notiId: 'N-023', category: '결재', title: '국회 예산심의 대응자료 결재 요청', refId: 'T-001-05', read: true, createdAt: '2026-03-04T15:30:00' },
  { notiId: 'N-024', category: '멘션', title: '황도경님이 \'현황 조사·분석\' 업무에서 회원님을 언급했습니다', refId: 'T-002-01', read: true, createdAt: '2026-02-09T13:50:00' },
]

export const unreadCount = () => notifications.filter((n) => !n.read).length

// 벨 배지 롤업 — 상태색상정책 §4 알림: 미읽음 중 리스크 존재→risk, 결재만→warn, 그 외→neutral
export const unreadSeverity = () => {
  const unread = notifications.filter((n) => !n.read)
  if (unread.some((n) => n.category === '리스크')) return 'risk'
  if (unread.some((n) => n.category === '결재')) return 'warn'
  return 'neutral'
}
