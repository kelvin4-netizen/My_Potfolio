import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { inputStyle, labelStyle, Btn, SaveBtn, FieldGroup } from './AdminUI.jsx'

const EMPTY = {
  title: '', subtitle: '', description: '', icon: '', color: '#7c3aed',
  tags: [], highlights: [], problem: '', solution: '',
  process: '', results: '', live_url: '', code_url: '', sort_order: 0,
}

export default function ProjectForm({ project, onSave, onCancel }) {
  const [form, setForm] = useState(project || EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.title.trim()) { setError('Title is required'); return }
    setSaving(true); setError('')
    try {
      if (project?.id) {
        const { error } = await supabase.from('projects').update(form).eq('id', project.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('projects').insert(form)
        if (error) throw error
      }
      onSave()
    } catch (e) {
      setError(e.message)
    }
    setSaving(false)
  }

  const ta = (key, rows = 4, placeholder = '') => (
    <textarea
      rows={rows}
      placeholder={placeholder}
      value={form[key] || ''}
      onChange={e => set(key, e.target.value)}
      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
    />
  )

  return (
    <div style={{ maxWidth: '860px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={onCancel} style={{
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
          fontFamily: "'Syne', sans-serif", fontSize: '13px',
        }}>← Back</button>
        <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: '20px', color: '#fff', margin: 0 }}>
          {project ? 'Edit Project' : 'New Project'}
        </h1>
      </div>

      {error && (
        <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Grid: basic fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '4px' }}>
        <FieldGroup label="Title *">
          <input value={form.title} onChange={e => set('title', e.target.value)} style={inputStyle} placeholder="ChuoFund" />
        </FieldGroup>
        <FieldGroup label="Subtitle">
          <input value={form.subtitle || ''} onChange={e => set('subtitle', e.target.value)} style={inputStyle} placeholder="Scholarship Discovery App" />
        </FieldGroup>
        <FieldGroup label="Icon (emoji)">
          <input value={form.icon || ''} onChange={e => set('icon', e.target.value)} style={inputStyle} placeholder="📚" />
        </FieldGroup>
        <FieldGroup label="Accent colour (hex)">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input value={form.color || ''} onChange={e => set('color', e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="#7c3aed" />
            <input type="color" value={form.color || '#7c3aed'} onChange={e => set('color', e.target.value)}
              style={{ width: '40px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'none' }} />
          </div>
        </FieldGroup>
        <FieldGroup label="Live URL">
          <input value={form.live_url || ''} onChange={e => set('live_url', e.target.value)} style={inputStyle} placeholder="https://" />
        </FieldGroup>
        <FieldGroup label="Code URL">
          <input value={form.code_url || ''} onChange={e => set('code_url', e.target.value)} style={inputStyle} placeholder="https://github.com/..." />
        </FieldGroup>
        <FieldGroup label="Tags (comma separated)">
          <input
            value={(form.tags || []).join(', ')}
            onChange={e => set('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            style={inputStyle}
            placeholder="React, Vite, Supabase"
          />
        </FieldGroup>
        <FieldGroup label="Sort order (lower = first)">
          <input type="number" value={form.sort_order || 0} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} style={inputStyle} />
        </FieldGroup>
      </div>

      {/* Description */}
      <FieldGroup label="Short description (shown on project cards)">
        {ta('description', 3, 'A brief description shown on the projects page...')}
      </FieldGroup>

      {/* Highlights */}
      <FieldGroup label="Highlights (one per line — shown as bullet points on cards)">
        <textarea
          rows={4}
          value={(form.highlights || []).join('\n')}
          onChange={e => set('highlights', e.target.value.split('\n').filter(Boolean))}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          placeholder="54+ scholarships aggregated&#10;Covers all 47 counties&#10;SMS deadline reminders"
        />
      </FieldGroup>

      {/* Case study fields */}
      <p style={{ ...labelStyle, marginBottom: '16px', color: 'rgba(124,58,237,0.8)' }}>— CASE STUDY SECTIONS —</p>
      <FieldGroup label="Problem">{ta('problem', 4, 'What problem does this project solve?')}</FieldGroup>
      <FieldGroup label="Solution">{ta('solution', 4, 'How did you solve it?')}</FieldGroup>
      <FieldGroup label="Process">{ta('process', 4, 'How was it built?')}</FieldGroup>
      <FieldGroup label="Results">{ta('results', 4, 'What were the outcomes?')}</FieldGroup>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <SaveBtn loading={saving} onClick={save} />
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  )
}
