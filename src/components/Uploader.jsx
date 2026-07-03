// Uploader — 드롭존(클릭/드래그). mock 업로드: 파일 메타만 콜백.
// accept 표시·용량 안내 텍스트, 형식/용량 초과 거부(간이 검증).
import { useRef, useState } from 'react'

export default function Uploader({ hint = 'PDF · HWP · DOCX · XLSX · 최대 50MB', accept, maxMB = 50, onFiles, note }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)

  const handle = (fileList) => {
    setError(null)
    const files = Array.from(fileList)
    const tooBig = files.find((f) => f.size > maxMB * 1024 * 1024)
    if (tooBig) {
      setError(`용량 초과: ${tooBig.name} (최대 ${maxMB}MB)`)
      return
    }
    onFiles?.(files.map((f) => ({ name: f.name, size: f.size, type: f.type })))
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handle(e.dataTransfer.files) }}
        role="button"
        tabIndex={0}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 'var(--krds-space-3)', padding: 'var(--krds-space-12)', cursor: 'pointer',
          border: `1.5px dashed ${dragOver ? 'var(--narae-accent)' : 'var(--color-border-basic, #d1d5db)'}`,
          borderRadius: 'var(--krds-radius-large)',
          background: dragOver ? 'color-mix(in srgb, var(--narae-accent) 6%, transparent)' : 'var(--color-background-white)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '1.5rem' }} aria-hidden>📎</div>
        <p style={{ fontWeight: 'var(--krds-weight-medium)', color: 'var(--narae-accent)' }}>
          파일을 드래그하거나 클릭하여 업로드
        </p>
        <p style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive, #6b7280)' }}>{hint}</p>
        {note && (
          <span style={{
            marginTop: 'var(--krds-space-3)', padding: '2px var(--krds-space-6)',
            borderRadius: 'var(--krds-radius-pill)', fontSize: 'var(--krds-body-small)',
            background: 'color-mix(in srgb, var(--narae-accent) 10%, transparent)', color: 'var(--narae-accent)',
          }}>★ {note}</span>
        )}
        <input ref={inputRef} type="file" accept={accept} multiple hidden
          onChange={(e) => handle(e.target.files)} />
      </div>
      {error && (
        <p role="alert" style={{ marginTop: 'var(--krds-space-4)', color: 'var(--color-risk-text)', fontSize: 'var(--krds-body-small)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
