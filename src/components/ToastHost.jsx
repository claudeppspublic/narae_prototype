// ToastHost — useUiStore 토스트 큐를 화면 우하단에 렌더. Layout에 1회 마운트.
import { useEffect } from 'react'
import { useUiStore } from '@/store/useUiStore'

const COLOR = {
  info: 'var(--narae-status-info)',
  ok: 'var(--narae-status-ok)',
  warn: 'var(--narae-status-warn)',
  risk: 'var(--narae-status-risk)',
}

export default function ToastHost() {
  const toasts = useUiStore((s) => s.toasts)
  const dismiss = useUiStore((s) => s.dismissToast)

  return (
    <div style={{ position: 'fixed', right: 'var(--krds-space-9)', bottom: 'var(--krds-space-9)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-4)' }}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDone={() => dismiss(t.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 3000)
    return () => clearTimeout(id)
  }, [onDone])
  return (
    <div
      role="status"
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--krds-space-6)',
        minWidth: '16rem', padding: 'var(--krds-space-7) var(--krds-space-8)',
        background: 'var(--color-background-white)', borderRadius: 'var(--krds-radius-medium)',
        boxShadow: 'var(--krds-shadow-2)', borderLeft: `3px solid ${COLOR[toast.variant] ?? COLOR.info}`,
        animation: 'narae-slide-in 0.2s ease-out',
      }}
    >
      <span style={{ flex: 1, fontSize: 'var(--krds-body-medium)' }}>{toast.message}</span>
      <button onClick={onDone} aria-label="닫기" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-assistive, #6b7280)' }}>✕</button>
    </div>
  )
}
