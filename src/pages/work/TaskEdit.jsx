// SCR-WF-05 — 업무 상세/편집 (4섹션 폼, 화면설계서 p9~11)
// WF05-01 상위과제 · WF05-02 담당자 · WF05-03 주기 · WF05-04 결재선추가 · WF05-05 절차도
// WF05-06 양식업로드 · WF05-07 중요도/보안 · WF05-08 임시저장/등록/목록 · WF05-09 프리필
// FN-WF05-* · 상태 5종
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUiStore } from '@/store/useUiStore'
import { rootOrgs } from '@/mock/orgUnits'
import { projects } from '@/mock/projects'
import { PRIORITY_LEVEL, SECURITY_LEVEL, TASK_TYPE } from '@/lib/codes'
import WorkNav from '@/components/WorkNav'
import Field from '@/components/Field'
import Uploader from '@/components/Uploader'
import Badge from '@/components/Badge'
import { SegToggle } from '@/components/Tabs'
import Button from '@/components/Button'

// WF-04 자동생성 프리필 (taskId=NEW)
const PREFILL = {
  taskNm: '예산 편성 지침 수립', taskType: 'REGULAR', orgUnitId: 'ORG-01', projectId: 'PRJ-2026-001',
  financeYn: true, taskDesc: '2026년도 예산 편성을 위한 부서 지침 수립', priorityLevel: 'NORMAL', securityLevel: 'L2',
}

