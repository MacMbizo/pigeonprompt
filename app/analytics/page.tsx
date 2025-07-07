"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Zap, Clock, DollarSign, Activity, Target, Award, Calendar } from "lucide-react"

const mockAnalytics = {
  overview: {
    totalPrompts: 47,
    totalWorkflows: 12,
    totalExecutions: 1247,
    totalCost: 124.5,
    avgResponseTime: 1.2,
    successRate: 98.5,
  },
  usage: {
    daily: [
      { date: "2024-01-01", prompts: 15, workflows: 3, cost: 12.5 },
      { date: "2024-01-02", prompts: 23, workflows: 5, cost: 18.75 },
      { date: "2024-01-03", prompts: 18, workflows: 2, cost: 14.25 },
      { date: "2024-01-04", prompts: 31, workflows: 7, cost: 22.8 },
      { date: "2024-01-05", prompts: 28, workflows: 4, cost: 19.6 },
      { date: "2024-01-06", prompts: 35, workflows: 8, cost: 26.4 },
      { date: "2024-01-07", prompts: 42, workflows: 6, cost: 28.9 },
    ],
    categories: [
      { name: "Content Creation", usage: 45, cost: 56.25 },
      { name: "Code Analysis", usage: 30, cost: 37.5 },
      { name: "Data Processing", usage: 15, cost: 18.75 },
      { name: "Marketing", usage: 10, cost: 12.0 },
    ],
  },
  performance: {
    topPrompts: [
      { name: "Blog Post Writer", usage: 156, rating: 4.8, cost: 23.4 },
      { name: "Code Reviewer", usage: 134, rating: 4.9, cost: 20.1 },
      { name: "Email Generator", usage: 98, rating: 4.7, cost: 14.7 },
      { name: "Data Analyzer", usage: 87, rating: 4.6, cost: 13.05 },
    ],
    topWorkflows: [
      { name: "Content Pipeline", executions: 45, success: 97.8, cost: 67.5 },
      { name: "Code Review Flow", executions: 32, success: 100, cost: 48.0 },
      { name: "Marketing Automation", executions: 28, success: 96.4, cost: 42.0 },
    ],
  },
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("usage")

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
                  <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                  <p className="text-gray-600">Track performance and optimize your AI usage</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24h</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Executions</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {mockAnalytics.overview.totalExecutions.toLocaleString()}
                        </p>
                      </div>
                      <Zap className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+12% from last period</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Success Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.successRate}%</p>
                      </div>
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+0.3% improvement</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                        <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.avgResponseTime}s</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">-0.2s faster</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Cost</p>
                        <p className="text-2xl font-bold text-gray-900">${mockAnalytics.overview.totalCost}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-600">+8% from last period</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analytics */}
              <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
                <TabsList>
                  <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="usage" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Usage by Category */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Usage by Category</CardTitle>
                        <CardDescription>Distribution of AI usage across categories</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockAnalytics.usage.categories.map((category, index) => (
                            <div key={category.name} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{category.name}</span>
                                <span className="text-gray-500">{category.usage}%</span>
                              </div>
                              <Progress value={category.usage} className="h-2" />
                              <div className="text-xs text-gray-500">${category.cost} spent</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Daily Usage Trend */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Daily Usage Trend</CardTitle>
                        <CardDescription>Prompts and workflows executed over time</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockAnalytics.usage.daily.slice(-5).map((day, index) => (
                            <div key={day.date} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium">{new Date(day.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span>{day.prompts} prompts</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  <span>{day.workflows} workflows</span>
                                </div>
                                <span className="text-gray-500">${day.cost}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Performing Prompts */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Performing Prompts</CardTitle>
                        <CardDescription>Most used prompts by execution count</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockAnalytics.performance.topPrompts.map((prompt, index) => (
                            <div
                              key={prompt.name}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                  <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{prompt.name}</p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>{prompt.usage} uses</span>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1">
                                      <Award className="h-3 w-3 text-yellow-500" />
                                      <span>{prompt.rating}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline">${prompt.cost}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Top Performing Workflows */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Performing Workflows</CardTitle>
                        <CardDescription>Most executed workflows with success rates</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockAnalytics.performance.topWorkflows.map((workflow, index) => (
                            <div
                              key={workflow.name}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                                  <span className="text-sm font-medium text-purple-600">#{index + 1}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{workflow.name}</p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>{workflow.executions} executions</span>
                                    <span>•</span>
                                    <span>{workflow.success}% success</span>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline">${workflow.cost}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="costs" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cost Breakdown */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Cost Breakdown</CardTitle>
                        <CardDescription>Detailed cost analysis by category and time</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-600">This Month</p>
                              <p className="text-2xl font-bold text-gray-900">$124.50</p>
                              <div className="flex items-center">
                                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-sm text-red-600">+8% from last month</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-600">Average per Day</p>
                              <p className="text-2xl font-bold text-gray-900">$4.02</p>
                              <div className="flex items-center">
                                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">-2% from last month</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium">Cost by Category</h4>
                            {mockAnalytics.usage.categories.map((category) => (
                              <div key={category.name} className="flex items-center justify-between">
                                <span className="text-sm">{category.name}</span>
                                <span className="font-medium">${category.cost}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Budget Status */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Budget Status</CardTitle>
                        <CardDescription>Monthly budget tracking</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">$124.50</p>
                            <p className="text-sm text-gray-600">of $200.00 budget</p>
                          </div>

                          <Progress value={62.25} className="h-3" />

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Used</span>
                              <span className="font-medium">62.25%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Remaining</span>
                              <span className="font-medium">$75.50</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Days left</span>
                              <span className="font-medium">18 days</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t">
                            <div className="flex items-center space-x-2">
                              <Activity className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">On track for budget</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
