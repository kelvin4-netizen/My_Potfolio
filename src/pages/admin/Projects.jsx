import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { PageHeader, Btn, cardStyle } from '../../components/admin/AdminUI.jsx'
import ProjectForm from '../../components/admin/ProjectForm.jsx'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(null) // null=list, 'new'=add, obj=edit
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('sort_order')
    setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const remove = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await supabase.from('projects').delete().eq('id', id)
    load()
  }

  if (editing !== null)
    return <ProjectForm
      project={editing === 'new' ? null : editing}
      onSave={() => { setEditing(null); load() }}
      onCancel={() => setEditing(null)}
    />

  return (
    <div>
      <PageHeader
        title="Projects"
        action={<Btn onClick={() => setEditing('new')}>+ New project</Btn>}
      />

      {loading ? (
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Loading...</p>
      ) : projects.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '60px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Syne', sans-serif", marginBottom: '20px' }}>No projects yet</p>
          <Btn onClick={() => setEditing('new')}>Add your first project</Btn>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {projects.map(p => (
            <div key={p.id} style={{
              ...cardStyle,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = (p.color || '#7c3aed') + '40'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              {/* Color dot */}
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.color || '#7c3aed', flexShrink: 0 }} />

              {/* Icon */}
              <span style={{ fontSize: '28px', flexShrink: 0 }}>{p.icon || '📁'}</span>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, color: '#fff', marginBottom: '2px', fontSize: '15px' }}>{p.title}</p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{p.subtitle}</p>
              </div>

              {/* Tags preview */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: '260px' }}>
                {(p.tags || []).slice(0, 3).map(t => (
                  <span key={t} style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '10px',
                    fontFamily: "'Space Mono', monospace",
                    background: (p.color || '#7c3aed') + '18',
                    border: `1px solid ${p.color || '#7c3aed'}30`,
                    color: p.color || '#7c3aed',
                  }}>{t}</span>
                ))}
              </div>

              {/* Order badge */}
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.25)', minWidth: '20px', textAlign: 'right' }}>#{p.sort_order}</span>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <Btn variant="ghost" onClick={() => setEditing(p)}>Edit</Btn>
                <Btn variant="danger" onClick={() => remove(p.id, p.title)}>Delete</Btn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
