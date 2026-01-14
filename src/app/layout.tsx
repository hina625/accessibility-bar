import type { Metadata } from "next";
// Temporarily disabled next/font/google due to Turbopack compatibility issue
// import { Lexend, Open_Sans } from "next/font/google";
import "./globals.css";
import "./accessibility-responsive.css";
import Script from 'next/script';
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import AccessibilityBar from "@/components/accessibility-bar/AccessibilityBar";

// Using CSS variables for fonts instead to avoid Turbopack font module issue
// const lexend = Lexend({
//   variable: "--font-lexend",
//   subsets: ["latin"],
// });

// const openSans = Open_Sans({
//   variable: "--font-open-sans",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Accessibility Bar",
  description: "Accessibility features for better web experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/dist/external/open-dyslexic.css" />
      </head>
      <body
        className="antialiased font-sans"
        style={{
          fontFamily: 'var(--font-open-sans, "Open Sans", sans-serif)',
        }}
      >
        <a
          href="#accessible-content"
          className="skip-link focus:translate-y-0"
        >
          Skip to Content
        </a>
        <svg width="0" height="0" style={{ position: 'absolute' }}>
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
        </svg>
        <AccessibilityProvider>
          {children}
          <AccessibilityBar />
        </AccessibilityProvider>
      </body >
    </html >
  );
}
