// SCR-AI-02 — 규정 등록 (화면설계서 p12)
// AI02-01 분류 칩 · AI02-02 업로드 드롭존(50MB/형식 초과 거부) · FN-AI02-1 · 상태 5종
import { useState } from 'react'
import { docAssets as seedDocs } from '@/mock/docAssets'
import { useUiStore } from '@/store/useUiStore'
import { REGULATION_CATEGORY } from '@/lib/codes'
import RegNav from '@/components/RegNav'
import FilterChip from '@/components/FilterChip'
import Uploader from '@/components/Uploader'
import DataTable from '@/components/DataTable'
import Badge from '@/components/Badge'
import { EmptyState } from '@/components/StateViews'

const CAT_ENTRIES = Object.entries(REGULATION_CATEGORY)

export default function RegulationUpload() {
  const toast = useUiStore((s) => s.toast)
  const [category, setCategory] = useState('ORGANIZATION')
  const [docs, setDocs] = useState(seedDocs)

  const onFiles = (files) => {
    const added = files.map((f, i) => ({
      docId: `DOC-NEW-${Date.now()}-${i}`,
      fileName: f.name,
      category,
      mime: f.type || '-',
      size: `${Math.max(1, Math.round(f.size / 1024))}KB`,
      uploadedAt: '방금',
    }))
    setDocs((d) => [...added, ...d])
    toast(`${added.length}개 파일이 '${REGULATION_CATEGORY[category]}'로 업로드되었습니다 (mock)`, 'ok')
  }

  const columns = [
    { key: 'fileName', header: '파일명', render: (r) => <span style={{ fontWeight: 'var(--krds-weight-medium)' }}>{r.fileName}</span> },
    { key: 'category', header: '분류', width: 110, render: (r) => <Badge variant="neutral">{REGULATION_CATEGORY[r.category]}</Badge> },
    { key: 'size', header: '크기', width: 90 },
    { key: 'uploadedAt', header: '업로드', width: 110 },
  ]

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--krds-control-xlarge))' }}>
      <RegNav />
      <section style={{ flex: 1, overflowY: 'auto', padding: 'var(--krds-space-9)' }}>
        <h1 style={{ fontSize: 'var(--krds-heading-medium)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-3)' }}>규정 등록</h1>
        <p style={{ color: 'var(--color-text-assistive,#6b7280)', marginBottom: 'var(--krds-space-8)' }}>
          직제·운영·업무분장·인사 등 조직 관련 규정 문서를 등록합니다.
        </p>

        {/* 분류 칩 */}
        <div style={{ marginBottom: 'var(--krds-space-4)', fontSize: 'var(--krds-body-small)', color: 'var(--color-text-assistive,#6b7280)' }}>업로드 문서 분류</div>
        <div style={{ display: 'flex', gap: 'var(--krds-space-4)', marginBottom: 'var(--krds-space-8)', flexWrap: 'wrap' }}>
          {CAT_ENTRIES.map(([key, label]) => (
            <FilterChip key={key} label={label} variant="solid" active={category === key} onClick={() => setCategory(key)} />
          ))}
        </div>

        {/* 드롭존 */}
        <div style={{ marginBottom: 'var(--krds-space-10)' }}>
          <Uploader hint="PDF · HWP · DOCX · XLSX · 파일당 최대 50MB" maxMB={50}
            note={`${REGULATION_CATEGORY[category]}로 분류됩니다`} onFiles={onFiles} />
        </div>

        {/* 목록 */}
        <h2 style={{ fontSize: 'var(--krds-heading-small)', fontWeight: 'var(--krds-weight-bold)', margin: '0 0 var(--krds-space-6)' }}>
          등록된 규정 <span style={{ color: 'var(--narae-accent)' }}>{docs.length}</span>
        </h2>
        {docs.length === 0 ? (
          <EmptyState icon="📄" title="등록된 자산이 없습니다" description="위 드롭존에 파일을 올리면 규정 자산으로 등록됩니다." />
        ) : (
          <DataTable columns={columns} rows={docs} rowKey={(r) => r.docId} />
        )}
      </section>
    </div>
  )
}
