// AiAssistantPanel — 전역 AI 어시스턴트 패널 (CM02-02 → SCR-AI-03 mock).
// 전역 AI질문창 제출 시 열리며 mock RAG 응답+출처를 표시. AI-03 본체는 M4에서 확장.
import { useState, useEffect, useRef } from 'react'
import Drawer from '@/components/Drawer'
import { sleep } from '@/lib/async'

export default function AiAssistantPanel({ open, onClose, initialQuery }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const bottomRef = useRef(null)
  const askedRef = useRef(null)

  // 패널이 초기 질의와 함께 열리면 자동 질의
  useEffect(() => {
    if (open && initialQuery && askedRef.current !== initialQuery) {
      askedRef.current = initialQuery
      ask(initialQuery)
    }
    if (!open) askedRef.current = null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialQuery])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, pending])

  async function ask(query) {
    const q = query.trim()
    if (!q) return
    setMessages((m) => [...m, { role: 'user', text: q }])
    setInput('')
    setPending(true)
    await sleep(700) // mock RAG
    setMessages((m) => [
      ...m,
      {
        role: 'ai',
        text: `"${q}"에 대한 mock 응답입니다. 관련 규정·업무 데이터를 근거로 요약했습니다.`,
        citations: [
          { label: '직제규정_2024.pdf (p.3)', url: '#' },
          { label: '업무 테이블 · 진행중 12건', url: '/work/table' },
        ],
        confidence: 0.86,
      },
    ])
    setPending(false)
  }

  return (
    <Drawer open={open} onClose={onClose} title="AI 어시스턴트" width="var(--narae-drawer-sm)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-7)', minHeight: '100%' }}>
        {messages.length === 0 && !pending && (
          <p style={{ color: 'var(--color-text-assistive, #6b7280)' }}>
            질문을 입력하면 규정·업무 데이터를 근거로 답변합니다. (mock)
          </p>
        )}
        {messages.map((m, i) => (
          <Bubble key={i} msg={m} />
        ))}
        {pending && <Bubble msg={{ role: 'ai', text: '답변 생성 중…', loading: true }} />}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: 'var(--krds-space-4)', marginTop: 'var(--krds-space-8)' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask(input)}
          placeholder="AI에게 질문…"
          aria-label="AI 질의 입력"
          style={{
            flex: 1, height: 'var(--krds-control-medium)', padding: '0 var(--krds-space-7)',
            borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--color-border-basic, #d1d5db)',
          }}
        />
        <button
          onClick={() => ask(input)}
          disabled={pending || !input.trim()}
          style={{
            height: 'var(--krds-control-medium)', padding: '0 var(--krds-space-8)', border: 'none',
            borderRadius: 'var(--krds-radius-medium)', background: 'var(--narae-accent)', color: '#fff',
            fontWeight: 'var(--krds-weight-bold)', cursor: 'pointer', opacity: pending || !input.trim() ? 0.6 : 1,
          }}
        >
          전송
        </button>
      </div>
    </Drawer>
  )
}

function Bubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
      <div
        style={{
          padding: 'var(--krds-space-6) var(--krds-space-7)',
          borderRadius: 'var(--krds-radius-large)',
          background: isUser ? 'var(--narae-accent)' : 'var(--color-background-alternative, #f1f3f5)',
          color: isUser ? '#fff' : 'var(--color-text-basic)',
          fontStyle: msg.loading ? 'italic' : 'normal',
        }}
      >
        {msg.text}
      </div>
      {msg.citations && (
        <div style={{ marginTop: 'var(--krds-space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-2)' }}>
          {msg.citations.map((c, i) => (
            <a key={i} href={c.url} style={{ fontSize: 'var(--krds-body-small)', color: 'var(--narae-accent)' }}>
              🔗 {c.label}
            </a>
          ))}
          <span style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive, #6b7280)' }}>
            신뢰도 {Math.round(msg.confidence * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
