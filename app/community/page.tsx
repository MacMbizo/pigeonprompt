"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Plus,
  MessageCircle,
  Heart,
  Share,
  Users,
  TrendingUp,
  Clock,
  Star,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Award,
} from "lucide-react"

interface Post {
  id: string
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  likes: number
  replies: number
  created_at: string
  is_pinned?: boolean
}

interface User {
  id: string
  name: string
  role: string
  posts: number
  reputation: number
  joined: string
}

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Best practices for prompt engineering with GPT-4",
    content:
      "I've been experimenting with different prompt structures and found some interesting patterns that consistently improve output quality...",
    author: "Sarah Johnson",
    category: "Tips & Tricks",
    tags: ["gpt-4", "prompt-engineering", "best-practices"],
    likes: 24,
    replies: 8,
    created_at: new Date().toISOString(),
    is_pinned: true,
  },
  {
    id: "2",
    title: "How to optimize workflow execution costs?",
    content:
      "My workflows are getting expensive to run. What strategies do you use to optimize costs while maintaining quality?",
    author: "Alex Chen",
    category: "Help & Support",
    tags: ["workflows", "cost-optimization", "help"],
    likes: 15,
    replies: 12,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    title: "Sharing my content creation workflow template",
    content:
      "I've built a comprehensive workflow for automated content creation that includes SEO optimization, fact-checking, and formatting...",
    author: "Maria Garcia",
    category: "Show & Tell",
    tags: ["content", "workflow", "template", "automation"],
    likes: 31,
    replies: 6,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
]

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "AI Specialist",
    posts: 47,
    reputation: 1250,
    joined: "2023-06-15",
  },
  {
    id: "2",
    name: "Alex Chen",
    role: "Developer",
    posts: 23,
    reputation: 890,
    joined: "2023-08-22",
  },
  {
    id: "3",
    name: "Maria Garcia",
    role: "Content Creator",
    posts: 35,
    reputation: 1100,
    joined: "2023-07-10",
  },
]

const categories = ["All", "Tips & Tricks", "Help & Support", "Show & Tell", "Feature Requests", "General Discussion"]

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("discussions")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  })

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      // Pin pinned posts to top
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const handleCreatePost = () => {
    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: "You",
      category: newPost.category,
      tags: newPost.tags.split(",").map((tag) => tag.trim()),
      likes: 0,
      replies: 0,
      created_at: new Date().toISOString(),
    }

    setPosts([post, ...posts])
    setNewPost({ title: "", content: "", category: "", tags: "" })
    setShowCreateDialog(false)
  }

  const handleLikePost = (id: string) => {
    setPosts(posts.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post)))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tips & Tricks":
        return <Lightbulb className="h-4 w-4" />
      case "Help & Support":
        return <HelpCircle className="h-4 w-4" />
      case "Show & Tell":
        return <Star className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Tips & Tricks":
        return "bg-yellow-100 text-yellow-800"
      case "Help & Support":
        return "bg-blue-100 text-blue-800"
      case "Show & Tell":
        return "bg-green-100 text-green-800"
      case "Feature Requests":
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
                  <h1 className="text-3xl font-bold text-gray-900">Community</h1>
                  <p className="text-gray-600">Connect, learn, and share with the PigeonPrompt community</p>
                </div>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Post</DialogTitle>
                      <DialogDescription>Share your knowledge with the community</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          placeholder="What's your post about?"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          value={newPost.category}
                          onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select category</option>
                          {categories.slice(1).map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          placeholder="Share your thoughts, questions, or insights..."
                          className="h-32"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={newPost.tags}
                          onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                          placeholder="ai, prompts, workflows"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreatePost} className="bg-purple-600 hover:bg-purple-700">
                          Create Post
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Community Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Members</p>
                        <p className="text-lg font-semibold">1,247</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Discussions</p>
                        <p className="text-lg font-semibold">3,456</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Resources</p>
                        <p className="text-lg font-semibold">892</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Active Today</p>
                        <p className="text-lg font-semibold">156</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="discussions" className="space-y-6">
                  {/* Filters */}
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search discussions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className={selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Posts */}
                  <div className="space-y-4">
                    {filteredPosts.map((post) => (
                      <Card
                        key={post.id}
                        className={`hover:shadow-md transition-shadow ${post.is_pinned ? "border-yellow-200 bg-yellow-50" : ""}`}
                      >
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {post.is_pinned && <Badge className="bg-yellow-100 text-yellow-800">📌 Pinned</Badge>}
                                  <Badge className={getCategoryColor(post.category)}>
                                    <div className="flex items-center space-x-1">
                                      {getCategoryIcon(post.category)}
                                      <span>{post.category}</span>
                                    </div>
                                  </Badge>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                                <p className="text-gray-600 line-clamp-2">{post.content}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">{post.author.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-gray-600">{post.author}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleLikePost(post.id)}
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  <Heart className="h-4 w-4 mr-1" />
                                  {post.likes}
                                </Button>
                                <Button size="sm" variant="ghost" className="text-gray-500">
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  {post.replies}
                                </Button>
                                <Button size="sm" variant="ghost" className="text-gray-500">
                                  <Share className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredPosts.length === 0 && (
                      <div className="text-center py-12">
                        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
                        <p className="text-gray-600 mb-4">Be the first to start a conversation!</p>
                        <Button onClick={() => setShowCreateDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Post
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="members" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockUsers.map((user) => (
                      <Card key={user.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{user.name}</h3>
                              <p className="text-sm text-gray-600">{user.role}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <MessageCircle className="h-3 w-3" />
                                  <span>{user.posts} posts</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Award className="h-3 w-3" />
                                  <span>{user.reputation} rep</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="space-y-6">
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Resources Coming Soon</h3>
                    <p className="text-gray-600">
                      We're working on a comprehensive resource library for the community.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
