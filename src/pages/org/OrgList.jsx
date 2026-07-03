// SCR-WS-01 — 조직도 · 리스트뷰
// WS01-01 리스트/조직도뷰 토글 · WS01-02 검색 · WS01-03 실/관 접기 · WS01-04 과 선택→상세
// WS01-05 팀원구성/연계과제 탭 · WS01-06 연계과제 항목(읽기전용)
// FN-WS01-1~3 · 상태 5종(초기/로딩/데이터/빈/에러)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/mock'
import { findOrg, childrenOf } from '@/mock/orgUnits'
import { usersOf } from '@/mock/users'
import { projectsInOrg } from '@/mock/projects'
import { useAsync } from '@/lib/useAsync'
import { EMPLOYMENT_STATUS, ORG_LEVEL } from '@/lib/codes'
import OrgTree from '@/components/OrgTree'
import Tabs from '@/components/Tabs'
import { SegToggle } from '@/components/Tabs'
import Card from '@/components/Card'
import Badge, { StatusBadge } from '@/components/Badge'
import { Spinner, ErrorState, EmptyState } from '@/components/StateViews'

const LEVEL_LABEL = { [ORG_LEVEL.OFFICE]: '실', [ORG_LEVEL.BUREAU]: '관', [ORG_LEVEL.DIVISION]: '과' }

// 조직 경로(breadcrumb)
function breadcrumb(orgUnitId) {
  const chain = []
  let cur = orgUnitId
  while (cur) { const o = findOrg(cur); if (!o) break; chain.unshift(o); cur = o.parentId }
  return chain
}

export default function OrgList() {
  const navigate = useNavigate()
  const { loading, error, reload } = useAsync(() => api.getOrgTree({ delay: 400 }), [])
  const [keyword, setKeyword] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [tab, setTab] = useState('members')

  const selected = selectedId ? findOrg(selectedId) : null

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      {/* 좌측 조직 트리 */}
      <aside style={leftPane}>
        <div style={{ display: 'flex', gap: 'var(--krds-space-4)', marginBottom: 'var(--krds-space-6)' }}>
          <SegToggle items={[{ key: 'list', label: '리스트뷰' }, { key: 'chart', label: '조직도뷰' }]}
            value="list" onChange={(v) => v === 'chart' && navigate('/org/chart')} size="sm" />
        </div>
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)}
          placeholder="실·관·과 검색" aria-label="조직 검색" style={searchInput} />
        <p style={{ fontSize: 'var(--krds-body-small)', color: 'var(--narae-accent)', fontWeight: 'var(--krds-weight-bold)', margin: 'var(--krds-space-6) 0' }}>
          5개 실 · 114명
        </p>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading ? <Spinner label="조직 불러오는 중…" />
            : error ? <ErrorState error={error} onRetry={reload} />
            : <OrgTree selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setTab('members') }} keyword={keyword} />}
        </div>
      </aside>

      {/* 우측 상세 */}
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)' }}>
        {!selected ? (
          <EmptyState icon="🏢" title="조직을 선택하세요" description="좌측 트리에서 실·관·과를 선택하면 상세가 표시됩니다." />
        ) : (
          <OrgDetail org={selected} tab={tab} setTab={setTab} navigate={navigate} />
        )}
      </section>
    </div>
  )
}

