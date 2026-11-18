import './globals.css'

export const metadata = {
  title: 'Plateforme de Jeux Multijoueurs',
  description: 'Jeux interactifs sur TV et smartphone',
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
