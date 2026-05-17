import { useState, useEffect } from 'react'
import { GlowOrb, GridBg, SectionLabel, Tag } from '../components/UI.jsx'
import { supabase } from '../lib/supabase.js'
import { SKILLS } from '../data/index.js'
import SEO from '../components/SEO.jsx'

export default function About() {
  const [animatedSkills, setAnimated] = useState(false)
  const [about, setAbout] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400)
    // Fetch from Supabase; fall back to static data if not set up yet
    supabase.from('about').select('*').limit(1).single().then(({ data }) => {
      if (data) setAbout(data)
    })
    return () => clearTimeout(t)
  }, [])

  // Use Supabase data if available, else fall back to static
  const skills = about?.skills || SKILLS
  const stack = about?.stack
    ? (Array.isArray(about.stack) ? about.stack : about.stack.split(',').map(s => s.trim()).filter(Boolean))
    : ['React', 'Next.js', 'TypeScript', 'JavaScript', 'React Native', 'Expo', 'Node.js', 'Express', 'Python', 'Supabase', 'Firebase', 'PostgreSQL', 'M-Pesa API', 'Tailwind CSS', 'Vite', 'Git']
  const education = about?.education || [
    { year: '2023–Now', title: 'BSc Computer Science', sub: 'Kirinyaga University' },
    { year: '2024', title: 'Cloud Security Path', sub: 'Microsoft Learn + AWS Free Tier' },
    { year: '2024', title: 'Cybersecurity Path', sub: 'TryHackMe' },
    { year: '2024', title: 'Information Systems Analysis', sub: 'Kyambogo University' },
  ]
  const bio = {
    p1: about?.bio1 || "I'm a full-stack developer and CS student based in Kenya, passionate about building digital products that solve real problems for real people.",
    p2: about?.bio2 || "From fintech platforms targeting mama mboga traders to apartment management apps for the Kenyan rental market — I build with purpose and precision.",
    p3: about?.bio3 || "I'm also deeply interested in cybersecurity, cloud computing, and building systems that are not just functional but also secure and scalable.",
  }
  const cvUrl = about?.cv_url || '#'

  return (
    <section style={{ minHeight: '100vh', padding: '120px 5% 80px', position: 'relative', overflow: 'hidden' }}>
      <SEO
        title="About"
        description="Learn about Kelvin Maina Mucheru — his story, tech stack, education at Kirinyaga University, and mission to build impactful tech for African markets."
        url="/about"
        keywords="Kelvin Maina Mucheru, about, CS student Kenya, full-stack developer, Kirinyaga University"
      />
      <GridBg />
      <GlowOrb style={{ width: '400px', height: '400px', background: 'rgba(6,182,212,0.1)', top: '20%', right: '-100px' }} />
      <GlowOrb style={{ width: '300px', height: '300px', background: 'rgba(124,58,237,0.08)', bottom: '10%', left: '-80px', animationDelay: '4s' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionLabel label="About Me" />
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 800, marginBottom: '60px', lineHeight: 1.2 }}>
          The{' '}
          <span style={{ background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Story</span>
          {' '}Behind The Code
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '60px', alignItems: 'start' }}>
          {/* LEFT */}
          <div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', marginBottom: '24px', backdropFilter: 'blur(10px)' }}>
              <p style={{ lineHeight: 1.9, color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px' }}>
                {bio.p1.replace('Kenya', '')}
                <span style={{ color: 'var(--cyan)' }}>Kenya</span>.{bio.p1.split('Kenya')[1]}
              </p>
              <p style={{ lineHeight: 1.9, color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px' }}>{bio.p2}</p>
              <p style={{ lineHeight: 1.9, color: 'var(--text-muted)', fontSize: '15px' }}>{bio.p3}</p>
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '14px', marginBottom: '24px', color: 'var(--purple-light)', letterSpacing: '0.1em' }}>EDUCATION & CERTS</h3>
              {education.map(item => (
                <div key={item.title} style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'var(--cyan)', minWidth: '80px', paddingTop: '2px' }}>{item.year}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '14px', marginBottom: '20px', color: 'var(--purple-light)', letterSpacing: '0.1em' }}>MISSION & INTERESTS</h3>
              {[
                { icon: '🌍', text: 'Building tech for African markets' },
                { icon: '🔒', text: 'Web security & penetration testing' },
                { icon: '☁️', text: 'Cloud computing & DevOps' },
                { icon: '🤖', text: 'AI integrations & automation' },
                { icon: '📱', text: 'Cross-platform mobile development' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '14px', marginBottom: '28px', color: 'var(--purple-light)', letterSpacing: '0.1em' }}>TECH PROFICIENCY</h3>
              {skills.map((skill, i) => (
                <div key={skill.name} style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontFamily: "'Space Mono', monospace" }}>{skill.name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--cyan)' }}>{skill.level}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '2px', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', width: animatedSkills ? `${skill.level}%` : '0%', transition: `width 1s ease ${i * 0.1}s`, boxShadow: '0 0 8px rgba(124,58,237,0.6)' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '14px', marginBottom: '20px', color: 'var(--purple-light)', letterSpacing: '0.1em' }}>FULL TECH STACK</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {stack.map(t => <Tag key={t} label={t} color="#7c3aed" />)}
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '16px', marginBottom: '8px' }}>Want my full résumé?</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                Download my CV for a detailed look at my experience, projects, and academic background.
              </p>
              <a href={cvUrl} style={{ display: 'inline-block', padding: '10px 28px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#fff', fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.05em' }}>
                Download CV ↓
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
