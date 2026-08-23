import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import { PortfolioProvider } from '@/components/portfolio-store'
import { ConsoleProvider } from '@/components/console-provider'
import { AuthGate } from '@/components/auth-gate'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Portfolio Bakery — Research Handover Assistant',
  description:
    'You kept the model. But did you keep the recipe? Portfolio Bakery keeps research context attached to your quant strategies.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5efe0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable} bg-background`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ConsoleProvider>
          <PortfolioProvider>
            <AuthGate>{children}</AuthGate>
          </PortfolioProvider>
        </ConsoleProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