export default function TaskEdit() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const toast = useUiStore((s) => s.toast)
  const prefill = taskId === 'NEW' ? PREFILL : {}

  const [form, setForm] = useState({
    taskNm: prefill.taskNm ?? '', taskType: prefill.taskType ?? 'REGULAR',
    orgUnitId: prefill.orgUnitId ?? '', projectId: prefill.projectId ?? '',
    financeYn: prefill.financeYn ?? false, taskDesc: prefill.taskDesc ?? '',
    cycleType: 'REGULAR', priorityLevel: prefill.priorityLevel ?? 'NORMAL', securityLevel: prefill.securityLevel ?? 'L2',
    watermark: true, downloadLimit: false,
  })
  const [assignees, setAssignees] = useState(['우선정 이OO'])
  const [assigneeInput, setAssigneeInput] = useState('')
  const [approvalLine, setApprovalLine] = useState([
    { role: '기안', nm: '이OO', title: '과장' }, { role: '리더', nm: '이OO', title: '부장' }, { role: '담당', nm: '박OO', title: '팀장' },
  ])
  const [procedures, setProcedures] = useState([
    { seq: 1, name: '요청의 수정 기한', owner: '주담당', pre: '검증 미요청' },
    { seq: 2, name: '담당자 매칭 / 자격', owner: '중담당', pre: '자격 검증 보고' },
    { seq: 3, name: '공개 및 증명', owner: '주담당', pre: '전자 문서' },
  ])
  const [forms, setForms] = useState([{ name: '업무자서_표준서식.hwp', ver: 'v21' }])

  const patch = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const addAssignee = () => {
    if (!assigneeInput.trim()) return
    setAssignees((a) => [...a, assigneeInput.trim()]); setAssigneeInput('')
  }
  const addApproval = () => setApprovalLine((l) => [...l, { role: '담당', nm: '신규', title: '' }])
  const addProcedure = () => setProcedures((p) => [...p, { seq: p.length + 1, name: '새 단계', owner: '주담당', pre: '' }])

  const submit = (mode) => {
    if (!form.taskNm.trim()) { toast('업무명을 입력하세요', 'warn'); return }
    if (!form.projectId) { toast('상위 과제를 선택하세요', 'warn'); return } // WF05-01 미선택 차단
    if (assignees.length === 0) { toast('담당자를 1명 이상 지정하세요', 'warn'); return }
    if (mode === 'draft') { toast('임시저장되었습니다 (mock)', 'info'); return }
    toast('업무가 등록되었습니다 (mock)', 'ok'); navigate('/work/table')
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <WorkNav />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-9)' }}>
        {/* 상단 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--krds-space-9)', flexWrap: 'wrap', gap: 'var(--krds-space-6)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: 0 }}>
              업무 등록 <span style={{ fontSize: 'var(--krds-body-medium)', color: 'var(--color-text-assistive,#9ca3af)', fontWeight: 'normal' }}>STD-2026-0142</span>
            </h1>
            {taskId === 'NEW' && <Badge variant="primary">자동생성 값 프리필 · HITL 검토</Badge>}
          </div>
          <div style={{ display: 'flex', gap: 'var(--krds-space-4)' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/work/table')}>목록</Button>
            <Button variant="ghost" size="sm" onClick={() => submit('draft')}>임시저장</Button>
            <Button size="md" onClick={() => submit('register')}>등록</Button>
          </div>
        </div>

        {/* ① 기본 정보 */}
        <Section n={1} title="기본 정보">
          <Field label="업무명" required value={form.taskNm} onChange={patch('taskNm')} placeholder="예) 월별 매출 마감 보고" />
          <Grid>
            <Labeled label="업무 구분 *">
              <SegToggle items={[{ key: 'REGULAR', label: TASK_TYPE.REGULAR }, { key: 'ADHOC', label: TASK_TYPE.ADHOC }]} value={form.taskType} onChange={patch('taskType')} />
            </Labeled>
            <Labeled label="소속 부서 *">
              <select value={form.orgUnitId} onChange={(e) => patch('orgUnitId')(e.target.value)} style={select}>
                <option value="">부서 선택</option>
                {rootOrgs().map((o) => <option key={o.orgUnitId} value={o.orgUnitId}>{o.orgUnitNm}</option>)}
              </select>
            </Labeled>
            <Labeled label="상위 과제 * (WF-04 상속)">
              <select value={form.projectId} onChange={(e) => patch('projectId')(e.target.value)} style={select}>
                <option value="">과제 선택</option>
                {projects.map((p) => <option key={p.projectId} value={p.projectId}>{p.projectNm}</option>)}
              </select>
            </Labeled>
            <Labeled label="재정예제">
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-4)', height: 'var(--krds-control-medium)' }}>
                <input type="checkbox" checked={form.financeYn} onChange={(e) => patch('financeYn')(e.target.checked)} /> 재정 관련 업무
              </label>
            </Labeled>
          </Grid>
          <Labeled label="업무 설명">
            <textarea value={form.taskDesc} onChange={(e) => patch('taskDesc')(e.target.value)} placeholder="업무의 목적과 내용을 입력하세요." style={{ ...select, height: 80, padding: 'var(--krds-space-5) var(--krds-space-7)', resize: 'vertical' }} />
          </Labeled>
        </Section>

        {/* ② 담당·주기 */}
        <Section n={2} title="업무 담당·주기">
          <Labeled label="업무 담당 *">
            <div style={{ display: 'flex', gap: 'var(--krds-space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              {assignees.map((a, i) => (
                <span key={i} style={chipStyle}>{a}
                  <button onClick={() => setAssignees((arr) => arr.filter((_, j) => j !== i))} style={chipX}>×</button>
                </span>
              ))}
              <input value={assigneeInput} onChange={(e) => setAssigneeInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addAssignee()}
                placeholder="담당자 검색" style={{ ...select, width: 160, height: 'var(--krds-control-small)' }} />
              <Button variant="ghost" size="sm" onClick={addAssignee}>검색</Button>
            </div>
          </Labeled>
          <Labeled label="업무 주기 *">
            <SegToggle items={[{ key: 'ADHOC', label: '수시' }, { key: 'REGULAR', label: '정기' }]} value={form.cycleType} onChange={patch('cycleType')} />
          </Labeled>
        </Section>

        {/* ③ 전결·절차도 */}
        <Section n={3} title="전결사항·절차도">
          <Labeled label="전결사항 *">
            <div style={{ display: 'flex', gap: 'var(--krds-space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
              {approvalLine.map((a, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {i > 0 && <span style={{ color: 'var(--color-text-assistive,#9ca3af)' }}>→</span>}
                  <span style={approvalCard}><b>{a.role}</b><br />{a.nm}<br /><span style={{ fontSize: 'var(--narae-caption)', color: 'var(--color-text-assistive,#6b7280)' }}>{a.title}</span></span>
                </span>
              ))}
              <Button variant="ghost" size="sm" onClick={addApproval}>+ 결재선 추가</Button>
            </div>
          </Labeled>
          <Labeled label="절차도">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--krds-body-small)' }}>
              <thead><tr>{['순서', '단계명', '담당', '선응'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>
                {procedures.map((p) => (
                  <tr key={p.seq}><td style={td}>{p.seq}</td><td style={td}>{p.name}</td><td style={td}>{p.owner}</td><td style={td}>{p.pre}</td></tr>
                ))}
              </tbody>
            </table>
            <Button variant="ghost" size="sm" onClick={addProcedure} style={{ marginTop: 'var(--krds-space-4)', width: '100%' }}>+ 단계 추가</Button>
          </Labeled>
        </Section>

        {/* ④ 양식·중요도·보안 */}
        <Section n={4} title="양식·중요도·보안">
          <Uploader hint="HWP · DOCX · XLSX · PDF · 최대 20MB" maxMB={20}
            onFiles={(fs) => { setForms((prev) => [...prev, ...fs.map((f) => ({ name: f.name, ver: 'v1' }))]); toast('양식 첨부됨', 'info') }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-3)', margin: 'var(--krds-space-6) 0' }}>
            {forms.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--krds-space-4) var(--krds-space-6)', border: '1px solid var(--color-border-basic,#eef0f2)', borderRadius: 'var(--krds-radius-small)' }}>
                <span>📄 {f.name}</span><span style={{ color: 'var(--color-text-assistive,#9ca3af)' }}>{f.ver}</span>
              </div>
            ))}
          </div>
          <Grid>
            <Labeled label="중요도 *">
              <SegToggle items={Object.entries(PRIORITY_LEVEL).map(([k, l]) => ({ key: k, label: l }))} value={form.priorityLevel} onChange={patch('priorityLevel')} size="sm" />
            </Labeled>
            <Labeled label="보안 등급 *">
              <SegToggle items={Object.entries(SECURITY_LEVEL).map(([k, l]) => ({ key: k, label: l }))} value={form.securityLevel} onChange={patch('securityLevel')} size="sm" />
            </Labeled>
          </Grid>
          <div style={{ display: 'flex', gap: 'var(--krds-space-9)', marginTop: 'var(--krds-space-5)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-4)' }}>
              <input type="checkbox" checked={form.downloadLimit} onChange={(e) => patch('downloadLimit')(e.target.checked)} /> 다운로드 제약
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-4)' }}>
              <input type="checkbox" checked={form.watermark} onChange={(e) => patch('watermark')(e.target.checked)} /> 워터마크
            </label>
          </div>
        </Section>
      </section>
    </div>
  )
}

