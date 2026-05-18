import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin/login')
      else {
        setLoading(false)
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

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{ paddingLeft: '10px', marginBottom: '32px' }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '24px', fontWeight: 700, fontStyle: 'italic',
          background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>KM</span>
        <span style={{
          display: 'block', fontFamily: "'Space Mono', monospace",
          fontSize: '9px', color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.2em', marginTop: '2px',
        }}>ADMIN PANEL</span>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 14px', borderRadius: '8px',
            fontFamily: "'Syne', sans-serif",
            fontSize: isMobile ? '15px' : '13px',
            fontWeight: 500, textDecoration: 'none',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
            background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
            borderLeft: isActive ? '2px solid #7c3aed' : '2px solid transparent',
            transition: 'all 0.2s',
          })}>
            <span style={{ fontSize: '18px', lineHeight: 1 }}>{icon}</span>
            {label}
            {label === 'Messages' && unread > 0 && (
              <span style={{
                marginLeft: 'auto', background: '#06b6d4', color: '#000',
                fontSize: '10px', fontWeight: 700,
                fontFamily: "'Space Mono', monospace",
                padding: '2px 7px', borderRadius: '20px',
              }}>{unread}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
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
          color: 'rgba(255,255,255,0.35)', cursor: 'pointer', textAlign: 'left',
        }}>⏻ Sign out</button>
      </div>
    </>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* DESKTOP sidebar */}
      {!isMobile && (
        <aside style={{
          width: '220px', position: 'fixed', top: 0, bottom: 0, left: 0,
          background: 'rgba(5,5,15,0.98)',
          borderRight: '1px solid rgba(124,58,237,0.2)',
          display: 'flex', flexDirection: 'column',
          padding: '28px 16px', zIndex: 100,
        }}>
          {sidebarContent}
        </aside>
      )}

      {/* MOBILE top bar */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
          background: 'rgba(5,5,15,0.98)',
          borderBottom: '1px solid rgba(124,58,237,0.2)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px', zIndex: 200,
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px', fontWeight: 700, fontStyle: 'italic',
            background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>KM Admin</span>

          {/* Hamburger */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: '5px', padding: '8px',
          }}>
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#a78bfa', borderRadius: '2px', transition: 'all 0.3s', transform: sidebarOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ display: 'block', width: '16px', height: '2px', background: '#06b6d4', borderRadius: '2px', transition: 'all 0.3s', opacity: sidebarOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#ec4899', borderRadius: '2px', transition: 'all 0.3s', transform: sidebarOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>
      )}

      {/* MOBILE sidebar drawer */}
      {isMobile && (
        <>
          {/* Overlay */}
          <div onClick={() => setSidebarOpen(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 198, opacity: sidebarOpen ? 1 : 0,
            pointerEvents: sidebarOpen ? 'all' : 'none',
            transition: 'opacity 0.3s',
          }} />
          {/* Drawer */}
          <aside style={{
            position: 'fixed', top: 0, bottom: 0, left: 0,
            width: '260px',
            background: 'rgba(5,5,15,0.99)',
            borderRight: '1px solid rgba(124,58,237,0.3)',
            display: 'flex', flexDirection: 'column',
            padding: '28px 16px', zIndex: 199,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(.16,1,.3,1)',
          }}>
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Main content */}
      <main style={{
        marginLeft: isMobile ? 0 : '220px',
        flex: 1,
        padding: isMobile ? '80px 16px 40px' : '40px 48px',
        minHeight: '100vh',
      }}>
        <Outlet />
      </main>
    </div>
  )
}