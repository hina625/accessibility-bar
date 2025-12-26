'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

// --- Premium Icons ---

function IconAccessibility() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4C13.1046 4 14 3.10457 14 2C14 0.89543 13.1046 0 12 0C10.8954 0 10 0.89543 10 2C10 3.10457 10.8954 4 12 4Z" fill="currentColor" />
      <path d="M21.5 6H15.5V5H8.5V6H2.5C1.67 6 1 6.67 1 7.5V11H3V22H5V15H7V22H9V15H10V11H8V9H10V11C10 11.55 10.45 12 11 12H13C13.55 12 14 11.55 14 11V7H16V22H18V15H20V22H22V11H23V7.5C23 6.67 22.33 6 21.5 6Z" fill="currentColor" />
    </svg>
  )
}

function IconSparkle() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#sparkle-grad)" />
      <defs>
        <linearGradient id="sparkle-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// --- Components ---

function Nav({ onChangeName, author }: { onChangeName: () => void; author: string }) {
  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <nav style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <IconAccessibility />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: '#1e1b4b' }}>A11yBar</div>
            <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pro Studio</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#features" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Features</a>
          <a href="#showcase" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Showcase</a>
          <button
            onClick={onChangeName}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              padding: '8px 16px',
              borderRadius: 10,
              cursor: 'pointer',
              color: '#1e293b',
              fontWeight: 700,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }}></span>
            {author}
          </button>
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section style={{
      position: 'relative',
      padding: '120px 24px',
      overflow: 'hidden',
      background: '#ffffff'
    }}>
      {/* Decorative Background Elements */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)', zIndex: 0 }}></div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            background: '#eef2ff',
            borderRadius: 100,
            color: '#4f46e5',
            fontWeight: 700,
            fontSize: 12,
            marginBottom: 24,
            letterSpacing: '0.02em',
            boxShadow: 'inset 0 0 0 1px rgba(79, 70, 229, 0.1)'
          }}>
            PLATFORM v2.4 IS LIVE
          </div>
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            margin: '0 auto 24px',
            maxWidth: 900
          }}>
            The Internet belongs to <span style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>everyone.</span>
          </h1>
          <p style={{
            fontSize: 'clamp(17px, 2vw, 20px)',
            color: '#475569',
            maxWidth: 650,
            margin: '0 auto 40px',
            lineHeight: 1.6,
            fontWeight: 500
          }}>
            Empower your visitors with a sleek, one-line accessibility bar. Instantly add controls for scaling, contrast, and reading aids without writing a single line of custom CSS.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <a href="#demo" style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#fff',
              padding: '16px 32px',
              borderRadius: 14,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 16,
              boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
              transition: 'transform 0.2s ease'
            }}>Get Started Free</a>
            <a href="#features" style={{
              background: '#fff',
              color: '#1e293b',
              padding: '16px 32px',
              borderRadius: 14,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)'
            }}>View Capabilities</a>
          </div>
        </div>

        {/* Floating Demo Elements */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          marginTop: 60
        }}>
          {[
            { label: 'Avg. Compliance Score', val: '98%', color: '#6366f1' },
            { label: 'Active Deployments', val: '12.4k+', color: '#a855f7' },
            { label: 'Improved Readability', val: '40%', color: '#ec4899' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: 32,
              borderRadius: 24,
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: stat.color, marginBottom: 8, letterSpacing: '-0.02em' }}>{stat.val}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ title, desc, icon, accent }: { title: string; desc: string; icon: string; accent: string }) {
  return (
    <article style={{
      background: '#ffffff',
      padding: 32,
      borderRadius: 24,
      border: '1px solid #f1f5f9',
      boxShadow: '0 10px 20px rgba(0,0,0,0.02)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: `${accent}15`,
        color: accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        fontSize: 24
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', marginBottom: 12, letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, fontWeight: 500 }}>{desc}</p>
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 100,
        height: 100,
        background: `radial-gradient(circle at bottom right, ${accent}08, transparent 70%)`
      }}></div>
    </article>
  )
}

