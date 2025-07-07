"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: "admin" | "user" | "premium"
  subscription_tier: string
  credits: number
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session in localStorage
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem("pigeonprompt_user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)

          // Create mock profile
          const mockProfile: UserProfile = {
            id: userData.id,
            full_name: userData.user_metadata?.full_name || userData.email?.split("@")[0] || "User",
            avatar_url: null,
            role: "user",
            subscription_tier: "Free",
            credits: 1000,
          }
          setProfile(mockProfile)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        localStorage.removeItem("pigeonprompt_user")
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const signUp = async (email: string, password: string, metadata?: any) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (!email || !password) {
      return { data: null, error: { message: "Email and password are required" } }
    }

    if (password.length < 6) {
      return { data: null, error: { message: "Password must be at least 6 characters long" } }
    }

    // Check if user already exists (mock)
    const existingUsers = JSON.parse(localStorage.getItem("pigeonprompt_users") || "[]")
    if (existingUsers.find((u: any) => u.email === email)) {
      return { data: null, error: { message: "User already registered" } }
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      user_metadata: metadata,
    }

    // Store user in mock database
    existingUsers.push({ ...newUser, password })
    localStorage.setItem("pigeonprompt_users", JSON.stringify(existingUsers))

    return {
      data: { user: newUser },
      error: null,
    }
  }

  const signIn = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (!email || !password) {
      return { data: null, error: { message: "Email and password are required" } }
    }

    // Check credentials (mock)
    const existingUsers = JSON.parse(localStorage.getItem("pigeonprompt_users") || "[]")
    const foundUser = existingUsers.find((u: any) => u.email === email && u.password === password)

    if (!foundUser) {
      return { data: null, error: { message: "Invalid login credentials" } }
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = foundUser

    // Set user session immediately
    setUser(userWithoutPassword)
    localStorage.setItem("pigeonprompt_user", JSON.stringify(userWithoutPassword))

    // Create mock profile
    const mockProfile: UserProfile = {
      id: userWithoutPassword.id,
      full_name: userWithoutPassword.user_metadata?.full_name || userWithoutPassword.email?.split("@")[0] || "User",
      avatar_url: null,
      role: "user",
      subscription_tier: "Free",
      credits: 1000,
    }
    setProfile(mockProfile)

    // Trigger navigation after state update
    setTimeout(() => {
      router.push("/")
    }, 100)

    return {
      data: { user: userWithoutPassword },
      error: null,
    }
  }

  const signOut = async () => {
    setUser(null)
    setProfile(null)
    localStorage.removeItem("pigeonprompt_user")
    router.push("/auth/login")
  }

  const resetPassword = async (email: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!email) {
      return { data: null, error: { message: "Email is required" } }
    }

    // Mock success response
    return {
      data: { message: "Password reset email sent" },
      error: null,
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
