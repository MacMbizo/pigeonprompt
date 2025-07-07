import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    const { data, error, count } = await supabase
      .from("workflows")
      .select(`
        *,
        users(full_name, avatar_url)
      `)
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    const { name, description, workflow_data, status, is_public } = body

    const { data, error } = await supabase
      .from("workflows")
      .insert({
        user_id: session.user.id,
        name,
        description,
        workflow_data,
        status: status || "draft",
        is_public: is_public || false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 })
  }
}
