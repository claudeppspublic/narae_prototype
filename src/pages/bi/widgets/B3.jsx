// B3 지연 결재 Top 5 — 랭킹 리스트(과제·담당·단계·경과일). DEF-05: 기한초과(경과>평균)=risk 배지.
// 행 클릭 → WF-02 drill (INT-RB01-04 — onDrill 전달 시 활성)
import { biWidget } from '@/mock/biMetrics'
import { AVG_ELAPSED_DAYS } from '@/lib/approval'
import Badge from '@/components/Badge'
import WidgetCard from './WidgetCard'

export default function B3({ onDrill }) {
  const w = biWidget('B3')
  return (
    <WidgetCard widget={w} tone="risk">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-3)' }}>
        {w.series.map((r) => {
          const over = r.elapsedDays > AVG_ELAPSED_DAYS
          const clickable = !!onDrill && !!r.taskId // taskId 미존재 행→비활성 (spec 엣지)
          return (
            <button key={r.rank} data-testid="rb01-04" disabled={!clickable}
              onClick={clickable ? () => onDrill(r.taskId) : undefined}
              title={clickable ? '업무 상세(워크플로우) 열기' : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--krds-space-5)',
                padding: 'var(--krds-space-4) var(--krds-space-5)', borderRadius: 'var(--krds-radius-small)',
                border: '1px solid var(--color-border-basic,#eef0f2)', background: 'var(--color-background-white)',
                cursor: clickable ? 'pointer' : 'default', textAlign: 'left', fontSize: 'var(--krds-body-small)',
              }}>
              <b style={{ width: 16, color: r.rank === 1 ? 'var(--color-risk-text)' : 'var(--color-text-assistive,#9ca3af)' }}>{r.rank}</b>
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 'var(--krds-weight-medium)' }}>
                {r.taskNm}
              </span>
              <span style={{ color: 'var(--color-text-assistive,#6b7280)', fontSize: 'var(--narae-caption)' }}>{r.assigneeNm} · {r.stage}</span>
              <Badge variant={over ? 'risk' : 'neutral'}>{over && <b aria-hidden>!</b>}{r.elapsedDays}일</Badge>
            </button>
          )
        })}
      </div>
    </WidgetCard>
  )
}