function Features() {
  const feats = [
    { title: 'Dynamic Scaling', desc: 'Real-time text resizing without breaking your grid system or layout containers.', icon: '📐', accent: '#6366f1' },
    { title: 'Color Intelligence', desc: 'High contrast, grayscale, and specialized color-blinds filters with a single tap.', icon: '🎨', accent: '#a855f7' },
    { title: 'Reading Sanctuary', desc: 'Reading masks and guides that follow the user’s cursor to improve focus.', icon: '🎗️', accent: '#ec4899' },
    { title: 'Assistive Spacing', desc: 'Adjust line height and letter spacing globally to enhance word recognition.', icon: '↔️', accent: '#3b82f6' },
  ]

  return (
    <section id="features" style={{ padding: '100px 24px', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, gap: 40, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', marginBottom: 16, letterSpacing: '-0.02em' }}>Advanced Accessibility Suite.</h2>
            <p style={{ fontSize: 18, color: '#64748b', fontWeight: 500, lineHeight: 1.6 }}>Everything you need to make your digital experience compliant and comfortable for every type of user.</p>
          </div>
          <div style={{ padding: '12px 24px', borderLeft: '4px solid #6366f1', background: '#fff' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', marginBottom: 4 }}>Compliance Ready</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>WCAG 2.1 AAA Compliant</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {feats.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </div>
    </section>
  )
}

// function Showcase() {
//   return (
//     <section id="showcase" style={{ padding: '100px 24px', background: '#f8fafc' }}>
//       <div style={{ maxWidth: 1200, margin: '0 auto' }}>
//         <div style={{
//           background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
//           borderRadius: 40,
//           padding: '60px 40px',
//           display: 'grid',
//           gridTemplateColumns: '1fr 1fr',
//           gap: 60,
//           alignItems: 'center',
//           color: '#fff',
//           boxShadow: '0 30px 60px rgba(99, 102, 241, 0.15)'
//         }}>
//           <div>
//             <h2 style={{ fontSize: 42, fontWeight: 900, marginBottom: 24, lineHeight: 1.1, letterSpacing: '-0.02em' }}>Total Layout <br /><span style={{ color: '#e0e7ff' }}>Independence.</span></h2>
//             <p style={{ fontSize: 18, color: '#e0e7ff', lineHeight: 1.7, marginBottom: 32 }}>Unlike other tools, A11yBar’s shadow DOM architecture ensures that global accessibility filters never bleed into your component logic or site navigation.</p>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//               {['Seamless Integration', 'Zero Performance Overhead', 'Custom Branding Support'].map((item, i) => (
//                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
//                   <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
//                   </div>
//                   <span style={{ fontWeight: 600, fontSize: 15, color: '#fff' }}>{item}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div style={{
//             background: 'rgba(255, 255, 255, 0.1)',
//             backdropFilter: 'blur(10px)',
//             borderRadius: 32,
//             padding: 24,
//             border: '1px solid rgba(255, 255, 255, 0.2)',
//             boxShadow: '0 40px 80px rgba(0, 0, 0, 0.1)'
//           }}>
//             <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 16, overflow: 'hidden', aspectRatio: '16/10', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
//               <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 8 }}>
//                 <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff6b6b' }}></div>
//                 <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fcc419' }}></div>
//                 <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#51cf66' }}></div>
//               </div>
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ opacity: 0.8 }}><IconSparkle /></div>
//                 <div style={{ marginTop: 16, fontWeight: 800, fontSize: 11, color: '#fff', letterSpacing: '0.15em' }}>ISOLATED ARCHITECTURE</div>
//               </div>
//             </div>
//             <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: 12, border: '1px dashed rgba(255, 255, 255, 0.4)' }}>
//               <code style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>&lt;a11y-shadow-root /&gt;</code>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

function CTA() {
  return (
    <section id="demo" style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #ffffff 0%, #eef2ff 100%)' }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        textAlign: 'center',
        background: '#ffffff',
        padding: '80px 40px',
        borderRadius: 40,
        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.05)'
      }}>
        <h3 style={{ fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: 900, color: '#0f172a', marginBottom: 24, letterSpacing: '-0.02em' }}>Make the web accessible <br />within seconds.</h3>
        <p style={{ fontSize: 18, color: '#64748b', fontWeight: 500, lineHeight: 1.6, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>Join over 12,000 developers building inclusive platforms. A single line of code is all it takes.</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            background: '#1e1b4b',
            color: '#fff',
            padding: '18px 48px',
            borderRadius: 16,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: 16,
            boxShadow: '0 12px 24px rgba(30, 27, 75, 0.2)',
            transition: 'all 0.2s ease'
          }}
        >
          Inject to My Site
        </button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '60px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32, marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconAccessibility />
            </div>
            <span style={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>A11yBar</span>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Twitter</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Github</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>LinkedIn</a>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, fontSize: 13, fontWeight: 500 }}>
          <div>© {new Date().getFullYear()} A11yBar Engine. Registered Open Source Project.</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Page() {
  const [author, setAuthor] = useState<string>('Include me')

  useEffect(() => {
    const handle = (e: MessageEvent) => {
      const d = (e as any).data
      if (!d || typeof d !== 'object') return
      const api = (window as any).AccessibilityBarEmbed
      if (!api) return
      const { type, payload } = d
      if (type === 'init') api.init(payload || {})
      else if (type === 'setFontSize') api.setFontSize(payload)
      else if (type === 'setFontStyle') api.setFontStyle(payload)
      else if (type === 'setTextAlign') api.setTextAlign(payload)
      else if (type === 'toggleHighContrast') api.toggleHighContrast(payload)
    }

    window.addEventListener('message', handle)
    window.parent?.postMessage?.({ type: 'embed-ready' }, '*')
    return () => window.removeEventListener('message', handle)
  }, [])

  const changeName = () => {
    const n = prompt('Enter your name to include:', author)
    if (n !== null) setAuthor(n.trim() || 'Include me')
  }

  return (
    <div style={{ scrollBehavior: 'smooth' }}>
      <div style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <Nav onChangeName={changeName} author={author} />
        <main>
          <Hero />
          <Features />
          {/* <Showcase /> */}
          <CTA />
        </main>
        <Footer />
      </div>

      <div id="a11y-embed-container" />

      <Script src="/embed-standalone.js" strategy="afterInteractive" />
      <Script id="init-embed" strategy="afterInteractive">
        {`window.addEventListener('load', function(){ if(window.AccessibilityBarEmbed) window.AccessibilityBarEmbed.init({ targetSelector: 'body' }); });`}
      </Script>
    </div>
  )
}
