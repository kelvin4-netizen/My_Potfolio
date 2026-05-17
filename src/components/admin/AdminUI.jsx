/* Shared admin styles & tiny components */

export const inputStyle = {
  width: '100%',
  padding: '10px 14px',
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

export const labelStyle = {
  color: 'rgba(255,255,255,0.45)',
  fontSize: '11px',
  fontFamily: "'Space Mono', monospace",
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: '6px',
  marginTop: 0,
  display: 'block',
}

export const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '24px',
}

export const PageHeader = ({ title, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
    <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>
      {title}
    </h1>
    {action}
  </div>
)

export const Btn = ({ children, onClick, variant = 'primary', disabled = false, style = {} }) => {
  const bg = {
    primary: 'linear-gradient(135deg, #7c3aed, #2563eb)',
    danger: 'rgba(239,68,68,0.15)',
    ghost: 'rgba(255,255,255,0.06)',
  }
  const color = { primary: '#fff', danger: '#f87171', ghost: 'rgba(255,255,255,0.7)' }
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '8px 16px',
      borderRadius: '7px',
      border: variant === 'danger' ? '1px solid rgba(239,68,68,0.3)' : variant === 'ghost' ? '1px solid rgba(255,255,255,0.1)' : 'none',
      background: bg[variant],
      color: color[variant],
      fontFamily: "'Syne', sans-serif",
      fontSize: '13px',
      fontWeight: 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
      ...style,
    }}>{children}</button>
  )
}

export const SaveBtn = ({ loading, onClick }) => (
  <Btn onClick={onClick} disabled={loading} style={{ padding: '10px 28px', fontSize: '14px' }}>
    {loading ? 'Saving...' : 'Save ✓'}
  </Btn>
)

export const FieldGroup = ({ label, children }) => (
  <div style={{ marginBottom: '18px' }}>
    <p style={labelStyle}>{label}</p>
    {children}
  </div>
)
