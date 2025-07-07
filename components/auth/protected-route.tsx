"use client"

import type React from "react"

import { useAuth } from "@/lib/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "user" | "admin" | "moderator"
}

export function ProtectedRoute({ children, requiredRole = "user" }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && profile && requiredRole !== "user") {
      const roleHierarchy = { user: 0, moderator: 1, admin: 2 }
      const userLevel = roleHierarchy[profile.role]
      const requiredLevel = roleHierarchy[requiredRole]

      if (userLevel < requiredLevel) {
        router.push("/dashboard")
      }
    }
  }, [user, profile, requiredRole, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
