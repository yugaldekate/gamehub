import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { dark } from '@clerk/themes'
import { ClerkProvider } from '@clerk/nextjs'

import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gamehub',
  description: 'A live video streaming platform created using Nextjs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }} >
      <html lang="en">
        <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              forcedTheme="dark"
              storageKey="gamehub-theme"
            >
              <Toaster theme="light" position="bottom-center" />
              {children}
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