function OrgDetail({ org, tab, setTab }) {
  const crumbs = breadcrumb(org.orgUnitId)
  const subOrgs = childrenOf(org.orgUnitId)
  const members = usersOf(org.orgUnitId).filter((u) => u.employmentStatus !== 'RESIGNED') // 퇴직 미표시
  const linked = projectsInOrg(org.orgUnitId)

  return (
    <div>
      <Badge variant="neutral">총 {org.empCount}명</Badge>
      <h1 style={{ margin: 'var(--krds-space-4) 0 var(--krds-space-3)', fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)' }}>
        {org.orgUnitNm}
      </h1>
      <nav style={{ display: 'flex', gap: 'var(--krds-space-3)', color: 'var(--color-text-assistive,#6b7280)', fontSize: 'var(--krds-body-small)', marginBottom: 'var(--krds-space-9)' }}>
        {crumbs.map((c, i) => (
          <span key={c.orgUnitId}>{i > 0 && '› '}{c.orgUnitNm}</span>
        ))}
      </nav>

      <Tabs
        items={[
          { key: 'members', label: '팀원 구성' },
          { key: 'projects', label: '연계 과제', count: linked.length },
        ]}
        value={tab} onChange={setTab}
      />

      <div style={{ marginTop: 'var(--krds-space-9)' }}>
        {tab === 'members' ? (
          <MembersTab org={org} subOrgs={subOrgs} members={members} linkedCount={linked.length} />
        ) : (
          <ProjectsTab linked={linked} />
        )}
      </div>
    </div>
  )
}

function MembersTab({ org, subOrgs, members, linkedCount }) {
  if (subOrgs.length > 0) {
    // 하위 조직(관/과) 카드
    return (
      <>
        <p style={summaryLine}>
          <b>{subOrgs.length}개</b> {LEVEL_LABEL[subOrgs[0].level]} · <b>{org.empCount}명</b> · 연계과제 {linkedCount}건
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-5)' }}>
          {subOrgs.map((s) => {
            const chief = usersOf(s.orgUnitId).find((u) => u.position === '과장' || u.position === '실장' || u.position?.includes('장'))
            return (
              <Card key={s.orgUnitId} hoverable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'var(--krds-weight-bold)' }}>{s.orgUnitNm}</div>
                    {chief && <div style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>{chief.position} · {chief.empNm}</div>}
                  </div>
                  <Badge variant="neutral">총 {s.empCount}명</Badge>
                </div>
              </Card>
            )
          })}
        </div>
      </>
    )
  }

  // 말단 과 → 인원 목록 (휴직 회색)
  if (members.length === 0) return <EmptyState title="소속 인원이 없습니다" />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-4)' }}>
      {members.map((m) => {
        const onLeave = m.employmentStatus === 'ON_LEAVE'
        return (
          <Card key={m.empNo} style={onLeave ? { opacity: 0.55 } : undefined}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 'var(--krds-weight-medium)' }}>{m.empNm}</span>
                <span style={{ marginLeft: 'var(--krds-space-5)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>{m.position}</span>
              </div>
              {onLeave && <Badge variant="warn">{EMPLOYMENT_STATUS.ON_LEAVE}</Badge>}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function ProjectsTab({ linked }) {
  const [openId, setOpenId] = useState(null)
  if (linked.length === 0) {
    return <EmptyState icon="📁" title="연계된 과제가 없습니다" description="이 조직에 연계된 과제가 아직 없습니다." />
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-5)' }}>
      {linked.map((p) => (
        <Card key={p.projectId} hoverable onClick={() => setOpenId((v) => (v === p.projectId ? null : p.projectId))}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 'var(--krds-weight-bold)' }}>{p.projectNm}</div>
            <StatusBadge status={p.status} />
          </div>
          {openId === p.projectId && (
            <dl style={readonlyGrid}>
              <Field k="과제 ID" v={p.projectId} />
              <Field k="담당자" v={p.ownerUserNm} />
              <Field k="기간" v={`${p.startAt} ~ ${p.endAt}`} />
              <Field k="진척률" v={`${p.progress}%`} />
            </dl>
          )}
        </Card>
      ))}
      <p style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#9ca3af)' }}>
        * 연계 과제는 읽기 전용입니다. (별도 과제 상세 화면 없음)
      </p>
    </div>
  )
}

function Field({ k, v }) {
  return (
    <div>
      <dt style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>{k}</dt>
      <dd style={{ margin: 0, fontWeight: 'var(--krds-weight-medium)' }}>{v}</dd>
    </div>
  )
}

const leftPane = {
  width: '26rem', flexShrink: 0, borderRight: '1px solid var(--color-border-basic, #e5e7eb)',
  padding: 'var(--krds-space-8)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
}
const searchInput = {
  height: 'var(--krds-control-small)', padding: '0 var(--krds-space-7)',
  borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--color-border-basic, #e5e7eb)',
  background: 'var(--color-background-white)',
}
const summaryLine = { marginBottom: 'var(--krds-space-7)', color: 'var(--color-text-basic)' }
const readonlyGrid = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--krds-space-6)',
  marginTop: 'var(--krds-space-7)', paddingTop: 'var(--krds-space-7)',
  borderTop: '1px solid var(--color-border-basic, #eef0f2)',
}
