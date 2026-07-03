// SCR-DO-01 — 회의록 (생성·목록·상세) · 홈 '회의록' 도구/직접 진입
// DO01-01 녹음/업로드 · DO01-02 전사 편집 · DO01-03 액션아이템 승인→과제(WF-04)
// DO01-04 목록 행→상세 · FN-DO01-* · 상태 5종
import { useState } from 'react'
import { api } from '@/mock'
import { useAsync } from '@/lib/useAsync'
import { useUiStore } from '@/store/useUiStore'
import Tabs from '@/components/Tabs'
import Badge from '@/components/Badge'
import Uploader from '@/components/Uploader'
import { AsyncView, EmptyState } from '@/components/StateViews'
import Button from '@/components/Button'

export default function Meeting() {
  const toast = useUiStore((s) => s.toast)
  const { data: meetings, loading, error, reload } = useAsync(() => api.getMeetings({ delay: 400 }), [])
  const [selId, setSelId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [tab, setTab] = useState('summary')
  const [approved, setApproved] = useState(() => new Set())

  const selected = (meetings ?? []).find((m) => m.meetingId === selId) ?? null

  const approveAction = (itemId) => {
    setApproved((s) => new Set(s).add(itemId))
    toast('액션아이템이 과제로 생성되었습니다 (WF-04, mock)', 'ok')
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      {/* 좌측 목록 */}
      <aside style={leftPane}>
        <Button size="sm" onClick={() => { setCreating(true); setSelId(null) }} style={{ width: '100%', marginBottom: 'var(--krds-space-6)' }}>+ 새 회의록</Button>
        <AsyncView loading={loading} error={error} data={meetings} reload={reload}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-3)' }}>
            {(meetings ?? []).map((m) => (
              <button key={m.meetingId} onClick={() => { setSelId(m.meetingId); setCreating(false); setTab('summary') }}
                style={{ ...listItem, ...(selId === m.meetingId ? listActive : {}) }}>
                <div style={{ fontWeight: 'var(--krds-weight-medium)' }}>{m.meetingNm}</div>
                <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>{m.date} · 참석 {m.participants.length}명</div>
              </button>
            ))}
          </div>
        </AsyncView>
      </aside>

      {/* 우측 상세/생성 */}
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)' }}>
        {creating ? (
          <div style={{ maxWidth: 640 }}>
            <h1 style={h1}>회의록 생성 등록</h1>
            <p style={{ color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-8)' }}>녹음 파일을 업로드하면 STT 전사·요약을 생성합니다 (mock).</p>
            <Uploader hint="MP3 · WAV · M4A · 최대 200MB" maxMB={200}
              onFiles={(fs) => { toast(`${fs[0].name} 업로드 · STT 전사 시작 (mock)`, 'info'); setCreating(false) }} />
          </div>
        ) : !selected ? (
          <EmptyState icon="🎙" title="회의록을 선택하세요" description="좌측 목록에서 회의록을 선택하거나 새로 생성하세요." />
        ) : (
          <div>
            <h1 style={h1}>{selected.meetingNm}</h1>
            <p style={{ color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-8)' }}>
              {selected.date} · 참석 {selected.participants.join(', ')}
            </p>
            <Tabs items={[{ key: 'summary', label: '요약' }, { key: 'transcript', label: '전사' }, { key: 'actions', label: '액션아이템', count: selected.actionItems.length }]}
              value={tab} onChange={setTab} />
            <div style={{ marginTop: 'var(--krds-space-8)' }}>
              {tab === 'summary' && <p style={{ lineHeight: 1.7 }}>{selected.summaryText}</p>}
              {tab === 'transcript' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-5)' }}>
                  {selected.transcript.map((t, i) => (
                    <div key={i} style={{ display: 'flex', gap: 'var(--krds-space-6)' }}>
                      <Badge variant="neutral">{t.speaker}</Badge>
                      <span style={{ flex: 1 }}>{t.text}</span>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'actions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-5)' }}>
                  {selected.actionItems.map((a) => {
                    const done = approved.has(a.itemId) || a.approved
                    return (
                      <div key={a.itemId} style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-6)', padding: 'var(--krds-space-6)', border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 'var(--krds-radius-medium)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'var(--krds-weight-medium)' }}>{a.text}</div>
                          <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>{a.assigneeNm} · {a.due}</div>
                        </div>
                        {done ? <Badge variant="ok">과제 생성됨</Badge>
                          : <Button size="sm" onClick={() => approveAction(a.itemId)}>승인 · 과제화</Button>}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

const leftPane = { width: '20rem', flexShrink: 0, borderRight: '1px solid var(--color-border-basic, #e5e7eb)', padding: 'var(--krds-space-8)', overflowY: 'auto' }
const listItem = { display: 'block', width: '100%', textAlign: 'left', padding: 'var(--krds-space-6)', border: '1px solid var(--color-border-basic,#eef0f2)', borderRadius: 'var(--krds-radius-medium)', background: 'var(--color-background-white)', cursor: 'pointer' }
const listActive = { borderColor: 'var(--narae-accent)', background: 'color-mix(in srgb, var(--narae-accent) 8%, transparent)' }
const h1 = { fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-4)' }
