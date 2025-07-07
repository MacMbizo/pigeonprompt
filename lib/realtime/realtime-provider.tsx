"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface RealtimeContextType {
  subscribe: (table: string, callback: (payload: any) => void) => () => void
  unsubscribe: (table: string) => void
  isConnected: boolean
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected] = useState(true)

  const subscribe = (table: string, callback: (payload: any) => void) => {
    // Mock subscription - return unsubscribe function
    return () => {}
  }

  const unsubscribe = (table: string) => {
    // Mock unsubscribe
  }

  const value = {
    subscribe,
    unsubscribe,
    isConnected,
  }

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}
