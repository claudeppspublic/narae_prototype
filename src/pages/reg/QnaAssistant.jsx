// SCR-AI-03 — QnA (AI 어시스턴트)
// AI03-01 질의 입력/전송→mock RAG+출처·신뢰도 · AI03-02 모델 선택(망분리 C→외부 비활성)
// AI03-03 출처 클릭→원문 이동 · AI03-04 새 채팅 · 피드백: 채팅목록 LNB + 입력창 +버튼(도구)
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ragAnswer, AI_MODELS } from '@/mock/ai'
import { useUiStore } from '@/store/useUiStore'
import Button from '@/components/Button'

// mock 이전 채팅 세션 (LNB)
const SESSIONS = [
  { id: 's1', title: '직제규정 문의', when: '오늘' },
  { id: 's2', title: '진행중 업무 현황', when: '어제' },
  { id: 's3', title: '재정집행 지침 요약', when: '3일 전' },
]
const TOOLS = ['문서 검색', '규정 검색', '업무 평가', '파일 첨부']

export default function QnaAssistant() {
  const navigate = useNavigate()
  const toast = useUiStore((s) => s.toast)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [model, setModel] = useState('onprem')
  const [pending, setPending] = useState(false)
  const [activeSession, setActiveSession] = useState(null)
  const [toolMenu, setToolMenu] = useState(false)
  const bottomRef = useRef(null)
  const toolRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, pending])
  useEffect(() => {
    const onDoc = (e) => { if (toolRef.current && !toolRef.current.contains(e.target)) setToolMenu(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  // 답변 요청 — 실패 시 대화 영역에 인라인 에러 행(role:'error') 추가 (상태 5종: 에러)
  const requestAnswer = async (q) => {
    setPending(true)
    try {
      const res = await ragAnswer(q, { model })
      setMessages((m) => [...m, { role: 'ai', ...res }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'error', question: q, text: err?.message }])
    } finally {
      setPending(false)
    }
  }

  const ask = async () => {
    const q = input.trim()
    if (!q || pending) return
    setMessages((m) => [...m, { role: 'user', text: q }])
    setInput('')
    await requestAnswer(q)
  }

  // 다시 시도 — 에러 행을 제거하고 같은 질문을 재요청
  const retry = async (index, q) => {
    if (pending) return
    setMessages((m) => m.filter((_, i) => i !== index))
    await requestAnswer(q)
  }

  const newChat = () => { setMessages([]); setInput(''); setActiveSession(null) }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      {/* 좌측 채팅 목록 LNB (피드백) */}
      <aside style={lnb}>
        <Button size="sm" onClick={newChat} style={{ width: '100%', marginBottom: 'var(--krds-space-6)' }}>+ 새 채팅</Button>
        <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)', margin: '0 0 var(--krds-space-4)' }}>최근 대화</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-2)' }}>
          {SESSIONS.map((s) => (
            <button key={s.id} onClick={() => { setActiveSession(s.id); toast(`'${s.title}' 대화를 불러왔습니다 (mock)`, 'info') }}
              style={{ ...sessionItem, ...(activeSession === s.id ? sessionActive : {}) }}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>💬 {s.title}</div>
              <div style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#9ca3af)' }}>{s.when}</div>
            </button>
          ))}
        </div>
      </aside>

      {/* 채팅 본문 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={topBar}>
          <h1 style={{ fontWeight: 'var(--krds-weight-bold)', margin: 0, fontSize: 'var(--krds-body-medium)' }}>AI 어시스턴트 (QnA)</h1>
          <select value={model} onChange={(e) => setModel(e.target.value)} aria-label="모델 선택" style={select}>
            {Object.entries(AI_MODELS).map(([key, label]) => (
              <option key={key} value={key} disabled={key === 'premium'}>
                {label}{key === 'premium' ? ' (망분리 제한)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={chatArea}>
          {messages.length === 0 && !pending && (
            <div style={{ textAlign: 'center', color: 'var(--color-text-assistive,#9ca3af)', marginTop: 'var(--krds-space-14)' }}>
              <div style={{ fontSize: '2rem' }} aria-hidden>💬</div>
              <p style={{ marginTop: 'var(--krds-space-5)' }}>규정·업무에 대해 무엇이든 물어보세요. (mock RAG)</p>
              <div style={{ display: 'flex', gap: 'var(--krds-space-4)', justifyContent: 'center', marginTop: 'var(--krds-space-8)', flexWrap: 'wrap' }}>
                {['직제규정 알려줘', '진행중인 업무는?', '재정집행 지침 요약'].map((s) => (
                  <button key={s} onClick={() => setInput(s)} style={suggestion}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            m.role === 'error'
              ? <ErrorBubble key={i} msg={m} onRetry={() => retry(i, m.question)} />
              : <Bubble key={i} msg={m} navigate={navigate} />
          ))}
          {pending && <Bubble msg={{ role: 'ai', text: '답변 생성 중…', loading: true }} navigate={navigate} />}
          <div ref={bottomRef} />
        </div>

        {/* 입력: + 도구 버튼 + 입력 + 전송 */}
        <div style={inputBar}>
          <div ref={toolRef} style={{ position: 'relative' }}>
            <button onClick={() => setToolMenu((v) => !v)} aria-label="도구 추가" title="도구 추가" style={plusBtn}>＋</button>
            {toolMenu && (
              <div style={toolMenuBox}>
                {TOOLS.map((t) => (
                  <button key={t} onClick={() => { setToolMenu(false); toast(`'${t}' 도구를 추가했습니다 (mock)`, 'info') }} style={toolMenuItem}>{t}</button>
                ))}
              </div>
            )}
          </div>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask()}
            placeholder="질문을 입력하세요…" aria-label="질의 입력" style={textInput} />
          <Button size="md" onClick={ask} disabled={pending || !input.trim()}
            style={{ borderRadius: 'var(--krds-radius-pill)' }}>전송</Button>
        </div>
      </div>
    </div>
  )
}

