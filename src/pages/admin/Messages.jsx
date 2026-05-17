import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { PageHeader, cardStyle, Btn } from '../../components/admin/AdminUI.jsx'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    await supabase.from('messages').update({ read: true }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return
    await supabase.from('messages').delete().eq('id', id)
    if (selected?.id === id) setSelected(null)
    load()
  }

  const open = (msg) => {
    setSelected(msg)
    if (!msg.read) markRead(msg.id)
  }

  const unread = messages.filter(m => !m.read).length

  const formatDate = (ts) => {
    const d = new Date(ts)
    const now = new Date()
    const diff = now - d
    if (diff < 86400000) return d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
    if (diff < 604800000) return d.toLocaleDateString('en-KE', { weekday: 'short' })
    return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })
  }

  return (
    <div>
      <PageHeader title={`Messages${unread > 0 ? ` · ${unread} new` : ''}`} />

      {loading ? (
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '360px 1fr' : '1fr', gap: '20px', alignItems: 'start' }}>

          {/* Message list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Syne', sans-serif" }}>No messages yet</p>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '8px', fontFamily: "'Space Mono', monospace" }}>Messages from your contact form will appear here</p>
              </div>
            ) : messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => open(msg)}
                style={{
                  ...cardStyle,
                  cursor: 'pointer',
                  borderColor: selected?.id === msg.id
                    ? 'rgba(124,58,237,0.6)'
                    : !msg.read
                    ? 'rgba(6,182,212,0.35)'
                    : 'rgba(255,255,255,0.08)',
                  background: selected?.id === msg.id
                    ? 'rgba(124,58,237,0.08)'
                    : !msg.read
                    ? 'rgba(6,182,212,0.04)'
                    : 'rgba(255,255,255,0.03)',
                  transition: 'all 0.2s',
                  padding: '16px 20px',
                }}
                onMouseEnter={e => { if (selected?.id !== msg.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                onMouseLeave={e => {
                  if (selected?.id === msg.id) e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)'
                  else if (!msg.read) e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)'
                  else e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    {!msg.read && (
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#06b6d4', flexShrink: 0, boxShadow: '0 0 6px #06b6d4' }} />
                    )}
                    <p style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: msg.read ? 500 : 700,
                      color: '#fff',
                      fontSize: '14px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>{msg.name}</p>
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginLeft: '8px' }}>
                    {formatDate(msg.created_at)}
                  </span>
                </div>

                {msg.subject && (
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '4px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.subject}
                  </p>
                )}

                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'Space Mono', monospace" }}>
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ ...cardStyle, position: 'sticky', top: '20px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#06b6d4', textDecoration: 'none' }}>
                    {selected.email}
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Btn variant="danger" onClick={() => remove(selected.id)}>Delete</Btn>
                  <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', width: '32px', height: '32px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              </div>

              {/* Subject + date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                {selected.subject ? (
                  <p style={{ fontFamily: "'Orbitron', monospace", fontSize: '13px', color: '#a78bfa' }}>{selected.subject}</p>
                ) : (
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>(no subject)</p>
                )}
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                  {new Date(selected.created_at).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              {/* Message body */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '20px', marginBottom: '24px', minHeight: '160px' }}>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.85, whiteSpace: 'pre-wrap', fontFamily: "'Syne', sans-serif" }}>
                  {selected.message}
                </p>
              </div>

              {/* Reply button */}
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message on kmmucheru.dev'}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 24px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  color: '#fff',
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                ✉ Reply via Email
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
