import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next')
  // Only allow same-origin paths (no protocol-relative "//host" redirects)
  const next =
    rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//')
      ? rawNext
      : null

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Explicit destination (e.g. password reset) always wins
      if (next) return NextResponse.redirect(`${origin}${next}`)

      // Otherwise route by onboarding state: new OAuth/email-confirmed
      // accounts go through onboarding before reaching the dashboard
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        // If an invite code was validated prior to OAuth/email redirect, claim it now
        const cookieStore = await (await import('next/headers')).cookies()
        const inviteCookie = cookieStore.get('blovi_invite_code')?.value
        if (inviteCookie) {
          const { grantUserAccess } = await import('@/lib/access-code')
          await grantUserAccess(user.id, inviteCookie)
          cookieStore.delete('blovi_invite_code')
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, is_lifetime')
          .eq('id', user.id)
          .maybeSingle()
        if (!profile?.full_name || !profile?.is_lifetime) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}
