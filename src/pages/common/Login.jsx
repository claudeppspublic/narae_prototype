// SCR-CM-01 — 로그인 (FN-CM01-1 ID/PW 로그인·토큰 mock, FN-CM01-2 역할 미부여)
// 입력: loginId(필수), password(필수·min8). 예외: 불일치→오류, 빈/짧음→차단.
// 상태: 초기 / 로딩(인증중) / 에러(불일치·유효성) / 접근제한(역할없음).
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockFetch } from '@/lib/async'
import { useRoleStore } from '@/store/useRoleStore'
import { CURRENT_USER } from '@/mock/users'
import Field from '@/components/Field'
import Button from '@/components/Button'

export default function Login() {
  const navigate = useNavigate()
  const setUser = useRoleStore((s) => s.setUser)

  const [form, setForm] = useState({ loginId: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [restricted, setRestricted] = useState(false)

  const patch = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async () => {
    const e = {}
    if (!form.loginId.trim()) e.loginId = '아이디를 입력하세요.'
    if (form.password.length < 8) e.password = '비밀번호는 8자 이상 입력하세요.'
    setErrors(e)
    if (Object.keys(e).length) return

    setSubmitting(true)
    setAuthError(null)
    setRestricted(false)
    try {
      // mock 인증: loginId 'wrong' → 불일치, 'guest' → 역할 미부여(9999)
      await mockFetch(null, { delay: 700, fail: form.loginId.trim() === 'wrong' })
      if (form.loginId.trim() === 'guest') {
        setRestricted(true) // FN-CM01-2
        return
      }
      setUser(CURRENT_USER) // 데모 사용자로 로그인
      navigate('/')
    } catch {
      setAuthError('아이디 또는 비밀번호가 일치하지 않습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const onKeyDown = (e) => e.key === 'Enter' && !submitting && submit()

  return (
    <div style={page}>
      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--krds-space-10)' }}>
          <h1 style={{ fontSize: 'var(--krds-heading-large)', fontWeight: 'var(--krds-weight-bold)', color: 'var(--narae-accent)', margin: 0 }}>
            Narae AI
          </h1>
          <p style={{ marginTop: 'var(--krds-space-4)', color: 'var(--color-text-assistive, #6b7280)' }}>
            ERP 계정으로 로그인하세요.
          </p>
        </div>

        {restricted ? (
          <div role="alert" style={restrictBox}>
            <div style={{ fontSize: '1.5rem' }} aria-hidden>🔒</div>
            <p style={{ fontWeight: 'var(--krds-weight-bold)', marginTop: 'var(--krds-space-4)' }}>
              역할이 부여되지 않은 계정입니다
            </p>
            <p style={{ color: 'var(--color-text-assistive, #6b7280)', fontSize: 'var(--krds-body-small)', marginTop: 'var(--krds-space-2)' }}>
              로그인은 되었으나 기능 접근이 제한됩니다. 관리자에게 역할 부여를 요청하세요.
            </p>
            <Button size="md" style={{ marginTop: 'var(--krds-space-8)' }} onClick={() => setRestricted(false)}>
              다시 로그인
            </Button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); submit() }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--krds-space-8)' }}>
            <Field
              label="로그인 아이디" required name="loginId" autoComplete="username"
              placeholder="hong.gd" value={form.loginId} onChange={patch('loginId')}
              onKeyDown={onKeyDown} error={errors.loginId}
            />
            <Field
              label="비밀번호" required type="password" name="password" autoComplete="current-password"
              placeholder="********" value={form.password} onChange={patch('password')}
              onKeyDown={onKeyDown} error={errors.password}
              hint="데모: 8자 이상 입력 · 'guest'=역할 미부여 · 'wrong'=불일치"
            />

            {authError && (
              <p role="alert" style={{ color: 'var(--narae-status-risk)', fontSize: 'var(--krds-body-small)', margin: 0 }}>
                {authError}
              </p>
            )}

            <Button type="submit" size="md" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? '인증 중…' : '로그인'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

const page = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--color-background-alternative, #f5f6f8)', padding: 'var(--krds-space-9)',
}
const card = {
  width: '100%', maxWidth: '25rem', background: 'var(--color-background-white)',
  borderRadius: 'var(--krds-radius-xlarge)', boxShadow: 'var(--krds-shadow-2)',
  padding: 'var(--krds-space-12)',
}
const restrictBox = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
  padding: 'var(--krds-space-9)', borderRadius: 'var(--krds-radius-large)',
  background: 'var(--color-background-alternative, #f8f9fa)',
}
