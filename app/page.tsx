import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { MainContent } from "@/components/main-content"
import { ProtectedRoute } from "@/components/auth/protected-route"

async function getDashboardData() {
  const supabase = createServerClient()

  const [{ data: prompts }, { data: workflows }, { data: templates }, { data: integrations }, { data: activities }] =
    await Promise.all([
      supabase.from("prompts").select("*").limit(5),
      supabase.from("workflows").select("*").limit(5),
      supabase.from("templates").select("*").limit(5),
      supabase.from("ai_integrations").select("*").limit(5),
      supabase.from("user_activities").select("*").limit(10),
    ])

  return {
    prompts: prompts || [],
    workflows: workflows || [],
    templates: templates || [],
    integrations: integrations || [],
    activities: activities || [],
  }
}

export default async function HomePage() {
  const dashboardData = await getDashboardData()

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <EnhancedSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <Suspense fallback={<div className="p-6">Loading...</div>}>
              <MainContent initialData={dashboardData} />
            </Suspense>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
