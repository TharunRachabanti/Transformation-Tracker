import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Auth middleware - only active when Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Skip auth when Supabase isn't configured (dev mode without credentials)
  if (!supabaseUrl || supabaseUrl === 'https://dummy.supabase.co' || !supabaseKey || supabaseKey === 'dummy_key') {
    return NextResponse.next()
  }

  // When Supabase IS configured, protect routes
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

    // 3. Bypass Auth for strict local dev testing without hitting Supabase rate limits
    const devBypassCookie = request.cookies.get('dev_bypass')
    if (devBypassCookie?.value === 'true' && process.env.NODE_ENV !== 'production') {
      // If they are on auth page, redirect to dashboard
      if (request.nextUrl.pathname.startsWith('/auth')) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
      // Allow all other paths seamlessly
      return response
    }

    // 4. Extract user session
    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !request.nextUrl.pathname.startsWith('/auth')) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      return NextResponse.redirect(url)
    }

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
