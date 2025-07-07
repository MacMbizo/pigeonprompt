import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const publicOnly = searchParams.get("public") === "true"

  try {
    let query = supabase.from("prompts").select(`
        *,
        categories(name, color),
        users(full_name, avatar_url)
      `)

    if (publicOnly) {
      query = query.eq("is_public", true)
    }

    if (category) {
      query = query.eq("category_id", category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error, count } = await query
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
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 })
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
    const { title, description, content, category_id, tags, is_public } = body

    const { data, error } = await supabase
      .from("prompts")
      .insert({
        user_id: session.user.id,
        title,
        description,
        content,
        category_id,
        tags: tags || [],
        is_public: is_public || false,
      })
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase.rpc("log_user_activity", {
      p_user_id: session.user.id,
      p_activity_type: "prompt_created",
      p_activity_data: { prompt_id: data.id, title },
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create prompt" }, { status: 500 })
  }
}
