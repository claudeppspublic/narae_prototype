// USER 시드 — 대표 인원 (화면설계서 실측 과장·담당자 기반).
// 스키마: empNo, empNm, orgUnitId, position, roleId, employmentStatus, jobTags[]
// 개별 114명 전원이 아닌, 화면에 등장하는 대표 인원 + 조직별 표본.

export const users = [
  // 기획예산담당관 (과장 김민준)
  { empNo: 'U20260001', empNm: '김민준', orgUnitId: 'ORG-01-01-01', position: '과장', roleId: 'ROLE_CHF', employmentStatus: 'ACTIVE', jobTags: ['예산', '기획'] },
  { empNo: 'U20260002', empNm: '박서준', orgUnitId: 'ORG-01-01-01', position: '팀장', roleId: 'ROLE_TML', employmentStatus: 'ACTIVE', jobTags: ['예산편성'] },
  { empNo: 'U20260003', empNm: '이하늘', orgUnitId: 'ORG-01-01-01', position: '주무관', roleId: 'ROLE_STF', employmentStatus: 'ACTIVE', jobTags: ['재정집행'] },
  { empNo: 'U20260004', empNm: '오세훈', orgUnitId: 'ORG-01-01-01', position: '주무관', roleId: 'ROLE_STF', employmentStatus: 'ACTIVE', jobTags: ['예산분석'] },

  // 혁신행정담당관 (과장 강현우)
  { empNo: 'U20260011', empNm: '강현우', orgUnitId: 'ORG-01-01-02', position: '과장', roleId: 'ROLE_CHF', employmentStatus: 'ACTIVE', jobTags: ['혁신', '행정'] },
  { empNo: 'U20260012', empNm: '조하은', orgUnitId: 'ORG-01-01-02', position: '팀장', roleId: 'ROLE_TML', employmentStatus: 'ACTIVE', jobTags: ['서비스개선', '민원'] },
  { empNo: 'U20260013', empNm: '서지우', orgUnitId: 'ORG-01-01-02', position: '주무관', roleId: 'ROLE_STF', employmentStatus: 'ACTIVE', jobTags: ['디자인'] },
  { empNo: 'U20260014', empNm: '이도현', orgUnitId: 'ORG-01-01-02', position: '주무관', roleId: 'ROLE_STF', employmentStatus: 'ON_LEAVE', jobTags: ['경진대회'] },

  // 정보화담당관 (과장 이준혁)
  { empNo: 'U20260021', empNm: '이준혁', orgUnitId: 'ORG-01-01-03', position: '과장', roleId: 'ROLE_CHF', employmentStatus: 'ACTIVE', jobTags: ['정보화', 'AI'] },
  { empNo: 'U20260022', empNm: '정민서', orgUnitId: 'ORG-01-01-03', position: '팀장', roleId: 'ROLE_TML', employmentStatus: 'ACTIVE', jobTags: ['클라우드'] },
  { empNo: 'U20260023', empNm: '한지훈', orgUnitId: 'ORG-01-01-03', position: '주무관', roleId: 'ROLE_STF', employmentStatus: 'ACTIVE', jobTags: ['민원시스템'] },

  // 국제협력관
  { empNo: 'U20260031', empNm: '문가영', orgUnitId: 'ORG-01-02-01', position: '과장', roleId: 'ROLE_CHF', employmentStatus: 'ACTIVE', jobTags: ['국제회의'] },
  { empNo: 'U20260032', empNm: '고은채', orgUnitId: 'ORG-01-02-01', position: '주무관', roleId: 'ROLE_STF', employmentStatus: 'ACTIVE', jobTags: ['ODA'] },
  { empNo: 'U20260033', empNm: '심우재', orgUnitId: 'ORG-01-02-02', position: '주무관', roleId: 'ROLE_STF', employmentStatus: 'ACTIVE', jobTags: ['통상', '수출지원'] },

  // 운영지원실 총무국
  { empNo: 'U20260041', empNm: '윤태오', orgUnitId: 'ORG-02-01-01', position: '과장', roleId: 'ROLE_CHF', employmentStatus: 'ACTIVE', jobTags: ['인사'] },
  { empNo: 'U20260042', empNm: '배수지', orgUnitId: 'ORG-02-01-02', position: '팀장', roleId: 'ROLE_TML', employmentStatus: 'ACTIVE', jobTags: ['재무', '급여'] },
  { empNo: 'U20260043', empNm: '류준열', orgUnitId: 'ORG-02-01-03', position: '주무관', roleId: 'ROLE_STF', employmentStatus: 'ACTIVE', jobTags: ['총무', '에너지'] },

  // 실장/국장급 (기획관+) & 관리자
  { empNo: 'U20260051', empNm: '정해인', orgUnitId: 'ORG-01', position: '실장', roleId: 'ROLE_DIR', employmentStatus: 'ACTIVE', jobTags: ['총괄'] },
  { empNo: 'U20260052', empNm: '손예진', orgUnitId: 'ORG-02', position: '실장', roleId: 'ROLE_DIR', employmentStatus: 'ACTIVE', jobTags: ['운영총괄'] },
  { empNo: 'U20260099', empNm: '관리자', orgUnitId: 'ORG-01-01-03', position: '시스템관리자', roleId: 'ROLE_ADMIN', employmentStatus: 'ACTIVE', jobTags: ['시스템'] },
]

export const findUser = (empNo) => users.find((u) => u.empNo === empNo)
export const usersOf = (orgUnitId) => users.filter((u) => u.orgUnitId === orgUnitId)
// 현재 데모 사용자(로그인 흉내 기본값)
export const CURRENT_USER = 'U20260012' // 조하은(혁신행정담당관 팀장)
