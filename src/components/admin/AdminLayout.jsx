import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '⊞', end: true },
  { to: '/admin/projects', label: 'Projects', icon: '◈' },
  { to: '/admin/services', label: 'Services', icon: '✦' },
  { to: '/admin/about', label: 'About', icon: '◉' },
  { to: '/admin/blog', label: 'Blog', icon: '✎' },
  { to: '/admin/messages', label: 'Messages', icon: '✉' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙' },
]

export default function AdminLayout() {
  const [loading, setLoading] = useState(true)
  const [unread, setUnread] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin/login')
      else {
        setLoading(false)
        // Fetch unread message count
        supabase.from('messages').select('id', { count: 'exact', head: true }).eq('read', false).then(({ count }) => {
          setUnread(count || 0)
        })
      }
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: 'var(--cyan)' }}>Loading...</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        background: 'rgba(5,5,15,0.98)',
        borderRight: '1px solid rgba(124,58,237,0.2)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 16px',
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ paddingLeft: '10px', marginBottom: '32px' }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '24px',
            fontWeight: 700,
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>KM</span>
          <span style={{
            display: 'block',
            fontFamily: "'Space Mono', monospace",
            fontSize: '9px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.2em',
            marginTop: '2px',
          }}>ADMIN PANEL</span>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              fontFamily: "'Syne', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
              background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
              borderLeft: isActive ? '2px solid #7c3aed' : '2px solid transparent',
              transition: 'all 0.2s',
              position: 'relative',
            })}>
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{icon}</span>
              {label}
              {/* Unread badge on Messages */}
              {label === 'Messages' && unread > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#06b6d4',
                  color: '#000',
                  fontSize: '10px',
                  fontWeight: 700,
                  fontFamily: "'Space Mono', monospace",
                  padding: '2px 7px',
                  borderRadius: '20px',
                  minWidth: '20px',
                  textAlign: 'center',
                }}>{unread}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* View site + logout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <a href="/" target="_blank" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '9px 12px', borderRadius: '8px',
            fontFamily: "'Syne', sans-serif", fontSize: '12px',
            color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
          }}>↗ View site</a>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '9px 12px', borderRadius: '8px',
            background: 'transparent', border: 'none',
            fontFamily: "'Syne', sans-serif", fontSize: '13px',
            color: 'rgba(255,255,255,0.35)', cursor: 'pointer',
            textAlign: 'left',
          }}>⏻ Sign out</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '220px', flex: 1, padding: '40px 48px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}
