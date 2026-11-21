import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Plateforme de Jeux Multijoueurs',
  description: 'Jeux interactifs sur TV et smartphone',
  icons: {
    icon: '/apple-touch-icon.jpg',
    apple: [
      {
        url: '/apple-touch-icon.jpg',
        type: 'image/jpeg',
      },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-950 text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
