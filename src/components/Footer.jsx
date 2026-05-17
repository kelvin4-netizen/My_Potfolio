import { useNavigate } from 'react-router-dom'
import { NAV_LINKS } from '../data/index.js'

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer
      style={{
        padding: '40px 5%',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'var(--bg2)',
      }}
    >
      <span
        style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: '20px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        KM
      </span>

      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        © 2026 Kelvin Maina Mucheru. #Kingpin
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            onMouseEnter={(e) => (e.target.style.color = 'var(--purple-light)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              transition: 'color 0.2s',
            }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </footer>
  )
}