function Section({ n, title, children }) {
  return (
    <div style={{ marginBottom: 'var(--krds-space-10)', border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 'var(--krds-radius-large)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-4)', padding: 'var(--krds-space-6) var(--krds-space-8)', background: 'var(--color-background-alternative,#f8f9fa)', borderBottom: '1px solid var(--color-border-basic,#e5e7eb)' }}>
        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--narae-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--narae-caption)', fontWeight: 700 }}>{n}</span>
        <b>{title}</b>
      </div>
      <div style={{ padding: 'var(--krds-space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-7)' }}>{children}</div>
    </div>
  )
}
function Grid({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--krds-space-7)' }}>{children}</div> }
function Labeled({ label, children }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-3)' }}><span style={{ fontSize: 'var(--krds-body-medium)', fontWeight: 'var(--krds-weight-medium)' }}>{label}</span>{children}</div>
}

const select = { width: '100%', height: 'var(--krds-control-medium)', padding: '0 var(--krds-space-7)', borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--color-border-basic, #d1d5db)', background: 'var(--color-background-white)' }
const chipStyle = { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px var(--krds-space-5)', borderRadius: 'var(--krds-radius-pill)', background: 'color-mix(in srgb, var(--narae-accent) 12%, transparent)', color: 'var(--narae-accent)', fontSize: 'var(--krds-body-small)' }
const chipX = { border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--narae-accent)' }
const approvalCard = { display: 'inline-block', padding: 'var(--krds-space-4) var(--krds-space-6)', border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 'var(--krds-radius-medium)', textAlign: 'center', fontSize: 'var(--krds-body-small)' }
const th = { textAlign: 'left', padding: 'var(--krds-space-4) var(--krds-space-5)', background: 'var(--color-background-alternative,#f8f9fa)', borderBottom: '1px solid var(--color-border-basic,#e5e7eb)', color: 'var(--color-text-assistive,#6b7280)' }
const td = { padding: 'var(--krds-space-4) var(--krds-space-5)', borderBottom: '1px solid var(--color-border-basic,#eef0f2)' }