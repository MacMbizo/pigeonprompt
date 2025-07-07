"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth/auth-provider"

interface RealtimeContextType {
  workflowExecutions: any[]
  notifications: any[]
  onlineUsers: string[]
  subscribeToWorkflowExecution: (executionId: string) => void
  unsubscribeFromWorkflowExecution: (executionId: string) => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [workflowExecutions, setWorkflowExecutions] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [subscriptions, setSubscriptions] = useState<Map<string, any>>(new Map())

  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    // Subscribe to user activities (notifications)
    const activitiesChannel = supabase
      .channel("user-activities")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_activities",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev.slice(0, 49)]) // Keep last 50
        },
      )
      .subscribe()

    // Subscribe to presence for online users
    const presenceChannel = supabase
      .channel("online-users")
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState()
        const users = Object.keys(state)
        setOnlineUsers(users)
      })
      .on("presence", { event: "join" }, ({ key }) => {
        setOnlineUsers((prev) => [...prev, key])
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== key))
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          })
        }
      })

    return () => {
      activitiesChannel.unsubscribe()
      presenceChannel.unsubscribe()
    }
  }, [user])

  const subscribeToWorkflowExecution = (executionId: string) => {
    if (subscriptions.has(executionId)) return

    const channel = supabase
      .channel(`workflow-execution-${executionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "workflow_executions",
          filter: `id=eq.${executionId}`,
        },
        (payload) => {
          setWorkflowExecutions((prev) => {
            const index = prev.findIndex((exec) => exec.id === executionId)
            if (index >= 0) {
              const updated = [...prev]
              updated[index] = payload.new
              return updated
            }
            return [payload.new, ...prev]
          })
        },
      )
      .subscribe()

    setSubscriptions((prev) => new Map(prev).set(executionId, channel))
  }

  const unsubscribeFromWorkflowExecution = (executionId: string) => {
    const channel = subscriptions.get(executionId)
    if (channel) {
      channel.unsubscribe()
      setSubscriptions((prev) => {
        const updated = new Map(prev)
        updated.delete(executionId)
        return updated
      })
    }
  }

  const value = {
    workflowExecutions,
    notifications,
    onlineUsers,
    subscribeToWorkflowExecution,
    unsubscribeFromWorkflowExecution,
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
