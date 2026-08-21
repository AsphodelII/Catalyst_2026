import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { PortfolioProvider } from "@/lib/portfolio-store"
import { AppShell } from "@/components/app-shell"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "Portfolio Bakery — Research Handover",
  description:
    "The handover layer for quantitative research. Preserve the recipe behind every model so strategies survive when researchers move on.",
}

export const viewport: Viewport = {
  themeColor: "#faf6ef",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <PortfolioProvider>
          <TooltipProvider delayDuration={200}>
            <AppShell>{children}</AppShell>
          </TooltipProvider>
        </PortfolioProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
