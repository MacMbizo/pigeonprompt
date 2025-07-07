"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Notification {
  id: string
  user_id: string
  activity_type: string
  activity_data: any
  read: boolean
  created_at: string
}

interface WorkflowExecution {
  id: string
  workflow_id: string
  user_id: string
  status: "pending" | "running" | "completed" | "failed" | "cancelled"
  input_data: any
  output_data: any
  execution_log: any[]
  error_message?: string
  started_at: string
  completed_at?: string
  duration_ms?: number
  cost: number
  created_at: string
}

interface RealtimeContextType {
  subscribe: (table: string, callback: (payload: any) => void) => () => void
  unsubscribe: (table: string) => void
  subscribeToWorkflowExecution: (workflowId: string) => void
  isConnected: boolean
  notifications: Notification[]
  onlineUsers: any[]
  workflowExecutions: WorkflowExecution[]
  markNotificationAsRead: (id: string) => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const [workflowExecutions, setWorkflowExecutions] = useState<WorkflowExecution[]>([])

  useEffect(() => {
    // Mock initial data
    const mockNotifications: Notification[] = [
      {
        id: "1",
        user_id: "user_1",
        activity_type: "workflow_completed",
        activity_data: { workflow_name: "Content Pipeline" },
        read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        user_id: "user_1",
        activity_type: "prompt_shared",
        activity_data: { prompt_title: "Blog Writer" },
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ]

    const mockOnlineUsers = [
      { id: "user_1", name: "You" },
      { id: "user_2", name: "Sarah Johnson" },
      { id: "user_3", name: "Alex Chen" },
    ]

    setNotifications(mockNotifications)
    setOnlineUsers(mockOnlineUsers)
  }, [])

  const subscribe = (table: string, callback: (payload: any) => void) => {
    // Mock subscription - return unsubscribe function
    return () => {}
  }

  const unsubscribe = (table: string) => {
    // Mock unsubscribe
  }

  const subscribeToWorkflowExecution = (workflowId: string) => {
    // Mock workflow execution subscription
    console.log(`Subscribed to workflow execution: ${workflowId}`)
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const value = {
    subscribe,
    unsubscribe,
    subscribeToWorkflowExecution,
    isConnected,
    notifications,
    onlineUsers,
    workflowExecutions,
    markNotificationAsRead,
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
