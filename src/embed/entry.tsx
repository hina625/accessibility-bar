import './shim'
import React from 'react'
import { createRoot } from 'react-dom/client'
import AccessibilityBar from '../components/accessibility-bar/AccessibilityBar'
import { AccessibilityProvider } from '../contexts/AccessibilityContext'
import css from './embed.css?inline'
import tailwindCss from './embed-tailwind.css?inline'
import documentStyles from './document-styles.css?inline'

function mount() {
  // Ensure window.AccessibilityBarEmbed exists early
  if (typeof window !== 'undefined') {
    (window as any).AccessibilityBarEmbed = (window as any).AccessibilityBarEmbed || {}
  }

  if (document.getElementById('a11y-embed-host-react')) return

  // Inject accessibility styles into main document head (not shadow DOM)
  if (!document.getElementById('a11y-document-styles')) {
    const docStyle = document.createElement('style')
    docStyle.id = 'a11y-document-styles'
    docStyle.textContent = documentStyles
    document.head.appendChild(docStyle)
  }

  // Inject SVG filters for color blind filters into document head
  if (!document.getElementById('a11y-color-filters')) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.id = 'a11y-color-filters'
    svg.setAttribute('width', '0')
    svg.setAttribute('height', '0')
    svg.style.position = 'absolute'
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

    const protanopia = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
    protanopia.setAttribute('id', 'protanopia-filter')
    const protanopiaMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix')
    protanopiaMatrix.setAttribute('type', 'matrix')
    protanopiaMatrix.setAttribute('values', '0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0')
    protanopia.appendChild(protanopiaMatrix)

    const deuteranopia = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
    deuteranopia.setAttribute('id', 'deuteranopia-filter')
    const deuteranopiaMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix')
    deuteranopiaMatrix.setAttribute('type', 'matrix')
    deuteranopiaMatrix.setAttribute('values', '0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0')
    deuteranopia.appendChild(deuteranopiaMatrix)

    const tritanopia = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
    tritanopia.setAttribute('id', 'tritanopia-filter')
    const tritanopiaMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix')
    tritanopiaMatrix.setAttribute('type', 'matrix')
    tritanopiaMatrix.setAttribute('values', '0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0')
    tritanopia.appendChild(tritanopiaMatrix)

    defs.appendChild(protanopia)
    defs.appendChild(deuteranopia)
    defs.appendChild(tritanopia)
    svg.appendChild(defs)
    document.head.appendChild(svg)
  }

  try {
    const host = document.createElement('div')
    host.id = 'a11y-embed-host-react'
    host.className = 'a11y-embed-host'
    host.style.position = 'fixed'
    host.style.right = '12px'
    host.style.bottom = '12px'
    host.style.zIndex = '2147483647'
    host.style.all = 'initial'

    const shadow = host.attachShadow({ mode: 'open' })

    try {
      // Inject Tailwind CSS first (base styles)
      const tailwindStyle = document.createElement('style')
      tailwindStyle.textContent = tailwindCss
      shadow.appendChild(tailwindStyle)

      // Inject custom embed CSS
      const style = document.createElement('style')
      style.textContent = css
      shadow.appendChild(style)
    } catch (e) {
      console.error('Failed to inject styles:', e)
    }
    const container = document.createElement('div')
    container.id = 'a11y-react-root'
    shadow.appendChild(container)
    document.documentElement.appendChild(host)

    const root = createRoot(container)
    root.render(
      React.createElement(AccessibilityProvider, {
        children:
          React.createElement(AccessibilityBar)
      })
    )
  } catch (err) {

    try {
      (window as any).AccessibilityBarEmbed = (window as any).AccessibilityBarEmbed || {}
    } catch { }
    ; (window as any).AccessibilityBarEmbed.__lastError = err
    console.error('AccessibilityBar embed mount error:', err)
    return
  }

  const api = {
    setFontSize(n: number) { document.body.style.fontSize = `${n}px` },
    setFontStyle(s: string) { document.body.style.fontFamily = s },
    setTextAlign(a: string) { document.body.style.textAlign = a },
    toggleHighContrast(v: boolean) { if (v) document.documentElement.classList.add('high-contrast'); else document.documentElement.classList.remove('high-contrast') }
  }

  // Always set the API, even if mount was already called
  if (typeof window !== 'undefined') {
    ; (window as any).AccessibilityBarEmbed = Object.assign((window as any).AccessibilityBarEmbed || {}, api, { init: mount })
  }
}

// Initialize the global object immediately
if (typeof window !== 'undefined') {
  (window as any).AccessibilityBarEmbed = (window as any).AccessibilityBarEmbed || { init: mount }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    mount()
  } else {
    window.addEventListener('DOMContentLoaded', mount)
  }
}

export default mount
