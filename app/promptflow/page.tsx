import { Suspense } from "react"
import { Header } from "@/components/header"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { PromptflowBuilder } from "@/components/promptflow/promptflow-builder"
import { ProtectedRoute } from "@/components/auth/protected-route"

// Mock workflow data
const mockWorkflows = [
  {
    id: "1",
    name: "Content Creation Pipeline",
    description: "Automated content creation and optimization workflow",
    workflow_data: {
      nodes: [
        {
          id: "input-1",
          type: "input",
          data: { name: "topic", defaultValue: "" },
          position: { x: 100, y: 100 },
        },
        {
          id: "ai-1",
          type: "ai-model",
          data: {
            provider: "openai",
            model: "gpt-4",
            prompt: "Create a blog post about {{topic}}",
          },
          position: { x: 300, y: 100 },
        },
      ],
      edges: [
        {
          id: "e1",
          source: "input-1",
          target: "ai-1",
        },
      ],
    },
    status: "active",
    is_public: true,
    execution_count: 15,
    last_executed: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Data Analysis Workflow",
    description: "Process and analyze data with AI insights",
    workflow_data: {
      nodes: [
        {
          id: "input-2",
          type: "input",
          data: { name: "data", defaultValue: "" },
          position: { x: 100, y: 100 },
        },
      ],
      edges: [],
    },
    status: "draft",
    is_public: false,
    execution_count: 0,
    last_executed: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function PromptflowPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <EnhancedSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden">
            <Suspense fallback={<div className="p-6">Loading workflow builder...</div>}>
              <PromptflowBuilder initialWorkflows={mockWorkflows} />
            </Suspense>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
