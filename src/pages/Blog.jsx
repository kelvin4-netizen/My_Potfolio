import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlowOrb, GridBg, SectionLabel, Tag } from '../components/UI.jsx'
import { supabase } from '../lib/supabase.js'
import SEO from '../components/SEO.jsx'

export default function Blog() {
  const [hovered, setHovered] = useState(null)
  const [activeTag, setActiveTag] = useState('All')
  const [posts, setPosts] = useState([])

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false }).then(({ data }) => setPosts(data || []))
  }, [])

  const allTags = ['All', ...new Set(posts.map(p => p.tag).filter(Boolean))]
  const filtered = activeTag === 'All' ? posts : posts.filter(p => p.tag === activeTag)

  return (
    <section style={{ minHeight: '100vh', padding: '120px 5% 80px', position: 'relative', overflow: 'hidden' }}>
      <SEO
        title="Blog"
        description="Dev insights on React Native, M-Pesa API, Supabase, cybersecurity and building in Kenya."
        url="/blog"
      />
      <GridBg />
      <GlowOrb style={{ width: '350px', height: '350px', background: 'rgba(124,58,237,0.1)', top: '15%', right: '-80px' }} />
      <GlowOrb style={{ width: '250px', height: '250px', background: 'rgba(6,182,212,0.07)', bottom: '20%', left: '-60px', animationDelay: '3s' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionLabel label="Blog & Insights" />
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 800, marginBottom: '16px' }}>
          Dev{' '}
          <span style={{ background: 'linear-gradient(135deg, #a78bfa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Insights</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '460px', lineHeight: 1.8, marginBottom: '40px', fontSize: '15px' }}>
          Thoughts on building, shipping, and surviving as a developer in Kenya's tech ecosystem.
        </p>

        {/* Tag filter */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)} style={{
              padding: '7px 18px', borderRadius: '20px',
              border: `1px solid ${activeTag === tag ? 'var(--purple)' : 'var(--border)'}`,
              background: activeTag === tag ? 'rgba(124,58,237,0.2)' : 'transparent',
              color: activeTag === tag ? '#fff' : 'var(--text-muted)',
              fontFamily: "'Space Mono', monospace", fontSize: '11px', cursor: 'pointer',
              transition: 'all 0.2s', letterSpacing: '0.05em',
            }}>{tag}</button>
          ))}
        </div>

        {/* Post list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>No posts yet — check back soon.</p>
          )}
          {filtered.map((post, i) => (
            <div
              key={post.id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === i ? 'var(--card-hover)' : 'var(--card-bg)',
                border: `1px solid ${hovered === i ? post.color + '40' : 'var(--border)'}`,
                borderRadius: '14px', padding: '28px 32px', cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: hovered === i ? 'translateX(8px)' : 'none',
                backdropFilter: 'blur(10px)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                gap: '20px', flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <Tag label={post.tag} color={post.color} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'var(--text-muted)' }}>{post.date}</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, fontFamily: "'Orbitron', monospace", marginBottom: '8px', lineHeight: 1.4 }}>{post.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '580px' }}>{post.excerpt}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'var(--text-muted)' }}>{post.read_time}</span>
                <span style={{ color: post.color, fontSize: '18px', transition: 'transform 0.2s', transform: hovered === i ? 'translateX(4px)' : 'none' }}>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div style={{ marginTop: '60px', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.1))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>📬</div>
          <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '20px', marginBottom: '10px' }}>Stay in the loop</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.7 }}>
            Get new articles, project updates, and dev tips delivered to your inbox.
          </p>
          <div style={{ display: 'flex', gap: '12px', maxWidth: '420px', margin: '0 auto' }}>
            <input placeholder="your@email.com" style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', fontFamily: "'Syne', sans-serif", fontSize: '14px', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--purple)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button style={{ padding: '12px 22px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', border: 'none', color: '#fff', fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Subscribe ✦
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
