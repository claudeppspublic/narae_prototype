// PopupShell — 대형 중앙 팝업(오버레이). v1.1(REF-24 D11): WF-02 업무 상세 Drawer→팝업 전환용 셸.
// WF02-08 닫기(X)/ESC · WF02-10 오버레이 클릭/Escape 닫힘. (소형 확인 다이얼로그는 Modal.jsx)
import { useEffect } from 'react'

export default function PopupShell({ open, onClose, title, header, width = 'min(72rem, 94vw)', children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} aria-hidden
        style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.4)' }} />
      <section role="dialog" aria-modal="true" aria-label={title}
        style={{
          position: 'relative', width, maxHeight: '92vh',
          background: 'var(--color-background-white)', borderRadius: 'var(--krds-radius-large)',
          boxShadow: 'var(--krds-shadow-3)', display: 'flex', flexDirection: 'column',
          animation: 'narae-pop-in 0.16s ease-out',
        }}
      >
        <header style={{
          display: 'flex', alignItems: 'flex-start', gap: 'var(--krds-space-6)',
          padding: 'var(--krds-space-8) var(--krds-space-9)',
          borderBottom: '1px solid var(--color-border-basic, #e5e7eb)',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {header ?? (
              <h2 style={{ fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)', margin: 0 }}>{title}</h2>
            )}
          </div>
          <button onClick={onClose} aria-label="닫기" style={closeBtn}>✕</button>
        </header>
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-9)' }}>{children}</div>
        {footer && (
          <footer style={{ padding: 'var(--krds-space-7) var(--krds-space-9)', borderTop: '1px solid var(--color-border-basic, #e5e7eb)' }}>
            {footer}
          </footer>
        )}
      </section>
      <style>{`@keyframes narae-pop-in { from { transform: scale(0.97); opacity: 0.6; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  )
}

const closeBtn = {
  width: 'var(--krds-control-xsmall)', height: 'var(--krds-control-xsmall)', flexShrink: 0,
  border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem',
  color: 'var(--color-text-assistive, #6b7280)',
}
