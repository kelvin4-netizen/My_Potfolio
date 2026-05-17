import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { cardStyle } from '../../components/admin/AdminUI.jsx'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({ projects: 0, services: 0, blog: 0, messages: 0, unread: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('id', { count: 'exact', head: true }).eq('read', false),
    ]).then(([p, s, b, m, u]) => setCounts({
      projects: p.count || 0,
      services: s.count || 0,
      blog: b.count || 0,
      messages: m.count || 0,
      unread: u.count || 0,
    }))
  }, [])

  const sections = [
    { label: 'Projects', count: counts.projects, icon: '◈', color: '#7c3aed', path: '/admin/projects', desc: 'Add, edit or remove portfolio projects' },
    { label: 'Services', count: counts.services, icon: '✦', color: '#06b6d4', path: '/admin/services', desc: 'Update your service offerings' },
    { label: 'About', count: null, icon: '◉', color: '#ec4899', path: '/admin/about', desc: 'Edit bio, skills, and education' },
    { label: 'Blog', count: counts.blog, icon: '✎', color: '#f59e0b', path: '/admin/blog', desc: 'Write and publish blog posts' },
    {
      label: 'Messages',
      count: counts.messages,
      badge: counts.unread > 0 ? `${counts.unread} new` : null,
      icon: '✉',
      color: '#10b981',
      path: '/admin/messages',
      desc: 'View messages from your contact form',
    },
    { label: 'Settings', count: null, icon: '⚙', color: '#3b82f6', path: '/admin/settings', desc: 'Site info, social links, meta' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: '22px', color: '#fff', marginBottom: '6px' }}>Dashboard</h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
          kmmucheru.dev — portfolio admin
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {sections.map(({ label, count, badge, icon, color, path, desc }) => (
          <div
            key={label}
            onClick={() => navigate(path)}
            style={{ ...cardStyle, cursor: 'pointer', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color + '50'; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', color }}>{icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                {count !== null && (
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '22px', fontWeight: 700, color }}>{count}</span>
                )}
                {badge && (
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', background: color + '20', border: `1px solid ${color}40`, color, padding: '2px 8px', borderRadius: '20px' }}>{badge}</span>
                )}
              </div>
            </div>
            <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '14px', color: '#fff', marginBottom: '6px' }}>{label}</h3>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{desc}</p>
            <div style={{ marginTop: '16px', fontFamily: "'Space Mono', monospace", fontSize: '11px', color, opacity: 0.8 }}>Manage →</div>
          </div>
        ))}
      </div>
    </div>
  )
}
