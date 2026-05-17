import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GlowOrb, GridBg, SectionLabel, Tag, GlowButton } from '../components/UI.jsx'
import { supabase } from '../lib/supabase.js'
import SEO from '../components/SEO.jsx'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('projects').select('*').eq('id', id).single().then(({ data }) => {
      setProject(data)
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: 'var(--cyan)' }}>Loading...</span>
    </section>
  )

  if (!project) return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
      <h2 style={{ fontFamily: "'Orbitron', monospace" }}>Project not found</h2>
      <GlowButton onClick={() => navigate('/projects')}>← Back to Projects</GlowButton>
    </section>
  )

  const sections = [
    { label: 'Problem', text: project.problem },
    { label: 'Solution', text: project.solution },
    { label: 'Process', text: project.process },
    { label: 'Results', text: project.results },
  ]

  return (
    <section style={{ minHeight: '100vh', padding: '120px 5% 80px', position: 'relative', overflow: 'hidden' }}>
      <SEO title={project.title} description={project.description} url={`/projects/${project.id}`} />
      <GridBg />
      <GlowOrb style={{ width: '400px', height: '400px', background: `${project.color}15`, top: '10%', right: '-100px' }} />
      <GlowOrb style={{ width: '250px', height: '250px', background: `${project.color}10`, bottom: '20%', left: '-60px', animationDelay: '3s' }} />

      <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => navigate('/projects')}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', padding: '8px 18px', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '12px', marginBottom: '40px', transition: 'all 0.2s' }}
        >
          ← Back to Projects
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
          <span style={{ fontSize: '52px' }}>{project.icon}</span>
          <div>
            <SectionLabel label="Featured Project" />
            <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.15 }}>{project.title}</h1>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: project.color, fontFamily: "'Space Mono', monospace", marginBottom: '12px', letterSpacing: '0.05em' }}>{project.subtitle}</p>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '48px', maxWidth: '680px' }}>{project.description}</p>

        {sections.map(({ label, text }) => text && (
          <div key={label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px 32px', marginBottom: '20px', backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: `linear-gradient(180deg, ${project.color}, transparent)`, borderRadius: '14px 0 0 14px' }} />
            <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '13px', color: project.color, marginBottom: '14px', letterSpacing: '0.15em' }}>{label.toUpperCase()}</h3>
            <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-muted)' }}>{text}</p>
          </div>
        ))}

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px 32px', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '13px', color: project.color, marginBottom: '16px', letterSpacing: '0.15em' }}>TECH STACK</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {(project.tags || []).map(t => <Tag key={t} label={t} color={project.color} />)}
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px 32px', marginBottom: '40px' }}>
          <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '13px', color: project.color, marginBottom: '16px', letterSpacing: '0.15em' }}>KEY HIGHLIGHTS</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {(project.highlights || []).map(h => (
              <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: `${project.color}20`, border: `1px solid ${project.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: project.color, flexShrink: 0 }}>✓</div>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{h}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {project.live_url && project.live_url !== '#' && <GlowButton onClick={() => window.open(project.live_url, '_blank')}>Live Demo ↗</GlowButton>}
          {project.code_url && project.code_url !== '#' && <GlowButton variant="ghost" onClick={() => window.open(project.code_url, '_blank')}>View Code ⌥</GlowButton>}
          <GlowButton variant="ghost" onClick={() => navigate('/projects')}>← All Projects</GlowButton>
        </div>
      </div>
    </section>
  )
}
