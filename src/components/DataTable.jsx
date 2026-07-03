// DataTable — 토큰 기반 목록 테이블. columns=[{key,header,render?,width?,align?}].
export default function DataTable({ columns, rows, rowKey = (r, i) => i, onRowClick }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--color-border-basic, #e5e7eb)', borderRadius: 'var(--krds-radius-large)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--krds-body-small)' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align ?? 'left', padding: 'var(--krds-space-7) var(--krds-space-8)',
                  background: 'var(--color-background-alternative, #f8f9fa)',
                  color: 'var(--color-text-assistive, #6b7280)',
                  fontWeight: 'var(--krds-weight-bold)', fontSize: 'var(--krds-body-xsmall)',
                  borderBottom: '1px solid var(--color-border-basic, #e5e7eb)', width: c.width,
                  whiteSpace: 'nowrap',
                }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={rowKey(row, i)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'narae-row' : undefined}
              style={{ cursor: onRowClick ? 'pointer' : undefined }}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    textAlign: c.align ?? 'left', padding: 'var(--krds-space-7) var(--krds-space-8)',
                    borderBottom: '1px solid var(--color-border-basic, #eef0f2)',
                    color: 'var(--color-text-basic)',
                  }}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {onRowClick && <style>{`.narae-row:hover td{background:var(--color-background-alternative,#f8f9fa)}`}</style>}
    </div>
  )
}
