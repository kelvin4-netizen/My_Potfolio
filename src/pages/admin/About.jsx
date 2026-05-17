import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { PageHeader, SaveBtn, Btn, FieldGroup, inputStyle, cardStyle } from '../../components/admin/AdminUI.jsx'

const DEFAULT = {
  bio1: "I'm a full-stack developer and CS student based in Kenya, passionate about building digital products that solve real problems for real people.",
  bio2: "From fintech platforms targeting mama mboga traders to apartment management apps for the Kenyan rental market — I build with purpose and precision.",
  bio3: "I'm also deeply interested in cybersecurity, cloud computing, and building systems that are not just functional but also secure and scalable.",
  tagline: 'Available for work',
  location: 'Kenya',
  cv_url: '#',
  skills: [
    { name: 'React / Next.js', level: 88 },
    { name: 'TypeScript', level: 80 },
    { name: 'React Native', level: 75 },
    { name: 'Node.js / Express', level: 82 },
    { name: 'Supabase / Firebase', level: 85 },
    { name: 'Python', level: 78 },
    { name: 'Cybersecurity', level: 70 },
    { name: 'UI/UX Design', level: 76 },
  ],
  stack: 'React,Next.js,TypeScript,JavaScript,React Native,Expo,Node.js,Express,Python,Supabase,Firebase,PostgreSQL,M-Pesa API,Tailwind CSS,Vite,Git',
  education: [
    { year: '2023–Now', title: 'BSc Computer Science', sub: 'Kirinyaga University' },
    { year: '2024', title: 'Cloud Security Path', sub: 'Microsoft Learn + AWS Free Tier' },
    { year: '2024', title: 'Cybersecurity Path', sub: 'TryHackMe' },
  ],
}

export default function AdminAbout() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [recordId, setRecordId] = useState(null)

  useEffect(() => {
    supabase.from('about').select('*').limit(1).single().then(({ data }) => {
      if (data) {
        setRecordId(data.id)
        setForm({
          ...DEFAULT,
          ...data,
          skills: Array.isArray(data.skills) ? data.skills : DEFAULT.skills,
          education: Array.isArray(data.education) ? data.education : DEFAULT.education,
          stack: Array.isArray(data.stack) ? data.stack.join(',') : (data.stack || DEFAULT.stack),
        })
      } else {
        setForm(DEFAULT)
      }
    })
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    const payload = {
      ...form,
      stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
    }
    if (recordId) await supabase.from('about').update(payload).eq('id', recordId)
    else {
      const { data } = await supabase.from('about').insert(payload).select().single()
      if (data) setRecordId(data.id)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const updateSkill = (i, key, val) => {
    const skills = [...(form.skills || [])]
    skills[i] = { ...skills[i], [key]: key === 'level' ? parseInt(val) || 0 : val }
    set('skills', skills)
  }

  const addSkill = () => set('skills', [...(form.skills || []), { name: '', level: 75 }])
  const removeSkill = (i) => set('skills', form.skills.filter((_, idx) => idx !== i))

  const updateEdu = (i, key, val) => {
    const ed = [...(form.education || [])]
    ed[i] = { ...ed[i], [key]: val }
    set('education', ed)
  }
  const addEdu = () => set('education', [...(form.education || []), { year: '', title: '', sub: '' }])
  const removeEdu = (i) => set('education', form.education.filter((_, idx) => idx !== i))

  if (!form) return <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>Loading...</p>

  return (
    <div style={{ maxWidth: '800px' }}>
      <PageHeader
        title="About"
        action={
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {saved && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#10b981' }}>✓ Saved</span>}
            <SaveBtn loading={saving} onClick={save} />
          </div>
        }
      />

      {/* Bio */}
      <div style={{ ...cardStyle, marginBottom: '20px' }}>
        <p style={{ fontFamily: "'Orbitron', monospace", fontSize: '12px', color: '#a78bfa', marginBottom: '20px', letterSpacing: '0.1em' }}>BIO</p>
        <FieldGroup label="Paragraph 1">
          <textarea rows={3} value={form.bio1 || ''} onChange={e => set('bio1', e.target.value)} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
        </FieldGroup>
        <FieldGroup label="Paragraph 2">
          <textarea rows={3} value={form.bio2 || ''} onChange={e => set('bio2', e.target.value)} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
        </FieldGroup>
        <FieldGroup label="Paragraph 3">
          <textarea rows={3} value={form.bio3 || ''} onChange={e => set('bio3', e.target.value)} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
        </FieldGroup>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FieldGroup label="CV / Resume URL">
            <input value={form.cv_url || ''} onChange={e => set('cv_url', e.target.value)} style={inputStyle} placeholder="https://..." />
          </FieldGroup>
          <FieldGroup label="Location">
            <input value={form.location || ''} onChange={e => set('location', e.target.value)} style={inputStyle} placeholder="Kenya" />
          </FieldGroup>
        </div>
      </div>

      {/* Skills */}
      <div style={{ ...cardStyle, marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <p style={{ fontFamily: "'Orbitron', monospace", fontSize: '12px', color: '#a78bfa', letterSpacing: '0.1em', margin: 0 }}>SKILLS</p>
          <Btn variant="ghost" onClick={addSkill} style={{ fontSize: '12px', padding: '5px 12px' }}>+ Add skill</Btn>
        </div>
        {(form.skills || []).map((skill, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px auto', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
            <input value={skill.name || ''} onChange={e => updateSkill(i, 'name', e.target.value)} style={inputStyle} placeholder="React / Next.js" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="number" min="0" max="100" value={skill.level || 0} onChange={e => updateSkill(i, 'level', e.target.value)} style={{ ...inputStyle, width: '70px' }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#06b6d4' }}>{skill.level}%</span>
            </div>
            <Btn variant="danger" onClick={() => removeSkill(i)} style={{ padding: '8px 10px' }}>✕</Btn>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      <div style={{ ...cardStyle, marginBottom: '20px' }}>
        <p style={{ fontFamily: "'Orbitron', monospace", fontSize: '12px', color: '#a78bfa', marginBottom: '16px', letterSpacing: '0.1em' }}>FULL TECH STACK</p>
        <FieldGroup label="Technologies (comma separated)">
          <textarea rows={3} value={form.stack || ''} onChange={e => set('stack', e.target.value)} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} placeholder="React, Node.js, Supabase..." />
        </FieldGroup>
      </div>

      {/* Education */}
      <div style={{ ...cardStyle, marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <p style={{ fontFamily: "'Orbitron', monospace", fontSize: '12px', color: '#a78bfa', letterSpacing: '0.1em', margin: 0 }}>EDUCATION & CERTS</p>
          <Btn variant="ghost" onClick={addEdu} style={{ fontSize: '12px', padding: '5px 12px' }}>+ Add</Btn>
        </div>
        {(form.education || []).map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr auto', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
            <input value={item.year || ''} onChange={e => updateEdu(i, 'year', e.target.value)} style={inputStyle} placeholder="2024" />
            <input value={item.title || ''} onChange={e => updateEdu(i, 'title', e.target.value)} style={inputStyle} placeholder="BSc Computer Science" />
            <input value={item.sub || ''} onChange={e => updateEdu(i, 'sub', e.target.value)} style={inputStyle} placeholder="Kirinyaga University" />
            <Btn variant="danger" onClick={() => removeEdu(i)} style={{ padding: '8px 10px' }}>✕</Btn>
          </div>
        ))}
      </div>

      <SaveBtn loading={saving} onClick={save} />
    </div>
  )
}
