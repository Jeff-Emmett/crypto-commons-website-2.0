import type React from "react"
import type { Metadata } from "next"
import { Urbanist, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-sans",
})
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://crypto-commons.org"),
  title: "Crypto Commons Association",
  description:
    "Actively promoting the development of digital common goods and infrastructure in distributed ledger technology",
  generator: "v0.app",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>",
  },
  openGraph: {
    title: "Crypto Commons Association",
    description:
      "Actively promoting the development of digital common goods and infrastructure in distributed ledger technology",
    url: "https://crypto-commons.org",
    siteName: "Crypto Commons Association",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Crypto Commons Association",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Commons Association",
    description:
      "Actively promoting the development of digital common goods and infrastructure in distributed ledger technology",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
