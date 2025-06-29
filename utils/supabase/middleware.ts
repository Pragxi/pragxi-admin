import {createServerClient} from '@supabase/ssr'
import {type NextRequest, NextResponse} from 'next/server'
import { User } from '@supabase/supabase-js'

// Cache auth results for 5 seconds to prevent hammering Supabase
const AUTH_CACHE = new Map<string, {user: User | null, timestamp: number}>()
const CACHE_TTL = 5000 // 5 seconds

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Check if request is for public assets
    if (request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|gif|svg)$/)) {
        return supabaseResponse
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({name, value, options}) => {
                        void options;
                        return request.cookies.set(name, value)
                    })
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({name, value, options}) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Check cache first
    const sessionKey = request.cookies.get('sb-access-token')?.value || 'anonymous'
    const cachedAuth = AUTH_CACHE.get(sessionKey)
    const now = Date.now()
    
    if (cachedAuth && (now - cachedAuth.timestamp) < CACHE_TTL) {
        if (!cachedAuth.user && 
            !request.nextUrl.pathname.startsWith('/login') && 
            !request.nextUrl.pathname.startsWith('/auth')
        ) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
        return supabaseResponse
    }

    const {
        data: {user},
    } = await supabase.auth.getUser()

    // Update cache
    AUTH_CACHE.set(sessionKey, {user, timestamp: now})

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth')
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}