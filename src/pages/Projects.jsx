import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlowOrb, GridBg, SectionLabel, Tag } from '../components/UI.jsx'
import { supabase } from '../lib/supabase.js'
import SEO from '../components/SEO.jsx'

export default function Projects() {
  const [hovered, setHovered] = useState(null)
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('projects').select('*').order('sort_order').then(({ data }) => setProjects(data || []))
  }, [])

  return (
    <section style={{ minHeight: '100vh', padding: '120px 5% 80px', position: 'relative', overflow: 'hidden' }}>
      <SEO
        title="Projects"
        description="Featured works by Kelvin Maina — ChuoFund, Kenya Yetu, Nyumba, TaskHive and more."
        url="/projects"
        keywords="portfolio, React projects, Kenya fintech, mobile apps, full-stack"
      />
      <GridBg />
      <GlowOrb style={{ width: '350px', height: '350px', background: 'rgba(236,72,153,0.08)', bottom: '20%', left: '-80px' }} />
      <GlowOrb style={{ width: '300px', height: '300px', background: 'rgba(124,58,237,0.1)', top: '10%', right: '-60px', animationDelay: '2s' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionLabel label="Projects Portfolio" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 800, lineHeight: 1.2 }}>
            Featured{' '}
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Works
            </span>
          </h2>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: 'var(--text-muted)' }}>{projects.length} Projects</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
          {projects.map((proj, i) => (
            <div
              key={proj.id}
              onMouseEnter={() => setHovered(proj.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(`/projects/${proj.id}`)}
              style={{
                background: hovered === proj.id ? 'var(--card-hover)' : 'var(--card-bg)',
                border: `1px solid ${hovered === proj.id ? proj.color + '60' : 'var(--border)'}`,
                borderRadius: '16px', padding: '32px', cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: hovered === proj.id ? 'translateY(-6px)' : 'none',
                boxShadow: hovered === proj.id ? `0 20px 60px ${proj.color}20` : 'none',
                backdropFilter: 'blur(10px)',
                animation: `reveal 0.6s ease ${i * 0.12}s both`,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {hovered === proj.id && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${proj.color}, transparent)` }} />
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ fontSize: '36px' }}>{proj.icon}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: proj.color, background: `${proj.color}15`, border: `1px solid ${proj.color}30`, padding: '4px 12px', borderRadius: '20px', opacity: hovered === proj.id ? 1 : 0.6, transition: 'opacity 0.3s' }}>
                  View Case Study →
                </div>
              </div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>{proj.title}</h3>
              <p style={{ fontSize: '13px', color: proj.color, marginBottom: '16px', fontFamily: "'Space Mono', monospace" }}>{proj.subtitle}</p>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '24px' }}>{proj.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {(proj.tags || []).map(t => <Tag key={t} label={t} color={proj.color} />)}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                {(proj.highlights || []).map(h => (
                  <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: proj.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes reveal { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </section>
  )
}