// 답변 실패 시 인라인 에러 버블 — 같은 질문 재시도 버튼 포함
function ErrorBubble({ msg, onRetry }) {
  return (
    <div role="alert" style={{ display: 'flex', justifyContent: 'flex-start', margin: 'var(--krds-space-5) 0' }}>
      <div style={{
        maxWidth: '70%', padding: 'var(--krds-space-6) var(--krds-space-7)',
        borderRadius: 'var(--krds-radius-large)',
        border: '1px solid var(--color-risk-border)',
        background: 'var(--color-risk-bg)',
      }}>
        <p style={{ margin: 0, fontWeight: 'var(--krds-weight-bold)', color: 'var(--color-risk-text)' }}>
          ⚠️ 답변을 생성하지 못했습니다
        </p>
        <p style={{ margin: 'var(--krds-space-2) 0 0', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>
          {msg.text ?? '알 수 없는 오류'}
        </p>
        <Button variant="ghost" size="sm" onClick={onRetry} style={{ marginTop: 'var(--krds-space-5)' }}>다시 시도</Button>
      </div>
    </div>
  )
}

function Bubble({ msg, navigate }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', margin: 'var(--krds-space-5) 0' }}>
      <div style={{ maxWidth: '70%' }}>
        <div style={{
          padding: 'var(--krds-space-6) var(--krds-space-7)', borderRadius: 'var(--krds-radius-large)',
          background: isUser ? 'var(--narae-accent)' : 'var(--color-background-alternative, #f1f3f5)',
          color: isUser ? '#fff' : 'var(--color-text-basic)', fontStyle: msg.loading ? 'italic' : 'normal', lineHeight: 1.6,
        }}>
          {msg.text ?? msg.answer}
        </div>
        {msg.citations && (
          <div style={{ marginTop: 'var(--krds-space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-2)' }}>
            {msg.citations.map((c, i) => (
              <button key={i} onClick={() => c.to && navigate(c.to)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', color: 'var(--narae-accent)', fontSize: 'var(--krds-body-small)', padding: 0 }}>
                🔗 {c.label}
              </button>
            ))}
            <span style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>신뢰도 {Math.round(msg.confidence * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

const lnb = { width: '15rem', flexShrink: 0, borderRight: '1px solid var(--color-border-basic, #e5e7eb)', padding: 'var(--krds-space-8) var(--krds-space-6)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }
const sessionItem = { display: 'block', width: '100%', textAlign: 'left', padding: 'var(--krds-space-5) var(--krds-space-6)', border: 'none', background: 'transparent', borderRadius: 'var(--krds-radius-medium)', cursor: 'pointer', color: 'var(--color-text-basic)' }
const sessionActive = { background: 'color-mix(in srgb, var(--narae-accent) 10%, transparent)' }
const topBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--krds-space-6) var(--krds-space-9)', borderBottom: '1px solid var(--color-border-basic, #e5e7eb)' }
const chatArea = { flex: 1, overflowY: 'auto', padding: 'var(--krds-space-9) 12%', minHeight: 0 }
const inputBar = { display: 'flex', gap: 'var(--krds-space-4)', alignItems: 'center', padding: 'var(--krds-space-7) 12%', borderTop: '1px solid var(--color-border-basic, #e5e7eb)' }
const textInput = { flex: 1, height: 'var(--krds-control-medium)', padding: '0 var(--krds-space-7)', borderRadius: 'var(--krds-radius-pill)', border: '1px solid var(--color-border-basic, #d1d5db)' }
const plusBtn = { width: 'var(--krds-control-medium)', height: 'var(--krds-control-medium)', borderRadius: '50%', border: '1px solid var(--color-border-basic, #d1d5db)', background: 'var(--color-background-white)', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--narae-accent)' }
const toolMenuBox = { position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, minWidth: '9rem', background: 'var(--color-background-white)', borderRadius: 'var(--krds-radius-medium)', boxShadow: 'var(--krds-shadow-2)', border: '1px solid var(--color-border-basic, #eef0f2)', padding: 'var(--krds-space-3)', zIndex: 10 }
const toolMenuItem = { display: 'block', width: '100%', textAlign: 'left', padding: 'var(--krds-space-4) var(--krds-space-5)', border: 'none', background: 'transparent', borderRadius: 'var(--krds-radius-small)', cursor: 'pointer', fontSize: 'var(--krds-body-small)' }
const select = { height: 'var(--krds-control-xsmall)', padding: '0 var(--krds-space-5)', borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--color-border-basic, #e5e7eb)', background: 'var(--color-background-white)' }
const suggestion = { padding: 'var(--krds-space-4) var(--krds-space-7)', borderRadius: 'var(--krds-radius-pill)', border: '1px solid var(--color-border-basic, #e5e7eb)', background: 'var(--color-background-white)', cursor: 'pointer', fontSize: 'var(--krds-body-small)' }
