import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    const { data, error } = await supabase
      .from("prompts")
      .select(`
        *,
        categories(name, color),
        users(full_name, avatar_url)
      `)
      .eq("id", params.id)
      .single()

    if (error) throw error

    // Increment usage count
    await supabase
      .from("prompts")
      .update({ usage_count: data.usage_count + 1 })
      .eq("id", params.id)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      .update({
        title,
        description,
        content,
        category_id,
        tags,
        is_public,
        version: supabase.sql`version + 1`,
      })
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { error } = await supabase.from("prompts").delete().eq("id", params.id).eq("user_id", session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete prompt" }, { status: 500 })
  }
}
