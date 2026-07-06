// ✦ AI 요약 배너 — 결재·BI·보고서 관련 뷰 상단 1–2줄 상시 (REF-23 §4.3 · DEF-05 tone 색).
// 문장이 없으면 렌더하지 않는다(빈 배너 금지). WF-02/CM-03/RB-01/RB-03 공용.
import { aiSummaryFor } from '@/mock/aiSummary'

const TONE_TEXT = {
  risk: 'var(--color-risk-text)',
  warn: 'var(--color-warn-text)',
  neutral: 'var(--color-neutral-text)',
}
const TONE_BG = {
  risk: 'var(--color-risk-bg)',
  warn: 'var(--color-warn-bg)',
  neutral: 'var(--color-neutral-bg)',
}
const TONE_BORDER = {
  risk: 'var(--color-risk-border)',
  warn: 'var(--color-warn-border)',
  neutral: 'var(--color-neutral-border)',
}

export default function AiSummaryBanner({ screen, contextType, contextId, style }) {
  const summary = aiSummaryFor(screen, { contextType, contextId })
  if (!summary) return null
  return (
    <div
      role="status"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 'var(--krds-space-4)',
        padding: 'var(--krds-space-6) var(--krds-space-7)',
        borderRadius: 'var(--krds-radius-medium)',
        background: TONE_BG[summary.tone] ?? TONE_BG.neutral,
        border: `1px solid ${TONE_BORDER[summary.tone] ?? TONE_BORDER.neutral}`,
        fontSize: 'var(--krds-body-small)', lineHeight: 1.5,
        ...style,
      }}
    >
      <span aria-hidden style={{ color: TONE_TEXT[summary.tone], fontWeight: 'var(--krds-weight-bold)' }}>✦</span>
      <span style={{ color: TONE_TEXT[summary.tone] ?? TONE_TEXT.neutral, fontWeight: 'var(--krds-weight-medium)' }}>
        {summary.text}
      </span>
    </div>
  )
}
