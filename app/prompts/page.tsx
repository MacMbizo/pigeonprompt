"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useAuth } from "@/lib/auth/auth-provider"
import { Search, Plus, Filter, Star, Copy, Edit, Trash2, Heart, Share, FileText, Zap, User } from "lucide-react"

interface Prompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  is_public: boolean
  usage_count: number
  rating: number
  created_at: string
  author: string
}

const mockPrompts: Prompt[] = [
  {
    id: "1",
    title: "Blog Post Writer",
    description: "Generate SEO-optimized blog posts on any topic",
    content:
      "Write a comprehensive blog post about {{topic}}. Include an engaging introduction, detailed sections with subheadings, and a compelling conclusion. Make it SEO-friendly with relevant keywords.",
    category: "Content",
    tags: ["blog", "seo", "writing"],
    is_public: true,
    usage_count: 1247,
    rating: 4.8,
    created_at: new Date().toISOString(),
    author: "You",
  },
  {
    id: "2",
    title: "Code Review Assistant",
    description: "Comprehensive code analysis and suggestions",
    content:
      "Review the following {{language}} code and provide detailed feedback on:\n1. Code quality and best practices\n2. Performance optimizations\n3. Security considerations\n4. Maintainability improvements\n\nCode:\n{{code_snippet}}",
    category: "Development",
    tags: ["code", "review", "development"],
    is_public: true,
    usage_count: 892,
    rating: 4.9,
    created_at: new Date().toISOString(),
    author: "Alex Chen",
  },
  {
    id: "3",
    title: "Email Marketing Copy",
    description: "Create compelling email campaigns",
    content:
      "Create an email marketing campaign for {{product_name}} targeting {{target_audience}}. Include:\n- Subject line\n- Email body with compelling copy\n- Clear call-to-action\n- Professional tone",
    category: "Marketing",
    tags: ["email", "marketing", "copywriting"],
    is_public: false,
    usage_count: 634,
    rating: 4.7,
    created_at: new Date().toISOString(),
    author: "You",
  },
]

const categories = ["All", "Content", "Development", "Marketing", "Business", "Creative", "Data Analysis"]

export default function PromptsPage() {
  const { user } = useAuth()
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts)
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(mockPrompts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newPrompt, setNewPrompt] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    tags: "",
    is_public: false,
  })

  useEffect(() => {
    let filtered = prompts

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((prompt) => prompt.category === selectedCategory)
    }

    // Filter by tab
    if (activeTab === "my") {
      filtered = filtered.filter((prompt) => prompt.author === "You")
    } else if (activeTab === "public") {
      filtered = filtered.filter((prompt) => prompt.is_public)
    } else if (activeTab === "favorites") {
      // Mock favorites filter
      filtered = filtered.filter((prompt) => prompt.rating > 4.5)
    }

    setFilteredPrompts(filtered)
  }, [prompts, searchQuery, selectedCategory, activeTab])

  const handleCreatePrompt = () => {
    const prompt: Prompt = {
      id: Date.now().toString(),
      title: newPrompt.title,
      description: newPrompt.description,
      content: newPrompt.content,
      category: newPrompt.category,
      tags: newPrompt.tags.split(",").map((tag) => tag.trim()),
      is_public: newPrompt.is_public,
      usage_count: 0,
      rating: 0,
      created_at: new Date().toISOString(),
      author: "You",
    }

    setPrompts([prompt, ...prompts])
    setNewPrompt({
      title: "",
      description: "",
      content: "",
      category: "",
      tags: "",
      is_public: false,
    })
    setShowCreateDialog(false)
  }

  const handleCopyPrompt = (prompt: Prompt) => {
    navigator.clipboard.writeText(prompt.content)
    // You could add a toast notification here
  }

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter((p) => p.id !== id))
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
                  <h1 className="text-3xl font-bold text-gray-900">Prompts</h1>
                  <p className="text-gray-600">Create, manage, and discover AI prompts</p>
                </div>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Prompt
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Prompt</DialogTitle>
                      <DialogDescription>Build a new AI prompt template</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newPrompt.title}
                          onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                          placeholder="Enter prompt title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={newPrompt.description}
                          onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                          placeholder="Brief description of the prompt"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newPrompt.category}
                          onValueChange={(value) => setNewPrompt({ ...newPrompt, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.slice(1).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="content">Prompt Content</Label>
                        <Textarea
                          id="content"
                          value={newPrompt.content}
                          onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
                          placeholder="Enter your prompt template here. Use {{variable}} for dynamic content."
                          className="h-32"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={newPrompt.tags}
                          onChange={(e) => setNewPrompt({ ...newPrompt, tags: e.target.value })}
                          placeholder="tag1, tag2, tag3"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="public"
                          checked={newPrompt.is_public}
                          onCheckedChange={(checked) => setNewPrompt({ ...newPrompt, is_public: checked })}
                        />
                        <Label htmlFor="public">Make this prompt public</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreatePrompt} className="bg-purple-600 hover:bg-purple-700">
                          Create Prompt
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Prompts</TabsTrigger>
                  <TabsTrigger value="my">My Prompts</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrompts.map((prompt) => (
                      <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{prompt.title}</CardTitle>
                              <CardDescription className="mt-1">{prompt.description}</CardDescription>
                            </div>
                            <Badge variant="secondary">{prompt.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-sm text-gray-600 line-clamp-3">{prompt.content}</div>

                            <div className="flex flex-wrap gap-1">
                              {prompt.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span>{prompt.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Zap className="h-4 w-4" />
                                  <span>{prompt.usage_count}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span className="text-xs">{prompt.author}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline" onClick={() => handleCopyPrompt(prompt)}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Heart className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Share className="h-3 w-3" />
                                </Button>
                              </div>
                              {prompt.author === "You" && (
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleDeletePrompt(prompt.id)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredPrompts.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                      <Button onClick={() => setShowCreateDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Prompt
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
