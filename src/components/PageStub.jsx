// 공통 화면 스텁 — M0 부트스트랩용. 각 화면은 마일스톤에서 실제 구현으로 대체된다.
export default function PageStub({ scrId, title, priority }) {
  return (
    <section
      style={{
        padding: 'var(--krds-space-11)',
        fontFamily: 'var(--krds-font-sans)',
        color: 'var(--color-text-basic)',
      }}
    >
      <p
        style={{
          fontSize: 'var(--krds-body-small)',
          color: 'var(--narae-accent)',
          fontWeight: 'var(--krds-weight-bold)',
          letterSpacing: '0.04em',
        }}
      >
        {scrId}
        {priority ? ` · ${priority}` : ''}
      </p>
      <h1
        style={{
          fontSize: 'var(--krds-heading-medium)',
          fontWeight: 'var(--krds-weight-bold)',
          margin: 'var(--krds-space-4) 0 0',
        }}
      >
        {title}
      </h1>
      <p
        style={{
          marginTop: 'var(--krds-space-7)',
          color: 'var(--color-text-assistive, #6b7280)',
        }}
      >
        구현 예정 화면입니다. (마일스톤 진행 시 실제 화면으로 대체)
      </p>
    </section>
  )
}
