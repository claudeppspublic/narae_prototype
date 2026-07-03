// SCR-AD-02 — 사무분장 태그 관리 (담당자 추천 근거 키워드) · FN-AD02-1 · ADMIN
import { useState, useMemo } from 'react'
import { useRoleStore } from '@/store/useRoleStore'
import { useUiStore } from '@/store/useUiStore'
import { users } from '@/mock/users'
import SideNav, { ADMIN_ITEMS } from '@/components/SideNav'
import AdminGate from '@/components/AdminGate'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import FilterChip from '@/components/FilterChip'
import { EmptyState } from '@/components/StateViews'

export default function JobTags() {
  const role = useRoleStore((s) => s.role)
  const toast = useUiStore((s) => s.toast)
  const seed = useMemo(() => Array.from(new Set(users.flatMap((u) => u.jobTags))), [])
  const [tags, setTags] = useState(seed)
  const [input, setInput] = useState('')

  if (role !== 'ROLE_ADMIN') return <AdminGate />

  const add = () => {
    const t = input.trim()
    if (!t || tags.includes(t)) return
    setTags((a) => [...a, t]); setInput(''); toast(`태그 '${t}' 추가됨 (mock)`, 'ok')
  }
  const remove = (t) => { setTags((a) => a.filter((x) => x !== t)); toast(`태그 '${t}' 삭제됨 (mock)`, 'info') }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <SideNav items={ADMIN_ITEMS} title="관리자" />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)', maxWidth: 760 }}>
        <h1 style={h1}>사무분장 태그 관리</h1>
        <p style={sub}>담당자 업무영역 키워드입니다. AI 담당자 추천의 근거로 사용됩니다.</p>

        <div style={{ display: 'flex', gap: 'var(--krds-space-4)', marginBottom: 'var(--krds-space-8)' }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="새 태그 입력" style={input_} />
          <Button size="md" onClick={add}>추가</Button>
        </div>

        {tags.length === 0 ? (
          <EmptyState icon="🏷️" title="등록된 태그가 없습니다" description="위 입력창에서 새 태그를 추가하세요." />
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--krds-space-4)' }}>
            {tags.map((t) => (
              <FilterChip key={t} label={t} onRemove={() => remove(t)} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

const h1 = { fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-4)' }
const sub = { color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-8)' }
const input_ = { flex: 1, height: 'var(--krds-control-medium)', padding: '0 var(--krds-space-7)', borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--color-border-basic, #d1d5db)' }
