'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { CookieOptions } from '@supabase/ssr'

const riderSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone_number: z.string().min(1),
  email: z.string().email(),
  dob: z.coerce.date(),
  marital_status: z.string(),
  gender: z.string(),
  nationality: z.string(),
  city: z.string().min(1),
  gps_address: z.string().min(1),
})

export type RiderFormData = z.infer<typeof riderSchema>

export async function createRider(formData: RiderFormData) {
  try {
    console.log('Received form data:', formData)

    const cookieStore = cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name)
            return cookie?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          },
        },
      }
    )

    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return { error: 'Authentication required' }
    }

    // First, ensure the user exists in the public.users table
    const { data: existingUser, error: userQueryError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id) // Use the auth user's ID to check public.users
      .single()

    if (userQueryError && userQueryError.code !== 'PGRST116') {
      console.error('Error checking existing user:', userQueryError)
      return { error: `Failed to check existing user: ${userQueryError.message}` }
    }

    let userId = user.id // Use the auth user's ID

    if (!existingUser) {
      // Insert into public.users with the same ID as auth.users
      const { error: createUserError } = await supabase
        .from('users')
        .insert([{
          id: userId, // Use the same ID as auth.users
          email: user.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone_number,
          created_at: new Date().toISOString(),
        }])

      if (createUserError) {
        console.error('Error creating user:', createUserError)
        return { error: `Failed to create user: ${createUserError.message}` }
      }
    }

    // Now create the rider personal information
    const { data, error } = await supabase
      .from('riders_personal_information')
      .insert([{
        id: uuidv4(),
        rider_id: userId, // Use the auth user's ID which matches public.users
        ...formData,
        dob: new Date(formData.dob).toISOString().split('T')[0],
        created_at: new Date().toISOString(),
      }])
      .select()

    if (error) {
      console.error('Error creating rider personal info:', error)
      return { error: `Failed to create rider personal info: ${error.message}` }
    }

    if (!data || data.length === 0) {
      console.error('No data returned from insert')
      return { error: 'Failed to create rider - no data returned' }
    }

    return { data: data[0] }
  } catch (error) {
    console.error('Error in createRider:', error)
    if (error instanceof z.ZodError) {
      return { error: 'Invalid form data: ' + error.errors.map(e => e.message).join(', ') }
    }
    return { error: 'Failed to create rider: ' + (error instanceof Error ? error.message : String(error)) }
  }
} 