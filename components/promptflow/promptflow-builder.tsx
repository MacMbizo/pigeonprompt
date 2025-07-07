"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Save,
  Plus,
  Zap,
  Database,
  GitBranch,
  Repeat,
  Upload,
  Download,
  Code,
  Brain,
  Workflow,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Lock,
  Unlock,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-provider"
import { useRealtime } from "@/lib/realtime/realtime-provider"
import { createClient } from "@/lib/supabase/client"

interface WorkflowNode {
  id: string
  type: string
  data: any
  position: { x: number; y: number }
}

interface WorkflowEdge {
  id: string
  source: string
  target: string
}

interface WorkflowData {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

interface Workflow {
  id: string
  name: string
  description: string
  workflow_data: WorkflowData
  status: string
  is_public: boolean
  execution_count: number
  last_executed: string | null
  created_at: string
  updated_at: string
}

interface PromptflowBuilderProps {
  initialWorkflows: Workflow[]
}

const nodeTypes = [
  { type: "prompt", label: "Prompt", icon: Brain, color: "bg-blue-500" },
  { type: "ai-model", label: "AI Model", icon: Zap, color: "bg-purple-500" },
  { type: "data-transform", label: "Data Transform", icon: Database, color: "bg-green-500" },
  { type: "condition", label: "Condition", icon: GitBranch, color: "bg-yellow-500" },
  { type: "loop", label: "Loop", icon: Repeat, color: "bg-orange-500" },
  { type: "input", label: "Input", icon: Upload, color: "bg-cyan-500" },
  { type: "output", label: "Output", icon: Download, color: "bg-pink-500" },
  { type: "api-call", label: "API Call", icon: Code, color: "bg-red-500" },
]

export function PromptflowBuilder({ initialWorkflows }: PromptflowBuilderProps) {
  const { user } = useAuth()
  const { subscribeToWorkflowExecution, workflowExecutions } = useRealtime()
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [executionResults, setExecutionResults] = useState<any[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [testInput, setTestInput] = useState<any>({})
  const [showNodeLibrary, setShowNodeLibrary] = useState(false)
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 })

  const supabase = createClient()

  useEffect(() => {
    if (selectedWorkflow) {
      const executions = workflowExecutions.filter((exec) => exec.workflow_id === selectedWorkflow.id)
      setExecutionResults(executions)
    }
  }, [workflowExecutions, selectedWorkflow])

