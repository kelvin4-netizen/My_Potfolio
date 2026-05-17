import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { PageHeader, Btn, SaveBtn, FieldGroup, inputStyle, labelStyle, cardStyle } from '../../components/admin/AdminUI.jsx'

const EMPTY = { icon: '', title: '', desc: '', color: '#7c3aed', sort_order: 0 }

function ServiceForm({ service, onSave, onCancel }) {
  const [form, setForm] = useState(service || EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    if (service?.id) await supabase.from('services').update(form).eq('id', service.id)
    else await supabase.from('services').insert(form)
    setSaving(false)
    onSave()
  }

  return (
    <div style={{ maxWidth: '620px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: '13px' }}>← Back</button>
        <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: '18px', color: '#fff', margin: 0 }}>{service ? 'Edit Service' : 'New Service'}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FieldGroup label="Icon (emoji or text)">
          <input value={form.icon || ''} onChange={e => set('icon', e.target.value)} style={inputStyle} placeholder="🔒 or </>" />
        </FieldGroup>
        <FieldGroup label="Title">
          <input value={form.title || ''} onChange={e => set('title', e.target.value)} style={inputStyle} placeholder="Security Audits" />
        </FieldGroup>
        <FieldGroup label="Colour">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input value={form.color || ''} onChange={e => set('color', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <input type="color" value={form.color || '#7c3aed'} onChange={e => set('color', e.target.value)} style={{ width: '40px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer' }} />
          </div>
        </FieldGroup>
        <FieldGroup label="Sort order">
          <input type="number" value={form.sort_order || 0} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} style={inputStyle} />
        </FieldGroup>
      </div>

      <FieldGroup label="Description">
        <textarea rows={4} value={form.description || ''} onChange={e => set('description', e.target.value)} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} placeholder="What this service covers..." />
      </FieldGroup>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <SaveBtn loading={saving} onClick={save} />
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  )
}

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [editing, setEditing] = useState(null)

  const load = async () => {
    const { data } = await supabase.from('services').select('*').order('sort_order')
    setServices(data || [])
  }

  useEffect(() => { load() }, [])

  const remove = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    await supabase.from('services').delete().eq('id', id)
    load()
  }

  if (editing !== null)
    return <ServiceForm service={editing === 'new' ? null : editing} onSave={() => { setEditing(null); load() }} onCancel={() => setEditing(null)} />

  return (
    <div>
      <PageHeader title="Services" action={<Btn onClick={() => setEditing('new')}>+ New service</Btn>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {services.map(s => (
          <div key={s.id} style={{ ...cardStyle, position: 'relative' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = (s.color || '#7c3aed') + '50'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: (s.color || '#7c3aed') + '18', border: `1px solid ${s.color || '#7c3aed'}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{s.icon}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Btn variant="ghost" onClick={() => setEditing(s)}>Edit</Btn>
                <Btn variant="danger" onClick={() => remove(s.id, s.title)}>✕</Btn>
              </div>
            </div>
            <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '14px', color: '#fff', marginBottom: '8px' }}>{s.title}</h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{s.description}</p>
          </div>
        ))}
        {services.length === 0 && (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '60px', gridColumn: '1/-1' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>No services yet</p>
            <Btn onClick={() => setEditing('new')}>Add first service</Btn>
          </div>
        )}
      </div>
    </div>
  )
}
