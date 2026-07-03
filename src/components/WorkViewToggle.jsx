// WorkViewToggle — 업무 뷰(테이블/캘린더/차트) + 주기(일/주/월) 토글을 항상 같은 위치에 고정.
// 피드백: 화면 전환 시 버튼 위치가 바뀌지 않도록 통일. 우측 정렬, 주기 토글이 뷰 토글 왼쪽.
import { useNavigate } from 'react-router-dom'
import { SegToggle } from '@/components/Tabs'

const VIEW_PATH = { table: '/work/table', calendar: '/work/calendar', gantt: '/work/gantt' }

export default function WorkViewToggle({ view, scale, onScale }) {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', gap: 'var(--krds-space-5)', alignItems: 'center', flexShrink: 0 }}>
      {/* 주기(일/주/월) — 차트·캘린더만 표시. 위치는 뷰 토글 왼쪽 고정 */}
      {scale && (
        <SegToggle items={[{ key: 'day', label: '일' }, { key: 'week', label: '주' }, { key: 'month', label: '월' }]}
          value={scale} onChange={onScale} size="sm" />
      )}
      {/* 뷰 전환 — 항상 우측 끝 고정 */}
      <SegToggle
        items={[{ key: 'table', label: '테이블' }, { key: 'calendar', label: '캘린더' }, { key: 'gantt', label: '차트' }]}
        value={view}
        onChange={(v) => v !== view && navigate(VIEW_PATH[v])}
        size="sm"
      />
    </div>
  )
}
