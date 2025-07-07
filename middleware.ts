import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // For v0 environment, we'll use a simplified approach
  // In production, this would check actual Supabase session

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")

  // Allow auth pages to load without authentication
  if (isAuthPage) {
    return NextResponse.next()
  }

  // For demo purposes, allow all other pages
  // In production, you would check for valid session here
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
