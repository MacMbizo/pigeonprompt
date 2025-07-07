import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { WorkflowExecutor } from "@/lib/workflow/executor"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { input_data } = body

    // Get workflow
    const { data: workflow, error: workflowError } = await supabase
      .from("workflows")
      .select("*")
      .eq("id", params.id)
      .single()

    if (workflowError) throw workflowError

    // Create execution record
    const { data: execution, error: executionError } = await supabase
      .from("workflow_executions")
      .insert({
        workflow_id: params.id,
        user_id: session.user.id,
        status: "pending",
        input_data,
      })
      .select()
      .single()

    if (executionError) throw executionError

    // Execute workflow asynchronously
    const executor = new WorkflowExecutor(supabase)
    executor.execute(execution.id, workflow, input_data)

    return NextResponse.json({ execution_id: execution.id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to execute workflow" }, { status: 500 })
  }
}
