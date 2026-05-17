import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../data/index.js'
import { GlowButton } from './UI.jsx'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 5%', height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled || menuOpen ? 'rgba(5,5,15,0.96)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(124,58,237,0.15)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', zIndex: 1001 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '26px', fontWeight: 700, fontStyle: 'italic',
            background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '0.08em',
          }}>KM</span>
        </div>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {NAV_LINKS.map(link => (
              <NavLink key={link.path} to={link.path} end={link.path === '/'}
                style={({ isActive }) => ({
                  padding: '8px 16px', borderRadius: '6px',
                  fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
                  borderBottom: isActive ? '1px solid var(--purple)' : '1px solid transparent',
                  transition: 'all 0.2s',
                })}>
                {link.label}
              </NavLink>
            ))}
            <GlowButton onClick={() => navigate('/contact')} style={{ marginLeft: '10px', padding: '8px 20px', fontSize: '13px' }}>
              Hire Me ✦
            </GlowButton>
          </div>
        )}

        {/* Hamburger button */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              zIndex: 1001, padding: '8px', display: 'flex', flexDirection: 'column',
              gap: '5px', alignItems: 'flex-end',
            }}
          >
            <span style={{
              display: 'block', height: '2px', borderRadius: '2px',
              background: '#a78bfa', transition: 'all 0.3s',
              width: menuOpen ? '24px' : '24px',
              transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            }} />
            <span style={{
              display: 'block', height: '2px', borderRadius: '2px',
              background: '#06b6d4', transition: 'all 0.3s',
              width: '18px',
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? 'translateX(10px)' : 'none',
            }} />
            <span style={{
              display: 'block', height: '2px', borderRadius: '2px',
              background: '#ec4899', transition: 'all 0.3s',
              width: menuOpen ? '24px' : '14px',
              transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
            }} />
          </button>
        )}
      </nav>

      {/* Mobile menu overlay */}
      {isMobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(3,2,10,0.97)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '8px',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}>
          {NAV_LINKS.map((link, i) => (
            <NavLink key={link.path} to={link.path} end={link.path === '/'}
              style={({ isActive }) => ({
                fontFamily: "'Orbitron', monospace",
                fontSize: '22px', fontWeight: 700,
                textDecoration: 'none',
                color: isActive ? '#a78bfa' : 'rgba(255,255,255,0.7)',
                padding: '14px 40px',
                borderRadius: '10px',
                background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                transition: 'all 0.2s',
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${i * 0.05}s`,
              })}>
              {link.label}
            </NavLink>
          ))}
          <div style={{ marginTop: '20px' }}>
            <GlowButton onClick={() => navigate('/contact')} style={{ padding: '12px 36px', fontSize: '15px' }}>
              Hire Me ✦
            </GlowButton>
          </div>
        </div>
      )}
    </>
  )
}