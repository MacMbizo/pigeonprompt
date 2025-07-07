"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import {
  Search,
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  Share,
  Clock,
  CheckCircle,
  XCircle,
  Workflow,
  Zap,
  Settings,
} from "lucide-react"

interface WorkflowItem {
  id: string
  name: string
  description: string
  status: "active" | "draft" | "paused" | "archived"
  execution_count: number
  last_executed: string | null
  created_at: string
  is_public: boolean
}

const mockWorkflows: WorkflowItem[] = [
  {
    id: "1",
    name: "Content Creation Pipeline",
    description: "Automated content creation and optimization workflow",
    status: "active",
    execution_count: 15,
    last_executed: new Date().toISOString(),
    created_at: new Date().toISOString(),
    is_public: true,
  },
  {
    id: "2",
    name: "Data Analysis Workflow",
    description: "Process and analyze data with AI insights",
    status: "draft",
    execution_count: 0,
    last_executed: null,
    created_at: new Date().toISOString(),
    is_public: false,
  },
  {
    id: "3",
    name: "Email Campaign Generator",
    description: "Generate personalized email campaigns",
    status: "paused",
    execution_count: 8,
    last_executed: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date().toISOString(),
    is_public: false,
  },
]

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(mockWorkflows)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    is_public: false,
  })

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "active") return matchesSearch && workflow.status === "active"
    if (activeTab === "draft") return matchesSearch && workflow.status === "draft"
    if (activeTab === "public") return matchesSearch && workflow.is_public

    return matchesSearch
  })

  const handleCreateWorkflow = () => {
    const workflow: WorkflowItem = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      status: "draft",
      execution_count: 0,
      last_executed: null,
      created_at: new Date().toISOString(),
      is_public: newWorkflow.is_public,
    }

    setWorkflows([workflow, ...workflows])
    setNewWorkflow({ name: "", description: "", is_public: false })
    setShowCreateDialog(false)
  }

  const handleStatusChange = (id: string, newStatus: "active" | "paused") => {
    setWorkflows(workflows.map((w) => (w.id === id ? { ...w, status: newStatus } : w)))
  }

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((w) => w.id !== id))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
      case "draft":
        return <Edit className="h-4 w-4 text-gray-500" />
      case "archived":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "archived":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <EnhancedSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
                  <p className="text-gray-600">Design and manage AI automation workflows</p>
                </div>
                <div className="flex space-x-2">
                  <Link href="/promptflow">
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Workflow Builder
                    </Button>
                  </Link>
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Workflow
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Workflow</DialogTitle>
                        <DialogDescription>Start building a new AI automation workflow</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Workflow Name</Label>
                          <Input
                            id="name"
                            value={newWorkflow.name}
                            onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                            placeholder="Enter workflow name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newWorkflow.description}
                            onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                            placeholder="Describe what this workflow does"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="public"
                            checked={newWorkflow.is_public}
                            onCheckedChange={(checked) => setNewWorkflow({ ...newWorkflow, is_public: checked })}
                          />
                          <Label htmlFor="public">Make this workflow public</Label>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateWorkflow} className="bg-purple-600 hover:bg-purple-700">
                            Create Workflow
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Workflows</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkflows.map((workflow) => (
                      <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{workflow.name}</CardTitle>
                              <CardDescription className="mt-1">{workflow.description}</CardDescription>
                            </div>
                            <Badge className={getStatusColor(workflow.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(workflow.status)}
                                <span className="capitalize">{workflow.status}</span>
                              </div>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Zap className="h-4 w-4" />
                                  <span>{workflow.execution_count} runs</span>
                                </div>
                                {workflow.last_executed && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{new Date(workflow.last_executed).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {workflow.status === "active" ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(workflow.id, "paused")}
                                  >
                                    <Pause className="h-3 w-3" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(workflow.id, "active")}
                                  >
                                    <Play className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button size="sm" variant="outline">
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Share className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Link href={`/promptflow?workflow=${workflow.id}`}>
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </Link>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteWorkflow(workflow.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredWorkflows.length === 0 && (
                    <div className="text-center py-12">
                      <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
                      <p className="text-gray-600 mb-4">Create your first workflow to get started</p>
                      <Button onClick={() => setShowCreateDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Workflow
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
