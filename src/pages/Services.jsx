import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlowOrb, GridBg, SectionLabel, GlowButton } from '../components/UI.jsx'
import { supabase } from '../lib/supabase.js'
import SEO from '../components/SEO.jsx'

export default function Services() {
  const [hovered, setHovered] = useState(null)
  const [services, setServices] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('services').select('*').order('sort_order').then(({ data }) => setServices(data || []))
  }, [])

  return (
    <section style={{ minHeight: '100vh', padding: '120px 5% 80px', position: 'relative', overflow: 'hidden' }}>
      <SEO title="Services" description="Web development, UI/UX design, mobile apps, cloud backend, AI integrations and security audits." url="/services" />
      <GridBg />
      <GlowOrb style={{ width: '500px', height: '500px', background: 'rgba(59,130,246,0.07)', top: '10%', left: '50%', transform: 'translateX(-50%)' }} />
      <GlowOrb style={{ width: '300px', height: '300px', background: 'rgba(124,58,237,0.08)', bottom: '15%', right: '-60px', animationDelay: '3s' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionLabel label="What I Do" />
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
          Services That{' '}
          <span style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>I Offer</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '500px', lineHeight: 1.8, marginBottom: '60px', fontSize: '15px' }}>
          I help businesses and individuals bring their ideas to life with modern technology and creative solutions tailored for real impact.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '60px' }}>
          {services.map((svc, i) => (
            <div
              key={svc.id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === i ? 'var(--card-hover)' : 'var(--card-bg)',
                border: `1px solid ${hovered === i ? svc.color + '50' : 'var(--border)'}`,
                borderRadius: '16px', padding: '32px', cursor: 'default',
                transition: 'all 0.3s ease',
                transform: hovered === i ? 'translateY(-6px)' : 'none',
                boxShadow: hovered === i ? `0 20px 60px ${svc.color}15` : 'none',
                backdropFilter: 'blur(10px)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {hovered === i && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${svc.color}, transparent)` }} />}
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: `${svc.color}18`, border: `1px solid ${svc.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '20px', boxShadow: hovered === i ? `0 0 20px ${svc.color}30` : 'none', transition: 'box-shadow 0.3s' }}>
                {svc.icon}
              </div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>{svc.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{svc.description}</p>
              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '6px', opacity: hovered === i ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                <span style={{ fontSize: '13px', color: svc.color, fontFamily: "'Space Mono', monospace" }}>Learn more</span>
                <span style={{ color: svc.color }}>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Process section */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '48px', marginBottom: '40px', backdropFilter: 'blur(10px)' }}>
          <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '20px', marginBottom: '40px', textAlign: 'center' }}>
            My{' '}
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Process</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
            {[
              { step: '01', title: 'Discover', desc: 'Understand the problem, goals, and users through research and discussion.' },
              { step: '02', title: 'Design', desc: 'Wireframes, prototypes, and UI design that align with the product vision.' },
              { step: '03', title: 'Build', desc: 'Clean, scalable code with regular checkpoints and feedback loops.' },
              { step: '04', title: 'Launch', desc: 'Deploy, test, and monitor. Then iterate based on real user data.' },
            ].map(item => (
              <div key={item.step} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '32px', fontWeight: 900, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '12px' }}>{item.step}</div>
                <h4 style={{ fontFamily: "'Orbitron', monospace", fontSize: '15px', marginBottom: '10px' }}>{item.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '16px', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '22px', marginBottom: '8px' }}>Have a project in mind?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Let's build something extraordinary together.</p>
          </div>
          <GlowButton onClick={() => navigate('/contact')}>Start A Project →</GlowButton>
        </div>
      </div>
    </section>
  )
}
