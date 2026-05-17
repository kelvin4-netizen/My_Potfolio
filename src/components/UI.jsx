import { useState } from 'react'

/* ── Glow Orb background decoration ─────────────────────────── */
export const GlowOrb = ({ style = {} }) => (
  <div
    style={{
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(80px)',
      pointerEvents: 'none',
      animation: 'orb-move 8s ease-in-out infinite',
      ...style,
    }}
  />
)

/* ── Subtle grid background ──────────────────────────────────── */
export const GridBg = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
      backgroundImage: `
        linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
      maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
    }}
  />
)

/* ── Small coloured tag / badge ──────────────────────────────── */
export const Tag = ({ label, color = '#7c3aed' }) => (
  <span
    style={{
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '11px',
      fontFamily: "'Space Mono', monospace",
      background: `${color}18`,
      border: `1px solid ${color}40`,
      color,
      letterSpacing: '0.05em',
    }}
  >
    {label}
  </span>
)

/* ── Small label above section headings ──────────────────────── */
export const SectionLabel = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
    <div
      style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'var(--cyan)',
        boxShadow: '0 0 10px var(--cyan)',
      }}
    />
    <span
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '11px',
        color: 'var(--cyan)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  </div>
)

/* ── Glowing primary / ghost button ──────────────────────────── */
export const GlowButton = ({ children, onClick, variant = 'primary', style = {} }) => {
  const [hovered, setHovered] = useState(false)
  const isPrimary = variant === 'primary'
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '12px 28px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: "'Syne', sans-serif",
        fontWeight: 600,
        letterSpacing: '0.05em',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: isPrimary ? 'none' : '1px solid rgba(124,58,237,0.5)',
        background: isPrimary
          ? hovered
            ? 'linear-gradient(135deg, #9333ea, #3b82f6)'
            : 'linear-gradient(135deg, #7c3aed, #2563eb)'
          : hovered
          ? 'rgba(124,58,237,0.1)'
          : 'transparent',
        color: '#fff',
        boxShadow: isPrimary && hovered ? '0 0 30px rgba(124,58,237,0.6)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
