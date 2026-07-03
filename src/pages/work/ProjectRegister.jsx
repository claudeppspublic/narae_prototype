// SCR-WF-04 — 과제 등록 (멀티스텝: 계획서 업로드→AI분석→기본정보 프리필→업무 확정)
// 피드백: 문서를 먼저 올려 분석한 뒤 기본값을 입력하는 순서로 반전
// WF04-02 계획서 업로드 · WF04-03 AI 분석 · WF04-04 제출→WF-05 · FN-WF04-* · 상태 5종
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sleep } from '@/lib/async'
import { rootOrgs } from '@/mock/orgUnits'
import { goals } from '@/mock/goals'
import { useUiStore } from '@/store/useUiStore'
import { PROJECT_TYPE } from '@/lib/codes'
import WorkNav from '@/components/WorkNav'
import Stepper from '@/components/Stepper'
import Field from '@/components/Field'
import Uploader from '@/components/Uploader'
import { SegToggle } from '@/components/Tabs'
import Badge from '@/components/Badge'
import Button from '@/components/Button'

const STEPS = ['계획서 분석', '기본 정보', '업무 확정']

export default function ProjectRegister() {
  const navigate = useNavigate()
  const toast = useUiStore((s) => s.toast)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ projectNm: '', projectType: 'GENERAL', orgUnitId: '', goalId: '' })
  const [errors, setErrors] = useState({})
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeStatus, setAnalyzeStatus] = useState(null)
  const [draftTasks, setDraftTasks] = useState([])

  const patch = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  // Step 0: 계획서 업로드 시 자동 분석 → 완료 후 자동으로 기본정보(프리필) 단계로
  const onUpload = async (files) => {
    const f = files[0]
    setFile(f)
    setAnalyzing(true)
    for (const s of ['CLASSIFYING', 'MODEL_GENERATING', 'RESPONSE_RETURNED']) {
      setAnalyzeStatus(s); await sleep(600)
    }
    // 분석 결과: 업무 초안 + 기본정보 프리필
    setDraftTasks([
      { id: 'D1', taskNm: '예산 편성 지침 수립', taskType: 'REGULAR', confidence: 92, source: 'AI 추출' },
      { id: 'D2', taskNm: '부서별 요구안 취합', taskType: 'REGULAR', confidence: 88, source: 'AI 추출' },
      { id: 'D3', taskNm: '재정집행 점검 계획', taskType: 'ADHOC', confidence: 76, source: 'AI 추출' },
    ])
    setForm((prev) => ({ ...prev, projectNm: prev.projectNm || '2026년도 예산 편성·집행 관리', orgUnitId: prev.orgUnitId || 'ORG-01' }))
    setAnalyzing(false)
    setStep(1) // 자동 전환
    toast('계획서 분석 완료 · 기본 정보가 자동 입력되었습니다', 'ok')
  }

  const next1 = () => {
    const e = {}
    if (!form.projectNm.trim()) e.projectNm = '과제명을 입력하세요.'
    if (!form.orgUnitId) e.orgUnitId = '소속 부서를 선택하세요.'
    setErrors(e)
    if (Object.keys(e).length) return
    setStep(2)
  }

  const submit = () => {
    toast('과제가 생성되었습니다. 자동생성 업무를 검토·확정하세요 (HITL)', 'ok')
    navigate('/work/tasks/NEW/edit')
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <WorkNav />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-10)', maxWidth: 860 }}>
        <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-8)' }}>과제 등록</h1>

        {/* Stepper */}
        <Stepper steps={STEPS} current={step} style={{ gap: 'var(--krds-space-4)', marginBottom: 'var(--krds-space-10)' }} />

        {/* Step 0: 계획서 업로드 → 자동 분석 */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-8)' }}>
            <p style={{ color: 'var(--color-text-assistive,#6b7280)' }}>
              과제 계획서를 업로드하면 AI가 자동 분석하여 업무·기본정보를 추출합니다. 분석 후 다음 단계로 자동 이동합니다.
            </p>
            <Uploader hint="HWP · HWPX · DOCX · PDF · 최대 50MB" maxMB={50} onFiles={onUpload} />
            {file && <div style={{ padding: 'var(--krds-space-6)', border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 'var(--krds-radius-medium)' }}>📄 {file.name}</div>}
            {analyzing && (
              <div style={{ padding: 'var(--krds-space-9)', textAlign: 'center', color: 'var(--narae-accent)', fontWeight: 'var(--krds-weight-medium)' }}>
                🔎 AI 분석 중… {{ CLASSIFYING: '문서 분류', MODEL_GENERATING: '업무 추출', RESPONSE_RETURNED: '결과 정리' }[analyzeStatus]}
              </div>
            )}
          </div>
        )}

        {/* Step 1: 기본 정보 (분석 프리필) */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-8)' }}>
            <Badge variant="primary">계획서 분석 결과가 자동 입력되었습니다 · 확인·수정하세요</Badge>
            <Field label="과제명" required value={form.projectNm} onChange={patch('projectNm')} placeholder="예) 행정시스템 통합" error={errors.projectNm} />
            <div>
              <span style={fieldLabel}>과제 유형</span>
              <div style={{ marginTop: 'var(--krds-space-4)' }}>
                <SegToggle items={[{ key: 'GENERAL', label: PROJECT_TYPE.GENERAL }, { key: 'DEPT_REGULAR', label: PROJECT_TYPE.DEPT_REGULAR }]}
                  value={form.projectType} onChange={patch('projectType')} />
              </div>
            </div>
            <div>
              <span style={fieldLabel}>소속 부서 *</span>
              <select value={form.orgUnitId} onChange={(e) => patch('orgUnitId')(e.target.value)} style={{ ...select, marginTop: 'var(--krds-space-4)', borderColor: errors.orgUnitId ? 'var(--narae-status-risk)' : undefined }}>
                <option value="">부서 선택</option>
                {rootOrgs().map((o) => <option key={o.orgUnitId} value={o.orgUnitId}>{o.orgUnitNm}</option>)}
              </select>
              {errors.orgUnitId && <p style={{ color: 'var(--narae-status-risk)', fontSize: 'var(--krds-body-small)', marginTop: 4 }}>{errors.orgUnitId}</p>}
            </div>
            <div>
              <span style={fieldLabel}>목표 연계 (선택)</span>
              <select value={form.goalId} onChange={(e) => patch('goalId')(e.target.value)} style={{ ...select, marginTop: 'var(--krds-space-4)' }}>
                <option value="">연계 안 함</option>
                {goals.map((g) => <option key={g.goalId} value={g.goalId}>{g.objective}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="ghost" size="sm" onClick={() => setStep(0)}>이전</Button>
              <Button size="md" onClick={next1}>다음</Button>
            </div>
          </div>
        )}

        {/* Step 2: 업무 확정 */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-7)' }}>
            <p style={{ color: 'var(--color-text-assistive,#6b7280)' }}>자동생성된 업무 초안입니다. 확정 후 업무 상세/편집에서 HITL 검토합니다.</p>
            {draftTasks.map((t) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--krds-space-5)', padding: 'var(--krds-space-6)', border: '1px solid var(--color-border-basic,#e5e7eb)', borderRadius: 'var(--krds-radius-medium)' }}>
                <span style={{ flex: 1, fontWeight: 'var(--krds-weight-medium)' }}>{t.taskNm}</span>
                <Badge variant="neutral">{t.taskType === 'REGULAR' ? '정기' : '수시'}</Badge>
                <Badge variant="primary">{t.source}</Badge>
                {/* [CONFIRM: BI 임계값(정책 §8) 확정 전 — 수치 기반 색 자동 결정 금지(§7)로 무채색 처리] */}
                {t.confidence && <span style={{ fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive)' }}>신뢰도 {t.confidence}%</span>}
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--krds-space-6)' }}>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>이전</Button>
              <Button size="md" onClick={submit}>과제 등록 · 업무 편집으로</Button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

const fieldLabel = { fontSize: 'var(--krds-body-medium)', fontWeight: 'var(--krds-weight-medium)' }
const select = { width: '100%', height: 'var(--krds-control-medium)', padding: '0 var(--krds-space-7)', borderRadius: 'var(--krds-radius-medium)', border: '1px solid var(--color-border-basic, #d1d5db)', background: 'var(--color-background-white)' }