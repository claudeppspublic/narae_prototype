// 공용 SrOnly — 화면에는 숨기고 스크린리더에만 노출 (h1 등 시맨틱 보존용)
export default function SrOnly({ as: Tag = 'span', children }) {
  return <Tag style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }}>{children}</Tag>
}
