import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const login = async () => {
    if (!email || !password) { setError('Enter your email and password'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else navigate('/admin')
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'rgba(124,58,237,0.08)',
        filter: 'blur(80px)',
        top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        width: '380px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: '20px',
        padding: '48px 40px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '36px',
            fontWeight: 700,
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'block',
          }}>KM</span>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.25em',
          }}>ADMIN PANEL</span>
        </div>

        {/* Fields */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={fieldStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="••••••••"
            style={fieldStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        {error && (
          <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '13px', fontFamily: "'Syne', sans-serif" }}>
            {error}
          </div>
        )}

        <button onClick={login} disabled={loading} style={{
          width: '100%',
          padding: '13px',
          borderRadius: '10px',
          border: 'none',
          background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
          color: '#fff',
          fontFamily: "'Syne', sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: '0.05em',
          transition: 'opacity 0.2s',
        }}>
          {loading ? 'Signing in...' : 'Sign in →'}
        </button>
      </div>
    </div>
  )
}

const fieldStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  fontFamily: "'Syne', sans-serif",
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}
