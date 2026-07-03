// useAsync — 상태 5종(초기/로딩/데이터/빈/에러) 표준 훅.
// mock api 호출을 감싸 { data, loading, error, reload } 반환.
import { useState, useEffect, useCallback, useRef } from 'react'

export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fnRef.current()
      setData(result)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    run()
  }, [run])

  return { data, loading, error, reload: run }
}

// 빈 상태 판정 헬퍼
export const isEmpty = (data) =>
  data == null || (Array.isArray(data) && data.length === 0)
