// NOTIFICATION 시드 — 헤더 벨 → RB-02 리스크 알림(알림센터 대체).
// 스키마: notiId, category(리스크/결재/멘션), refId, read
export const notifications = [
  { notiId: 'NTF-001', category: '리스크', title: '디지털 예산관리 시스템 구축 지연 위험', refId: 'T-001-03', read: false, createdAt: '2026-03-05T09:10:00' },
  { notiId: 'NTF-002', category: '결재', title: '예산 편성 지침 결재 요청', refId: 'T-001-01', read: false, createdAt: '2026-03-04T14:22:00' },
  { notiId: 'NTF-003', category: '멘션', title: '조하은님이 회의록에서 회원님을 언급했습니다', refId: 'MTG-002', read: true, createdAt: '2026-03-02T11:05:00' },
  { notiId: 'NTF-004', category: '리스크', title: 'AI 민원처리 시스템 담당자 과부하', refId: 'T-003-01', read: false, createdAt: '2026-02-20T16:40:00' },
]

export const unreadCount = () => notifications.filter((n) => !n.read).length
