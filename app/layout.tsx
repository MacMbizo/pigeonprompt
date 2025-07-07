import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/auth/auth-provider"
import { RealtimeProvider } from "@/lib/realtime/realtime-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PigeonPrompt - AI Workflow Platform",
  description: "Build, manage, and execute AI workflows with ease",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RealtimeProvider>
            {children}
            <Toaster />
          </RealtimeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
