"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth/auth-provider"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface RealtimeContextType {
  subscribe: (table: string, callback: (payload: any) => void) => () => void
  unsubscribe: (table: string) => void
  isConnected: boolean
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [channels, setChannels] = useState<Map<string, RealtimeChannel>>(new Map())
  const [isConnected, setIsConnected] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    // Set up connection status monitoring
    const channel = supabase.channel("connection-status")

    channel
      .on("presence", { event: "sync" }, () => {
        setIsConnected(true)
      })
      .on("presence", { event: "join" }, () => {
        setIsConnected(true)
      })
      .on("presence", { event: "leave" }, () => {
        setIsConnected(false)
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user, supabase])

  const subscribe = (table: string, callback: (payload: any) => void) => {
    if (!user) return () => {}

    const channelName = `${table}-${user.id}`

    // Check if channel already exists
    if (channels.has(channelName)) {
      return () => unsubscribe(table)
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
          filter: `user_id=eq.${user.id}`,
        },
        callback,
      )
      .subscribe()

    setChannels((prev) => new Map(prev).set(channelName, channel))

    return () => unsubscribe(table)
  }

  const unsubscribe = (table: string) => {
    if (!user) return

    const channelName = `${table}-${user.id}`
    const channel = channels.get(channelName)

    if (channel) {
      channel.unsubscribe()
      setChannels((prev) => {
        const newChannels = new Map(prev)
        newChannels.delete(channelName)
        return newChannels
      })
    }
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
