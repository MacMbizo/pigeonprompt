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

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
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
    existingUsers.push(newUser)
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
    const foundUser = existingUsers.find((u: any) => u.email === email)

    if (!foundUser) {
      return { data: null, error: { message: "Invalid login credentials" } }
    }

    // Set user session immediately
    setUser(foundUser)
    localStorage.setItem("pigeonprompt_user", JSON.stringify(foundUser))

    // Trigger navigation after state update
    setTimeout(() => {
      router.push("/")
    }, 100)

    return {
      data: { user: foundUser },
      error: null,
    }
  }

  const signOut = async () => {
    setUser(null)
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
