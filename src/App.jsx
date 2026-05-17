import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Services from './pages/Services.jsx'
import Contact from './pages/Contact.jsx'
import Blog from './pages/Blog.jsx'

// Admin
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminLogin from './pages/admin/Login.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminProjects from './pages/admin/Projects.jsx'
import AdminServices from './pages/admin/Services.jsx'
import AdminAbout from './pages/admin/About.jsx'
import AdminBlog from './pages/admin/Blog.jsx'
import AdminMessages from './pages/admin/Messages.jsx'
import AdminSettings from './pages/admin/Settings.jsx'

const isHome = (path) => path === '/'
const isAdmin = (path) => path.startsWith('/admin')

export default function App() {
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const [ring, setRing] = useState({ x: -100, y: -100 })
  const location = useLocation()
  const home = isHome(location.pathname)
  const admin = isAdmin(location.pathname)

  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  useEffect(() => {
    const move = (e) => {
      setCursor({ x: e.clientX - 6, y: e.clientY - 6 })
      setTimeout(() => setRing({ x: e.clientX - 18, y: e.clientY - 18 }), 80)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <div className="cursor" style={{ left: cursor.x, top: cursor.y }} />
      <div className="cursor-ring" style={{ left: ring.x, top: ring.y }} />

      {/* Fixed hex background — shown on all pages except home and admin */}
      {!home && !admin && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          backgroundImage: "url('/bg-hex.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />
      )}

      {/* Dark overlay on top of hex image */}
      {!home && !admin && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: 'rgba(3, 2, 10, 0.6)',
          pointerEvents: 'none',
        }} />
      )}

      {!admin && <Navbar />}

      <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1, background: home || admin ? 'var(--bg)' : 'transparent' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>

      {!admin && <Footer />}
    </>
  )
}