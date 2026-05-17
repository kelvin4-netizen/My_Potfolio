import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlowOrb, GlowButton, Tag } from '../components/UI.jsx'
import { supabase } from '../lib/supabase.js'
import SEO from '../components/SEO.jsx'

function useTypewriter(phrases) {
  const [typed, setTyped] = useState('')
  const phraseIdx = useRef(0)
  const charIdx = useRef(0)
  const deleting = useRef(false)
  useEffect(() => {
    let timeout
    const tick = () => {
      const phrase = phrases[phraseIdx.current]
      if (!deleting.current) {
        setTyped(phrase.substring(0, charIdx.current + 1))
        charIdx.current++
        if (charIdx.current === phrase.length) {
          deleting.current = true; timeout = setTimeout(tick, 1800); return
        }
      } else {
        setTyped(phrase.substring(0, charIdx.current - 1))
        charIdx.current--
        if (charIdx.current === 0) { deleting.current = false; phraseIdx.current = (phraseIdx.current + 1) % phrases.length }
      }
      timeout = setTimeout(tick, deleting.current ? 60 : 90)
    }
    timeout = setTimeout(tick, 500)
    return () => clearTimeout(timeout)
  }, [])
  return typed
}

export default function Home() {
  const navigate = useNavigate()
  const typed = useTypewriter(['Full-Stack Developer', 'UI/UX Designer', 'Mobile Developer', 'Problem Solver'])
  const [featuredProject, setFeaturedProject] = useState(null)
  const [settings, setSettings] = useState({})
  const [entered, setEntered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [avatarLoaded, setAvatarLoaded] = useState(false)
  const avatarRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    supabase.from('projects').select('*').order('sort_order').limit(1).single().then(({ data }) => { if (data) setFeaturedProject(data) })
    supabase.from('settings').select('key, value').then(({ data }) => {
      if (data) { const map = {}; data.forEach(({ key, value }) => { map[key] = value }); setSettings(map) }
    })
    setTimeout(() => setEntered(true), 100)
  }, [])

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    const pts = Array.from({ length: 160 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.5 + .3,
      c: ['124,58,237', '6,182,212', '236,72,153', '167,139,250'][Math.floor(Math.random() * 4)],
      p: Math.random() * Math.PI * 2, s: Math.random() * .03 + .01,
    }))
    let mx = -1000, my = -1000
    const onMove = e => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', onMove)
    let raf
    const loop = () => {
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.p += p.s
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        const d = Math.hypot(p.x - mx, p.y - my)
        if (d < 140) { p.x += (p.x - mx) * .025; p.y += (p.y - my) * .025 }
        const o = .15 + Math.sin(p.p) * .12
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + Math.sin(p.p) * .3), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.c},${o})`; ctx.fill()
      })
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
        if (d < 90) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
          ctx.strokeStyle = `rgba(124,58,237,${(1 - d / 90) * .07})`; ctx.lineWidth = .4; ctx.stroke()
        }
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('mousemove', onMove) }
  }, [])

  // Avatar 3D tilt
  const handleAvatarMove = e => {
    const el = avatarRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - .5
    const y = (e.clientY - r.top) / r.height - .5
    setTilt({ x, y })
  }
  const handleAvatarLeave = () => setTilt({ x: 0, y: 0 })

  const stats = [
    [settings.stats_experience || '3+', 'Years Experience'],
    [settings.stats_projects || '20+', 'Projects Done'],
    [settings.stats_clients || '10+', 'Happy Clients'],
  ]
  const available = settings.available_for_work !== 'false'

  return (
    <>
    <div className="home-no-hexbg" style={{ display: 'none' }} />
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 5%', paddingTop: '70px', position: 'relative', overflow: 'hidden' }}>
      <SEO title="Home" description="Kelvin Maina Mucheru — Full-stack developer in Kenya building fast, modern, and impactful digital experiences." url="/" />

      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* Scanline overlay */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.05) 2px,rgba(0,0,0,.05) 4px)', pointerEvents: 'none', zIndex: 1 }} />

      {/* Ambient orbs */}
      <GlowOrb style={{ width: '500px', height: '500px', background: 'rgba(124,58,237,.12)', top: '-100px', right: '5%', zIndex: 1 }} />
      <GlowOrb style={{ width: '300px', height: '300px', background: 'rgba(6,182,212,.08)', bottom: '0', left: '-80px', animationDelay: '3s', zIndex: 1 }} />

      {/* LEFT: Text content */}
      <div style={{ maxWidth: '600px', position: 'relative', zIndex: 2, flex: 1 }}>

        {/* Available badge */}
        {available && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', opacity: entered ? 1 : 0, transform: entered ? 'none' : 'translateY(20px)', transition: 'all .8s cubic-bezier(.16,1,.3,1)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 16px #10b981', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#10b981', letterSpacing: '.25em' }}>AVAILABLE FOR WORK</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,rgba(16,185,129,.4),transparent)', maxWidth: '120px' }} />
          </div>
        )}

        {/* Name */}
        <div style={{ opacity: entered ? 1 : 0, transform: entered ? 'none' : 'translateY(30px)', transition: 'all .9s .1s cubic-bezier(.16,1,.3,1)' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,.3)', letterSpacing: '.2em', display: 'block', marginBottom: '10px' }}>{'{ HI, I\'M }'}</span>
          <h1 style={{ fontFamily: "'Orbitron', monospace", lineHeight: 1.05, marginBottom: '8px' }}>
            <span style={{ fontSize: 'clamp(52px,8vw,84px)', fontWeight: 900, display: 'block', background: 'linear-gradient(135deg,#a78bfa 0%,#06b6d4 60%,#fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'glitch 5s infinite' }}>KELVIN</span>
            <span style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: '#fff', display: 'block' }}>MAINA MUCHERU</span>
          </h1>
          {/* Animated line */}
          <svg width="280" height="16" viewBox="0 0 280 16" style={{ display: 'block', margin: '8px 0' }}>
            <line x1="0" y1="8" x2="280" y2="8" stroke="url(#lg)" strokeWidth="1" strokeDasharray="280" style={{ animation: 'drawLine 1.5s .5s ease forwards', strokeDashoffset: 280 }} />
            <defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="60%" stopColor="#06b6d4" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
          </svg>
        </div>

        {/* Typewriter */}
        <div style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0 24px', opacity: entered ? 1 : 0, transition: 'all .9s .25s cubic-bezier(.16,1,.3,1)' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: 'rgba(255,255,255,.3)' }}>//</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '15px', color: '#a78bfa' }}>{typed}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '20px', color: '#06b6d4', animation: 'blink 1s infinite' }}>_</span>
        </div>

        {/* Description */}
        <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(255,255,255,.5)', maxWidth: '480px', marginBottom: '36px', fontFamily: "'Syne', sans-serif", opacity: entered ? 1 : 0, transform: entered ? 'none' : 'translateY(20px)', transition: 'all .9s .35s cubic-bezier(.16,1,.3,1)' }}>
          Building fast, modern, and impactful digital experiences — from fintech to EdTech. Tailored for African markets, built for the world.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '52px', opacity: entered ? 1 : 0, transform: entered ? 'none' : 'translateY(20px)', transition: 'all .9s .45s cubic-bezier(.16,1,.3,1)' }}>
          <GlowButton onClick={() => navigate('/projects')}>Explore My Work →</GlowButton>
          <GlowButton variant="ghost" onClick={() => navigate('/contact')}>Get In Touch</GlowButton>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '40px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,.07)', opacity: entered ? 1 : 0, transform: entered ? 'none' : 'translateY(20px)', transition: 'all .9s .55s cubic-bezier(.16,1,.3,1)' }}>
          {stats.map(([val, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg,#a78bfa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{val}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.35)', marginTop: '4px', letterSpacing: '.1em', fontFamily: "'Space Mono', monospace" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Avatar */}
      <div
        ref={avatarRef}
        onMouseMove={handleAvatarMove}
        onMouseLeave={handleAvatarLeave}
        style={{
          position: 'relative', zIndex: 2, flexShrink: 0,
          width: 'clamp(320px,40vw,520px)',
          marginLeft: '4%',
          opacity: entered ? 1 : 0,
          transition: 'opacity 1.2s .6s ease',
        }}
      >
        {/* Rotating conic ring behind avatar */}
        <div style={{
          position: 'absolute', inset: '-20px',
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, transparent 60%, rgba(124,58,237,.4) 75%, rgba(6,182,212,.5) 85%, transparent 100%)',
          animation: 'spinRing 6s linear infinite',
          zIndex: 0,
        }} />
        {/* Second ring */}
        <div style={{
          position: 'absolute', inset: '-8px',
          borderRadius: '50%',
          background: 'conic-gradient(from 180deg, transparent 60%, rgba(236,72,153,.3) 75%, rgba(124,58,237,.4) 85%, transparent 100%)',
          animation: 'spinRing 9s linear infinite reverse',
          zIndex: 0,
        }} />

        {/* Glow halo */}
        <div style={{
          position: 'absolute', inset: '10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,.35) 0%, rgba(6,182,212,.2) 50%, transparent 70%)',
          filter: 'blur(30px)',
          animation: 'haloPulse 4s ease-in-out infinite',
          zIndex: 0,
        }} />

        {/* Avatar image */}
        <div style={{
          position: 'relative', zIndex: 1,
          borderRadius: '20px',
          overflow: 'hidden',
          transform: `perspective(900px) rotateY(${tilt.x * 18}deg) rotateX(${-tilt.y * 18}deg) translateY(${Math.sin(Date.now() * .001) * 0}px)`,
          transition: tilt.x === 0 ? 'transform .8s cubic-bezier(.16,1,.3,1)' : 'transform .1s ease-out',
          boxShadow: `${tilt.x * 20}px ${tilt.y * 10}px 60px rgba(124,58,237,.4), 0 0 80px rgba(6,182,212,.15)`,
          animation: 'avatarFloat 6s ease-in-out infinite',
        }}>
          {/* Scanline overlay on image */}
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.08) 3px,rgba(0,0,0,.08) 4px)', zIndex: 2, pointerEvents: 'none', borderRadius: '20px' }} />
          {/* Glitch color overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(124,58,237,.15) 0%,transparent 50%,rgba(6,182,212,.1) 100%)', zIndex: 2, pointerEvents: 'none', borderRadius: '20px' }} />
          {/* Corner accents */}
          {[['0','0','borderTop','borderLeft'],['0','auto','borderTop','borderRight'],['auto','0','borderBottom','borderLeft'],['auto','auto','borderBottom','borderRight']].map(([t,r,b1,b2],i) => (
            <div key={i} style={{ position: 'absolute', top: t === '0' ? 12 : 'auto', bottom: t === 'auto' ? 12 : 'auto', left: r === '0' ? 12 : 'auto', right: r === 'auto' ? 12 : 'auto', width: 20, height: 20, [b1]: '2px solid #7c3aed', [b2]: '2px solid #7c3aed', zIndex: 3, opacity: .8 }} />
          ))}
          <img
            src="/avatar.jpg"
            alt="Kelvin Maina Mucheru — Cyberpunk Developer"
            onLoad={() => setAvatarLoaded(true)}
            style={{ width: '100%', height: 'auto', display: 'block', filter: 'contrast(1.05) saturate(1.1) brightness(.95)', borderRadius: '20px' }}
          />
        </div>

        {/* Floating badges */}
        <div style={{ position: 'absolute', top: '-16px', right: '-16px', background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.4)', borderRadius: '20px', padding: '6px 14px', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#10b981', zIndex: 4, animation: 'floatBadge1 4s ease-in-out infinite', backdropFilter: 'blur(10px)' }}>
          ● ONLINE
        </div>
        <div style={{ position: 'absolute', bottom: '15%', left: '-24px', background: 'rgba(124,58,237,.12)', border: '1px solid rgba(124,58,237,.4)', borderRadius: '20px', padding: '6px 14px', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#a78bfa', zIndex: 4, animation: 'floatBadge2 5s ease-in-out infinite', backdropFilter: 'blur(10px)' }}>
          &lt;/&gt; Building
        </div>
        <div style={{ position: 'absolute', bottom: '-16px', right: '10%', background: 'rgba(6,182,212,.1)', border: '1px solid rgba(6,182,212,.35)', borderRadius: '20px', padding: '6px 14px', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#06b6d4', zIndex: 4, animation: 'floatBadge1 6s ease-in-out infinite .5s', backdropFilter: 'blur(10px)' }}>
          🇰🇪 Nanyuki, KE
        </div>
      </div>

      <style>{`
        @keyframes glitch {
          0%,89%,100%{filter:none}
          90%{filter:drop-shadow(-3px 0 #06b6d4) drop-shadow(3px 0 #ec4899);transform:skewX(-1deg)}
          92%{filter:none;transform:none}
          94%{filter:drop-shadow(3px 0 #06b6d4) drop-shadow(-2px 0 #a78bfa);transform:skewX(1deg)}
          96%{filter:none;transform:none}
        }
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 16px #10b981}50%{opacity:.6;box-shadow:0 0 8px #10b981}}
        @keyframes spinRing{to{transform:rotate(360deg)}}
        @keyframes haloPulse{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes avatarFloat{0%,100%{transform:translateY(0px)}50%{transform:translateY(-14px)}}
        @keyframes floatBadge1{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes floatBadge2{0%,100%{transform:translateY(0) translateX(0)}33%{transform:translateY(-10px) translateX(3px)}66%{transform:translateY(-5px) translateX(-2px)}}
        @keyframes drawLine{to{stroke-dashoffset:0}}
      `}</style>
    </section>
    </>
  )
}