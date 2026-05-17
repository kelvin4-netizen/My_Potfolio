import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { NAV_LINKS } from '../data/index.js'
import { GlowButton } from './UI.jsx'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 5%',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(5,5,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(124,58,237,0.15)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <span
  style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '26px',         // slightly larger — Cormorant reads smaller optically
    fontWeight: 700,
    fontStyle: 'italic',      // italic is where Cormorant truly shines
    background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '0.08em',
  }}
>
  KM
</span>
      </div>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            style={({ isActive }) => ({
              padding: '8px 16px',
              borderRadius: '6px',
              fontFamily: "'Syne', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              color: isActive ? '#fff' : 'var(--text-muted)',
              background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
              borderBottom: isActive ? '1px solid var(--purple)' : '1px solid transparent',
              transition: 'all 0.2s',
            })}
          >
            {link.label}
          </NavLink>
        ))}
        <GlowButton
          onClick={() => navigate('/contact')}
          style={{ marginLeft: '10px', padding: '8px 20px', fontSize: '13px' }}
        >
          Hire Me ✦
        </GlowButton>
      </div>
    </nav>
  )
}
