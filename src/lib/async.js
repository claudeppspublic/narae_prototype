// mock 비동기 흉내 — 로딩 상태 노출용.
// 백엔드 없음: setTimeout으로 지연 후 시드 반환. 실패 흉내는 fail 옵션.

export const sleep = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// data를 지연 후 반환. { delay, fail } 옵션으로 로딩/에러 상태 시연.
export async function mockFetch(data, { delay = 400, fail = false } = {}) {
  await sleep(delay)
  if (fail) throw new Error('mock 요청 실패 (재시도하세요)')
  // 참조 격리 (호출부에서 mutate 방지)
  return typeof structuredClone === 'function'
    ? structuredClone(data)
    : JSON.parse(JSON.stringify(data))
}
