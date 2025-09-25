import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const rider_id = id
  if (!rider_id) {
    return NextResponse.json({ error: 'Missing rider id' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  try {
    // Delete dependent records first to avoid FK violations
    const tables = [
      'riders_document_information',
      'riders_security_information',
      'riders_financial_information',
      'riders_personal_information',
    ]

    for (const table of tables) {
      const { error } = await supabase.from(table).delete().eq('rider_id', rider_id)
      if (error) {
        return NextResponse.json({ error: `Failed to delete from ${table}: ${error.message}` }, { status: 500 })
      }
    }

    // Delete from users table (if applicable)
    const { error: userTableError } = await supabase.from('users').delete().eq('id', rider_id)
    if (userTableError) {
      return NextResponse.json({ error: `Failed to delete from users table: ${userTableError.message}` }, { status: 500 })
    }

    // Delete from Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(rider_id)
    if (authError) {
      return NextResponse.json({ error: `Failed to delete auth user: ${authError.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}
