// Card — 토큰 기반 컨테이너 카드.
export default function Card({ children, onClick, hoverable, style }) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e) } } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={hoverable ? 'narae-card-hover' : undefined}
      style={{
        background: 'var(--color-background-white)',
        border: '1px solid var(--color-border-basic, #e5e7eb)',
        borderRadius: 'var(--krds-radius-large)',
        padding: 'var(--krds-space-9)',
        boxShadow: 'var(--krds-shadow-1)',
        cursor: onClick ? 'pointer' : undefined,
        transition: 'box-shadow 0.15s, border-color 0.15s',
        ...style,
      }}
    >
      {children}
      {hoverable && (
        <style>{`.narae-card-hover:hover{box-shadow:var(--krds-shadow-2);border-color:var(--narae-accent)}`}</style>
      )}
    </div>
  )
}