  const createNewWorkflow = useCallback(async () => {
    if (!user) return

    const newWorkflow = {
      name: "New Workflow",
      description: "A new AI workflow",
      workflow_data: {
        nodes: [
          {
            id: "input-1",
            type: "input",
            data: { name: "input", defaultValue: "" },
            position: { x: 100, y: 100 },
          },
          {
            id: "output-1",
            type: "output",
            data: { name: "output", value: "{{input-1}}" },
            position: { x: 400, y: 100 },
          },
        ],
        edges: [
          {
            id: "edge-1",
            source: "input-1",
            target: "output-1",
          },
        ],
      },
      status: "draft",
      is_public: false,
    }

    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkflow),
      })

      if (response.ok) {
        const workflow = await response.json()
        setWorkflows((prev) => [workflow, ...prev])
        setSelectedWorkflow(workflow)
        setIsEditing(true)
      }
    } catch (error) {
      console.error("Failed to create workflow:", error)
    }
  }, [user])

  const saveWorkflow = useCallback(async () => {
    if (!selectedWorkflow) return

    try {
      const response = await fetch(`/api/workflows/${selectedWorkflow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedWorkflow.name,
          description: selectedWorkflow.description,
          workflow_data: selectedWorkflow.workflow_data,
          status: selectedWorkflow.status,
          is_public: selectedWorkflow.is_public,
        }),
      })

      if (response.ok) {
        const updatedWorkflow = await response.json()
        setWorkflows((prev) => prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))
        setSelectedWorkflow(updatedWorkflow)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Failed to save workflow:", error)
    }
  }, [selectedWorkflow])

  const executeWorkflow = useCallback(async () => {
    if (!selectedWorkflow) return

    setIsExecuting(true)
    subscribeToWorkflowExecution(selectedWorkflow.id)

    try {
      const response = await fetch(`/api/workflows/${selectedWorkflow.id}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_data: testInput }),
      })

      if (response.ok) {
        const { execution_id } = await response.json()
        console.log("Workflow execution started:", execution_id)
      }
    } catch (error) {
      console.error("Failed to execute workflow:", error)
    } finally {
      setIsExecuting(false)
    }
  }, [selectedWorkflow, testInput, subscribeToWorkflowExecution])

  const addNode = useCallback(
    (nodeType: string, position: { x: number; y: number }) => {
      if (!selectedWorkflow) return

      const newNode: WorkflowNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        data: getDefaultNodeData(nodeType),
        position,
      }

      const updatedWorkflow = {
        ...selectedWorkflow,
        workflow_data: {
          ...selectedWorkflow.workflow_data,
          nodes: [...selectedWorkflow.workflow_data.nodes, newNode],
        },
      }

      setSelectedWorkflow(updatedWorkflow)
      setIsEditing(true)
    },
    [selectedWorkflow],
  )

  const getDefaultNodeData = (nodeType: string) => {
    switch (nodeType) {
      case "prompt":
        return { template: "Enter your prompt template here...", variables: {} }
      case "ai-model":
        return { provider: "openai", model: "gpt-4", prompt: "", temperature: 0.7, maxTokens: 1000 }
      case "data-transform":
        return { operation: "json-parse", input: "", parameters: {} }
      case "condition":
        return { left: "", operator: "equals", right: "" }
      case "loop":
        return { type: "for-each", items: "", body: [] }
      case "input":
        return { name: "input", defaultValue: "" }
      case "output":
        return { name: "output", value: "" }
      case "api-call":
        return { url: "", method: "GET", headers: {}, body: {} }
      default:
        return {}
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Workflows</h2>
            <Button onClick={createNewWorkflow} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {workflows.map((workflow) => (
              <Card
                key={workflow.id}
                className={`cursor-pointer transition-colors ${
                  selectedWorkflow?.id === workflow.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedWorkflow(workflow)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium truncate">{workflow.name}</h3>
                    <Badge variant={workflow.status === "active" ? "default" : "secondary"}>{workflow.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{workflow.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{workflow.execution_count} runs</span>
                    <div className="flex items-center">
                      {workflow.is_public ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedWorkflow ? (
          <>
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h1 className="text-xl font-semibold">{selectedWorkflow.name}</h1>
                    <p className="text-sm text-gray-600">{selectedWorkflow.description}</p>
                  </div>
                  <Badge variant={selectedWorkflow.status === "active" ? "default" : "secondary"}>
                    {selectedWorkflow.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowNodeLibrary(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Node
                  </Button>
                  <Button variant="outline" size="sm" onClick={executeWorkflow} disabled={isExecuting}>
                    {isExecuting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Execute
                  </Button>
                  <Button size="sm" onClick={saveWorkflow} disabled={!isEditing}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>

            {/* Canvas and Properties */}
            <div className="flex-1 flex">
              {/* Canvas */}
              <div className="flex-1 bg-gray-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="relative h-full p-8">
                  <div className="grid grid-cols-4 gap-4 h-full">
                    {selectedWorkflow.workflow_data.nodes.map((node) => {
                      const nodeType = nodeTypes.find((nt) => nt.type === node.type)
                      const Icon = nodeType?.icon || Brain

                      return (
                        <Card
                          key={node.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedNode?.id === node.id ? "ring-2 ring-blue-500" : ""
                          }`}
                          onClick={() => setSelectedNode(node)}
                          style={{
                            gridColumn: Math.floor(node.position.x / 200) + 1,
                            gridRow: Math.floor(node.position.y / 150) + 1,
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`p-2 rounded ${nodeType?.color || "bg-gray-500"}`}>
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{nodeType?.label || node.type}</h4>
                                <p className="text-xs text-gray-500">{node.id}</p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">
                              {node.type === "prompt" && node.data.template?.slice(0, 50) + "..."}
                              {node.type === "ai-model" && `${node.data.provider}/${node.data.model}`}
                              {node.type === "input" && `Input: ${node.data.name}`}
                              {node.type === "output" && `Output: ${node.data.name}`}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Properties Panel */}
              <div className="w-80 bg-white border-l border-gray-200">
                <Tabs defaultValue="properties" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="properties">Properties</TabsTrigger>
                    <TabsTrigger value="test">Test</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                  </TabsList>

                  <TabsContent value="properties" className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4">
                        {selectedNode ? (
                          <NodePropertiesPanel node={selectedNode} />
                        ) : (
                          <WorkflowPropertiesPanel workflow={selectedWorkflow} onUpdate={setSelectedWorkflow} />
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="test" className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4">
                        <h3 className="font-medium">Test Input</h3>
                        <Textarea
                          placeholder="Enter test input as JSON..."
                          value={JSON.stringify(testInput, null, 2)}
                          onChange={(e) => {
                            try {
                              setTestInput(JSON.parse(e.target.value))
                            } catch {
                              // Invalid JSON, ignore
                            }
                          }}
                          className="h-32"
                        />
                        <Button onClick={executeWorkflow} disabled={isExecuting} className="w-full">
                          {isExecuting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          Run Test
                        </Button>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="results" className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4">
                        <h3 className="font-medium">Execution Results</h3>
                        {executionResults.length === 0 ? (
                          <p className="text-sm text-gray-500">No executions yet</p>
                        ) : (
                          executionResults.map((result) => (
                            <Card key={result.id}>
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(result.status)}
                                    <span className="text-sm font-medium">{result.status}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {new Date(result.started_at).toLocaleTimeString()}
                                  </span>
                                </div>
                                {result.duration_ms && (
                                  <p className="text-xs text-gray-600">Duration: {result.duration_ms}ms</p>
                                )}
                                {result.error_message && (
                                  <Alert className="mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs">{result.error_message}</AlertDescription>
                                  </Alert>
                                )}
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Workflow</h2>
              <p className="text-gray-600 mb-4">Choose a workflow from the sidebar to start editing</p>
              <Button onClick={createNewWorkflow}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Workflow
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Node Library Dialog */}
      <Dialog open={showNodeLibrary} onOpenChange={setShowNodeLibrary}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Node</DialogTitle>
            <DialogDescription>Choose a node type to add to your workflow</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {nodeTypes.map((nodeType) => {
              const Icon = nodeType.icon
              return (
                <Card
                  key={nodeType.type}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    addNode(nodeType.type, { x: 200, y: 200 })
                    setShowNodeLibrary(false)
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded ${nodeType.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{nodeType.label}</h3>
                        <p className="text-sm text-gray-600">{getNodeDescription(nodeType.type)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function NodePropertiesPanel({ node }: { node: WorkflowNode }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Node ID</Label>
        <Input value={node.id} disabled />
      </div>
      <div>
        <Label>Node Type</Label>
        <Input value={node.type} disabled />
      </div>

      {node.type === "prompt" && (
        <div>
          <Label>Template</Label>
          <Textarea value={node.data.template || ""} placeholder="Enter your prompt template..." className="h-32" />
        </div>
      )}

      {node.type === "ai-model" && (
        <>
          <div>
            <Label>Provider</Label>
            <Select value={node.data.provider || "openai"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Model</Label>
            <Input value={node.data.model || "gpt-4"} />
          </div>
          <div>
            <Label>Temperature</Label>
            <Slider value={[node.data.temperature || 0.7]} max={2} min={0} step={0.1} className="w-full" />
          </div>
        </>
      )}

      {node.type === "input" && (
        <>
          <div>
            <Label>Input Name</Label>
            <Input value={node.data.name || ""} />
          </div>
          <div>
            <Label>Default Value</Label>
            <Input value={node.data.defaultValue || ""} />
          </div>
        </>
      )}

      {node.type === "output" && (
        <>
          <div>
            <Label>Output Name</Label>
            <Input value={node.data.name || ""} />
          </div>
          <div>
            <Label>Value</Label>
            <Input value={node.data.value || ""} />
          </div>
        </>
      )}
    </div>
  )
}

function WorkflowPropertiesPanel({
  workflow,
  onUpdate,
}: {
  workflow: Workflow
  onUpdate: (workflow: Workflow) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Workflow Name</Label>
        <Input value={workflow.name} onChange={(e) => onUpdate({ ...workflow, name: e.target.value })} />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={workflow.description}
          onChange={(e) => onUpdate({ ...workflow, description: e.target.value })}
        />
      </div>
      <div>
        <Label>Status</Label>
        <Select value={workflow.status} onValueChange={(value) => onUpdate({ ...workflow, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={workflow.is_public}
          onCheckedChange={(checked) => onUpdate({ ...workflow, is_public: checked })}
        />
        <Label>Public Workflow</Label>
      </div>
    </div>
  )
}

function getNodeDescription(nodeType: string): string {
  switch (nodeType) {
    case "prompt":
      return "Create and manage AI prompts with variables"
    case "ai-model":
      return "Execute AI models with custom parameters"
    case "data-transform":
      return "Transform and process data between nodes"
    case "condition":
      return "Add conditional logic to your workflow"
    case "loop":
      return "Iterate over data with loops"
    case "input":
      return "Define workflow input parameters"
    case "output":
      return "Set workflow output values"
    case "api-call":
      return "Make HTTP requests to external APIs"
    default:
      return "Node description"
  }
}
