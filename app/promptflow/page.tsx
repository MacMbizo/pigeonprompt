import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { PromptflowBuilder } from "@/components/promptflow/promptflow-builder"
import { ProtectedRoute } from "@/components/auth/protected-route"

async function getWorkflowData() {
  const supabase = createServerClient()

  const { data: workflows } = await supabase.from("workflows").select("*").order("created_at", { ascending: false })

  return workflows || []
}

export default async function PromptflowPage() {
  const workflows = await getWorkflowData()

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <EnhancedSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden">
            <Suspense fallback={<div className="p-6">Loading workflow builder...</div>}>
              <PromptflowBuilder initialWorkflows={workflows} />
            </Suspense>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
