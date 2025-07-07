import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/types"
import { AIProvider } from "./ai-provider"

type WorkflowNode = {
  id: string
  type: string
  data: any
  position: { x: number; y: number }
}

type WorkflowEdge = {
  id: string
  source: string
  target: string
}

type WorkflowData = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export class WorkflowExecutor {
  private supabase: SupabaseClient<Database>
  private aiProvider: AIProvider

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase
    this.aiProvider = new AIProvider()
  }

  async execute(executionId: string, workflow: any, inputData: any) {
    const startTime = Date.now()
    const executionLog: any[] = []

    try {
      // Update execution status to running
      await this.updateExecution(executionId, {
        status: "running",
        execution_log: executionLog,
      })

      const workflowData: WorkflowData = workflow.workflow_data
      const context = { ...inputData }

      // Execute workflow nodes in topological order
      const executionOrder = this.getExecutionOrder(workflowData)

      for (const nodeId of executionOrder) {
        const node = workflowData.nodes.find((n) => n.id === nodeId)
        if (!node) continue

        const stepStart = Date.now()

        try {
          const result = await this.executeNode(node, context)
          context[nodeId] = result

          executionLog.push({
            nodeId,
            type: node.type,
            status: "success",
            result,
            duration: Date.now() - stepStart,
            timestamp: new Date().toISOString(),
          })
        } catch (error) {
          executionLog.push({
            nodeId,
            type: node.type,
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
            duration: Date.now() - stepStart,
            timestamp: new Date().toISOString(),
          })
          throw error
        }

        // Update execution log in real-time
        await this.updateExecution(executionId, {
          execution_log: executionLog,
        })
      }

      // Get output from final nodes
      const outputNodes = workflowData.nodes.filter((n) => n.type === "output")
      const outputData = outputNodes.reduce((acc, node) => {
        acc[node.data.name || node.id] = context[node.id]
        return acc
      }, {} as any)

      // Complete execution
      await this.updateExecution(executionId, {
        status: "completed",
        output_data: outputData,
        execution_log: executionLog,
        completed_at: new Date().toISOString(),
        duration_ms: Date.now() - startTime,
      })

      // Update workflow execution count
      await this.supabase
        .from("workflows")
        .update({
          execution_count: workflow.execution_count + 1,
          last_executed: new Date().toISOString(),
        })
        .eq("id", workflow.id)
    } catch (error) {
      await this.updateExecution(executionId, {
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
        execution_log: executionLog,
        completed_at: new Date().toISOString(),
        duration_ms: Date.now() - startTime,
      })
    }
  }

  private async executeNode(node: WorkflowNode, context: any): Promise<any> {
    switch (node.type) {
      case "prompt":
        return await this.executePromptNode(node, context)
      case "ai-model":
        return await this.executeAIModelNode(node, context)
      case "data-transform":
        return this.executeDataTransformNode(node, context)
      case "condition":
        return this.executeConditionNode(node, context)
      case "loop":
        return await this.executeLoopNode(node, context)
      case "api-call":
        return await this.executeAPICallNode(node, context)
      case "input":
        return context[node.data.name] || node.data.defaultValue
      case "output":
        return this.resolveValue(node.data.value, context)
      default:
        throw new Error(`Unknown node type: ${node.type}`)
    }
  }

  private async executePromptNode(node: WorkflowNode, context: any): Promise<string> {
    const { template, variables } = node.data
    let prompt = template

    // Replace variables in template
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        const resolvedValue = this.resolveValue(value, context)
        prompt = prompt.replace(new RegExp(`{{${key}}}`, "g"), resolvedValue)
      }
    }

    return prompt
  }

  private async executeAIModelNode(node: WorkflowNode, context: any): Promise<string> {
    const { provider, model, prompt, temperature, maxTokens } = node.data
    const resolvedPrompt = this.resolveValue(prompt, context)

    return await this.aiProvider.generateText({
      provider,
      model,
      prompt: resolvedPrompt,
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 1000,
    })
  }

  private executeDataTransformNode(node: WorkflowNode, context: any): any {
    const { operation, input, parameters } = node.data
    const inputValue = this.resolveValue(input, context)

    switch (operation) {
      case "json-parse":
        return JSON.parse(inputValue)
      case "json-stringify":
        return JSON.stringify(inputValue)
      case "text-split":
        return inputValue.split(parameters.delimiter || "\n")
      case "text-join":
        return Array.isArray(inputValue) ? inputValue.join(parameters.delimiter || " ") : inputValue
      case "text-replace":
        return inputValue.replace(new RegExp(parameters.search, "g"), parameters.replace)
      case "extract-field":
        return inputValue[parameters.field]
      default:
        return inputValue
    }
  }

  private executeConditionNode(node: WorkflowNode, context: any): boolean {
    const { condition, left, operator, right } = node.data
    const leftValue = this.resolveValue(left, context)
    const rightValue = this.resolveValue(right, context)

    switch (operator) {
      case "equals":
        return leftValue === rightValue
      case "not-equals":
        return leftValue !== rightValue
      case "greater-than":
        return leftValue > rightValue
      case "less-than":
        return leftValue < rightValue
      case "contains":
        return String(leftValue).includes(String(rightValue))
      case "starts-with":
        return String(leftValue).startsWith(String(rightValue))
      case "ends-with":
        return String(leftValue).endsWith(String(rightValue))
      default:
        return false
    }
  }

  private async executeLoopNode(node: WorkflowNode, context: any): Promise<any[]> {
    const { type, items, condition, body } = node.data
    const results: any[] = []

    if (type === "for-each") {
      const itemsArray = this.resolveValue(items, context)
      if (!Array.isArray(itemsArray)) {
        throw new Error("For-each loop requires an array")
      }

      for (const item of itemsArray) {
        const loopContext = { ...context, item }
        // Execute body nodes (simplified - would need proper sub-workflow execution)
        results.push(item)
      }
    }

    return results
  }

  private async executeAPICallNode(node: WorkflowNode, context: any): Promise<any> {
    const { url, method, headers, body } = node.data
    const resolvedUrl = this.resolveValue(url, context)
    const resolvedHeaders = headers
      ? Object.fromEntries(Object.entries(headers).map(([k, v]) => [k, this.resolveValue(v, context)]))
      : {}
    const resolvedBody = body ? this.resolveValue(body, context) : undefined

    const response = await fetch(resolvedUrl, {
      method: method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...resolvedHeaders,
      },
      body: resolvedBody ? JSON.stringify(resolvedBody) : undefined,
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }

  private resolveValue(value: any, context: any): any {
    if (typeof value === "string" && value.startsWith("{{") && value.endsWith("}}")) {
      const key = value.slice(2, -2)
      return context[key] || value
    }
    return value
  }

  private getExecutionOrder(workflowData: WorkflowData): string[] {
    // Simple topological sort implementation
    const nodes = new Map(workflowData.nodes.map((n) => [n.id, n]))
    const edges = workflowData.edges
    const visited = new Set<string>()
    const order: string[] = []

    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return
      visited.add(nodeId)

      // Visit dependencies first
      const dependencies = edges.filter((e) => e.target === nodeId).map((e) => e.source)

      dependencies.forEach(visit)
      order.push(nodeId)
    }

    // Start with input nodes
    const inputNodes = workflowData.nodes.filter((n) => n.type === "input").map((n) => n.id)

    if (inputNodes.length === 0) {
      // If no input nodes, start with nodes that have no incoming edges
      const nodesWithoutIncoming = workflowData.nodes
        .filter((n) => !edges.some((e) => e.target === n.id))
        .map((n) => n.id)

      nodesWithoutIncoming.forEach(visit)
    } else {
      inputNodes.forEach(visit)
    }

    // Visit any remaining nodes
    workflowData.nodes.forEach((n) => visit(n.id))

    return order
  }

  private async updateExecution(executionId: string, updates: any) {
    await this.supabase.from("workflow_executions").update(updates).eq("id", executionId)
  }
}
