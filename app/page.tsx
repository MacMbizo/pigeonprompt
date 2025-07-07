"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth/auth-provider"
import Link from "next/link"
import {
  Search,
  Plus,
  TrendingUp,
  Users,
  Zap,
  FileText,
  Bot,
  Puzzle,
  Network,
  BarChart3,
  Star,
  ArrowRight,
  Sparkles,
  Globe,
  BookOpen,
  ChevronRight,
  Play,
  Heart,
  Workflow,
  Bell,
  Settings,
} from "lucide-react"

export default function PigeonPromptDashboard() {
  const { user, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState({
    prompts: [],
    workflows: [],
    templates: [],
    integrations: [],
    activities: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data loading
    const loadMockData = async () => {
      if (!user) return

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockData = {
        prompts: [
          { id: 1, title: "Blog Post Writer", category: "Content", created_at: new Date().toISOString() },
          { id: 2, title: "Code Reviewer", category: "Development", created_at: new Date().toISOString() },
          { id: 3, title: "Email Generator", category: "Marketing", created_at: new Date().toISOString() },
        ],
        workflows: [
          { id: 1, name: "Content Pipeline", status: "active", created_at: new Date().toISOString() },
          { id: 2, name: "Data Analysis", status: "draft", created_at: new Date().toISOString() },
        ],
        templates: [
          { id: 1, name: "SEO Article", category: "Content", created_at: new Date().toISOString() },
          { id: 2, name: "Product Description", category: "E-commerce", created_at: new Date().toISOString() },
        ],
        integrations: [
          { id: 1, name: "OpenAI GPT-4", provider: "openai", status: "active" },
          { id: 2, name: "Claude 3", provider: "anthropic", status: "inactive" },
        ],
        activities: [
          {
            id: 1,
            type: "prompt_created",
            data: { title: "New prompt created" },
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            type: "workflow_executed",
            data: { title: "Workflow executed" },
            created_at: new Date().toISOString(),
          },
        ],
      }

      setDashboardData(mockData)
      setLoading(false)
    }

    loadMockData()
  }, [user])

  const quickStats = {
    totalPrompts: dashboardData.prompts.length,
    totalWorkflows: dashboardData.workflows.length,
    totalIntegrations: dashboardData.integrations.length,
    monthlyUsage: 1247,
    avgRating: 4.8,
    communityMembers: 156,
  }

  const recentActivity = [
    {
      id: 1,
      type: "prompt",
      title: "Blog Post Writer Template",
      action: "created",
      time: "2 hours ago",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      id: 2,
      type: "workflow",
      title: "Content Creation Pipeline",
      action: "executed",
      time: "4 hours ago",
      icon: Workflow,
      color: "text-purple-600",
    },
    {
      id: 3,
      type: "integration",
      title: "GPT-4 Turbo",
      action: "configured",
      time: "1 day ago",
      icon: Bot,
      color: "text-green-600",
    },
    {
      id: 4,
      type: "marketplace",
      title: "Code Review Assistant",
      action: "published",
      time: "2 days ago",
      icon: Globe,
      color: "text-orange-600",
    },
  ]

  const featuredTemplates = [
    {
      id: 1,
      name: "Blog Post Writer",
      description: "Generate SEO-optimized blog posts",
      category: "Content",
      rating: 4.9,
      uses: 1247,
      author: "Sarah Johnson",
    },
    {
      id: 2,
      name: "Code Review Assistant",
      description: "Comprehensive code analysis and suggestions",
      category: "Development",
      rating: 4.8,
      uses: 892,
      author: "Alex Chen",
    },
    {
      id: 3,
      name: "Email Marketing Copy",
      description: "Create compelling email campaigns",
      category: "Marketing",
      rating: 4.7,
      uses: 634,
      author: "Maria Garcia",
    },
  ]

  const platformFeatures = [
    {
      title: "AI Integrations",
      description: "Connect and manage multiple AI models and services",
      icon: Puzzle,
      href: "/integrations",
      color: "bg-blue-500",
      stats: `${quickStats.totalIntegrations} integrations`,
      features: ["Model Management", "API Configuration", "Testing Playground"],
    },
    {
      title: "Template Creation",
      description: "Build reusable prompt templates with variables",
      icon: FileText,
      href: "/templates",
      color: "bg-green-500",
      stats: `${quickStats.totalPrompts} templates`,
      features: ["Visual Editor", "Variable System", "Preview Mode"],
    },
    {
      title: "Marketplace",
      description: "Discover, share, and monetize AI prompts",
      icon: Globe,
      href: "/marketplace",
      color: "bg-purple-500",
      stats: "1000+ items",
      features: ["Community Sharing", "Monetization", "Reviews & Ratings"],
    },
    {
      title: "Workflow Builder",
      description: "Design and automate AI-driven workflows",
      icon: Workflow,
      href: "/workflows",
      color: "bg-orange-500",
      stats: `${quickStats.totalWorkflows} workflows`,
      features: ["Visual Designer", "Automation", "Real-time Execution"],
    },
    {
      title: "Analytics Dashboard",
      description: "Track performance and optimize your AI usage",
      icon: BarChart3,
      href: "/analytics",
      color: "bg-indigo-500",
      stats: "Real-time insights",
      features: ["Usage Analytics", "Performance Metrics", "Cost Tracking"],
    },
    {
      title: "Community Hub",
      description: "Collaborate and learn from other AI practitioners",
      icon: Users,
      href: "/community",
      color: "bg-pink-500",
      stats: `${quickStats.communityMembers} members`,
      features: ["Discussions", "Knowledge Sharing", "Collaboration"],
    },
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Welcome to PigeonPrompt</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/auth/login">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" className="w-full bg-transparent">
                Create Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">PigeonPrompt</h1>
                  <p className="text-xs text-slate-500">AI Prompt Management Platform</p>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search prompts, workflows, integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-96"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Zap className="w-4 h-4 mr-2" />
                Quick Start
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-slate-100 text-slate-600 text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Welcome back, {user.email?.split("@")[0]}</h2>
                  <p className="text-purple-100 text-lg max-w-2xl">
                    Your intelligent AI prompt management platform. Create, manage, and optimize AI workflows with ease.
                  </p>
                  <div className="flex items-center space-x-4">
                    <Button className="bg-white text-purple-600 hover:bg-purple-50">
                      <Play className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                    <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Documentation
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-64 h-48 bg-white/10 rounded-xl flex items-center justify-center">
                    <Network className="w-24 h-24 text-white/50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Prompts</p>
                      <p className="text-2xl font-bold text-slate-900">{quickStats.totalPrompts}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Active Workflows</p>
                      <p className="text-2xl font-bold text-slate-900">{quickStats.totalWorkflows}</p>
                    </div>
                    <Workflow className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">+3 new this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Monthly Usage</p>
                      <p className="text-2xl font-bold text-slate-900">{quickStats.monthlyUsage.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">+24% increase</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Avg Rating</p>
                      <p className="text-2xl font-bold text-slate-900">{quickStats.avgRating}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Excellent performance</p>
                </CardContent>
              </Card>
            </div>

            {/* Featured Templates */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Featured Templates</h3>
                <Link href="/templates">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>{template.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Zap className="w-4 h-4" />
                              <span>{template.uses}</span>
                            </div>
                          </div>
                          <span className="text-xs">by {template.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                            <Play className="w-4 h-4 mr-1" />
                            Use Template
                          </Button>
                          <Button variant="outline" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/templates">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <h4 className="font-medium text-slate-900 mb-1">Create Template</h4>
                      <p className="text-sm text-slate-600">Build a new prompt template</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/workflows">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Workflow className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                      <h4 className="font-medium text-slate-900 mb-1">Build Workflow</h4>
                      <p className="text-sm text-slate-600">Design AI automation</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/integrations">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Puzzle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                      <h4 className="font-medium text-slate-900 mb-1">Add Integration</h4>
                      <p className="text-sm text-slate-600">Connect AI models</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/marketplace">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Globe className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                      <h4 className="font-medium text-slate-900 mb-1">Explore Marketplace</h4>
                      <p className="text-sm text-slate-600">Discover community content</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-slate-900">Platform Features</h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  Discover the powerful tools and capabilities that make PigeonPrompt the ultimate AI prompt management
                  platform.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {platformFeatures.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-200 group">
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                          <CardDescription className="text-base">{feature.description}</CardDescription>
                          <Badge variant="outline" className="mt-2">
                            {feature.stats}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {feature.features.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm text-slate-600">
                              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                        <Link href={feature.href}>
                          <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:shadow-md transition-all">
                            Explore {feature.title}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">Recent Activity</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-4 p-4 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <div className={`w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center`}>
                            <activity.icon className={`w-5 h-5 ${activity.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{activity.title}</h4>
                            <p className="text-sm text-slate-600">
                              {activity.action} • {activity.time}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Overview */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Usage Overview</h3>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Progress</CardTitle>
                    <CardDescription>API calls this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">1,247 / 2,000</span>
                        <span className="text-sm font-medium">62%</span>
                      </div>
                      <Progress value={62} className="h-2" />
                      <p className="text-xs text-slate-500">753 calls remaining</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Content Creation", percentage: 45, color: "bg-blue-500" },
                        { name: "Code Analysis", percentage: 30, color: "bg-green-500" },
                        { name: "Data Processing", percentage: 25, color: "bg-purple-500" },
                      ].map((category, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-700">{category.name}</span>
                            <span className="text-slate-500">{category.percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`${category.color} h-2 rounded-full transition-all`}
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Success Rate</span>
                        <span className="text-sm font-medium text-green-600">98.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Avg Response Time</span>
                        <span className="text-sm font-medium">1.2s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Cost This Month</span>
                        <span className="text-sm font-medium">$24.50</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
