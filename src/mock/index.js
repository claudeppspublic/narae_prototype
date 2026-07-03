// mock 통합 인덱스 — 시드 re-export + 비동기 조회 API(로딩 흉내).
// 화면은 이 파일의 api.* 를 통해 데이터를 가져온다(await + 로딩/에러 상태).
import { mockFetch } from '@/lib/async'
import { orgUnits, childrenOf, rootOrgs, findOrg } from './orgUnits'
import { users, usersOf, findUser, CURRENT_USER } from './users'
import { projects, projectsOf, findProject } from './projects'
import { tasks, tasksOf, tasksByAssignee, findTask } from './tasks'
import { taskRelations, relationsFrom, relationsTo } from './taskRelations'
import { steps, stepsOf, findStep } from './steps'
import { procedureSteps, proceduresOf } from './procedureSteps'
import { approvalLines, approvalLinesOf } from './approvalLines'
import { formTemplates } from './formTemplates'
import { taskTemplates, templatesOf } from './taskTemplates'
import { goals, findGoal, goalsForTask } from './goals'
import { meetings, findMeeting } from './meetings'
import { regulations, regulationsByCategory, regulationsOfStep, findRegulation } from './regulations'
import { riskItems, findRisk } from './riskItems'
import { notifications, unreadCount } from './notifications'
import { docAssets, docsByCategory } from './docAssets'
import { canvasNodes, canvasEdges, toolAttachments, toolPalette, homeTabs } from './canvas'

// 원시 시드 (동기 접근용)
export const seed = {
  orgUnits, users, projects, tasks, taskRelations, steps, procedureSteps,
  approvalLines, formTemplates, taskTemplates, goals, meetings, regulations,
  riskItems, notifications, docAssets, canvasNodes, canvasEdges, toolAttachments,
}

export {
  childrenOf, rootOrgs, findOrg, usersOf, findUser, CURRENT_USER,
  projectsOf, findProject, tasksOf, tasksByAssignee, findTask,
  relationsFrom, relationsTo, stepsOf, findStep, proceduresOf, approvalLinesOf,
  templatesOf, findGoal, goalsForTask, findMeeting, regulationsByCategory,
  regulationsOfStep, findRegulation, findRisk, unreadCount, docsByCategory,
  toolPalette, homeTabs,
}

// 비동기 조회 API — { delay, fail } 로 로딩/에러 상태 시연 가능
export const api = {
  getOrgTree: (opts) => mockFetch(orgUnits, opts),
  getUsersOf: (orgUnitId, opts) => mockFetch(usersOf(orgUnitId), opts),
  getProjects: (opts) => mockFetch(projects, opts),
  getProjectsOf: (orgUnitId, opts) => mockFetch(projectsOf(orgUnitId), opts),
  getTasks: (opts) => mockFetch(tasks, opts),
  getTasksOf: (projectId, opts) => mockFetch(tasksOf(projectId), opts),
  getTask: (taskId, opts) => mockFetch(findTask(taskId), opts),
  getTaskRelations: (opts) => mockFetch(taskRelations, opts),
  getStepsOf: (projectId, opts) => mockFetch(stepsOf(projectId), opts),
  getProceduresOf: (taskId, opts) => mockFetch(proceduresOf(taskId), opts),
  getApprovalLinesOf: (taskId, opts) => mockFetch(approvalLinesOf(taskId), opts),
  getFormTemplates: (opts) => mockFetch(formTemplates, opts),
  getGoals: (opts) => mockFetch(goals, opts),
  getGoalsForTask: (taskId, opts) => mockFetch(goalsForTask(taskId), opts),
  getMeetings: (opts) => mockFetch(meetings, opts),
  getMeeting: (id, opts) => mockFetch(findMeeting(id), opts),
  getRegulations: (category, opts) => mockFetch(regulationsByCategory(category), opts),
  getRegulationsOfStep: (stepId, opts) => mockFetch(regulationsOfStep(stepId), opts),
  getRisks: (opts) => mockFetch(riskItems, opts),
  getNotifications: (opts) => mockFetch(notifications, opts),
  getDocAssets: (category, opts) => mockFetch(docsByCategory(category), opts),
}
