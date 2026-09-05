import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.getClaims();

const isProtectedRoute =
  request.nextUrl.pathname.startsWith("/dashboard") ||
  request.nextUrl.pathname.startsWith("/profile") ||
  request.nextUrl.pathname.startsWith("/emergency-contacts") ||
  request.nextUrl.pathname.startsWith("/digital-id") ||
  request.nextUrl.pathname.startsWith("/safety-map") ||
  request.nextUrl.pathname.startsWith("/alerts")   ||
  request.nextUrl.pathname.startsWith("/sos") ||
  request.nextUrl.pathname.startsWith("/incidents") ||
    request.nextUrl.pathname.startsWith("/resources") ||
    request.nextUrl.pathname.startsWith("/authority") ||
    request.nextUrl.pathname.startsWith("/smart-safety");

  if ((error || !data?.claims) && isProtectedRoute) {
    const url = request.nextUrl.clone();

    url.pathname = "/login";

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}