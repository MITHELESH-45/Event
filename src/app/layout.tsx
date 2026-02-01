import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EventEdge - Event Management Platform',
  description: 'Create, manage, and track college events with ease. From registration to certificates, EventEdge handles everything.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}