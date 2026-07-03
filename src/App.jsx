// SCR-CM-02 — 라우팅 + 글로벌 레이아웃 셸
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import { routeMeta, publicRoutes } from '@/routes'

export default function App() {
  return (
    <Routes>
      {/* 레이아웃 밖 (로그인) */}
      {publicRoutes.map((r) => (
        <Route key={r.scrId} path={r.path} element={<r.element />} />
      ))}

      {/* 글로벌 레이아웃 셸 아래 중첩 */}
      <Route element={<Layout />}>
        {routeMeta.map((r) =>
          r.index ? (
            <Route key={r.scrId} index element={<r.element />} />
          ) : (
            <Route key={r.scrId} path={r.path} element={<r.element />} />
          ),
        )}
      </Route>
    </Routes>
  )
}
