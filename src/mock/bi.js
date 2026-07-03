// BI 산출 — 홈(CM-03) 목표관리 BI Drawer (FN-CM03-5).
// 단위별(조직/실무자/업무) 지표 + 상황요약 텍스트.
// [CONFIRM] 지표·산출식은 기획확인 대상 → 아래는 mock 시드 기반 합리적 산출.
import { orgUnits, childrenOf } from './orgUnits'
import { usersOf } from './users'
import { tasks as allTasks, findTask, tasksByAssignee } from './tasks'
import { goalsForTask } from './goals'
import { TASK_STATUS } from '@/lib/codes'

// 조직(및 모든 하위 조직) 소속 사용자의 업무 집계
function orgUnitDescendants(orgUnitId) {
  const acc = [orgUnitId]
  for (const c of childrenOf(orgUnitId)) acc.push(...orgUnitDescendants(c.orgUnitId))
  return acc
}
function tasksInOrg(orgUnitId) {
  const orgIds = new Set(orgUnitDescendants(orgUnitId))
  const empNos = new Set()
  orgUnits.filter((o) => orgIds.has(o.orgUnitId)).forEach((o) => usersOf(o.orgUnitId).forEach((u) => empNos.add(u.empNo)))
  return allTasks.filter((t) => empNos.has(t.assigneeId))
}

function aggregate(tasks) {
  const total = tasks.length
  const dist = { PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0, ON_HOLD: 0, DELAYED: 0 }
  tasks.forEach((t) => { dist[t.status] = (dist[t.status] ?? 0) + 1 })
  const delayed = tasks.filter((t) => t.status === 'DELAYED' || t.riskGrade === 'RISK').length
  const completed = dist.COMPLETED
  const avgProgress = total ? Math.round(tasks.reduce((s, t) => s + (t.progress ?? 0), 0) / total) : 0
  const complianceRate = total ? Math.round(((total - delayed) / total) * 100) : 100
  return { total, dist, delayed, completed, avgProgress, complianceRate }
}

function statusChartData(dist) {
  return Object.entries(TASK_STATUS)
    .map(([key, label]) => ({ key, label, value: dist[key] ?? 0 }))
    .filter((d) => d.value > 0)
}

// 담당자별 부하 (조직 단위 편중 그래프용)
function workloadData(tasks) {
  const byName = {}
  tasks.forEach((t) => { byName[t.assigneeNm] = (byName[t.assigneeNm] ?? 0) + 1 })
  return Object.entries(byName).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
}

export function biForNode(node) {
  if (!node) return null

  if (node.nodeType === 'ORG' || node.nodeType === 'COMPANY') {
    const tasks = node.nodeType === 'COMPANY' ? allTasks : tasksInOrg(node.refId)
    const agg = aggregate(tasks)
    return {
      unit: '조직',
      title: node.label,
      metrics: [
        { label: '일정 준수율', value: `${agg.complianceRate}%`, tone: agg.complianceRate >= 80 ? 'ok' : 'warn' },
        { label: '진행중', value: agg.dist.IN_PROGRESS, tone: 'primary' },
        { label: '지연·위험', value: agg.delayed, tone: agg.delayed > 0 ? 'risk' : 'ok' },
        { label: '평균 진척', value: `${agg.avgProgress}%`, tone: 'neutral' },
      ],
      statusChart: statusChartData(agg.dist),
      workloadChart: workloadData(tasks),
      summary: `${node.label}은(는) 총 ${agg.total}건의 업무 중 진행중 ${agg.dist.IN_PROGRESS}건, 완료 ${agg.completed}건입니다. ` +
        `지연·위험 ${agg.delayed}건으로 일정 준수율은 ${agg.complianceRate}%이며, 평균 진척률은 ${agg.avgProgress}%입니다.`,
    }
  }

  if (node.nodeType === 'WORKER') {
    const tasks = tasksByAssignee(node.refId)
    const agg = aggregate(tasks)
    return {
      unit: '실무자',
      title: node.label,
      metrics: [
        { label: '담당 업무', value: agg.total, tone: 'primary' },
        { label: '진행중', value: agg.dist.IN_PROGRESS, tone: 'primary' },
        { label: '지연·위험', value: agg.delayed, tone: agg.delayed > 0 ? 'risk' : 'ok' },
        { label: '평균 진척', value: `${agg.avgProgress}%`, tone: 'neutral' },
      ],
      statusChart: statusChartData(agg.dist),
      workloadChart: null,
      summary: `${node.label}님은 총 ${agg.total}건의 업무를 담당하며 진행중 ${agg.dist.IN_PROGRESS}건, 완료 ${agg.completed}건입니다. ` +
        (agg.delayed > 0 ? `지연·위험 업무가 ${agg.delayed}건 있어 주의가 필요합니다.` : '지연·위험 업무가 없어 안정적입니다.'),
    }
  }

  if (node.nodeType === 'TASK') {
    const task = findTask(node.refId)
    if (!task) return null
    const linkedGoals = goalsForTask(task.taskId)
    return {
      unit: '업무',
      title: task.taskNm,
      task,
      metrics: [
        { label: '진행률', value: `${task.progress}%`, tone: 'primary' },
        { label: '상태', value: TASK_STATUS[task.status], tone: 'neutral' },
        { label: '위험등급', value: { OK: '정상', WARN: '경고', RISK: '위험' }[task.riskGrade], tone: task.riskGrade === 'RISK' ? 'risk' : task.riskGrade === 'WARN' ? 'warn' : 'ok' },
        { label: '기간', value: `${task.startAt} ~ ${task.endAt}`, tone: 'neutral' },
      ],
      progressChart: [{ label: '진행', value: task.progress }, { label: '잔여', value: 100 - task.progress }],
      linkedGoals,
      summary: `"${task.taskNm}"은(는) 현재 ${TASK_STATUS[task.status]} 상태로 진척률 ${task.progress}%입니다. ` +
        `담당자는 ${task.assigneeNm}이며, 위험등급은 ${{ OK: '정상', WARN: '경고', RISK: '위험' }[task.riskGrade]}입니다.` +
        (linkedGoals.length ? ` 상위 목표 "${linkedGoals[0].objective}"에 기여합니다.` : ''),
    }
  }

  return null
}
