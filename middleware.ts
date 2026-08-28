import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Skip auth when Supabase isn't configured
  if (!supabaseUrl || supabaseUrl === 'https://dummy.supabase.co' || !supabaseKey || supabaseKey === 'dummy_key') {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname

  // Always allow static files and auth/onboarding routes
  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  try {
    const { createServerClient } = await import('@supabase/ssr')
    let response = NextResponse.next({ request })

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    // Not logged in → go to auth
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      return NextResponse.redirect(url)
    }

    // Logged in and headed somewhere → allow through
    // (new user detection happens at page level in app/(app)/page.tsx)
    return response
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
