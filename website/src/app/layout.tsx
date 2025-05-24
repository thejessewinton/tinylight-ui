import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Inter, Newsreader } from 'next/font/google'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'

import '~/styles/globals.css'

const BASE_URL = 'https://tinylight.jessewinton.works'

const sans = Inter({
  variable: '--font-sans',
  display: 'optional',
  subsets: ['latin'],
})

const serif = Newsreader({
  variable: '--font-serif',
  display: 'optional',
  style: 'italic',
  subsets: ['latin'],
  weight: ['300'],
})

const mono = localFont({
  src: '../fonts/commit-mono.woff2',
  variable: '--font-mono',
  display: 'optional',
})

export const metadata: Metadata = {
  title: {
    default: 'tinylight',
    template: '%s — tinylight',
  },
  description: 'A set of beautifully designed, composable lightbox primitives.',
  metadataBase: new URL(BASE_URL),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable} scroll-smooth text-sm`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col items-center justify-center bg-main text-primary leading-loose antialiased selection:bg-slate-700 selection:text-white">
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <main>{children}</main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
