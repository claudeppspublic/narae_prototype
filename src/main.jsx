// SCR-CM-02 (앱 진입점) — 토큰 배선 + 라우터 마운트
// 디자인 토큰 import 순서: Figma 원본 → 폰트 → 타이포 → 별칭 → 리셋 → 프로젝트 커스텀 → KRDS 컴포넌트 → Tailwind
import '../design/tokens/product/fig-tokens.css'
import '../design/tokens/product/fig-assets.css'
import '../design/tokens/fonts.css'
import '../design/tokens/typography.css'
import '../design/tokens/aliases.css'
import '../design/tokens/base.css'
import '../design/tokens.css'
import 'krds-react/dist/index.css'
import './tailwind.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
