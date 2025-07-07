"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Home,
  FileText,
  Workflow,
  Bot,
  BarChart3,
  Settings,
  Users,
  Globe,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    current: false,
  },
  {
    name: "Prompts",
    href: "/prompts",
    icon: FileText,
    current: false,
    children: [
      { name: "My Prompts", href: "/prompts" },
      { name: "Templates", href: "/prompts/templates" },
      { name: "Favorites", href: "/prompts/favorites" },
    ],
  },
  {
    name: "Workflows",
    href: "/promptflow",
    icon: Workflow,
    current: false,
    children: [
      { name: "Builder", href: "/promptflow" },
      { name: "My Workflows", href: "/workflows" },
      { name: "Executions", href: "/workflows/executions" },
    ],
  },
  {
    name: "AI Models",
    href: "/integrations",
    icon: Bot,
    current: false,
    children: [
      { name: "Integrations", href: "/integrations" },
      { name: "API Keys", href: "/integrations/keys" },
      { name: "Usage", href: "/integrations/usage" },
    ],
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    current: false,
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    icon: Globe,
    current: false,
  },
  {
    name: "Community",
    href: "/community",
    icon: Users,
    current: false,
  },
]

const quickActions = [
  {
    name: "New Prompt",
    href: "/prompts/new",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    name: "Build Workflow",
    href: "/promptflow",
    icon: Workflow,
    color: "bg-purple-500",
  },
  {
    name: "Add Integration",
    href: "/integrations/new",
    icon: Bot,
    color: "bg-green-500",
  },
]

export function EnhancedSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>(["Prompts", "Workflows"])

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">PigeonPrompt</h2>
              <p className="text-xs text-gray-500">AI Platform</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          <ChevronRight className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-0" : "rotate-180")} />
        </Button>
      </div>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action) => (
                <Link key={action.name} href={action.href}>
                  <Button variant="outline" size="sm" className="w-full justify-start h-8 text-xs bg-transparent">
                    <div className={cn("w-3 h-3 rounded mr-2", action.color)}>
                      <action.icon className="w-3 h-3 text-white" />
                    </div>
                    {action.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const hasChildren = item.children && item.children.length > 0
            const isOpen = openSections.includes(item.name)

            if (hasChildren) {
              return (
                <Collapsible key={item.name} open={isOpen} onOpenChange={() => toggleSection(item.name)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between h-9 px-3 text-sm font-medium",
                        isActive
                          ? "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
                          : "text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-4 w-4" />
                        {!collapsed && item.name}
                      </div>
                      {!collapsed && (
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "rotate-0")}
                        />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  {!collapsed && (
                    <CollapsibleContent className="space-y-1 mt-1">
                      {item.children?.map((child) => {
                        const isChildActive = pathname === child.href
                        return (
                          <Link key={child.name} href={child.href}>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start h-8 px-6 text-xs",
                                isChildActive ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50",
                              )}
                            >
                              {child.name}
                            </Button>
                          </Link>
                        )
                      })}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              )
            }

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-9 px-3 text-sm font-medium",
                    isActive
                      ? "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {!collapsed && item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>API Usage</span>
              <span>1,247 / 2,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: "62%" }} />
            </div>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs">
                <Settings className="mr-2 h-3 w-3" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
