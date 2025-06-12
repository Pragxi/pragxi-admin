import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Create supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Refresh session if expired
    await supabase.auth.getSession()

    // Get user
    const { data: { user } } = await supabase.auth.getUser()

    // Handle root route redirect
    if (request.nextUrl.pathname === '/') {
      const redirectUrl = user ? '/dashboard' : '/login'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Handle protected routes
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                       request.nextUrl.pathname.startsWith('/signup')
    const isProtectedRoute = !isAuthRoute && 
                           !request.nextUrl.pathname.startsWith('/_next') && 
                           !request.nextUrl.pathname.startsWith('/api')

    if (!user && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}