// 상태 5종 뷰 — Spinner(로딩) · EmptyState(빈) · ErrorState(에러).
// 모든 화면이 동일한 상태 표현을 공유(CLAUDE.md DoD 상태 5종).
import Button from './Button'

export function Spinner({ label = '불러오는 중…', minHeight = '12rem' }) {
  return (
    <div style={{ ...center, minHeight }} role="status" aria-live="polite">
      <span style={spinnerCircle} />
      <p style={muted}>{label}</p>
      <style>{keyframes}</style>
    </div>
  )
}

export function EmptyState({ title = '표시할 데이터가 없습니다', description, action, icon = '📭' }) {
  return (
    <div style={{ ...center, minHeight: '12rem' }}>
      <div style={{ fontSize: '2rem' }} aria-hidden>{icon}</div>
      <p style={{ fontWeight: 'var(--krds-weight-bold)', marginTop: 'var(--krds-space-4)' }}>{title}</p>
      {description && <p style={muted}>{description}</p>}
      {action && <div style={{ marginTop: 'var(--krds-space-7)' }}>{action}</div>}
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <div style={{ ...center, minHeight: '12rem' }} role="alert">
      <div style={{ fontSize: '2rem' }} aria-hidden>⚠️</div>
      <p style={{ fontWeight: 'var(--krds-weight-bold)', marginTop: 'var(--krds-space-4)', color: 'var(--color-risk-text)' }}>
        ! 요청을 처리하지 못했습니다
      </p>
      <p style={muted}>{error?.message ?? '알 수 없는 오류'}</p>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} style={{ marginTop: 'var(--krds-space-7)' }}>다시 시도</Button>
      )}
    </div>
  )
}

// 상태 5종 렌더 헬퍼: loading/error/empty → 해당 뷰, 아니면 children(data)
export function AsyncView({ loading, error, data, reload, empty, children }) {
  if (loading) return <Spinner />
  if (error) return <ErrorState error={error} onRetry={reload} />
  const isEmpty = data == null || (Array.isArray(data) && data.length === 0)
  if (isEmpty) return empty ?? <EmptyState />
  return children
}

const center = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 'var(--krds-space-2)', textAlign: 'center', padding: 'var(--krds-space-9)',
}
const muted = { color: 'var(--color-text-assistive, #6b7280)', fontSize: 'var(--krds-body-small)' }
const spinnerCircle = {
  width: '2rem', height: '2rem', borderRadius: 'var(--krds-radius-pill)',
  border: '3px solid var(--color-border-basic, #e5e7eb)',
  borderTopColor: 'var(--narae-accent)', animation: 'narae-spin 0.8s linear infinite',
  marginBottom: 'var(--krds-space-4)',
}
const keyframes ='@keyframes narae-spin { to { transform: rotate(360deg); } }'
