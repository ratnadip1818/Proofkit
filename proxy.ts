import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Domains we don't want to rewrite (system domains)
  const systemHosts = [
    "www.blovi.space",
    "blovi.space",
    "localhost:3000",
    "proofkit.vercel.app",
  ];

  const isSystemHost = systemHosts.some(
    (h) => hostname === h || hostname.endsWith(".vercel.app")
  );

  if (!isSystemHost) {
    // Custom domain routing!
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const cleanHost = hostname.split(":")[0].trim().toLowerCase();
    const bareHost = cleanHost.replace(/^www\./, "");

    const { data: form } = await supabase
      .from("forms")
      .select("slug")
      .or(`custom_domain.eq.${cleanHost},custom_domain.eq.${bareHost}`)
      .maybeSingle();

    if (form?.slug) {
      // Rewrite the URL internally to the collection page /c/${form.slug}
      return NextResponse.rewrite(new URL(`/c/${form.slug}`, request.url));
    }
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Logged-in users don't need the auth pages — send them to the dashboard
  const path = request.nextUrl.pathname
  if (user && ['/login', '/signup', '/forgot-password'].includes(path)) {
    const redirect = NextResponse.redirect(new URL('/dashboard', request.url))
    // carry over any refreshed auth cookies
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie)
    })
    return redirect
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
