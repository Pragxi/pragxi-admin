import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') || '1')
  const pageSize = Number(searchParams.get('pageSize') || '10')
  const q = (searchParams.get('q') || '').trim()

  if (page < 1 || pageSize < 1) {
    return NextResponse.json({ error: 'Invalid pagination params' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  try {
    // Use Supabase auth admin listUsers with paging
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: pageSize,
    })
    if (error) throw new Error(error.message)

    const users = data?.users ?? []

    // Filter to passengers based on user_metadata.user_type or identities[].identity_data.user_type
    const filteredPassengers = users.filter((u: any) => {
      const metaType = u?.user_metadata?.user_type
      const identityType = Array.isArray(u?.identities)
        ? u.identities.find((i: any) => i?.identity_data?.user_type)?.identity_data?.user_type
        : undefined
      const userType = metaType ?? identityType
      if (userType !== 'passenger') return false

      if (!q) return true
      const displayName = u?.user_metadata?.display_name ?? ''
      const email = u?.email ?? ''
      const term = q.toLowerCase()
      return (
        String(displayName).toLowerCase().includes(term) ||
        String(email).toLowerCase().includes(term)
      )
    })

    const rows = filteredPassengers.map((u: any) => ({
      id: u.id as string,
      name: (u.user_metadata?.display_name as string) || (u.user_metadata?.full_name as string) || '-',
      email: (u.email as string) || null,
    }))

    // We only know the total for this requested page of users from auth
    // If you need global totals across all pages, we can iterate pages or persist counts elsewhere
    const total = rows.length

    return NextResponse.json({ rows, total })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to load passengers' }, { status: 500 })
  }
}
