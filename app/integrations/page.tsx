"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Plus,
  Settings,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bot,
  Key,
  Zap,
  Activity,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  provider: string
  model_name: string
  status: "active" | "inactive" | "error"
  api_endpoint?: string
  created_at: string
  last_used?: string
  usage_count: number
}

const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "GPT-4 Turbo",
    provider: "openai",
    model_name: "gpt-4-turbo-preview",
    status: "active",
    created_at: new Date().toISOString(),
    last_used: new Date().toISOString(),
    usage_count: 1247,
  },
  {
    id: "2",
    name: "Claude 3 Opus",
    provider: "anthropic",
    model_name: "claude-3-opus-20240229",
    status: "inactive",
    created_at: new Date().toISOString(),
    usage_count: 0,
  },
  {
    id: "3",
    name: "Gemini Pro",
    provider: "google",
    model_name: "gemini-pro",
    status: "error",
    created_at: new Date().toISOString(),
    last_used: new Date(Date.now() - 86400000).toISOString(),
    usage_count: 45,
  },
]

const providers = [
  { id: "openai", name: "OpenAI", models: ["gpt-4-turbo-preview", "gpt-4", "gpt-3.5-turbo"] },
  {
    id: "anthropic",
    name: "Anthropic",
    models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
  },
  { id: "google", name: "Google", models: ["gemini-pro", "gemini-pro-vision"] },
  { id: "custom", name: "Custom API", models: [] },
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    provider: "",
    model_name: "",
    api_key: "",
    api_endpoint: "",
  })

  const filteredIntegrations = integrations.filter(
    (integration) =>
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.provider.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateIntegration = () => {
    const integration: Integration = {
      id: Date.now().toString(),
      name: newIntegration.name,
      provider: newIntegration.provider,
      model_name: newIntegration.model_name,
      status: "active",
      api_endpoint: newIntegration.api_endpoint,
      created_at: new Date().toISOString(),
      usage_count: 0,
    }

    setIntegrations([integration, ...integrations])
    setNewIntegration({
      name: "",
      provider: "",
      model_name: "",
      api_key: "",
      api_endpoint: "",
    })
    setShowCreateDialog(false)
  }

  const handleToggleStatus = (id: string) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === id
          ? { ...integration, status: integration.status === "active" ? "inactive" : "active" }
          : integration,
      ),
    )
  }

  const handleDeleteIntegration = (id: string) => {
    setIntegrations(integrations.filter((integration) => integration.id !== id))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const selectedProvider = providers.find((p) => p.id === newIntegration.provider)

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
                  <h1 className="text-3xl font-bold text-gray-900">AI Integrations</h1>
                  <p className="text-gray-600">Connect and manage your AI model integrations</p>
                </div>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Integration
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add AI Integration</DialogTitle>
                      <DialogDescription>Connect a new AI model to your workspace</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Integration Name</Label>
                        <Input
                          id="name"
                          value={newIntegration.name}
                          onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                          placeholder="e.g., GPT-4 Production"
                        />
                      </div>
                      <div>
                        <Label htmlFor="provider">Provider</Label>
                        <Select
                          value={newIntegration.provider}
                          onValueChange={(value) =>
                            setNewIntegration({ ...newIntegration, provider: value, model_name: "" })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {providers.map((provider) => (
                              <SelectItem key={provider.id} value={provider.id}>
                                {provider.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {selectedProvider && selectedProvider.models.length > 0 && (
                        <div>
                          <Label htmlFor="model">Model</Label>
                          <Select
                            value={newIntegration.model_name}
                            onValueChange={(value) => setNewIntegration({ ...newIntegration, model_name: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedProvider.models.map((model) => (
                                <SelectItem key={model} value={model}>
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {newIntegration.provider === "custom" && (
                        <div>
                          <Label htmlFor="model_custom">Model Name</Label>
                          <Input
                            id="model_custom"
                            value={newIntegration.model_name}
                            onChange={(e) => setNewIntegration({ ...newIntegration, model_name: e.target.value })}
                            placeholder="Enter model name"
                          />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="api_key">API Key</Label>
                        <Input
                          id="api_key"
                          type="password"
                          value={newIntegration.api_key}
                          onChange={(e) => setNewIntegration({ ...newIntegration, api_key: e.target.value })}
                          placeholder="Enter your API key"
                        />
                      </div>
                      {newIntegration.provider === "custom" && (
                        <div>
                          <Label htmlFor="api_endpoint">API Endpoint</Label>
                          <Input
                            id="api_endpoint"
                            value={newIntegration.api_endpoint}
                            onChange={(e) => setNewIntegration({ ...newIntegration, api_endpoint: e.target.value })}
                            placeholder="https://api.example.com/v1"
                          />
                        </div>
                      )}
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateIntegration} className="bg-purple-600 hover:bg-purple-700">
                          Add Integration
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Integrations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map((integration) => (
                  <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {integration.provider} • {integration.model_name}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(integration.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(integration.status)}
                            <span className="capitalize">{integration.status}</span>
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
                              <span>{integration.usage_count} calls</span>
                            </div>
                            {integration.last_used && (
                              <div className="flex items-center space-x-1">
                                <Activity className="h-4 w-4" />
                                <span>{new Date(integration.last_used).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={integration.status === "active"}
                              onCheckedChange={() => handleToggleStatus(integration.id)}
                            />
                            <span className="text-sm text-gray-600">
                              {integration.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Key className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteIntegration(integration.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredIntegrations.length === 0 && (
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
                  <p className="text-gray-600 mb-4">Add your first AI integration to get started</p>
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Integration
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
