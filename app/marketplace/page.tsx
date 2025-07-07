"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Star,
  Download,
  Heart,
  Share,
  TrendingUp,
  Crown,
  Zap,
  FileText,
  Workflow,
  Bot,
  DollarSign,
} from "lucide-react"

interface MarketplaceItem {
  id: string
  title: string
  description: string
  category: string
  type: "prompt" | "template" | "workflow"
  price: number
  rating: number
  downloads: number
  author: string
  tags: string[]
  is_featured: boolean
  created_at: string
}

const mockItems: MarketplaceItem[] = [
  {
    id: "1",
    title: "SEO Blog Post Generator",
    description: "Generate SEO-optimized blog posts with proper structure and keywords",
    category: "Content",
    type: "template",
    price: 0,
    rating: 4.9,
    downloads: 2847,
    author: "Sarah Johnson",
    tags: ["seo", "blog", "content"],
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Code Review Assistant",
    description: "Comprehensive code analysis and improvement suggestions",
    category: "Development",
    type: "prompt",
    price: 5.99,
    rating: 4.8,
    downloads: 1923,
    author: "Alex Chen",
    tags: ["code", "review", "development"],
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Email Marketing Automation",
    description: "Complete workflow for automated email marketing campaigns",
    category: "Marketing",
    type: "workflow",
    price: 19.99,
    rating: 4.7,
    downloads: 856,
    author: "Maria Garcia",
    tags: ["email", "marketing", "automation"],
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Data Analysis Report",
    description: "Generate comprehensive data analysis reports with insights",
    category: "Analytics",
    type: "template",
    price: 0,
    rating: 4.6,
    downloads: 1456,
    author: "David Kim",
    tags: ["data", "analysis", "reports"],
    is_featured: false,
    created_at: new Date().toISOString(),
  },
]

const categories = ["All", "Content", "Development", "Marketing", "Analytics", "Business", "Creative"]
const sortOptions = ["Popular", "Newest", "Rating", "Price: Low to High", "Price: High to Low"]

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>(mockItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState("Popular")
  const [priceFilter, setPriceFilter] = useState("all")

  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      const matchesType = selectedType === "all" || item.type === selectedType
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "free" && item.price === 0) ||
        (priceFilter === "paid" && item.price > 0)

      return matchesSearch && matchesCategory && matchesType && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "Rating":
          return b.rating - a.rating
        case "Price: Low to High":
          return a.price - b.price
        case "Price: High to Low":
          return b.price - a.price
        default: // Popular
          return b.downloads - a.downloads
      }
    })

  const handleDownload = (item: MarketplaceItem) => {
    setItems(items.map((i) => (i.id === item.id ? { ...i, downloads: i.downloads + 1 } : i)))
    // In a real app, this would trigger the download/purchase flow
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "prompt":
        return <FileText className="h-4 w-4" />
      case "template":
        return <Zap className="h-4 w-4" />
      case "workflow":
        return <Workflow className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "prompt":
        return "bg-blue-100 text-blue-800"
      case "template":
        return "bg-green-100 text-green-800"
      case "workflow":
        return "bg-purple-100 text-purple-800"
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
                  <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                  <p className="text-gray-600">Discover and share AI prompts, templates, and workflows</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Crown className="h-4 w-4 mr-2" />
                  Publish Item
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search marketplace..."
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
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="prompt">Prompts</SelectItem>
                    <SelectItem value="template">Templates</SelectItem>
                    <SelectItem value="workflow">Workflows</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Featured Items */}
              {filteredItems.some((item) => item.is_featured) && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <h2 className="text-xl font-semibold text-gray-900">Featured</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems
                      .filter((item) => item.is_featured)
                      .map((item) => (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow border-yellow-200">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge className={getTypeColor(item.type)}>
                                    <div className="flex items-center space-x-1">
                                      {getTypeIcon(item.type)}
                                      <span className="capitalize">{item.type}</span>
                                    </div>
                                  </Badge>
                                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Featured
                                  </Badge>
                                </div>
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                                <CardDescription className="mt-1">{item.description}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span>{item.rating}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Download className="h-4 w-4" />
                                    <span>{item.downloads}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Avatar className="h-5 w-5">
                                    <AvatarFallback className="text-xs">{item.author.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{item.author}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-semibold text-gray-900">
                                    {item.price === 0 ? "Free" : `$${item.price}`}
                                  </span>
                                  {item.price > 0 && <DollarSign className="h-4 w-4 text-green-600" />}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Heart className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Share className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-700"
                                    onClick={() => handleDownload(item)}
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    {item.price === 0 ? "Get" : "Buy"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* All Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">All Items ({filteredItems.length})</h2>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Sorted by {sortBy}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems
                    .filter((item) => !item.is_featured)
                    .map((item) => (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge className={getTypeColor(item.type)}>
                                  <div className="flex items-center space-x-1">
                                    {getTypeIcon(item.type)}
                                    <span className="capitalize">{item.type}</span>
                                  </div>
                                </Badge>
                                <Badge variant="secondary">{item.category}</Badge>
                              </div>
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                              <CardDescription className="mt-1">{item.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span>{item.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Download className="h-4 w-4" />
                                  <span>{item.downloads}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-xs">{item.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{item.author}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-semibold text-gray-900">
                                  {item.price === 0 ? "Free" : `$${item.price}`}
                                </span>
                                {item.price > 0 && <DollarSign className="h-4 w-4 text-green-600" />}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline">
                                  <Heart className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Share className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-purple-600 hover:bg-purple-700"
                                  onClick={() => handleDownload(item)}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  {item.price === 0 ? "Get" : "Buy"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Crown className="h-4 w-4 mr-2" />
                      Publish Your First Item
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
