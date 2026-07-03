// ORG_UNIT 시드 — 5실 114명 (화면설계서 조직도뷰/리스트뷰 실측).
// 스키마: orgUnitId, orgUnitNm, level(실/관/과), parentId, empCount
// 기획조정실은 실측 계층 완전 구성, 그 외 4개 실은 실 단위 + 대표 하위(설계값).
import { ORG_LEVEL } from '@/lib/codes'

const { OFFICE, BUREAU, DIVISION } = ORG_LEVEL

export const orgUnits = [
  // ── 기획조정실 30 ──
  { orgUnitId: 'ORG-01', orgUnitNm: '기획조정실', level: OFFICE, parentId: null, empCount: 30 },
  { orgUnitId: 'ORG-01-01', orgUnitNm: '정책기획관', level: BUREAU, parentId: 'ORG-01', empCount: 21 },
  { orgUnitId: 'ORG-01-01-01', orgUnitNm: '기획예산담당관', level: DIVISION, parentId: 'ORG-01-01', empCount: 8 },
  { orgUnitId: 'ORG-01-01-02', orgUnitNm: '혁신행정담당관', level: DIVISION, parentId: 'ORG-01-01', empCount: 6 },
  { orgUnitId: 'ORG-01-01-03', orgUnitNm: '정보화담당관', level: DIVISION, parentId: 'ORG-01-01', empCount: 7 },
  { orgUnitId: 'ORG-01-02', orgUnitNm: '국제협력관', level: BUREAU, parentId: 'ORG-01', empCount: 9 },
  { orgUnitId: 'ORG-01-02-01', orgUnitNm: '국제협력담당관', level: DIVISION, parentId: 'ORG-01-02', empCount: 5 },
  { orgUnitId: 'ORG-01-02-02', orgUnitNm: '통상지원담당관', level: DIVISION, parentId: 'ORG-01-02', empCount: 4 },

  // ── 운영지원실 36 ──
  { orgUnitId: 'ORG-02', orgUnitNm: '운영지원실', level: OFFICE, parentId: null, empCount: 36 },
  { orgUnitId: 'ORG-02-01', orgUnitNm: '총무국', level: BUREAU, parentId: 'ORG-02', empCount: 22 },
  { orgUnitId: 'ORG-02-01-01', orgUnitNm: '인사과', level: DIVISION, parentId: 'ORG-02-01', empCount: 9 },
  { orgUnitId: 'ORG-02-01-02', orgUnitNm: '재무과', level: DIVISION, parentId: 'ORG-02-01', empCount: 7 },
  { orgUnitId: 'ORG-02-01-03', orgUnitNm: '총무과', level: DIVISION, parentId: 'ORG-02-01', empCount: 6 },
  // [확인필요] 운영지원실 잔여 14명 하위(설계값)
  { orgUnitId: 'ORG-02-02', orgUnitNm: '시설관리관', level: BUREAU, parentId: 'ORG-02', empCount: 14 },
  { orgUnitId: 'ORG-02-02-01', orgUnitNm: '청사관리담당관', level: DIVISION, parentId: 'ORG-02-02', empCount: 8 },
  { orgUnitId: 'ORG-02-02-02', orgUnitNm: '자산운영담당관', level: DIVISION, parentId: 'ORG-02-02', empCount: 6 },

  // ── 감사실 9 (설계값 하위) ──
  { orgUnitId: 'ORG-03', orgUnitNm: '감사실', level: OFFICE, parentId: null, empCount: 9 },
  { orgUnitId: 'ORG-03-01', orgUnitNm: '감사담당관', level: DIVISION, parentId: 'ORG-03', empCount: 5 },
  { orgUnitId: 'ORG-03-02', orgUnitNm: '청렴조사담당관', level: DIVISION, parentId: 'ORG-03', empCount: 4 },

  // ── 정책홍보실 22 (설계값 하위) ──
  { orgUnitId: 'ORG-04', orgUnitNm: '정책홍보실', level: OFFICE, parentId: null, empCount: 22 },
  { orgUnitId: 'ORG-04-01', orgUnitNm: '홍보기획관', level: BUREAU, parentId: 'ORG-04', empCount: 13 },
  { orgUnitId: 'ORG-04-01-01', orgUnitNm: '언론협력담당관', level: DIVISION, parentId: 'ORG-04-01', empCount: 7 },
  { orgUnitId: 'ORG-04-01-02', orgUnitNm: '디지털소통담당관', level: DIVISION, parentId: 'ORG-04-01', empCount: 6 },
  { orgUnitId: 'ORG-04-02', orgUnitNm: '대변인실', level: DIVISION, parentId: 'ORG-04', empCount: 9 },

  // ── 연구기획실 17 (설계값 하위) ──
  { orgUnitId: 'ORG-05', orgUnitNm: '연구기획실', level: OFFICE, parentId: null, empCount: 17 },
  { orgUnitId: 'ORG-05-01', orgUnitNm: '정책연구담당관', level: DIVISION, parentId: 'ORG-05', empCount: 9 },
  { orgUnitId: 'ORG-05-02', orgUnitNm: '미래전략담당관', level: DIVISION, parentId: 'ORG-05', empCount: 8 },
]

// 헬퍼
export const findOrg = (id) => orgUnits.find((o) => o.orgUnitId === id)
export const childrenOf = (parentId) => orgUnits.filter((o) => o.parentId === parentId)
export const rootOrgs = () => orgUnits.filter((o) => o.parentId === null)
