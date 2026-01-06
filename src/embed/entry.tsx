import './shim'
import React from 'react'
import { createRoot } from 'react-dom/client'
import AccessibilityBar from '../components/accessibility-bar/AccessibilityBar'
import { AccessibilityProvider } from '../contexts/AccessibilityContext'

// @ts-ignore
import css from './embed.css?inline'
// @ts-ignore
import tailwindCss from './embed-tailwind.css?inline'
// @ts-ignore
import documentStyles from './document-styles.css?inline'

function mount() {
    if (typeof window !== 'undefined') {
        (window as any).AccessibilityBarEmbed = (window as any).AccessibilityBarEmbed || {}
    }

    // Prevent duplicate mounting
    if (document.getElementById('a11y-embed-host-react')) return

    // 1. Inject Global Document Styles
    if (!document.getElementById('a11y-global-styles')) {
        const docStyle = document.createElement('style')
        docStyle.id = 'a11y-global-styles'
        docStyle.textContent = documentStyles
        document.head.appendChild(docStyle)
    }

    // 2. Inject Fonts (matching layout.tsx concept)
    const fontUrls = [
        'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&family=Lexend:wght@300;400;500;600;700&display=swap',
        'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/dist/external/open-dyslexic.css'
    ]

    fontUrls.forEach(url => {
        if (!document.querySelector(`link[href="${url}"]`)) {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = url
            document.head.appendChild(link)
        }
    })

    // 3. Inject SVG Filters (matching layout.tsx concept)
    if (!document.getElementById('a11y-color-filters')) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.id = 'a11y-color-filters'
        svg.setAttribute('width', '0')
        svg.setAttribute('height', '0')
        svg.style.position = 'absolute'
        svg.style.pointerEvents = 'none'

        // Define filters in a clean way
        svg.innerHTML = `
      <defs>
        <filter id="protanopia-filter">
          <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
        </filter>
        <filter id="deuteranopia-filter">
          <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
        </filter>
        <filter id="tritanopia-filter">
          <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
        </filter>
      </defs>
    `
        document.body.appendChild(svg)
    }

    // 4. Create Host Element (Zero-Footprint Strategy)
    const host = document.createElement('div')
    host.id = 'a11y-embed-host-react'
    host.className = 'a11y-embed-host'

    // CRITICAL: 0x0 size and visible overflow to prevent blocking
    host.style.all = 'initial'
    host.style.position = 'fixed'
    host.style.left = '0'
    host.style.top = '0'
    host.style.width = '0'
    host.style.height = '0'
    host.style.overflow = 'visible'
    host.style.zIndex = '2147483647'
    host.style.setProperty('pointer-events', 'none', 'important')

    const shadow = host.attachShadow({ mode: 'open' })

    // 5. Inject Scoped Styles into Shadow DOM
    const styleContainer = document.createElement('div')
    styleContainer.innerHTML = `<style>${tailwindCss}</style><style>${css}</style>`
    shadow.appendChild(styleContainer)

    // 6. Create React Root Container
    const container = document.createElement('div')
    container.id = 'a11y-react-root'
    container.style.position = 'static'
    container.style.width = '0'
    container.style.height = '0'
    container.style.overflow = 'visible'
    container.style.setProperty('pointer-events', 'none', 'important')

    shadow.appendChild(container)
    document.documentElement.appendChild(host)

    // 7. Mount Application
    try {
        const root = createRoot(container)

        // Render EXACTLY like layout.tsx: Provider -> Bar
        root.render(
            <React.StrictMode>
                <AccessibilityProvider>
                    <div className="a11y-embed-host">
                        <AccessibilityBar />
                    </div>
                </AccessibilityProvider>
            </React.StrictMode>
        )
    } catch (err) {
        console.error('AccessibilityBar mount error:', err)
    }

    // 8. Expose API
    const api = {
        init: mount
    }

    if (typeof window !== 'undefined') {
        (window as any).AccessibilityBarEmbed = Object.assign((window as any).AccessibilityBarEmbed || {}, api)
    }
}

// Auto-init
if (typeof window !== 'undefined') {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        mount()
    } else {
        window.addEventListener('DOMContentLoaded', mount)
    }
}

export default mount

