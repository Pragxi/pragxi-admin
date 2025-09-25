import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'

export async function GET() {
  const supabase = await createServiceRoleClient()

  try {
    // Riders count from riders_personal_information
    const ridersCountPromise = supabase
      .from('riders_personal_information')
      .select('rider_id', { count: 'exact', head: true })

    // Passengers count by iterating auth admin users and filtering by user_type
    // Note: listUsers provides total users, but not filtered counts; we page through to count passengers
    async function countPassengers() {
      let page = 1
      const perPage = 1000 // large page size to minimize requests
      let totalPassengers = 0
      while (true) {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
        if (error) throw new Error(error.message)
        const users = data?.users ?? []
        // Filter for passenger user_type in user_metadata or identities.identity_data
        for (const u of users as any[]) {
          const metaType = u?.user_metadata?.user_type
          let identityType: string | undefined
          if (Array.isArray(u?.identities)) {
            for (const i of u.identities) {
              if (i?.identity_data?.user_type) {
                identityType = i.identity_data.user_type
                break
              }
            }
          }
          const userType = metaType ?? identityType
          if (userType === 'passenger') totalPassengers++
        }
        // Break if we've reached the last page
        if (!data?.nextPage || users.length === 0) break
        page = data.nextPage
      }
      return totalPassengers
    }

    const [ridersCountRes, passengersCount] = await Promise.all([
      ridersCountPromise,
      countPassengers(),
    ])

    const ridersCount = ridersCountRes.count ?? 0

    return NextResponse.json({ ridersCount, passengersCount })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to load stats' }, { status: 500 })
  }
}
