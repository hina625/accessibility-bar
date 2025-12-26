# Next.js Integration Guide

Accessibility bar ko Next.js app mein easily integrate kar sakte hain. Yahan different methods hain:

## Method 1: Using Next.js Script Component (Recommended)

### App Router (Next.js 13+)

`app/layout.tsx` ya kisi bhi page mein:

```tsx
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* Accessibility Bar Script */}
        <Script
          src="/embed-bundle.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
```

### Pages Router (Next.js 12)

`pages/_app.tsx` ya `pages/_document.tsx` mein:

```tsx
import Script from 'next/script'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      
      {/* Accessibility Bar Script */}
      <Script
        src="/embed-bundle.js"
        strategy="afterInteractive"
      />
    </>
  )
}
```

## Method 2: Using useEffect Hook

Agar aap manually control karna chahte hain:

```tsx
'use client'

import { useEffect } from 'react'

export default function AccessibilityBar() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/embed-bundle.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup if needed
      document.body.removeChild(script)
    }
  }, [])

  return null
}
```

Phir ise kisi bhi component mein use karein:

```tsx
import AccessibilityBar from '@/components/AccessibilityBar'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <AccessibilityBar />
    </>
  )
}
```

## Method 3: Direct Script Tag in _document.tsx

`pages/_document.tsx` mein (Pages Router only):

```tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <script src="/embed-bundle.js" async></script>
      </body>
    </Html>
  )
}
```

## Setup Steps

### Step 1: Copy Bundle File

`public/embed-bundle.js` file ko apne Next.js project ke `public` folder mein copy karein:

```
your-nextjs-app/
  public/
    embed-bundle.js  ← Yahan copy karein
```

### Step 2: Add Script

Upar diye gaye methods mein se koi bhi use karein.

### Step 3: Test

App run karein aur check karein ki accessibility bar bottom right corner mein show ho raha hai.

## Complete Example - App Router

### `app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'App with accessibility features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* Accessibility Bar */}
        <Script
          src="/embed-bundle.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
```

## Complete Example - Pages Router

### `pages/_app.tsx`

```tsx
import type { AppProps } from 'next/app'
import Script from 'next/script'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      
      {/* Accessibility Bar */}
      <Script
        src="/embed-bundle.js"
        strategy="afterInteractive"
      />
    </>
  )
}
```

## Using with TypeScript

Agar TypeScript use kar rahe hain, to type definitions add karein:

### `types/accessibility-bar.d.ts`

```typescript
interface Window {
  AccessibilityBarEmbed?: {
    init?: (options?: { debug?: boolean }) => void
    setFontSize?: (size: number) => void
    setFontStyle?: (style: string) => void
    setTextAlign?: (align: string) => void
    toggleHighContrast?: (value: boolean) => void
    __lastError?: Error
  }
}
```

## Custom Configuration

Agar aap manually initialize karna chahte hain:

```tsx
'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function AccessibilityBarLoader() {
  useEffect(() => {
    const initAccessibilityBar = () => {
      if (window.AccessibilityBarEmbed && window.AccessibilityBarEmbed.init) {
        window.AccessibilityBarEmbed.init({ debug: false })
      }
    }

    // Wait for script to load
    if (window.AccessibilityBarEmbed) {
      initAccessibilityBar()
    } else {
      window.addEventListener('load', initAccessibilityBar)
    }

    return () => {
      window.removeEventListener('load', initAccessibilityBar)
    }
  }, [])

  return (
    <Script
      src="/embed-bundle.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (window.AccessibilityBarEmbed?.init) {
          window.AccessibilityBarEmbed.init()
        }
      }}
    />
  )
}
```

## Troubleshooting

### Script not loading?

1. Check ki `embed-bundle.js` `public` folder mein hai
2. Browser console mein errors check karein
3. Network tab mein check karein ki file load ho rahi hai ya nahi

### Not working in production?

1. Make sure `embed-bundle.js` production build mein include ho
2. Check `next.config.js` mein koi restrictions to nahi
3. Verify file path correct hai

### TypeScript errors?

1. Type definitions add karein (upar dekhein)
2. Ya `// @ts-ignore` use karein (not recommended)

## Notes

- ✅ Works with both App Router and Pages Router
- ✅ Works with TypeScript
- ✅ Works in development and production
- ✅ No additional dependencies required
- ✅ Settings persist in localStorage
- ✅ All features work the same way

## Example Projects

Agar aap complete example dekhna chahte hain, to:

1. `public/test.html` - Simple HTML example
2. `public/example.html` - Complete website example
3. Current Next.js app - Already integrated in `app/layout.tsx`

