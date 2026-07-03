// ToastHost — useUiStore 토스트 큐를 화면 우하단에 렌더. Layout에 1회 마운트.
import { useEffect } from 'react'
import { useUiStore } from '@/store/useUiStore'

// 상태색상정책 §4 토스트: 오류=빨강 · 경고=노랑 · 성공=초록 · 정보=회색, 아이콘+문구 병행
const TONE = {
  info: { bar: 'var(--color-neutral-base)', fg: 'var(--color-neutral-text)', icon: 'ℹ' },
  ok: { bar: 'var(--color-ok-base)', fg: 'var(--color-ok-text)', icon: '✓' },
  warn: { bar: 'var(--color-warn-base)', fg: 'var(--color-warn-text)', icon: '!' },
  risk: { bar: 'var(--color-risk-base)', fg: 'var(--color-risk-text)', icon: '!' },
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
  const tone = TONE[toast.variant] ?? TONE.info
  return (
    <div
      role="status"
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--krds-space-6)',
        minWidth: '16rem', padding: 'var(--krds-space-7) var(--krds-space-8)',
        background: 'var(--color-background-white)', borderRadius: 'var(--krds-radius-medium)',
        boxShadow: 'var(--krds-shadow-2)', borderLeft: `3px solid ${tone.bar}`,
        animation: 'narae-slide-in 0.2s ease-out',
      }}
    >
      <span aria-hidden style={{ fontWeight: 'var(--krds-weight-bold)', color: tone.fg }}>{tone.icon}</span>
      <span style={{ flex: 1, fontSize: 'var(--krds-body-medium)' }}>{toast.message}</span>
      <button onClick={onDone} aria-label="닫기" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-assistive, #6b7280)' }}>✕</button>
    </div>
  )
}
