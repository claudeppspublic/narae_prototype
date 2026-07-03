// mock RAG — AI-03 QnA / 전역 AI 어시스턴트 공용 (FN-AI03-1).
// 질의 → 지연 후 mock 답변 + 출처(citation) + 신뢰도. 실제 검색/LLM 없음.
import { sleep } from '@/lib/async'

const MODELS = {
  onprem: '온프레미스',
  premium: '상위 모델',
}

export const AI_MODELS = MODELS

export async function ragAnswer(query, { model = 'onprem' } = {}) {
  await sleep(700)
  const q = query.trim()
  if (!q) return null
  return {
    answer:
      `"${q}"에 대한 검색 결과입니다. 관련 규정·업무 데이터를 근거로 요약했습니다. ` +
      `(${MODELS[model]} 기준 · mock 응답)`,
    citations: [
      { label: '직제규정_2024.pdf (p.3)', to: '/reg/table' },
      { label: '업무 테이블 · 진행중 업무', to: '/work/table' },
    ],
    confidence: 0.86,
  }
}
