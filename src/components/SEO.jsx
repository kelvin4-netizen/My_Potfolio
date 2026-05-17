import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://my-potfolio-psi-rust.vercel.app'

export default function SEO({
  title,
  description,
  keywords,
  image = '/og-image.png',
  url,
}) {
  const fullTitle = title
    ? `${title} | Kelvin Maina Mucheru`
    : 'Kelvin Maina Mucheru | Full-Stack Developer'

  const fullDesc =
    description ||
    'Full-stack developer based in Kenya building fast, modern, and impactful digital experiences.'

  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDesc} />
      <meta name="keywords" content={keywords || 'full-stack developer, Kenya, React, Next.js, mobile apps, UI/UX'} />
      <meta name="author" content="Kelvin Maina Mucheru" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph (WhatsApp, Facebook, LinkedIn previews) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDesc} />
      <meta property="og:image" content={`${BASE_URL}${image}`} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Kelvin Maina Mucheru" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDesc} />
      <meta name="twitter:image" content={`${BASE_URL}${image}`} />
      <meta name="twitter:creator" content="@yourtwitterhandle" />

      {/* Misc */}
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#7c3aed" />
    </Helmet>
  )
}