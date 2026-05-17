import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { PageHeader, SaveBtn, FieldGroup, inputStyle, cardStyle } from '../../components/admin/AdminUI.jsx'

const DEFAULTS = {
  site_name: 'Kelvin Maina Mucheru',
  site_tagline: 'Full-Stack Developer based in Kenya',
  contact_email: '',
  twitter: '',
  github: '',
  linkedin: '',
  whatsapp: '',
  available_for_work: 'true',
  stats_experience: '3+',
  stats_projects: '20+',
  stats_clients: '10+',
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('key, value').then(({ data }) => {
      if (data && data.length > 0) {
        const map = {}
        data.forEach(({ key, value }) => { map[key] = value })
        setSettings(s => ({ ...s, ...map }))
      }
    })
  }, [])

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }))

  const save = async () => {
    setSaving(true)
    const upserts = Object.entries(settings).map(([key, value]) => ({ key, value }))
    await supabase.from('settings').upsert(upserts, { onConflict: 'key' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inp = (key, placeholder = '') => (
    <input value={settings[key] || ''} onChange={e => set(key, e.target.value)} style={inputStyle} placeholder={placeholder} />
  )

  return (
    <div style={{ maxWidth: '700px' }}>
      <PageHeader
        title="Settings"
        action={
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {saved && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#10b981' }}>✓ Saved</span>}
            <SaveBtn loading={saving} onClick={save} />
          </div>
        }
      />

      {/* Site info */}
      <div style={{ ...cardStyle, marginBottom: '20px' }}>
        <p style={{ fontFamily: "'Orbitron', monospace", fontSize: '12px', color: '#a78bfa', marginBottom: '20px', letterSpacing: '0.1em' }}>SITE INFO</p>
        <FieldGroup label="Your name">{inp('site_name', 'Kelvin Maina Mucheru')}</FieldGroup>
        <FieldGroup label="Tagline (shown under your name)">{inp('site_tagline', 'Full-Stack Developer based in Kenya')}</FieldGroup>
        <FieldGroup label="Contact email">{inp('contact_email', 'you@email.com')}</FieldGroup>
        <FieldGroup label="Available for work">
          <select value={settings.available_for_work} onChange={e => set('available_for_work', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="true">Yes — show green badge</option>
            <option value="false">No — hide badge</option>
          </select>
        </FieldGroup>
      </div>

      {/* Social links */}
      <div style={{ ...cardStyle, marginBottom: '20px' }}>
        <p style={{ fontFamily: "'Orbitron', monospace", fontSize: '12px', color: '#a78bfa', marginBottom: '20px', letterSpacing: '0.1em' }}>SOCIAL LINKS</p>
        <FieldGroup label="GitHub">{inp('github', 'https://github.com/kmmucheru')}</FieldGroup>
        <FieldGroup label="LinkedIn">{inp('linkedin', 'https://linkedin.com/in/...')}</FieldGroup>
        <FieldGroup label="Twitter / X">{inp('twitter', 'https://twitter.com/...')}</FieldGroup>
        <FieldGroup label="WhatsApp (number with country code)">{inp('whatsapp', '+254700000000')}</FieldGroup>
      </div>

      {/* Homepage stats */}
      <div style={{ ...cardStyle, marginBottom: '20px' }}>
        <p style={{ fontFamily: "'Orbitron', monospace", fontSize: '12px', color: '#a78bfa', marginBottom: '20px', letterSpacing: '0.1em' }}>HOMEPAGE STATS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <FieldGroup label="Years experience">{inp('stats_experience', '3+')}</FieldGroup>
          <FieldGroup label="Projects done">{inp('stats_projects', '20+')}</FieldGroup>
          <FieldGroup label="Happy clients">{inp('stats_clients', '10+')}</FieldGroup>
        </div>
      </div>

      <SaveBtn loading={saving} onClick={save} />
    </div>
  )
}
