import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { PageHeader, Btn, SaveBtn, FieldGroup, inputStyle, labelStyle, cardStyle } from '../../components/admin/AdminUI.jsx'

const EMPTY = { title: '', date: '', tag: '', read_time: '', color: '#06b6d4', excerpt: '', content: '', published: false }

function PostForm({ post, onSave, onCancel }) {
  const [form, setForm] = useState(post || EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    if (post?.id) await supabase.from('blog_posts').update(form).eq('id', post.id)
    else await supabase.from('blog_posts').insert(form)
    setSaving(false)
    onSave()
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: '13px' }}>← Back</button>
        <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: '18px', color: '#fff', margin: 0 }}>{post ? 'Edit Post' : 'New Post'}</h1>
        <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: form.published ? '#10b981' : 'rgba(255,255,255,0.4)' }}>
            {form.published ? 'Published' : 'Draft'}
          </span>
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FieldGroup label="Title *">
          <input value={form.title} onChange={e => set('title', e.target.value)} style={inputStyle} placeholder="Building M-Pesa Integration..." />
        </FieldGroup>
        <FieldGroup label="Tag / Category">
          <input value={form.tag || ''} onChange={e => set('tag', e.target.value)} style={inputStyle} placeholder="Mobile Dev" />
        </FieldGroup>
        <FieldGroup label="Date">
          <input value={form.date || ''} onChange={e => set('date', e.target.value)} style={inputStyle} placeholder="Apr 2026" />
        </FieldGroup>
        <FieldGroup label="Read time">
          <input value={form.read_time || ''} onChange={e => set('read_time', e.target.value)} style={inputStyle} placeholder="8 min read" />
        </FieldGroup>
        <FieldGroup label="Accent colour">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input value={form.color || ''} onChange={e => set('color', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <input type="color" value={form.color || '#06b6d4'} onChange={e => set('color', e.target.value)} style={{ width: '40px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer' }} />
          </div>
        </FieldGroup>
      </div>

      <FieldGroup label="Excerpt (shown on blog list)">
        <textarea rows={3} value={form.excerpt || ''} onChange={e => set('excerpt', e.target.value)} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} placeholder="A brief preview of the post..." />
      </FieldGroup>

      <FieldGroup label="Full content">
        <textarea rows={14} value={form.content || ''} onChange={e => set('content', e.target.value)} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, fontFamily: "'Space Mono', monospace", fontSize: '13px' }} placeholder="Write your post here..." />
      </FieldGroup>

      <div style={{ display: 'flex', gap: '12px' }}>
        <SaveBtn loading={saving} onClick={save} />
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  )
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(null)

  const load = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
  }

  useEffect(() => { load() }, [])

  const remove = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    await supabase.from('blog_posts').delete().eq('id', id)
    load()
  }

  const togglePublish = async (post) => {
    await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id)
    load()
  }

  if (editing !== null)
    return <PostForm post={editing === 'new' ? null : editing} onSave={() => { setEditing(null); load() }} onCancel={() => setEditing(null)} />

  return (
    <div>
      <PageHeader title="Blog" action={<Btn onClick={() => setEditing('new')}>+ New post</Btn>} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {posts.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '60px' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>No posts yet</p>
            <Btn onClick={() => setEditing('new')}>Write your first post</Btn>
          </div>
        ) : posts.map(p => (
          <div key={p.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = (p.color || '#06b6d4') + '40'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color || '#06b6d4', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, color: '#fff', marginBottom: '3px' }}>{p.title}</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{p.date}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: p.color || '#06b6d4' }}>{p.tag}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>{p.read_time}</span>
              </div>
            </div>
            <button onClick={() => togglePublish(p)} style={{
              padding: '4px 12px', borderRadius: '20px',
              border: `1px solid ${p.published ? '#10b981' : 'rgba(255,255,255,0.15)'}40`,
              background: p.published ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
              color: p.published ? '#10b981' : 'rgba(255,255,255,0.35)',
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px', cursor: 'pointer', letterSpacing: '0.05em',
            }}>
              {p.published ? '● Live' : '○ Draft'}
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Btn variant="ghost" onClick={() => setEditing(p)}>Edit</Btn>
              <Btn variant="danger" onClick={() => remove(p.id, p.title)}>Delete</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
