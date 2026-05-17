import { useState } from 'react'
import { GlowOrb, GridBg, SectionLabel, GlowButton } from '../components/UI.jsx'
import { supabase } from '../lib/supabase.js'
import SEO from '../components/SEO.jsx'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('') // '' | 'sending' | 'sent' | 'error'
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSend = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setStatus('sending')

    const { error } = await supabase.from('messages').insert({
      name: form.name,
      email: form.email,
      subject: form.subject || '',
      message: form.message,
    })

    if (error) {
      console.error(error)
      setStatus('error')
    } else {
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    }
  }

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '13px 18px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${hasError ? '#ef4444' : 'var(--border)'}`,
    color: '#fff',
    fontFamily: "'Syne', sans-serif",
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  })

  const labelStyle = {
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.12em',
    display: 'block',
    marginBottom: '8px',
  }

  return (
    <section style={{ minHeight: '100vh', padding: '120px 5% 80px', position: 'relative', overflow: 'hidden' }}>
      <SEO
        title="Contact"
        description="Get in touch with Kelvin for freelance projects, collaborations, or full-time opportunities."
        url="/contact"
      />

      <GridBg />
      <GlowOrb style={{ width: '400px', height: '400px', background: 'rgba(124,58,237,0.12)', bottom: '10%', right: '-80px' }} />
      <GlowOrb style={{ width: '250px', height: '250px', background: 'rgba(6,182,212,0.08)', top: '20%', left: '-60px', animationDelay: '4s' }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionLabel label="Contact" />
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 800, marginBottom: '16px' }}>
          Let's{' '}
          <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Connect
          </span>
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '460px', lineHeight: 1.8, marginBottom: '60px', fontSize: '15px' }}>
          Available for freelance projects, collaborations, and full-time opportunities. Let's build something great together.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '40px' }}>

          {/* LEFT: Info */}
          <div>
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: 'Email',
                val: 'mucherukelvin4@gmail.com',
                href: 'mailto:mucherukelvin4@gmail.com',
                color: '#06b6d4',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.41A9.962 9.962 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: 'WhatsApp',
                val: '+254 743794415',
                href: 'https://wa.me/254743794415',
                color: '#25D366',
              },
              {
                icon: <span style={{ fontSize: '22px' }}>📍</span>,
                label: 'Location',
                val: 'Nanyuki, Laikipia, Kenya',
                href: 'https://maps.google.com/?q=Nanyuki,Kenya',
                color: '#ec4899',
              },
              {
                icon: <span style={{ fontSize: '22px' }}>🕐</span>,
                label: 'Availability',
                val: 'Mon – Fri, 9 AM – 6 PM EAT',
                href: null,
                color: '#a78bfa',
              },
            ].map(item => (
              <a
                key={item.label}
                href={item.href || undefined}
                target={item.href && !item.href.startsWith('mailto') ? '_blank' : undefined}
                rel="noopener noreferrer"
                style={{
                  display: 'flex', gap: '16px', alignItems: 'center',
                  background: 'var(--card-bg)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '18px 20px', marginBottom: '14px',
                  backdropFilter: 'blur(10px)', textDecoration: 'none',
                  cursor: item.href ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (item.href) { e.currentTarget.style.borderColor = item.color + '60'; e.currentTarget.style.background = item.color + '10' } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card-bg)' }}
              >
                <span style={{ minWidth: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '4px' }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize: '14px', fontFamily: "'Space Mono', monospace", color: item.href ? item.color : '#fff', transition: 'color 0.2s' }}>{item.val}</div>
                </div>
                {item.href && (
                  <span style={{ marginLeft: 'auto', color: item.color, fontSize: '16px', opacity: 0.6 }}>↗</span>
                )}
              </a>
            ))}

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginTop: '8px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '14px', letterSpacing: '0.15em' }}>FIND ME ON</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { name: 'GitHub', color: '#a78bfa' },
                  { name: 'LinkedIn', color: '#3b82f6' },
                  { name: 'X', color: '#5D6263' },
                  { name: 'Dribbble', color: '#ec4899' },
                ].map(s => (
                  <div key={s.name} style={{ padding: '7px 16px', borderRadius: '20px', background: `${s.color}15`, border: `1px solid ${s.color}30`, fontSize: '12px', fontFamily: "'Space Mono', monospace", cursor: 'pointer', color: s.color, transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = `${s.color}30`}
                    onMouseLeave={e => e.currentTarget.style.background = `${s.color}15`}
                  >{s.name}</div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '36px', backdropFilter: 'blur(12px)' }}>

            {/* Success state */}
            {status === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '56px', marginBottom: '20px' }}>✅</div>
                <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '20px', marginBottom: '12px' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus('')}
                  style={{ marginTop: '24px', background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', padding: '8px 20px', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: '13px' }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                {/* Name + Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>YOUR NAME</label>
                    <input
                      style={inputStyle(errors.name)}
                      placeholder="Kelvin Maina"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                      onBlur={e => e.target.style.borderColor = errors.name ? '#ef4444' : 'var(--border)'}
                    />
                    {errors.name && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>EMAIL ADDRESS</label>
                    <input
                      style={inputStyle(errors.email)}
                      placeholder="john@example.com"
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                      onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : 'var(--border)'}
                    />
                    {errors.email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>SUBJECT</label>
                  <input
                    style={inputStyle(false)}
                    placeholder="Project inquiry / Collaboration / Say hi"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={labelStyle}>YOUR MESSAGE</label>
                  <textarea
                    style={{ ...inputStyle(errors.message), height: '140px', resize: 'vertical' }}
                    placeholder="Tell me about your project, idea, or just say hello..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                    onBlur={e => e.target.style.borderColor = errors.message ? '#ef4444' : 'var(--border)'}
                  />
                  {errors.message && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.message}</p>}
                </div>

                {/* Error banner */}
                {status === 'error' && (
                  <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '13px', fontFamily: "'Syne', sans-serif" }}>
                    Something went wrong. Please try again or email me directly.
                  </div>
                )}

                <GlowButton
                  onClick={handleSend}
                  style={{ width: '100%', textAlign: 'center', opacity: status === 'sending' ? 0.7 : 1 }}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message ✦'}
                </GlowButton>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}