// 공용 Modal — 중앙 확인 다이얼로그(오버레이 클릭·Escape 닫힘). RB-03 발송 승인 등.
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, width = '26rem', children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div onClick={onClose} style={overlay}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} style={{ ...panel, width }}>
        <h3 style={{ margin: '0 0 var(--krds-space-5)', fontWeight: 'var(--krds-weight-bold)' }}>{title}</h3>
        {children}
        {footer && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--krds-space-4)' }}>{footer}</div>
        )}
      </div>
    </div>
  )
}

const overlay = { position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }
const panel = { background: 'var(--color-background-white)', borderRadius: 'var(--krds-radius-large)', padding: 'var(--krds-space-10)', maxWidth: '92vw', boxShadow: 'var(--krds-shadow-3)' }
