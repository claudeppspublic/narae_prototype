// Drawer — 우측 슬라이드 패널(배경 유지 오버레이). WF-02 업무상세·홈 BI Drawer 공용.
import { useEffect } from 'react'

export default function Drawer({ open, onClose, title, width = 'var(--narae-drawer-lg)', children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      {/* 배경(반투명) — 클릭 시 닫힘. 배경 콘텐츠는 유지됨 */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.28)' }}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'absolute', top: 0, right: 0, height: '100%', width, maxWidth: '92vw',
          background: 'var(--color-background-white)', boxShadow: 'var(--krds-shadow-3)',
          display: 'flex', flexDirection: 'column', animation: 'narae-slide-in 0.2s ease-out',
        }}
      >
        <header
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 'var(--krds-space-8) var(--krds-space-9)',
            borderBottom: '1px solid var(--color-border-basic, #e5e7eb)',
          }}
        >
          <h2 style={{ fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)', margin: 0 }}>
            {title}
          </h2>
          <button onClick={onClose} aria-label="닫기" style={closeBtn}>✕</button>
        </header>
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-9)' }}>{children}</div>
        {footer && (
          <footer style={{ padding: 'var(--krds-space-8) var(--krds-space-9)', borderTop: '1px solid var(--color-border-basic, #e5e7eb)' }}>
            {footer}
          </footer>
        )}
      </aside>
      <style>{`@keyframes narae-slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  )
}

const closeBtn = {
  width: 'var(--krds-control-xsmall)', height: 'var(--krds-control-xsmall)',
  border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem',
  color: 'var(--color-text-assistive, #6b7280)',
}
